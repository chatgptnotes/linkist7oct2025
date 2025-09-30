import nodemailer from 'nodemailer';
import { 
  OrderData, 
  orderConfirmationEmail, 
  receiptEmail, 
  inProductionEmail, 
  shippedEmail, 
  deliveredEmail 
} from './email-templates';

// Gmail SMTP configuration
const GMAIL_CONFIG = {
  from: process.env.GMAIL_FROM || 'Linkist <chatgptnotes@gmail.com>',
  replyTo: process.env.GMAIL_REPLY_TO || 'chatgptnotes@gmail.com',
  isProduction: process.env.NODE_ENV === 'production',
  isGmailConfigured: process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_FROM,
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

// Gmail SMTP transporter
let transporter: nodemailer.Transporter | null = null;

const getGmailTransporter = (): nodemailer.Transporter | null => {
  if (!GMAIL_CONFIG.isGmailConfigured) {
    console.log('⚠️ Gmail not configured. Missing GMAIL_APP_PASSWORD or GMAIL_FROM');
    return null;
  }
  
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_FROM || 'chatgptnotes@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD // App-specific password
      }
    });
  }
  
  return transporter;
};

export type EmailType = 'confirmation' | 'receipt' | 'production' | 'shipped' | 'delivered';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class GmailEmailService {
  private getEmailTemplate(type: EmailType, data: OrderData): { subject: string; html: string } {
    switch (type) {
      case 'confirmation':
        return {
          subject: `Your Linkist NFC Order is Confirmed – ${data.orderNumber}`,
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

      // In development mode, log the email and return mock success
      if (!GMAIL_CONFIG.isProduction) {
        console.log(`📧 [DEV][${type.toUpperCase()}] Email for ${data.email}:`, {
          subject,
          orderNumber: data.orderNumber,
          customer: data.customerName,
          htmlLength: html.length
        });
      }

      // Check if Gmail is properly configured
      const gmailTransporter = getGmailTransporter();
      if (!GMAIL_CONFIG.isGmailConfigured || !gmailTransporter) {
        console.warn(`⚠️  [${type.toUpperCase()}] Gmail not configured - email would be sent to ${data.email}`);
        console.log('📧 [MOCK] Email content preview:');
        console.log('Subject:', subject);
        console.log('To:', data.email);
        console.log('From:', GMAIL_CONFIG.from);
        return { success: true, messageId: `mock-${Date.now()}-${type}` };
      }

      // Send email with retry logic
      return await this.sendWithRetry(type, data, subject, html, gmailTransporter);

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
    gmailTransporter: nodemailer.Transporter,
    attempt: number = 1
  ): Promise<EmailResult> {
    try {
      console.log(`📤 [${type.toUpperCase()}] Sending email to ${data.email} via Gmail (attempt ${attempt}/${GMAIL_CONFIG.maxRetries})`);

      const mailOptions = {
        from: GMAIL_CONFIG.from,
        to: data.email,
        subject,
        html,
        replyTo: GMAIL_CONFIG.replyTo,
      };

      const info = await gmailTransporter.sendMail(mailOptions);

      console.log(`✅ [${type.toUpperCase()}] Email sent successfully to ${data.email}:`, {
        messageId: info.messageId,
        orderNumber: data.orderNumber,
        attempt,
        response: info.response
      });

      return { success: true, messageId: info.messageId };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gmail SMTP error';
      console.error(`❌ [${type.toUpperCase()}] Gmail send attempt ${attempt} failed:`, error);
      
      if (attempt < GMAIL_CONFIG.maxRetries) {
        console.log(`🔄 [${type.toUpperCase()}] Retrying in ${GMAIL_CONFIG.retryDelay}ms...`);
        await this.delay(GMAIL_CONFIG.retryDelay * attempt);
        return this.sendWithRetry(type, data, subject, html, gmailTransporter, attempt + 1);
      }
      
      return { success: false, error: errorMessage };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Send all order emails in sequence
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

  // Health check for Gmail service
  async healthCheck(): Promise<{ healthy: boolean; configured: boolean; message: string }> {
    const configured = GMAIL_CONFIG.isGmailConfigured;
    
    if (!configured) {
      return {
        healthy: false,
        configured: false,
        message: 'Gmail app password not configured'
      };
    }

    try {
      const gmailTransporter = getGmailTransporter();
      if (gmailTransporter) {
        // Test the connection
        await gmailTransporter.verify();
        return {
          healthy: true,
          configured: true,
          message: 'Gmail SMTP service is healthy and configured'
        };
      } else {
        return {
          healthy: false,
          configured: false,
          message: 'Gmail transporter not initialized'
        };
      }
    } catch (error) {
      return {
        healthy: false,
        configured: true,
        message: `Gmail SMTP error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get email configuration info (for admin dashboard)
  getConfig() {
    return {
      from: GMAIL_CONFIG.from,
      replyTo: GMAIL_CONFIG.replyTo,
      isProduction: GMAIL_CONFIG.isProduction,
      isConfigured: GMAIL_CONFIG.isGmailConfigured,
      maxRetries: GMAIL_CONFIG.maxRetries,
      retryDelay: GMAIL_CONFIG.retryDelay,
      service: 'Gmail SMTP'
    };
  }
}

export const gmailEmailService = new GmailEmailService();