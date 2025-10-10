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

// Color mapping for card preview
const allColours: Array<{ value: string; label: string; hex: string; gradient: string }> = [
  // PVC colors
  { value: 'white', label: 'White', hex: '#FFFFFF', gradient: 'from-white to-gray-100' },
  { value: 'black-pvc', label: 'Black', hex: '#000000', gradient: 'from-gray-900 to-black' },
  // Wood colors
  { value: 'cherry', label: 'Cherry', hex: '#8E3A2D', gradient: 'from-red-950 to-red-900' },
  { value: 'birch', label: 'Birch', hex: '#E5C79F', gradient: 'from-amber-100 to-amber-200' },
  // Metal colors
  { value: 'black-metal', label: 'Black', hex: '#1A1A1A', gradient: 'from-gray-800 to-gray-900' },
  { value: 'silver', label: 'Silver', hex: '#C0C0C0', gradient: 'from-gray-300 to-gray-400' },
  { value: 'rose-gold', label: 'Rose Gold', hex: '#B76E79', gradient: 'from-rose-300 to-rose-400' }
];

interface OrderData {
  orderId?: string;  // Order ID from checkout (if order was pre-created)
  orderNumber?: string;  // Order number from checkout
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
  const [hasOrderError, setHasOrderError] = useState(false);

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

      // Check if order has orderId (created during checkout)
      if (!data.orderId) {
        console.error('❌ No orderId found in pending order data');
        setHasOrderError(true);
        setOrderData(data); // Set data so page can display error properly
      } else {
        setOrderData(data);
        setCardHolder(data.customerName || '');
        setHasOrderError(false);
      }
    } else {
      // If no order data, redirect back to checkout
      console.error('❌ No pending order found in localStorage');
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
    if (!voucherCode.trim()) return;

    try {
      const response = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: voucherCode.toUpperCase(),
          orderAmount: orderData?.pricing.total || 0,
          userEmail: orderData?.email
        })
      });

      const result = await response.json();

      if (result.valid && result.voucher) {
        // Calculate discount percentage for display
        const discountPercent = result.voucher.discount_type === 'percentage'
          ? result.voucher.discount_value
          : Math.round((result.voucher.discount_amount / (orderData?.pricing.total || 1)) * 100);

        setVoucherDiscount(discountPercent);
        setVoucherValid(true);
      } else {
        setVoucherDiscount(0);
        setVoucherValid(false);
      }
    } catch (error) {
      console.error('Error validating voucher:', error);
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

  // Helper functions for card preview
  const getCardGradient = () => {
    const selectedColor = allColours.find(c => c.value === orderData?.cardConfig?.color);
    return selectedColor?.gradient || 'from-gray-800 to-gray-900';
  };

  const getTextColor = () => {
    // Return white text for dark backgrounds, black for light backgrounds
    const darkBackgrounds = ['black-pvc', 'black-metal', 'cherry', 'rose-gold'];
    if (orderData?.cardConfig?.color && darkBackgrounds.includes(orderData.cardConfig.color)) {
      return 'text-white';
    }
    return 'text-gray-900';
  };

  const getFinalAmount = () => {
    if (!orderData) return 0;

    const baseAmount = orderData.pricing.total;
    const discountAmount = (baseAmount * voucherDiscount) / 100;
    return Math.max(0, baseAmount - discountAmount);
  };

  const handleStripePayment = async () => {
    try {
      // For demo purposes, simulate successful card payment
      // In production, you'd integrate with actual Stripe payment intent
      console.log('💳 Processing Stripe payment...');
      console.log('💳 Card details:', { cardNumber, expiryDate, cvv: '***' });

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('✅ Stripe payment simulated successfully');
      return { success: true, paymentId: 'stripe_' + Date.now() };
    } catch (error) {
      console.error('❌ Stripe payment error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Payment failed' };
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
      console.log('🎟️ 100% voucher discount - no payment needed');
      return { success: true, paymentId: 'voucher_' + voucherCode };
    } else {
      // Partial discount - still process the order with reduced amount
      console.log('🎟️ Partial voucher discount applied:', voucherDiscount + '%');
      console.log('🎟️ Final amount after discount:', getFinalAmount());
      return { success: true, paymentId: 'voucher_partial_' + voucherCode + '_' + Date.now() };
    }
  };

  const handlePayment = async () => {
    if (!orderData) {
      console.error('❌ No order data found');
      return;
    }

    // Validate that order exists before processing payment
    if (!orderData.orderId) {
      console.error('❌ No orderId found in order data');
      alert('No order found. Please complete checkout first.');
      router.push('/nfc/checkout');
      return;
    }

    console.log('💳 Starting payment process...');
    console.log('💳 Payment method:', paymentMethod);
    console.log('💳 Order ID:', orderData.orderId);

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
          console.log('💳 Processing card payment...');
          paymentResult = await handleStripePayment();
          break;

        case 'upi':
          if (!upiId) {
            alert('Please enter your UPI ID');
            setProcessing(false);
            return;
          }
          console.log('💳 Processing UPI payment...');
          paymentResult = await handleUPIPayment();
          break;

        case 'voucher':
          if (!voucherCode || !voucherValid) {
            alert('Please enter a valid voucher code');
            setProcessing(false);
            return;
          }
          console.log('💳 Processing voucher payment...');
          paymentResult = await handleVoucherPayment();
          break;

        default:
          throw new Error('Invalid payment method');
      }

      console.log('💳 Payment result:', paymentResult);

      if (paymentResult && paymentResult.success) {
        console.log('✅ Payment successful, processing order...');

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

        console.log('💾 Storing order confirmation:', orderConfirmation);
        localStorage.setItem('orderConfirmation', JSON.stringify(orderConfirmation));

        // Update existing order with payment details using process-order API
        try {
          console.log('📝 Updating order with payment details...');

          const response = await fetch('/api/process-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              cardConfig: orderData.cardConfig,
              checkoutData: {
                email: orderData.email,
                fullName: orderData.customerName,
                phoneNumber: orderData.phoneNumber,
                addressLine1: orderData.shipping.addressLine1,
                addressLine2: orderData.shipping.addressLine2,
                city: orderData.shipping.city,
                state: orderData.shipping.stateProvince,
                country: orderData.shipping.country,
                postalCode: orderData.shipping.postalCode,
              },
              paymentData: {
                paymentMethod,
                paymentId: paymentResult.paymentId,
                voucherCode: voucherCode || null,
                voucherDiscount: voucherDiscount || 0,
              }
            })
          });

          console.log('📡 Response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Response error:', errorText);
            throw new Error(`Failed to process order: ${response.status}`);
          }

          const result = await response.json();
          console.log('✅ Order processed successfully:', result);

        } catch (error) {
          console.error('❌ Error processing order:', error);
          // Continue to success page even if there's an error
          // The order might still be in database, and user has already paid
        }

        console.log('🔀 Redirecting to success page...');

        // Small delay to ensure everything is saved
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect to success page
        router.push('/nfc/success');
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      alert('Payment failed. Please try again.');
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

  // Show error message if no order found
  if (hasOrderError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find your order information. Please complete the checkout process first before proceeding to payment.
          </p>
          <button
            onClick={() => router.push('/nfc/checkout')}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#ff0000', color: '#FFFFFF' }}
          >
            Go to Checkout
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full mt-3 py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-300"
            style={{ backgroundColor: '#FFFFFF', color: '#374151' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Payment Form - Left Side */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Secure Payment</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Complete your purchase securely. All transactions are encrypted.</p>

              {/* Payment Method Tabs */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base"
                  style={{
                    backgroundColor: paymentMethod === 'card' ? '#ff0000' : '#F3F4F6',
                    color: paymentMethod === 'card' ? '#FFFFFF' : '#374151'
                  }}
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                  Pay with Card
                </button>

                {isIndia && (
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base"
                    style={{
                      backgroundColor: paymentMethod === 'upi' ? '#ff0000' : '#F3F4F6',
                      color: paymentMethod === 'upi' ? '#FFFFFF' : '#374151'
                    }}
                  >
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                    UPI
                  </button>
                )}

                <button
                  onClick={() => setPaymentMethod('voucher')}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base"
                  style={{
                    backgroundColor: paymentMethod === 'voucher' ? '#ff0000' : '#F3F4F6',
                    color: paymentMethod === 'voucher' ? '#FFFFFF' : '#374151'
                  }}
                >
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                  Voucher
                </button>
              </div>

              {/* Express Checkout (for card payment) */}
              {paymentMethod === 'card' && (
                <>
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Express Checkout</h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button
                        className="flex items-center justify-center py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg transition-colors font-medium cursor-pointer text-sm sm:text-base"
                        style={{ backgroundColor: '#ff0000', color: '#FFFFFF' }}
                        onClick={() => alert('Apple Pay integration coming soon!')}
                      >
                        <img src="/apple_logo.png" alt="Apple" className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        <span>Pay</span>
                      </button>
                      <button
                        className="flex items-center justify-center py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg transition-colors font-medium text-sm sm:text-base"
                        style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
                        onClick={() => alert('Google Pay integration coming soon!')}
                      >
                        <span className="text-lg sm:text-xl mr-1.5 sm:mr-2 font-bold">G</span>
                        <span>Google Pay</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative mb-4 sm:mb-6">
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
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                      />
                      <CreditCard className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="ddd dddd"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        CVC / CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 mt-3">
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded bg-white">
                      <Image
                        src="/visa.png"
                        alt="Visa"
                        width={40}
                        height={24}
                        className="h-4 sm:h-5 w-auto"
                      />
                    </div>
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded bg-white">
                      <Image
                        src="/mc.png"
                        alt="Mastercard"
                        width={35}
                        height={24}
                        className="h-4 sm:h-5 w-auto"
                      />
                    </div>
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded bg-white">
                      <Image
                        src="/amex.png"
                        alt="American Express"
                        width={35}
                        height={24}
                        className="h-4 sm:h-5 w-auto"
                      />
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
                    <h4 className="font-medium text-gray-900 mb-2">Have a voucher code?</h4>
                    <p className="text-sm text-gray-600">
                      Enter your code above and click Apply to get your discount
                    </p>
                  </div>
                </div>
              )}

              {/* Voucher Info Message */}
              {paymentMethod === 'voucher' && voucherValid && voucherDiscount < 100 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 Your voucher covers {voucherDiscount}% of the order. The remaining ${getFinalAmount().toFixed(2)} will be processed as a voucher order with partial discount.
                  </p>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-4 sm:mt-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-colors disabled:cursor-not-allowed"
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
                ) : paymentMethod === 'voucher' && voucherDiscount === 100 ? (
                  'Complete Order (Free with Voucher)'
                ) : (
                  `Pay $${getFinalAmount().toFixed(2)}`
                )}
              </button>

              {/* Security Badges */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                  SSL Secure Connection
                </div>
                <div className="flex items-center">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                  PCI DSS Compliant
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1 lg:sticky lg:top-8 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h3>

              {/* Card Preview */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Your NFC Card</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                  {orderData?.cardConfig?.fullName || `${orderData?.cardConfig?.firstName} ${orderData?.cardConfig?.lastName}` || 'Custom NFC Card'}
                </p>
                {orderData?.cardConfig?.baseMaterial && (
                  <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                    Material: {orderData.cardConfig.baseMaterial.charAt(0).toUpperCase() + orderData.cardConfig.baseMaterial.slice(1)} •
                    Color: {(() => {
                      const color = orderData.cardConfig.color || 'Black';
                      // Remove material suffix (e.g., "black-pvc" -> "black")
                      const colorName = color.split('-')[0];
                      return colorName.charAt(0).toUpperCase() + colorName.slice(1);
                    })()}
                  </p>
                )}

                {/* Front Card */}
                <div className="mb-3 sm:mb-4">
                  <div className={`w-48 sm:w-56 aspect-[1.6/1] bg-gradient-to-br ${getCardGradient()} rounded-lg sm:rounded-xl relative overflow-hidden shadow-lg mr-auto`}>
                    {/* AI Icon top right - Changes based on card color */}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <div
                        className={`rounded-md sm:rounded-lg p-1.5 sm:p-2 shadow-md ${
                          orderData?.cardConfig?.color === 'white'
                            ? 'bg-white'
                            : 'bg-gray-900'
                        }`}
                      >
                        <img
                          src={orderData?.cardConfig?.color === 'white' ? '/ai2.png' : '/ai1.png'}
                          alt="AI"
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${orderData?.cardConfig?.color === 'white' ? '' : 'invert'}`}
                        />
                      </div>
                    </div>

                    {/* User Name or Initials */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                      {(() => {
                        const firstName = orderData?.cardConfig?.firstName?.trim() || '';
                        const lastName = orderData?.cardConfig?.lastName?.trim() || '';
                        const isSingleCharOnly = firstName.length <= 1 && lastName.length <= 1;

                        if (isSingleCharOnly) {
                          return (
                            <div className={`${getTextColor()} text-lg sm:text-xl font-light`}>
                              {(firstName || 'J').toUpperCase()}{(lastName || 'D').toUpperCase()}
                            </div>
                          );
                        } else {
                          return (
                            <div className={`${getTextColor()} text-xs sm:text-sm font-medium`}>
                              {firstName} {lastName}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>NFC Card × {orderData?.cardConfig?.quantity || 1}</span>
                  <span>${orderData.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customization</span>
                  <span className="text-green-600">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Included</span>
                </div>
                <div className="flex justify-between">
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
                <div className="border-t pt-2 sm:pt-3 flex justify-between font-semibold text-sm sm:text-base">
                  <span>Total</span>
                  <span>${getFinalAmount().toFixed(2)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-4 sm:mt-6 flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-xs sm:text-sm">Your payment info is encrypted and secure</p>
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