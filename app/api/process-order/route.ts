import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { generateOrderNumber, formatOrderForEmail } from '@/lib/order-store';
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardConfig, checkoutData, paymentData } = body;

    if (!cardConfig || !checkoutData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Calculate pricing
    const quantity = cardConfig.quantity || 1;
    const unitPrice = 29.99;
    const subtotal = unitPrice * quantity;
    const shippingAmount = 5.00;
    const taxAmount = subtotal * 0.0575; // 5.75% tax
    const totalAmount = subtotal + shippingAmount + taxAmount;

    // Create order in Supabase with correct field structure
    const order = await SupabaseOrderStore.create({
      orderNumber: generateOrderNumber(),
      status: 'confirmed',
      customerName: checkoutData.fullName,
      email: checkoutData.email,
      phoneNumber: checkoutData.phoneNumber || '',
      cardConfig: cardConfig,
      pricing: {
        subtotal,
        shipping: shippingAmount,
        tax: taxAmount,
        total: totalAmount,
      },
      shipping: {
        fullName: checkoutData.fullName,
        addressLine1: checkoutData.addressLine1,
        addressLine2: checkoutData.addressLine2,
        city: checkoutData.city,
        state: checkoutData.state,
        country: checkoutData.country,
        postalCode: checkoutData.postalCode,
        phoneNumber: checkoutData.phoneNumber || '',
      },
      estimatedDelivery: 'Sep 06, 2025',
      emailsSent: {},
    });

    if (!order) {
      console.error('Failed to create order in database');
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Send confirmation and receipt emails
    const emailData = formatOrderForEmail(order);
    const emailResults = await emailService.sendOrderLifecycleEmails(emailData);

    // Update order with email tracking in Supabase
    const updatedOrder = await SupabaseOrderStore.update(order.id, {
      emailsSent: {
        confirmation: {
          sent: emailResults.confirmation.success,
          timestamp: Date.now(),
          messageId: emailResults.confirmation.messageId
        },
        receipt: {
          sent: emailResults.receipt.success,
          timestamp: Date.now(),
          messageId: emailResults.receipt.messageId
        }
      }
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      emailResults: emailResults
    });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}