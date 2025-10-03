'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, CreditCard, Smartphone, User, Globe } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

interface ProductOption {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  priceLabel: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

// List of countries that allow physical cards (can be fetched from admin panel)
const ALLOWED_PHYSICAL_CARD_COUNTRIES = ['India', 'UAE', 'USA', 'UK'];

export default function ProductSelectionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [userCountry, setUserCountry] = useState<string>('India');
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({
    physical: '$29',
    digitalWithApp: '$19',
    digitalOnly: '$9'
  });

  useEffect(() => {
    // Get user's country from localStorage (set during onboarding)
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        setUserCountry(profile.country || 'India');
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }

    // In production, fetch prices from admin panel
    // For now, using default prices
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    // TODO: Fetch actual prices from admin panel API
    // const response = await fetch('/api/admin/product-prices');
    // const data = await response.json();
    // setPrices(data);
  };

  const isPhysicalCardAllowed = ALLOWED_PHYSICAL_CARD_COUNTRIES.includes(userCountry);

  const productOptions: ProductOption[] = [
    {
      id: 'physical-digital',
      title: 'Physical NFC Card + Linkist App',
      subtitle: '1 year subscription & AI Credits',
      price: `Starting from ${prices.physical}`,
      priceLabel: 'Most Popular',
      icon: <CreditCard className="w-8 h-8" />,
      features: [
        'Premium NFC Card',
        'Linkist App Access (1 Year)',
        'AI Credits worth $50',
        'Unlimited Profile Updates',
        'Analytics Dashboard',
        'Priority Support'
      ],
      popular: true,
      disabled: !isPhysicalCardAllowed,
      disabledMessage: `Physical cards are not available in ${userCountry}. Please choose a digital option.`
    },
    {
      id: 'digital-with-app',
      title: 'Digital Profile + Linkist App',
      subtitle: '1 year subscription & AI Credits',
      price: `Starting from ${prices.digitalWithApp}`,
      priceLabel: 'Best Value',
      icon: <Smartphone className="w-8 h-8" />,
      features: [
        'Digital Business Card',
        'Linkist App Access (1 Year)',
        'AI Credits worth $30',
        'Unlimited Profile Updates',
        'Analytics Dashboard',
        'Email Support'
      ]
    },
    {
      id: 'digital-only',
      title: 'Digital Profile Only',
      subtitle: 'Without Linkist App & AI credits',
      price: `Starting from ${prices.digitalOnly}`,
      priceLabel: 'Basic',
      icon: <User className="w-8 h-8" />,
      features: [
        'Digital Business Card',
        'Basic Profile',
        'Limited Updates (5/month)',
        'QR Code Generation',
        'Basic Analytics',
        'Community Support'
      ]
    }
  ];

  const handleCardClick = (productId: string) => {
    const product = productOptions.find(p => p.id === productId);

    if (product?.disabled) {
      showToast(product.disabledMessage || 'This option is not available', 'error');
      return;
    }

    // Just select the card, don't navigate
    setSelectedProduct(productId);
  };

  const handleConfirmSelection = async () => {
    if (!selectedProduct) {
      showToast('Please select a plan first', 'error');
      return;
    }

    setLoading(true);

    // Store the selection
    localStorage.setItem('productSelection', selectedProduct);

    // Navigate based on selection
    setTimeout(() => {
      switch (selectedProduct) {
        case 'physical-digital':
          // Physical card + app goes to NFC configuration
          router.push('/nfc/configure');
          break;
        case 'digital-with-app':
        case 'digital-only':
          // Both digital options go to payment page
          router.push('/payment');
          break;
        default:
          router.push('/nfc/checkout');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <Image
            src="/logo_linkist.png"
            alt="Linkist"
            width={120}
            height={40}
            priority
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Title Section */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Linkist Experience
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your professional networking needs
          </p>

          {!isPhysicalCardAllowed && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-lg">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                Physical cards are currently not available in {userCountry}
              </span>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {productOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => !option.disabled && handleCardClick(option.id)}
              className={`relative rounded-2xl border-2 transition-all ${
                selectedProduct === option.id
                  ? 'border-red-600 shadow-2xl scale-105 ring-2 ring-red-600 ring-offset-4 cursor-pointer'
                  : option.disabled
                  ? 'border-gray-200 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg cursor-pointer'
              }`}
            >
              {/* Popular Badge */}
              {option.popular && !option.disabled && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Disabled Overlay */}
              {option.disabled && (
                <div className="absolute inset-0 bg-white/80 rounded-2xl z-10 flex items-center justify-center p-6 pointer-events-none">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Not available in your region</p>
                    <p className="text-sm text-gray-500 mt-2">{option.disabledMessage}</p>
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  option.popular && !option.disabled ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {option.icon}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {option.subtitle}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {option.price.split(' ')[2]}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {option.priceLabel}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when button is clicked
                    if (selectedProduct === option.id) {
                      handleConfirmSelection(); // If already selected, confirm
                    } else {
                      handleCardClick(option.id); // Otherwise, select this card
                    }
                  }}
                  disabled={loading || option.disabled}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    selectedProduct === option.id
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : option.disabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } ${loading && selectedProduct === option.id ? 'opacity-75' : ''}`}
                >
                  {loading && selectedProduct === option.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : selectedProduct === option.id ? (
                    'Select This Plan ✓'
                  ) : (
                    'Select This Plan'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-gray-600">
            Need help choosing? All plans include a 30-day money-back guarantee.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Prices may vary based on your location and selected features.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Go Back
          </button>

          {selectedProduct && (
            <button
              onClick={handleConfirmSelection}
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Continue →'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}