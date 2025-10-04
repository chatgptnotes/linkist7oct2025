'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Footer from '@/components/Footer';

// Icon aliases
const ChevronDown = ExpandMoreIcon;
const Lock = LockIcon;
const CreditCard = CreditCardIcon;
const HelpCircle = HelpOutlineIcon;

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    config: {
      firstName: string;
      lastName: string;
      title?: string;
      mobile?: string;
      whatsapp?: boolean;
      logo?: string;
      quantity?: number;
    };
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    nameOnCard: '',
    expirationMM: '',
    expirationYY: '',
    cvc: '',
    country: 'United States',
    zipCode: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Load cart data from localStorage
    const savedConfig = localStorage.getItem('cardConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setCartItems([{
        id: 1,
        name: 'Linkist NFC Card',
        price: 29.99,
        quantity: config.quantity || 1,
        config: config
      }]);
    }
    setLoading(false);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 1.50; // Shipping cost
  };

  const calculateTax = () => {
    return 1.50; // VAT 5%
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handlePayment = async () => {
    console.log('💳 [confirm-payment] Payment button clicked');
    setProcessing(true);

    try {
      // Get stored data
      console.log('📦 [confirm-payment] Retrieving data from localStorage...');
      const cardConfig = JSON.parse(localStorage.getItem('cardConfig') || '{}');
      const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{}');

      console.log('📦 [confirm-payment] LocalStorage data retrieved:', {
        cardConfigPresent: !!cardConfig && Object.keys(cardConfig).length > 0,
        checkoutDataPresent: !!checkoutData && Object.keys(checkoutData).length > 0,
        cardConfig,
        checkoutData
      });

      const requestPayload = {
        cardConfig,
        checkoutData,
        paymentData
      };
      console.log('🚀 [confirm-payment] Sending request to /api/process-order:', requestPayload);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process the order
      const response = await fetch('/api/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      console.log('📨 [confirm-payment] API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ [confirm-payment] API response data:', result);

        // Save order data for thank you page
        localStorage.setItem('orderData', JSON.stringify(result.order));
        localStorage.setItem('paymentData', JSON.stringify(paymentData));

        console.log('🎉 [confirm-payment] Order processed successfully, redirecting to thank-you page');
        router.push('/thank-you');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [confirm-payment] API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData.error || 'Payment processing failed');
      }
    } catch (error) {
      console.error('❌ [confirm-payment] Payment error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error
      });
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData({...paymentData, cardNumber: formatted});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Pay with card</h1>
            
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pl-12"
                    />
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Name on Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on card
                  </label>
                  <input
                    type="text"
                    value={paymentData.nameOnCard}
                    onChange={(e) => setPaymentData({...paymentData, nameOnCard: e.target.value})}
                    placeholder="J. Appleseed"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* Expiration and CVC */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration (MM/YY)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={paymentData.expirationMM}
                        onChange={(e) => setPaymentData({...paymentData, expirationMM: e.target.value})}
                        placeholder="MM"
                        maxLength={2}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <span className="flex items-center text-gray-400">/</span>
                      <input
                        type="text"
                        value={paymentData.expirationYY}
                        onChange={(e) => setPaymentData({...paymentData, expirationYY: e.target.value})}
                        placeholder="YY"
                        maxLength={2}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={paymentData.cvc}
                        onChange={(e) => setPaymentData({...paymentData, cvc: e.target.value})}
                        placeholder="123"
                        maxLength={3}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                      />
                      <HelpCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Country and ZIP Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        value={paymentData.country}
                        onChange={(e) => setPaymentData({...paymentData, country: e.target.value})}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                      >
                        <option value="United States">United States</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={paymentData.zipCode}
                      onChange={(e) => setPaymentData({...paymentData, zipCode: e.target.value})}
                      placeholder="94103"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-red-500 text-white py-4 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay $${calculateTotal().toFixed(2)} USD`
                  )}
                </button>

                {/* Security Icons */}
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <div className="w-8 h-5 bg-red-700 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    AMEX
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Lock className="h-3 w-3 mr-1" />
                    3-D Secure supported
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-red-500 font-bold text-xs">LINKIST</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold">${item.price}</div>
              </div>
            ))}
            
            <div className="space-y-3 py-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${calculateShipping().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (5%)</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}