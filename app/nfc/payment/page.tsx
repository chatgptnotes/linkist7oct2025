'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import QRCode from 'qrcode';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Footer from '@/components/Footer';

// Icon aliases
const CreditCard = CreditCardIcon;
const Lock = LockIcon;
const Shield = SecurityIcon;
const Check = CheckIcon;
const ChevronLeft = ChevronLeftIcon;
const Smartphone = SmartphoneIcon;
const Ticket = ConfirmationNumberIcon;
const AlertCircle = ErrorOutlineIcon;

// Initialize Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface OrderData {
  customerName: string;
  email: string;
  phoneNumber: string;
  cardConfig: any;
  shipping: any;
  pricing: any;
}

export default function NFCPaymentPage() {
  const router = useRouter();

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'voucher'>('card');
  const [processing, setProcessing] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI details
  const [upiId, setUpiId] = useState('');
  const [showUpiQR, setShowUpiQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Voucher details
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherValid, setVoucherValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Get order data from localStorage (set by checkout page)
    const storedOrderData = localStorage.getItem('pendingOrder');
    if (storedOrderData) {
      const data = JSON.parse(storedOrderData);
      setOrderData(data);
      setCardHolder(data.customerName || '');
    } else {
      // If no order data, redirect back to checkout
      router.push('/nfc/checkout');
    }
  }, [router]);

  // Generate QR code when UPI QR is shown
  useEffect(() => {
    const generateQRCode = async () => {
      if (showUpiQR && orderData) {
        try {
          const amount = getFinalAmount();
          // Create UPI payment string
          const upiString = `upi://pay?pa=linkist@paytm&pn=Linkist%20NFC&am=${amount.toFixed(2)}&cu=USD&tn=NFC%20Card%20Payment`;

          // Generate QR code as data URL
          const qrDataUrl = await QRCode.toDataURL(upiString, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });

          setQrCodeUrl(qrDataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [showUpiQR, orderData, voucherDiscount]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace('/', '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validateVoucher = async () => {
    if (!voucherCode) return;

    // Simulate voucher validation
    // In production, this would call an API
    const validVouchers: { [key: string]: number } = {
      'FOUNDER50': 50,
      'WELCOME20': 20,
      'LINKIST10': 10,
      'EARLY100': 100,
    };

    if (validVouchers[voucherCode.toUpperCase()]) {
      setVoucherDiscount(validVouchers[voucherCode.toUpperCase()]);
      setVoucherValid(true);
    } else {
      setVoucherDiscount(0);
      setVoucherValid(false);
    }
  };

  const generateUPIQR = () => {
    if (!orderData) return '';

    // Generate UPI payment string
    const upiString = `upi://pay?pa=linkist@paytm&pn=Linkist%20NFC&am=${getFinalAmount()}&cu=INR&tn=NFC%20Card%20Purchase`;

    // In production, this would generate an actual QR code
    return upiString;
  };

  const getFinalAmount = () => {
    if (!orderData) return 0;

    const baseAmount = orderData.pricing.total;
    const discountAmount = (baseAmount * voucherDiscount) / 100;
    return Math.max(0, baseAmount - discountAmount);
  };

  const handleStripePayment = async () => {
    try {
      // Call your backend to create a payment intent
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getFinalAmount(),
          currency: orderData?.shipping.country === 'IN' ? 'inr' : 'usd',
          orderData
        })
      });

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      // In production, you'd use Stripe Elements for card collection
      // For now, we'll simulate success
      console.log('Processing Stripe payment...');

      return { success: true, paymentId: 'stripe_' + Date.now() };
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw error;
    }
  };

  const handleUPIPayment = async () => {
    // Generate UPI intent for mobile devices
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      const upiIntent = generateUPIQR();
      window.location.href = upiIntent;

      // Show QR code for desktop users to scan
    } else {
      setShowUpiQR(true);
    }

    // In production, you'd poll for payment confirmation
    // For now, simulate success after user action
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, paymentId: 'upi_' + Date.now() });
      }, 3000);
    });
  };

  const handleVoucherPayment = async () => {
    if (voucherDiscount === 100) {
      // Full discount, no payment needed
      return { success: true, paymentId: 'voucher_' + voucherCode };
    } else {
      // Partial discount, need additional payment
      alert('Please select a payment method for the remaining amount');
      return { success: false };
    }
  };

  const handlePayment = async () => {
    if (!orderData) return;

    setProcessing(true);

    try {
      let paymentResult;

      switch (paymentMethod) {
        case 'card':
          if (!cardNumber || !expiryDate || !cvv) {
            alert('Please enter all card details');
            setProcessing(false);
            return;
          }
          paymentResult = await handleStripePayment();
          break;

        case 'upi':
          if (!upiId) {
            alert('Please enter your UPI ID');
            setProcessing(false);
            return;
          }
          paymentResult = await handleUPIPayment();
          break;

        case 'voucher':
          if (!voucherCode || !voucherValid) {
            alert('Please enter a valid voucher code');
            setProcessing(false);
            return;
          }
          paymentResult = await handleVoucherPayment();
          break;

        default:
          throw new Error('Invalid payment method');
      }

      if (paymentResult.success) {
        // Store payment confirmation
        const orderConfirmation = {
          ...orderData,
          paymentMethod,
          paymentId: paymentResult.paymentId,
          amount: getFinalAmount(),
          voucherCode: voucherCode || null,
          voucherDiscount: voucherDiscount || 0,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('orderConfirmation', JSON.stringify(orderConfirmation));

        // Create order in backend
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderConfirmation)
        });

        // Redirect to success page
        router.push('/nfc/success');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const isIndia = orderData.shipping.country === 'IN' || orderData.shipping.country === 'India';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header - Linkist Logo Only */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Linkist</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Customer Info Card */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xl">~</span>
              <span className="font-semibold text-gray-900">{orderData.customerName}</span>
            </div>
            <div className="text-gray-600">
              {orderData.phoneNumber}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h2>
              <p className="text-gray-600 mb-6">Complete your purchase securely. All transactions are encrypted.</p>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className="flex-1 py-3 px-4 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: paymentMethod === 'card' ? '#ff0000' : '#F3F4F6',
                    color: paymentMethod === 'card' ? '#FFFFFF' : '#374151'
                  }}
                >
                  <CreditCard className="w-5 h-5 inline mr-2" />
                  Pay with Card
                </button>

                {isIndia && (
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className="flex-1 py-3 px-4 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: paymentMethod === 'upi' ? '#ff0000' : '#F3F4F6',
                      color: paymentMethod === 'upi' ? '#FFFFFF' : '#374151'
                    }}
                  >
                    <Smartphone className="w-5 h-5 inline mr-2" />
                    UPI
                  </button>
                )}

                <button
                  onClick={() => setPaymentMethod('voucher')}
                  className="flex-1 py-3 px-4 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: paymentMethod === 'voucher' ? '#ff0000' : '#F3F4F6',
                    color: paymentMethod === 'voucher' ? '#FFFFFF' : '#374151'
                  }}
                >
                  <Ticket className="w-5 h-5 inline mr-2" />
                  Voucher
                </button>
              </div>

              {/* Express Checkout (for card payment) */}
              {paymentMethod === 'card' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Express Checkout</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg transition-colors font-medium"
                        style={{ backgroundColor: '#ff0000', color: '#FFFFFF' }}
                        onClick={() => alert('Apple Pay integration coming soon!')}
                      >
                        <span className="text-xl mr-2">🍎</span>
                        <span>Pay</span>
                      </button>
                      <button
                        className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg transition-colors font-medium"
                        style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
                        onClick={() => alert('Google Pay integration coming soon!')}
                      >
                        <span className="text-xl mr-2 font-bold">G</span>
                        <span>Google Pay</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">OR</span>
                    </div>
                  </div>
                </>
              )}

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC / CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2 py-1 border rounded">
                      <span className="text-blue-600 font-bold text-xs">VISA</span>
                    </div>
                    <div className="px-2 py-1 border rounded">
                      <span className="text-red-600 font-bold text-xs">MC</span>
                    </div>
                    <div className="px-2 py-1 border rounded">
                      <span className="text-blue-500 font-bold text-xs">AMEX</span>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter UPI ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <Smartphone className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports: PhonePe, GPay, Paytm, BHIM, and all UPI apps
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">How UPI Payment Works:</h4>
                    <ol className="text-sm text-purple-700 space-y-1">
                      <li>1. Enter your UPI ID above</li>
                      <li>2. Click "Pay Now"</li>
                      <li>3. You'll receive a payment request on your UPI app</li>
                      <li>4. Approve the payment in your UPI app</li>
                      <li>5. Return here to see confirmation</li>
                    </ol>
                  </div>

                  {showUpiQR && (
                    <div className="bg-white border-2 border-purple-500 rounded-lg p-4 text-center">
                      <h4 className="font-medium mb-2">Scan QR Code to Pay</h4>
                      <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                        {qrCodeUrl ? (
                          <img
                            src={qrCodeUrl}
                            alt="UPI QR Code"
                            className="w-full h-full rounded-lg"
                          />
                        ) : (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Scan with any UPI app
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Amount: ${getFinalAmount().toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Voucher Payment Form */}
              {paymentMethod === 'voucher' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter Voucher Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                      />
                      <button
                        onClick={validateVoucher}
                        className="px-6 py-3 rounded-lg transition-colors"
                        style={{ backgroundColor: '#111827', color: '#FFFFFF' }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {voucherValid === true && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Voucher Applied!</p>
                        <p className="text-sm text-green-700">
                          You get {voucherDiscount}% off on your order
                        </p>
                      </div>
                    </div>
                  )}

                  {voucherValid === false && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Invalid Voucher</p>
                        <p className="text-sm text-red-700">
                          This voucher code is not valid or has expired
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Try these codes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['FOUNDER50', 'WELCOME20', 'LINKIST10'].map(code => (
                        <button
                          key={code}
                          onClick={() => {
                            setVoucherCode(code);
                            validateVoucher();
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                          style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-colors disabled:cursor-not-allowed"
                style={{
                  backgroundColor: processing ? '#D1D5DB' : '#ff0000',
                  color: '#FFFFFF'
                }}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ${isIndia ? '₹' : '$'}${getFinalAmount().toFixed(2)}`
                )}
              </button>

              {/* Security Badges */}
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  SSL Secure Connection
                </div>
                <div className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-blue-500" />
                  PCI DSS Compliant
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              {/* Order Item */}
              <div className="flex items-start gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Founder's Edition Card</h4>
                  <p className="text-sm text-gray-500">One-time purchase</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${orderData.pricing.subtotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${orderData.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Customization</span>
                  <span className="text-green-600">Included</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping ({orderData.shipping.country === 'IN' ? 'India' : orderData.shipping.country === 'AE' ? 'UAE' : orderData.shipping.country})</span>
                  <span className="text-green-600">{orderData.pricing.shippingCost === 0 ? 'Free' : `$${orderData.pricing.shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{isIndia ? 'GST (18%)' : 'VAT (5%)'}</span>
                  <span>${orderData.pricing.taxAmount.toFixed(2)}</span>
                </div>

                {orderData.isFounderMember && (
                  <div className="flex justify-between text-green-600">
                    <span>Founder Member Benefits (10% off)</span>
                    <span>-${(orderData.pricing.subtotal * 0.10).toFixed(2)}</span>
                  </div>
                )}

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Voucher ({voucherDiscount}% off)</span>
                    <span>-${((orderData.pricing.total * voucherDiscount) / 100).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {isIndia ? '₹' : '$'}{getFinalAmount().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Secure Payment Badge */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center mb-2">Secure payments powered by</p>
                <div className="flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">stripe</span>
                  <span className="text-xs text-gray-500 ml-2">3D Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}