'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Lock, ArrowLeft, CreditCard } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface OrderData {
  cartItems: any[];
  checkoutData: any;
  total: number;
}

function CheckoutForm({ orderData }: { orderData: OrderData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(true);

  useEffect(() => {
    if (!stripe) return;
    
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;
      
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          // Redirect to success page
          router.push('/nfc/success');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
      setIsLoadingPaymentIntent(false);
    });
  }, [stripe, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment?success=true`,
        receipt_email: orderData.checkoutData.email,
      },
    });

    if (error?.type === 'card_error' || error?.type === 'validation_error') {
      setMessage(error.message || 'An error occurred');
    } else if (error) {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  if (isLoadingPaymentIntent) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
        </div>
        
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                name: orderData.checkoutData.fullName,
                email: orderData.checkoutData.email,
                phone: orderData.checkoutData.phoneNumber,
                address: {
                  line1: orderData.checkoutData.addressLine1,
                  line2: orderData.checkoutData.addressLine2,
                  city: orderData.checkoutData.city,
                  state: orderData.checkoutData.state,
                  postal_code: orderData.checkoutData.postalCode,
                  country: orderData.checkoutData.country === 'United States' ? 'US' : orderData.checkoutData.country,
                },
              },
            },
          }}
        />
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('succeeded') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-red-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay $${orderData.total.toFixed(2)}`
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <Lock className="h-4 w-4" />
          <span>Payments secured by Stripe</span>
        </div>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load order data from localStorage
    const savedConfig = localStorage.getItem('cardConfig');
    const savedCheckout = localStorage.getItem('checkoutData');

    if (!savedConfig || !savedCheckout) {
      router.push('/nfc/configure');
      return;
    }

    const config = JSON.parse(savedConfig);
    const checkout = JSON.parse(savedCheckout);

    // Check if proof is approved
    if (config.status !== 'approved') {
      router.push('/nfc/proof-approval');
      return;
    }

    const cartItems = [{
      id: 1,
      name: 'Linkist NFC Card',
      price: 29.99,
      quantity: config.quantity || 1,
      config: config
    }];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const orderData: OrderData = {
      cartItems,
      checkoutData: checkout,
      total
    };

    setOrderData(orderData);

    // Create PaymentIntent
    createPaymentIntent(total, config.quantity, {
      email: checkout.email,
      customerName: checkout.fullName,
      productConfig: JSON.stringify(config),
    });

  }, [router]);

  const createPaymentIntent = async (amount: number, quantity: number, metadata: any) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          quantity,
          metadata,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setClientSecret(data.clientSecret);
      } else {
        setError(data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/checkout"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Return to Checkout
          </Link>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No order data found</p>
          <Link href="/nfc/configure" className="btn-primary">Start Over</Link>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#EF4444',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#DC2626',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/checkout')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Checkout
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Payment</h1>
              
              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm orderData={orderData} />
                </Elements>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {orderData.cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                  <img src="/logo.svg" alt="Linkist" className="h-4 filter brightness-0 invert" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  <div className="text-xs text-green-600">✓ Approved for printing</div>
                </div>
                <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            
            <div className="space-y-3 py-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${(orderData.total - 5.00 - (orderData.total - 5.00) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">$5.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5% VAT)</span>
                <span className="font-medium">${((orderData.total - 5.00) * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total (USD)</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-2">Shipping to:</p>
              <div className="text-gray-900">
                <p>{orderData.checkoutData.fullName}</p>
                <p>{orderData.checkoutData.addressLine1}</p>
                {orderData.checkoutData.addressLine2 && <p>{orderData.checkoutData.addressLine2}</p>}
                <p>{orderData.checkoutData.city}, {orderData.checkoutData.state} {orderData.checkoutData.postalCode}</p>
                <p>{orderData.checkoutData.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}