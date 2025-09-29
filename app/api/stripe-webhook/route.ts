import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { emailService } from '@/lib/email-service';
import { formatOrderForEmail, generateOrderNumber } from '@/lib/order-store';
import type { OrderData } from '@/lib/email-templates';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('⚠️ Stripe webhook received but STRIPE_SECRET_KEY not configured');
    return NextResponse.json({ received: true });
  }

  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!endpointSecret || !signature) {
    console.error('Missing webhook secret or signature');
    return NextResponse.json(
      { error: 'Missing webhook configuration' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Here you would typically:
        // 1. Update order status in database
        // 2. Send confirmation email
        // 3. Trigger production workflow
        // 4. Update inventory
        
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        await handlePaymentFailure(failedPayment);
        break;

      case 'payment_method.attached':
        console.log('Payment method attached:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handling failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  console.log('Processing successful payment:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    metadata: paymentIntent.metadata,
    receipt_email: paymentIntent.receipt_email,
  });

  try {
    const email = paymentIntent.receipt_email || paymentIntent.metadata?.email;
    
    if (!email) {
      console.warn('No email found in payment intent');
      return;
    }

    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Create order in database
    const order = await SupabaseOrderStore.create({
      orderNumber,
      status: 'confirmed',
      customerName: paymentIntent.metadata?.customerName || email.split('@')[0],
      email,
      phoneNumber: paymentIntent.metadata?.phone || paymentIntent.metadata?.mobile || '',
      cardConfig: {
        firstName: paymentIntent.metadata?.firstName || 'Customer',
        lastName: paymentIntent.metadata?.lastName || '',
        title: paymentIntent.metadata?.title || 'Professional',
        mobile: paymentIntent.metadata?.mobile,
        whatsapp: paymentIntent.metadata?.whatsapp === 'true',
        quantity: parseInt(paymentIntent.metadata?.quantity || '1')
      },
      shipping: {
        fullName: paymentIntent.metadata?.shippingName || paymentIntent.metadata?.customerName || 'Customer',
        addressLine1: paymentIntent.metadata?.addressLine1 || 'Address Line 1',
        addressLine2: paymentIntent.metadata?.addressLine2 || '',
        city: paymentIntent.metadata?.city || 'City',
        state: paymentIntent.metadata?.state || 'State',
        country: paymentIntent.metadata?.country || 'Country',
        postalCode: paymentIntent.metadata?.postalCode || '00000',
        phoneNumber: paymentIntent.metadata?.phone || paymentIntent.metadata?.mobile || ''
      },
      pricing: {
        subtotal: parseFloat(paymentIntent.metadata?.subtotal || '29.99'),
        shipping: parseFloat(paymentIntent.metadata?.shipping || '5.00'),
        tax: parseFloat(paymentIntent.metadata?.tax || '1.75'),
        total: paymentIntent.amount / 100 // Convert from cents
      },
      estimatedDelivery: calculateEstimatedDelivery(),
      emailsSent: {}
    });
    
    console.log(`✅ Order ${order.orderNumber} created in database with ID: ${order.id}`);
    
    // Send automated confirmation and receipt emails
    const orderData = formatOrderForEmail(order);
    const emailResults = await emailService.sendOrderLifecycleEmails(orderData);
    
    console.log('📧 Email automation results:', {
      confirmation: emailResults.confirmation.success ? '✅' : '❌',
      receipt: emailResults.receipt.success ? '✅' : '❌'
    });

    // Update order with email tracking
    await SupabaseOrderStore.update(order.id, {
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

    console.log('Order processing completed successfully');

  } catch (error) {
    console.error('Error processing payment success:', error);
    throw error; // Re-throw to trigger webhook retry
  }
}

// Helper function to calculate estimated delivery date
function calculateEstimatedDelivery(): string {
  const now = new Date();
  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + 7); // 7 business days from now
  
  return deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

async function handlePaymentFailure(paymentIntent: any) {
  console.log('Processing failed payment:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    failure_reason: paymentIntent.last_payment_error?.message,
    receipt_email: paymentIntent.receipt_email,
  });

  try {
    const email = paymentIntent.receipt_email || paymentIntent.metadata?.email;
    
    if (!email) {
      console.warn('No email found in failed payment intent');
      return;
    }

    // Log the failed payment details
    console.error('💳 Payment Failed:', {
      paymentIntentId: paymentIntent.id,
      amount: (paymentIntent.amount / 100).toFixed(2),
      currency: paymentIntent.currency,
      customer: email,
      errorCode: paymentIntent.last_payment_error?.code,
      errorMessage: paymentIntent.last_payment_error?.message,
      errorType: paymentIntent.last_payment_error?.type,
      paymentMethodId: paymentIntent.last_payment_error?.payment_method?.id,
      declineCode: paymentIntent.last_payment_error?.decline_code,
    });

    // Check if there's an existing pending order for this payment intent
    // (This would be created during the initial checkout process)
    const orderId = paymentIntent.metadata?.orderId;
    
    if (orderId) {
      // Update existing order status to cancelled due to payment failure
      const updatedOrder = await SupabaseOrderStore.updateStatus(orderId, 'cancelled', {
        notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown payment error'}`
      });
      
      if (updatedOrder) {
        console.log(`Order ${orderId} marked as cancelled due to payment failure`);
      }
    }

    // Create failed payment record for analysis and potential retry
    const failedPaymentData = {
      orderNumber: `FAILED-${Date.now().toString().slice(-8)}`,
      status: 'cancelled' as const,
      customerName: paymentIntent.metadata?.customerName || email.split('@')[0],
      email,
      phoneNumber: paymentIntent.metadata?.phone || paymentIntent.metadata?.mobile || '',
      cardConfig: {
        firstName: paymentIntent.metadata?.firstName || 'Customer',
        lastName: paymentIntent.metadata?.lastName || '',
        title: paymentIntent.metadata?.title || 'Professional',
        mobile: paymentIntent.metadata?.mobile,
        whatsapp: paymentIntent.metadata?.whatsapp === 'true',
        quantity: parseInt(paymentIntent.metadata?.quantity || '1')
      },
      shipping: {
        fullName: paymentIntent.metadata?.shippingName || paymentIntent.metadata?.customerName || 'Customer',
        addressLine1: paymentIntent.metadata?.addressLine1 || 'Address Line 1',
        addressLine2: paymentIntent.metadata?.addressLine2 || '',
        city: paymentIntent.metadata?.city || 'City',
        state: paymentIntent.metadata?.state || 'State',
        country: paymentIntent.metadata?.country || 'Country',
        postalCode: paymentIntent.metadata?.postalCode || '00000',
        phoneNumber: paymentIntent.metadata?.phone || paymentIntent.metadata?.mobile || ''
      },
      pricing: {
        subtotal: parseFloat(paymentIntent.metadata?.subtotal || '29.99'),
        shipping: parseFloat(paymentIntent.metadata?.shipping || '5.00'),
        tax: parseFloat(paymentIntent.metadata?.tax || '1.75'),
        total: paymentIntent.amount / 100 // Convert from cents
      },
      notes: `Payment failed - Stripe Payment Intent: ${paymentIntent.id}\nError: ${paymentIntent.last_payment_error?.message}\nError Code: ${paymentIntent.last_payment_error?.code}\nDecline Code: ${paymentIntent.last_payment_error?.decline_code || 'N/A'}`,
      emailsSent: {}
    };

    // Create failed order record for analysis
    const failedOrder = await SupabaseOrderStore.create(failedPaymentData);
    console.log(`Failed payment record created: ${failedOrder.orderNumber}`);

    // Send payment failure notification email (optional - be careful not to spam customers)
    try {
      const failureEmailData = formatOrderForEmail(failedOrder);
      
      // You might want to create a specific "payment failed" email template
      // For now, we'll just log that we would send a notification
      console.log('📧 Would send payment failure notification to:', email);
      
      // Uncomment below if you want to actually send failure emails
      // const emailResult = await emailService.sendPaymentFailureEmail(failureEmailData);
      // console.log('Payment failure email sent:', emailResult.success ? '✅' : '❌');
      
    } catch (emailError) {
      console.error('Error sending payment failure email:', emailError);
      // Don't throw here - we don't want email failures to cause webhook failures
    }

    console.log('Payment failure processing completed');

  } catch (error) {
    console.error('Error processing payment failure:', error);
    // Don't throw error for payment failures - we don't want webhook retries for failed payments
  }
}

// Disable body parsing for webhooks
export const runtime = 'nodejs';
export const preferredRegion = 'auto';