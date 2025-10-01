'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, CreditCard, Smartphone, Package, Zap } from 'lucide-react';

export default function ProductSelectionPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<'physical-digital' | 'digital-only' | null>(null);

  const handleContinue = () => {
    if (!selectedProduct) {
      alert('Please select a product option');
      return;
    }

    // Store selection
    localStorage.setItem('productSelection', selectedProduct);

    // Route to appropriate flow based on verification status
    const mobileVerified = localStorage.getItem('mobileVerified') === 'true';
    const pinSet = localStorage.getItem('pinSet') === 'true';

    if (!mobileVerified) {
      // First step: verify mobile number
      router.push('/verify-mobile');
    } else if (!pinSet) {
      // Second step: set PIN
      router.push('/account/set-pin');
    } else {
      // All verification complete, go to product flow
      if (selectedProduct === 'physical-digital') {
        // Go to NFC card configurator
        router.push('/nfc/configure');
      } else {
        // Go to digital profile setup
        router.push('/nfc/digital-profile');
      }
    }
  };

  const ProductCard = ({
    id,
    title,
    subtitle,
    price,
    features,
    icon: Icon,
    popular = false
  }: {
    id: 'physical-digital' | 'digital-only';
    title: string;
    subtitle: string;
    price: string;
    features: string[];
    icon: any;
    popular?: boolean;
  }) => {
    const isSelected = selectedProduct === id;

    return (
      <div
        onClick={() => setSelectedProduct(id)}
        className={`relative bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
          isSelected
            ? 'border-red-500 shadow-lg'
            : 'border-gray-200 hover:border-red-300'
        }`}
      >
        {popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
        )}

        {/* Selection Indicator */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-red-600 border-red-600'
                : 'bg-white border-gray-300'
            }`}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 text-center mb-4">
          {subtitle}
        </p>

        {/* Price */}
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-600"> one-time</span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Button */}
        <button
          onClick={() => setSelectedProduct(id)}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isSelected
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Linkist NFC</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Make Your First Impression Count
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect solution to share your contact information instantly
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <ProductCard
            id="physical-digital"
            title="Physical + Digital Card"
            subtitle="NFC-enabled smart business card"
            price="29.99"
            popular={true}
            icon={CreditCard}
            features={[
              'Premium NFC-enabled physical card',
              'Instant contact sharing with a tap',
              'Customizable digital profile',
              'QR code backup option',
              '1-year free app access included',
              'Unlimited profile updates',
              'Analytics and insights',
              'Professional card design'
            ]}
          />

          <ProductCard
            id="digital-only"
            title="Digital Profile Only"
            subtitle="Virtual contact sharing solution"
            price="9.99"
            icon={Smartphone}
            features={[
              'Digital profile page',
              'QR code for contact sharing',
              'Social media integration',
              'Email signature integration',
              'Customizable profile design',
              'Analytics and insights',
              'Unlimited profile updates',
              'No physical card needed'
            ]}
          />
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What's Included
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Physical + Digital</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Digital Only</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-700">NFC Physical Card</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4 text-gray-400">—</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-700">Digital Profile</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-700">QR Code</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-700">Contact Sharing</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-700">Analytics</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-700">1-Year App Access</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4 text-gray-400">Add-on</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Premium Support</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4 text-gray-400">Basic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedProduct}
            className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center space-x-2"
          >
            <span>Continue with Selected Plan</span>
            <Package className="w-5 h-5" />
          </button>

          {!selectedProduct && (
            <p className="text-sm text-gray-500 mt-3">
              Please select a product option above
            </p>
          )}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Sharing</h3>
            <p className="text-sm text-gray-600">
              Share your contact info in seconds with NFC tap or QR scan
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Always Updated</h3>
            <p className="text-sm text-gray-600">
              Update your info anytime and everyone has the latest version
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Physical cards ship within 3-5 business days, digital profiles activate instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
