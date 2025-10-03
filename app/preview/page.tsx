'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CheckIcon from '@mui/icons-material/Check';

// Icon aliases
const Check = CheckIcon;

export default function PreviewPage() {
  const router = useRouter();
  const [cardConfig, setCardConfig] = useState<{
    firstName: string;
    lastName: string;
    title?: string;
    mobile?: string;
    whatsapp?: boolean;
    logo?: string;
    quantity?: number;
  } | null>(null);
  const [, setCheckoutData] = useState<{
    email: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');

  useEffect(() => {
    // Load data from localStorage
    const savedConfig = localStorage.getItem('cardConfig');
    const savedCheckout = localStorage.getItem('checkoutData');
    
    if (savedConfig) {
      setCardConfig(JSON.parse(savedConfig));
    }
    if (savedCheckout) {
      setCheckoutData(JSON.parse(savedCheckout));
    }
    
    setLoading(false);
  }, []);

  const handleApprove = () => {
    router.push('/confirm-payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!cardConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No card configuration found</p>
          <Link href="/nfc/configure" className="btn-primary inline-block px-6 py-3">
            Configure Your Card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Preview & Approve</h1>
            <p className="text-gray-600 mb-8">Review your card design. If it looks perfect, approve the order and proceed to payment.</p>
            
            <div className="bg-white rounded-lg p-8">
              {/* Card Preview */}
              <div className="max-w-md mx-auto">
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setActiveTab('front')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'front'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setActiveTab('back')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'back'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Back
                  </button>
                </div>

                {/* Card Display */}
                <div className="relative">
                  {activeTab === 'front' ? (
                    // Front of card
                    <div className="w-full h-64 bg-gray-900 rounded-xl flex flex-col justify-between p-6 text-white shadow-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{cardConfig?.firstName} {cardConfig?.lastName}</h3>
                          <p className="text-gray-300 text-sm">{cardConfig?.title || 'Senior Designer'}</p>
                        </div>
                        {cardConfig?.logo && (
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-gray-900 text-xs font-bold">LOGO</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-red-500 font-bold text-xl">LINKIST</div>
                        <div className="text-xs text-gray-400">NFC ENABLED</div>
                      </div>
                    </div>
                  ) : (
                    // Back of card
                    <div className="w-full h-64 bg-gray-900 rounded-xl flex flex-col justify-center items-center p-6 text-white shadow-xl">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                      </div>
                      <p className="text-gray-300 text-sm text-center">
                        Tap to share your<br />
                        professional profile
                      </p>
                      <div className="mt-6 text-xs text-gray-400">
                        linkist.com/{cardConfig?.firstName?.toLowerCase()}{cardConfig?.lastName?.toLowerCase()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Final Check Section */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Final Check</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Card personalization</div>
                  <div className="text-sm text-gray-600">Name, title, and logo configured</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">NFC functionality</div>
                  <div className="text-sm text-gray-600">Digital profile link active</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Shipping details</div>
                  <div className="text-sm text-gray-600">Delivery address confirmed</div>
                </div>
              </div>
            </div>

            {/* Card Details Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Card Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{cardConfig?.firstName} {cardConfig?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{cardConfig?.title || 'Senior Designer'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium">{cardConfig?.mobile || 'Not provided'}</span>
                </div>
                {cardConfig?.whatsapp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleApprove}
              className="w-full bg-red-500 text-white py-4 rounded-lg font-medium hover:bg-red-600 transition-colors mb-4"
            >
              I&apos;m Satisfied
            </button>

            <div className="text-center">
              <button 
                onClick={() => router.push('/nfc/configure')}
                className="text-red-500 hover:text-red-600 font-medium text-sm"
              >
                Make Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-semibold">Linkist</span>
              </div>
              <p className="text-gray-300 text-sm">
                Network<br />
                Differently.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">For Teams</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}