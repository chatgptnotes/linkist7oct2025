'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Icon aliases
const CreditCard = CreditCardIcon;
const Lock = LockIcon;
const Shield = SecurityIcon;
const Check = CheckIcon;
const ChevronLeft = ChevronLeftIcon;

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'voucher'>('card');
  const [processing, setProcessing] = useState(false);
  const [userCountry, setUserCountry] = useState('India');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI details
  const [upiId, setUpiId] = useState('');

  // Voucher details
  const [voucherCode, setVoucherCode] = useState('');

  // Order details
  const [orderItem, setOrderItem] = useState<OrderItem>({
    id: '',
    name: '',
    quantity: 1,
    price: 249.00
  });

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 249.00,
    shipping: 0,
    vat: 12.45,
    total: 261.45
  });

  useEffect(() => {
    // Get user country and product selection from localStorage
    const userProfile = localStorage.getItem('userProfile');
    const productSelection = localStorage.getItem('productSelection');

    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        setUserCountry(profile.country || 'India');
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }

    // Set order details based on product selection
    if (productSelection) {
      let productName = 'Digital Profile';
      let productPrice = 9.00;

      switch (productSelection) {
        case 'physical-digital':
          productName = "Founder's Edition Card";
          productPrice = 249.00;
          break;
        case 'digital-with-app':
          productName = 'Digital Profile + Linkist App';
          productPrice = 19.00;
          break;
        case 'digital-only':
          productName = 'Digital Profile Only';
          productPrice = 9.00;
          break;
      }

      setOrderItem({
        id: productSelection,
        name: productName,
        quantity: 1,
        price: productPrice
      });

      // Calculate order summary based on country
      const subtotal = productPrice;
      const shipping = productSelection === 'physical-digital' ? (userCountry === 'India' ? 0 : 5.00) : 0;
      const vatRate = userCountry === 'UAE' ? 0.05 : userCountry === 'India' ? 0.18 : 0.10;
      const vat = (subtotal + shipping) * vatRate;

      setOrderSummary({
        subtotal,
        shipping,
        vat: parseFloat(vat.toFixed(2)),
        total: parseFloat((subtotal + shipping + vat).toFixed(2))
      });
    }
  }, []);

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

  const getPaymentProcessor = () => {
    return userCountry === 'India' ? 'Razorpay' : 'Stripe';
  };

  const validateCardDetails = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      showToast('Please enter a valid 16-digit card number', 'error');
      return false;
    }
    if (!cardHolder.trim()) {
      showToast('Please enter the cardholder name', 'error');
      return false;
    }
    if (expiryDate.length !== 5) {
      showToast('Please enter a valid expiry date (MM/YY)', 'error');
      return false;
    }
    if (cvv.length < 3) {
      showToast('Please enter a valid CVV', 'error');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    // Validate based on payment method
    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      showToast('Please enter your UPI ID', 'error');
      return;
    }

    if (paymentMethod === 'voucher' && !voucherCode) {
      showToast('Please enter a voucher code', 'error');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would call the actual payment API
      // For Stripe: /api/payment/stripe
      // For Razorpay: /api/payment/razorpay
      // For Voucher: /api/payment/voucher

      const paymentData = {
        method: paymentMethod,
        processor: getPaymentProcessor(),
        amount: orderSummary.total,
        currency: userCountry === 'India' ? 'INR' : userCountry === 'UAE' ? 'AED' : 'USD',
        orderId: orderItem.id,
        ...(paymentMethod === 'card' && {
          cardNumber: cardNumber.replace(/\s/g, '').slice(-4),
          cardHolder
        }),
        ...(paymentMethod === 'upi' && { upiId }),
        ...(paymentMethod === 'voucher' && { voucherCode })
      };

      // Store payment confirmation
      localStorage.setItem('paymentConfirmation', JSON.stringify({
        ...paymentData,
        timestamp: new Date().toISOString(),
        status: 'success'
      }));

      showToast('Payment successful!', 'success');

      // Redirect to success page
      setTimeout(() => {
        router.push('/nfc/success');
      }, 1000);

    } catch (error) {
      console.error('Payment error:', error);
      showToast('Payment failed. Please try again.', 'error');
      setProcessing(false);
    }
  };

  const getCurrencySymbol = () => {
    if (userCountry === 'India') return '₹';
    if (userCountry === 'UAE') return 'AED ';
    return '$';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <Image
                src="/logo_linkist.png"
                alt="Linkist"
                width={100}
                height={33}
                priority
              />
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Lock className="w-4 h-4 mr-2 text-green-500" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h2>
              <p className="text-gray-600 mb-6">Complete your purchase securely. All transactions are encrypted.</p>

              {/* Express Checkout Options */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Express Checkout</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-black text-white hover:bg-gray-900"
                    onClick={() => showToast('Apple Pay coming soon!', 'info')}
                  >
                    <span className="text-xl mr-2">🍎</span>
                    <span className="font-medium">Pay</span>
                  </button>
                  <button
                    className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => showToast('Google Pay coming soon!', 'info')}
                  >
                    <span className="text-xl mr-2 font-bold">G</span>
                    <span className="font-medium">Google Pay</span>
                  </button>
                </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Pay with Card</h3>
                <div className="flex items-center gap-2 mb-4">
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

                {/* Card Details Form */}
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
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                          className="absolute right-3 top-3.5"
                          onClick={() => showToast('CVV is the 3-4 digit code on the back of your card', 'info')}
                        >
                          <span className="text-gray-400 text-sm">ℹ️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: processing ? '#d1d5db' : '#dc2626',
                  color: '#ffffff'
                }}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ${getCurrencySymbol()}${orderSummary.total.toFixed(2)}`
                )}
              </button>

              {/* Other Payment Methods */}
              {userCountry === 'India' && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Other methods (India)</h3>
                  <button
                    onClick={() => {
                      setPaymentMethod('upi');
                      showToast('UPI payment option selected', 'info');
                    }}
                    className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white font-bold mr-3">
                        UPI
                      </div>
                      <span className="font-medium">Pay with UPI</span>
                    </div>
                    <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
                  </button>
                </div>
              )}

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
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              {/* Order Item */}
              <div className="flex items-start gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                  {orderItem.quantity}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{orderItem.name}</h4>
                  <p className="text-sm text-gray-500">One-time purchase</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{getCurrencySymbol()}{orderItem.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{getCurrencySymbol()}{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                {orderItem.id === 'physical-digital' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping ({userCountry})</span>
                    <span>{orderSummary.shipping === 0 ? 'Free' : `${getCurrencySymbol()}${orderSummary.shipping.toFixed(2)}`}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>VAT ({((orderSummary.vat / (orderSummary.subtotal + orderSummary.shipping)) * 100).toFixed(0)}%)</span>
                  <span>{getCurrencySymbol()}{orderSummary.vat.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">{getCurrencySymbol()}{orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure Payment Badge */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center mb-2">Secure payments powered by</p>
                <div className="flex items-center justify-center gap-4">
                  {userCountry === 'India' ? (
                    <div className="flex items-center">
                      <span className="text-blue-600 font-bold text-lg">Razorpay</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-indigo-600 font-bold text-lg">stripe</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center">
                      <Lock className="w-3 h-3 mr-1 text-green-500" />
                      3D Secure
                    </div>
                    <div className="text-[10px]">Authentication supported</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}