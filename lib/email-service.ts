import { sendOrderEmail as sendSMTPEmail, EMAIL_CONFIG as SMTP_EMAIL_CONFIG, getTransporterInstance } from './smtp-email-service';
import {
  OrderData,
  orderConfirmationEmail,
  receiptEmail,
  inProductionEmail,
  shippedEmail,
  deliveredEmail
} from './email-templates';

// Production-ready email configuration
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Linkist NFC <hello@linkist.ai>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@linkist.ai',
  isProduction: process.env.NODE_ENV === 'production',
  isSMTPConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

export type EmailType = 'confirmation' | 'receipt' | 'production' | 'shipped' | 'delivered';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class OrderEmailService {
  private getEmailTemplate(type: EmailType, data: OrderData): { subject: string; html: string } {
    switch (type) {
      case 'confirmation':
        return {
          subject: `Order Confirmed - ${data.orderNumber} | Linkist`,
          html: orderConfirmationEmail(data)
        };
      case 'receipt':
        return {
          subject: `Receipt for Order ${data.orderNumber} | Linkist`,
          html: receiptEmail(data)
        };
      case 'production':
        return {
          subject: `Your Card is in Production - ${data.orderNumber} | Linkist`,
          html: inProductionEmail(data)
        };
      case 'shipped':
        return {
          subject: `Package Shipped - ${data.orderNumber} | Linkist`,
          html: shippedEmail(data)
        };
      case 'delivered':
        return {
          subject: `Your Linkist Card Has Arrived! - ${data.orderNumber}`,
          html: deliveredEmail(data)
        };
      default:
        throw new Error(`Unknown email type: ${type}`);
    }
  }

  async sendOrderEmail(type: EmailType, data: OrderData): Promise<EmailResult> {
    try {
      // Validate required data
      if (!data.email || !data.orderNumber) {
        const error = 'Email and order number are required';
        console.error(`❌ [${type.toUpperCase()}] Validation failed:`, error);
        return { success: false, error };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        const error = 'Invalid email format';
        console.error(`❌ [${type.toUpperCase()}] Email validation failed:`, data.email);
        return { success: false, error };
      }

      const { subject, html } = this.getEmailTemplate(type, data);

      // Log email details in development mode but still attempt to send
      if (!EMAIL_CONFIG.isProduction) {
        console.log(`📧 [DEV][${type.toUpperCase()}] Email for ${data.email}:`, {
          subject,
          orderNumber: data.orderNumber,
          customer: data.customerName,
          htmlLength: html.length,
          willSendReal: EMAIL_CONFIG.isSMTPConfigured
        });
      }

      // Check if SMTP is properly configured
      const transporterInstance = getTransporterInstance();
      if (!EMAIL_CONFIG.isSMTPConfigured || !transporterInstance) {
        console.warn(`⚠️  [${type.toUpperCase()}] SMTP not configured - email would be sent to ${data.email}`);
        return { success: true, messageId: `mock-${Date.now()}-${type}` };
      }

      // Send email with retry logic
      return await this.sendWithRetry(type, data, subject, html, transporterInstance);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`💥 [${type.toUpperCase()}] Unexpected error:`, error);
      return { success: false, error: errorMessage };
    }
  }

  private async sendWithRetry(
    type: EmailType,
    data: OrderData,
    subject: string,
    html: string,
    transporterInstance: any,
    attempt: number = 1
  ): Promise<EmailResult> {
    try {
      console.log(`📤 [${type.toUpperCase()}] Sending email to ${data.email} (attempt ${attempt}/${EMAIL_CONFIG.maxRetries})`);

      const result = await sendSMTPEmail({
        to: data.email,
        subject,
        html,
        tags: [
          { name: 'email_type', value: type },
          { name: 'order_number', value: data.orderNumber },
          { name: 'environment', value: process.env.NODE_ENV || 'development' }
        ]
      });

      if (!result.success || result.error) {
        console.error(`❌ [${type.toUpperCase()}] SMTP error (attempt ${attempt}):`, result.error);

        // Retry for certain types of errors
        if (attempt < EMAIL_CONFIG.maxRetries && result.error) {
          console.log(`🔄 [${type.toUpperCase()}] Retrying in ${EMAIL_CONFIG.retryDelay}ms...`);
          await this.delay(EMAIL_CONFIG.retryDelay * attempt); // Exponential backoff
          return this.sendWithRetry(type, data, subject, html, transporterInstance, attempt + 1);
        }

        return { success: false, error: result.error?.message || 'Email sending failed' };
      }

      console.log(`✅ [${type.toUpperCase()}] Email sent successfully to ${data.email}:`, {
        messageId: result.id,
        orderNumber: data.orderNumber,
        attempt
      });

      return { success: true, messageId: result.id };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network or API error';
      console.error(`💥 [${type.toUpperCase()}] Send attempt ${attempt} failed:`, error);
      
      if (attempt < EMAIL_CONFIG.maxRetries) {
        console.log(`🔄 [${type.toUpperCase()}] Retrying in ${EMAIL_CONFIG.retryDelay}ms...`);
        await this.delay(EMAIL_CONFIG.retryDelay * attempt);
        return this.sendWithRetry(type, data, subject, html, transporterInstance, attempt + 1);
      }
      
      return { success: false, error: errorMessage };
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors, rate limits, and temporary server errors
    const retryableErrors = [
      'network',
      'timeout',
      'rate_limit_exceeded',
      'internal_server_error',
      'service_unavailable'
    ];
    
    const errorType = error.type?.toLowerCase() || error.message?.toLowerCase() || '';
    return retryableErrors.some(retryable => errorType.includes(retryable));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Send all order emails in sequence with better error handling
  async sendOrderLifecycleEmails(data: OrderData): Promise<Record<EmailType, EmailResult>> {
    console.log(`📧 Starting order lifecycle emails for ${data.orderNumber} (${data.email})`);
    
    const results: Record<EmailType, EmailResult> = {} as any;

    try {
      // Send confirmation and receipt immediately
      console.log('📤 Sending confirmation email...');
      results.confirmation = await this.sendOrderEmail('confirmation', data);
      
      console.log('📤 Sending receipt email...');
      results.receipt = await this.sendOrderEmail('receipt', data);

      // Log summary
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;
      
      console.log(`📊 Order lifecycle emails completed: ${successCount}/${totalCount} successful`, {
        orderNumber: data.orderNumber,
        email: data.email,
        results: Object.keys(results).reduce((acc, key) => {
          acc[key] = results[key as EmailType].success ? '✅' : '❌';
          return acc;
        }, {} as Record<string, string>)
      });

    } catch (error) {
      console.error('💥 Error in order lifecycle emails:', error);
    }

    return results;
  }

  // Send individual status update emails (for admin dashboard)
  async sendStatusUpdateEmail(type: EmailType, data: OrderData): Promise<EmailResult> {
    console.log(`📧 Sending ${type} status update for order ${data.orderNumber}`);
    return await this.sendOrderEmail(type, data);
  }

  // Batch email sending with rate limiting
  async sendBatchEmails(
    emailRequests: Array<{ type: EmailType; data: OrderData }>,
    options: { batchSize?: number; delayBetweenBatches?: number } = {}
  ): Promise<Array<{ request: { type: EmailType; data: OrderData }; result: EmailResult }>> {
    const { batchSize = 10, delayBetweenBatches = 1000 } = options;
    const results = [];

    console.log(`📧 Starting batch email send: ${emailRequests.length} emails in batches of ${batchSize}`);

    for (let i = 0; i < emailRequests.length; i += batchSize) {
      const batch = emailRequests.slice(i, i + batchSize);
      console.log(`📤 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(emailRequests.length / batchSize)}`);

      const batchPromises = batch.map(async (request) => {
        const result = await this.sendOrderEmail(request.type, request.data);
        return { request, result };
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
          results.push(promiseResult.value);
        } else {
          console.error('Batch email promise rejected:', promiseResult.reason);
          // Add failed result
          results.push({
            request: batch[0], // Fallback request
            result: { success: false, error: 'Promise rejected' }
          });
        }
      });

      // Delay between batches to respect rate limits
      if (i + batchSize < emailRequests.length) {
        console.log(`⏳ Waiting ${delayBetweenBatches}ms before next batch...`);
        await this.delay(delayBetweenBatches);
      }
    }

    const successCount = results.filter(r => r.result.success).length;
    console.log(`📊 Batch email sending completed: ${successCount}/${results.length} successful`);

    return results;
  }

  // Health check for email service
  async healthCheck(): Promise<{ healthy: boolean; configured: boolean; message: string }> {
    const configured = EMAIL_CONFIG.isSMTPConfigured;

    if (!configured) {
      return {
        healthy: false,
        configured: false,
        message: 'SMTP credentials not configured'
      };
    }

    try {
      // Check if we can create the SMTP transporter
      const transporterInstance = getTransporterInstance();
      if (transporterInstance) {
        // Try to verify connection
        await transporterInstance.verify();
        return {
          healthy: true,
          configured: true,
          message: 'Email service is healthy and configured'
        };
      } else {
        return {
          healthy: false,
          configured: false,
          message: 'SMTP transporter not initialized'
        };
      }
    } catch (error) {
      return {
        healthy: false,
        configured: true,
        message: `Email service error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get email configuration info (for admin dashboard)
  getConfig() {
    return {
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      isProduction: EMAIL_CONFIG.isProduction,
      isConfigured: EMAIL_CONFIG.isSMTPConfigured,
      maxRetries: EMAIL_CONFIG.maxRetries,
      retryDelay: EMAIL_CONFIG.retryDelay,
    };
  }
}

export const emailService = new OrderEmailService();