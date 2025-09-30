import { NextRequest, NextResponse } from 'next/server';
import { emailService, type EmailType } from '@/lib/email-service';
import type { OrderData } from '@/lib/email-templates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { emailType, orderData } = await request.json();
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    // Validate email type
    if (!emailType || !['production', 'shipped', 'delivered'].includes(emailType)) {
      return NextResponse.json(
        { error: 'Invalid email type. Must be: production, shipped, or delivered' },
        { status: 400 }
      );
    }

    // Validate order data
    if (!orderData || !orderData.email || !orderData.orderNumber) {
      return NextResponse.json(
        { error: 'Order data with email and orderNumber is required' },
        { status: 400 }
      );
    }

    // Ensure order number matches URL parameter
    if (orderData.orderNumber !== orderId) {
      return NextResponse.json(
        { error: 'Order number mismatch' },
        { status: 400 }
      );
    }

    console.log(`📧 Triggering ${emailType} email for order ${orderId}`);

    // Send the email
    const result = await emailService.sendOrderEmail(emailType as EmailType, orderData);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || 'Failed to send email' 
        },
        { status: 500 }
      );
    }

    console.log(`✅ ${emailType} email sent successfully for order ${orderId}`);

    return NextResponse.json({
      success: true,
      orderId,
      emailType,
      messageId: result.messageId,
      sentTo: orderData.email
    });

  } catch (error) {
    console.error('Error triggering email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check what emails can be triggered for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    return NextResponse.json({
      orderId,
      availableEmailTypes: ['production', 'shipped', 'delivered'],
      description: {
        production: 'Notify customer that their card is in production',
        shipped: 'Send tracking information when order is shipped',
        delivered: 'Welcome message when card is delivered'
      }
    });

  } catch (error) {
    console.error('Error getting email trigger info:', error);
    return NextResponse.json(
      { error: 'Failed to get email trigger information' },
      { status: 500 }
    );
  }
}