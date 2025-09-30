import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe, PRODUCT_CONFIG } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 503 }
      );
    }

    const { amount, quantity = 1, metadata = {} } = await request.json();

    // Validate the amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Calculate pricing breakdown
    const subtotal = PRODUCT_CONFIG.NFC_CARD.price * quantity;
    const shipping = PRODUCT_CONFIG.SHIPPING.price;
    const tax = subtotal * PRODUCT_CONFIG.TAX_RATE;
    const total = subtotal + shipping + tax;

    // Verify the amount matches our calculation
    if (Math.abs(amount - total) > 0.01) {
      return NextResponse.json(
        { error: 'Amount mismatch' },
        { status: 400 }
      );
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency: PRODUCT_CONFIG.NFC_CARD.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        product: 'nfc-card',
        quantity: quantity.toString(),
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        tax: tax.toString(),
        ...metadata,
      },
      description: `Linkist NFC Card (${quantity}x) - Premium smart business cards`,
      receipt_email: metadata.email || undefined,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: formatAmountFromStripe(paymentIntent.amount),
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

// Helper function to format amount from Stripe
function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}