'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Icon aliases
const CheckCircle = CheckCircleIcon;
const Package = Inventory2Icon;
const Truck = LocalShippingIcon;
const Mail = EmailIcon;
const ArrowRight = ArrowForwardIcon;

export default function SuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<{ orderNumber: string; cardConfig: { fullName: string }; shipping: { fullName: string; email: string; phone: string; addressLine1: string; addressLine2?: string; city: string; stateProvince?: string; postalCode: string; country: string; isFounderMember: boolean; quantity: number }; pricing: { total: number } } | null>(null);

  useEffect(() => {
    // First check for orderConfirmation from payment page
    const orderConfirmation = localStorage.getItem('orderConfirmation');
    if (orderConfirmation) {
      const confirmation = JSON.parse(orderConfirmation);
      // Convert to order format
      const orderData = {
        orderNumber: 'LFND' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        ...confirmation,
        cardConfig: confirmation.cardConfig || { fullName: confirmation.customerName },
        shipping: confirmation.shipping || {},
        pricing: confirmation.pricing || { total: confirmation.amount }
      };
      setOrderData(orderData);
      // Store the order data for page refreshes
      localStorage.setItem('lastCompletedOrder', JSON.stringify(orderData));
      // Clear the confirmation data
      localStorage.removeItem('orderConfirmation');
      localStorage.removeItem('pendingOrder');
    } else {
      // Check for last completed order (in case of page refresh)
      const lastOrder = localStorage.getItem('lastCompletedOrder');
      if (lastOrder) {
        setOrderData(JSON.parse(lastOrder));
      } else {
        // Fallback to currentOrder if coming from old flow
        const order = localStorage.getItem('currentOrder');
        if (order) {
          setOrderData(JSON.parse(order));
        } else {
          // Create a demo order for testing
          console.log('No order data found, creating demo order for display');
          const demoOrder = {
            orderNumber: 'LFND' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            cardConfig: { fullName: 'Your Name' },
            shipping: {
              fullName: 'Customer Name',
              email: 'customer@example.com',
              phone: '+1 (555) 123-4567',
              addressLine1: '123 Main Street',
              city: 'Dubai',
              country: 'United Arab Emirates',
              postalCode: '00000',
              isFounderMember: true
            },
            pricing: { total: 113.05 }
          };
          setOrderData(demoOrder);
          // Don't redirect, just show the success page with demo data
        }
      }
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations!
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Your card is on the way
          </p>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your order. Your NFC card is being prepared.
          </p>
          <p className="text-lg font-medium text-gray-700">
            Order #{orderData.orderNumber}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Order Details</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Card Name</span>
                <span className="font-medium text-gray-900">
                  {orderData.cardConfig?.fullName || orderData.customerName || 'John Doe'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">1</span>
              </div>

              <div className="pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${((orderData.pricing?.total || 103.95) / 1.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Customization</span>
                  <span className="text-green-600">Included</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping ({orderData.shipping?.country === 'United Arab Emirates' ? 'UAE' : orderData.shipping?.country || 'AE'})</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (5%)</span>
                  <span>${(((orderData.pricing?.total || 103.95) / 1.05) * 0.05).toFixed(2)}</span>
                </div>
                {orderData.shipping?.isFounderMember && (
                  <div className="flex justify-between text-green-600">
                    <span>Founder Member Benefits (10% off)</span>
                    <span>Included</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-700 font-bold">Total Amount</span>
                <span className="font-bold text-xl text-gray-900">
                  ${orderData.pricing?.total.toFixed(2) || '103.95'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Shipping Information</h3>

            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Name:</p>
                <p className="font-medium text-gray-900">{orderData.shipping?.fullName || orderData.customerName || 'Customer'}</p>
              </div>

              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Email:</p>
                <p className="text-gray-900">{orderData.shipping?.email || orderData.email || 'customer@example.com'}</p>
              </div>

              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Phone:</p>
                <p className="text-gray-900">{orderData.shipping?.phone || orderData.shipping?.phoneNumber || orderData.phoneNumber || '+1 (555) 123-4567'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Shipping Address:</p>
                <div className="text-gray-900 leading-relaxed">
                  <p className="font-medium">{orderData.shipping?.addressLine1 || 'Address'}</p>
                  {orderData.shipping?.addressLine2 && <p>{orderData.shipping.addressLine2}</p>}
                  <p>{orderData.shipping?.city || 'City'}{orderData.shipping?.stateProvince ? `, ${orderData.shipping.stateProvince}` : ''} {orderData.shipping?.postalCode || ''}</p>
                  <p>{orderData.shipping?.country || 'Country'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-8">What Happens Next</h2>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">Order Confirmed</h3>
                <p className="text-gray-600 text-sm">Your order has been received and confirmed</p>
                <p className="text-xs text-gray-500 mt-2">Just now</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">Design Processing</h3>
                <p className="text-gray-600 text-sm">Your card design is being prepared for production</p>
                <p className="text-xs text-gray-500 mt-2">Within 1-2 business days</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-500 mb-1">Shipping</h3>
                <p className="text-gray-500 text-sm">Your card will be shipped to your address</p>
                <p className="text-xs text-gray-400 mt-2">3-5 business days after production</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-500 mb-1">Delivery</h3>
                <p className="text-gray-500 text-sm">Your NFC card arrives at your doorstep</p>
                <p className="text-xs text-gray-400 mt-2">We'll send tracking information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Updates */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <div className="flex items-start space-x-3">
            <Mail className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Stay Updated
              </h3>
              <p className="text-blue-700 mb-4">
                We&apos;ll send you email updates at each step of the process:
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Order confirmation (sent now)</li>
                <li>• Design approval and production start</li>
                <li>• Shipping notification with tracking</li>
                <li>• Delivery confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/profiles/builder"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition text-center flex items-center justify-center"
          >
            Start building Profile
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        {/* Support Information */}
        <div className="text-center mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Questions about your order? We&apos;re here to help.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/help" className="text-blue-600 hover:underline">
              Help Center
            </Link>
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
            <Link href="mailto:support@linkist.ai" className="text-blue-600 hover:underline">
              support@linkist.ai
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}