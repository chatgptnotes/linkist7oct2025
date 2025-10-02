import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';
import type { OrderData } from '@/lib/email-templates';

// Test endpoint to verify all email templates
export async function POST(request: NextRequest) {
  try {
    const { testEmail, emailType } = await request.json();

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }

    // Create mock order data for testing
    const mockOrderData: OrderData = {
      orderNumber: 'LNK-TEST-' + Date.now(),
      customerName: 'John Test Customer',
      email: testEmail,
      cardConfig: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Software Engineer',
        mobile: '+1 555-123-4567',
        whatsapp: true,
        quantity: 1
      },
      shipping: {
        fullName: 'John Doe',
        addressLine1: '123 Test Street',
        addressLine2: 'Apt 4B',
        city: 'Test City',
        state: 'CA',
        country: 'United States',
        postalCode: '90210',
        phoneNumber: '+1 555-123-4567'
      },
      pricing: {
        subtotal: 29.99,
        shipping: 5.00,
        tax: 1.75,
        total: 36.74
      },
      estimatedDelivery: 'Thu, Sep 12, 2025',
      trackingNumber: 'TEST1Z999AA1234567890',
      trackingUrl: 'https://track.example.com/TEST1Z999AA1234567890'
    };

    console.log(`🧪 Testing email templates for ${testEmail}`);

    if (emailType && emailType !== 'all') {
      // Test specific email type
      const result = await emailService.sendOrderEmail(emailType, mockOrderData);
      
      return NextResponse.json({
        success: result.success,
        emailType,
        messageId: result.messageId,
        error: result.error,
        testData: mockOrderData
      });
    } else {
      // Test all email types
      const emailTypes: Array<'confirmation' | 'receipt' | 'production' | 'shipped' | 'delivered'> = [
        'confirmation', 'receipt', 'production', 'shipped', 'delivered'
      ];

      const results: Record<string, any> = {};

      for (const type of emailTypes) {
        console.log(`📧 Testing ${type} email...`);
        const result = await emailService.sendOrderEmail(type, mockOrderData);
        results[type] = {
          success: result.success,
          messageId: result.messageId,
          error: result.error
        };

        // Add delay between emails to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const allSuccessful = Object.values(results).every((result: any) => result.success);

      return NextResponse.json({
        success: allSuccessful,
        results,
        testEmail,
        testData: mockOrderData,
        summary: {
          total: emailTypes.length,
          successful: Object.values(results).filter((r: any) => r.success).length,
          failed: Object.values(results).filter((r: any) => !r.success).length
        }
      });
    }

  } catch (error) {
    console.error('Error testing emails:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to show available test options
export async function GET() {
  return NextResponse.json({
    description: 'Email template testing endpoint',
    usage: {
      method: 'POST',
      body: {
        testEmail: 'your-email@example.com',
        emailType: 'all | confirmation | receipt | production | shipped | delivered'
      }
    },
    availableEmailTypes: [
      {
        type: 'confirmation',
        description: 'Order confirmation email sent after successful payment'
      },
      {
        type: 'receipt',
        description: 'Payment receipt with order details'
      },
      {
        type: 'production',
        description: 'Notification when card enters production'
      },
      {
        type: 'shipped',
        description: 'Shipping notification with tracking information'
      },
      {
        type: 'delivered',
        description: 'Delivery confirmation and activation instructions'
      }
    ]
  });
}