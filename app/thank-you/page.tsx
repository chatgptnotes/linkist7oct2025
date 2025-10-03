'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CheckIcon from '@mui/icons-material/Check';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Icon aliases
const Check = CheckIcon;
const Facebook = FacebookIcon;
const Twitter = XIcon;
const Instagram = InstagramIcon;
const Linkedin = LinkedInIcon;

export default function ThankYouPage() {
  const [orderData, setOrderData] = useState<{
    config: {
      firstName: string;
      lastName: string;
      title?: string;
      mobile?: string;
      whatsapp?: boolean;
      logo?: string;
      quantity?: number;
    };
    checkout: {
      email: string;
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      phoneNumber: string;
    };
    orderNumber: string;
    estimatedDelivery: string;
    trackingUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    const savedConfig = localStorage.getItem('cardConfig');
    const savedCheckout = localStorage.getItem('checkoutData');
    // const savedPayment = localStorage.getItem('paymentData');
    
    if (savedConfig && savedCheckout) {
      const config = JSON.parse(savedConfig);
      const checkout = JSON.parse(savedCheckout);
      
      setOrderData({
        config,
        checkout,
        orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        estimatedDelivery: 'Sep 06, 2025',
        trackingUrl: '#'
      });
    }
    
    setLoading(false);
  }, []);

  const calculateSubtotal = () => 29.99;
  const calculateShipping = () => 1.50;
  const calculateTax = () => 1.50;
  const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank you, Alex!</h1>
          <p className="text-gray-600 mb-2">Your order has been confirmed and will be shipped soon.</p>
          <p className="text-gray-600 mb-8">
            A confirmation email has been sent to{' '}
            <span className="font-medium">{orderData?.checkout?.email || 'your email'}</span>
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Delivering to */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Delivering to</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="font-medium text-gray-900">
                    {orderData?.checkout?.fullName || 'Alex Morgan'}
                  </div>
                  <div>{orderData?.checkout?.addressLine1 || '1234 Main Street'}</div>
                  {orderData?.checkout?.addressLine2 && <div>{orderData.checkout.addressLine2}</div>}
                  <div>
                    {orderData?.checkout?.city || 'San Francisco'}, {orderData?.checkout?.state || 'CA'} {orderData?.checkout?.postalCode || '94103'}
                  </div>
                  <div>{orderData?.checkout?.country || 'United States'}</div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">1 x Linkist NFC Card</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${calculateShipping().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Delivery */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium">Estimated delivery: {orderData?.estimatedDelivery}</span>
            </div>
          </div>

          {/* Download Invoice Button */}
          <button className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors mb-8">
            Download Invoice
          </button>

          {/* Tell a Friend */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tell a friend</h3>
            <p className="text-gray-600 mb-6">Share your experience and help others discover Linkist</p>
            
            <div className="flex justify-center space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white hover:bg-red-800 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-gray-600 mb-4">Continue Shopping</p>
            <Link 
              href="/" 
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}