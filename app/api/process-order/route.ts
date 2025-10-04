import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { SupabaseUserStore } from '@/lib/supabase-user-store';
import { generateOrderNumber, formatOrderForEmail } from '@/lib/order-store';
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  console.log('🚀 [process-order] API called');

  try {
    const body = await request.json();
    console.log('📦 [process-order] Request body received:', {
      hasCardConfig: !!body.cardConfig,
      hasCheckoutData: !!body.checkoutData,
      hasPaymentData: !!body.paymentData
    });

    const { cardConfig, checkoutData, paymentData } = body;

    if (!cardConfig || !checkoutData) {
      console.error('❌ [process-order] Missing required data:', {
        cardConfig: !!cardConfig,
        checkoutData: !!checkoutData
      });
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    console.log('✅ [process-order] Data validation passed');

    // Calculate pricing
    const quantity = cardConfig.quantity || 1;
    const unitPrice = 29.99;
    const subtotal = unitPrice * quantity;
    const shippingAmount = 5.00;
    const taxAmount = subtotal * 0.0575; // 5.75% tax
    const totalAmount = subtotal + shippingAmount + taxAmount;

    console.log('💰 [process-order] Pricing calculated:', {
      quantity,
      subtotal,
      shippingAmount,
      taxAmount,
      totalAmount
    });

    // Create/update user in database
    console.log('👤 [process-order] Creating/updating user in database...');

    const user = await SupabaseUserStore.upsertByEmail({
      email: checkoutData.email,
      first_name: checkoutData.fullName?.split(' ')[0] || cardConfig.firstName,
      last_name: checkoutData.fullName?.split(' ').slice(1).join(' ') || cardConfig.lastName,
      phone_number: checkoutData.phoneNumber || null,
      email_verified: true, // They completed checkout, so email is verified
      mobile_verified: !!checkoutData.phoneNumber, // If they provided phone, assume verified
    });

    console.log('✅ [process-order] User created/updated:', {
      userId: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    });

    // Create order in Supabase with correct field structure
    console.log('📝 [process-order] Creating order in database...');
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
      console.error('❌ [process-order] Failed to create order in database');
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    console.log('✅ [process-order] Order created successfully:', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.email
    });

    // Send confirmation and receipt emails
    console.log('📧 [process-order] Sending confirmation and receipt emails...');
    const emailData = formatOrderForEmail(order);
    const emailResults = await emailService.sendOrderLifecycleEmails(emailData);
    console.log('📧 [process-order] Email results:', {
      confirmationSent: emailResults.confirmation.success,
      receiptSent: emailResults.receipt.success
    });

    // Update order with email tracking in Supabase
    console.log('🔄 [process-order] Updating order with email tracking...');
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

    console.log('🎉 [process-order] Order processed successfully!', {
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      emailResults: emailResults
    });

  } catch (error) {
    console.error('❌ [process-order] Error processing order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}