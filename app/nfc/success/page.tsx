'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, ArrowRight, Calendar } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<{ orderNumber: string; cardConfig: { fullName: string }; shipping: { fullName: string; email: string; phone: string; addressLine1: string; addressLine2?: string; city: string; stateProvince?: string; postalCode: string; country: string; isFounderMember: boolean; quantity: number }; pricing: { total: number } } | null>(null);

  useEffect(() => {
    const order = localStorage.getItem('currentOrder');
    if (order) {
      setOrderData(JSON.parse(order));
    } else {
      router.push('/landing');
    }
  }, [router]);

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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/landing" className="text-xl font-bold text-gray-900">
              Linkist NFC
            </Link>
            <Link 
              href="/account" 
              className="text-gray-700 hover:text-gray-900"
            >
              My Account
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your order. Your NFC card is being prepared.
          </p>
          <p className="text-lg text-gray-500">
            Order #{orderData.orderNumber}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Card Design</span>
                <span className="font-medium">
                  {orderData.cardConfig?.fullName || 'Custom NFC Card'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{orderData.shipping?.quantity || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-lg">
                  ${orderData.pricing?.total.toFixed(2)}
                </span>
              </div>
              {orderData.shipping?.isFounderMember && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">
                      Founder Member Benefits Included!
                    </span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    You&apos;ll get 1 year free app access when we launch
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{orderData.shipping?.fullName}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2">{orderData.shipping?.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2">{orderData.shipping?.phone}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-gray-600 mb-1">Shipping Address:</p>
                <div className="text-gray-900">
                  <p>{orderData.shipping?.addressLine1}</p>
                  {orderData.shipping?.addressLine2 && (
                    <p>{orderData.shipping.addressLine2}</p>
                  )}
                  <p>
                    {orderData.shipping?.city}, {orderData.shipping?.stateProvince} {orderData.shipping?.postalCode}
                  </p>
                  <p>{orderData.shipping?.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-6">What Happens Next</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 rounded-full p-2">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-700">Order Confirmed</h3>
                <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                <p className="text-xs text-gray-500 mt-1">Just now</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-red-600 rounded-full p-2">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-700">Design Processing</h3>
                <p className="text-sm text-gray-600">Your card design is being prepared for production</p>
                <p className="text-xs text-gray-500 mt-1">Within 1-2 business days</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-gray-300 rounded-full p-2">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Shipping</h3>
                <p className="text-sm text-gray-600">Your card will be shipped to your address</p>
                <p className="text-xs text-gray-500 mt-1">3-5 business days after production</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-gray-300 rounded-full p-2">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Delivery</h3>
                <p className="text-sm text-gray-600">Your NFC card arrives at your doorstep</p>
                <p className="text-xs text-gray-500 mt-1">We&apos;ll send tracking information</p>
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
            href="/nfc/configure"
            className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition text-center flex items-center justify-center"
          >
            Design Another Card
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          <Link
            href="/account"
            className="flex-1 border border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition text-center flex items-center justify-center"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Track Your Order
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
    </div>
  );
}