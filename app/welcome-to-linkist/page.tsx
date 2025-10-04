'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LanguageIcon from '@mui/icons-material/Language';

const Globe = LanguageIcon;
import { useToast } from '@/components/ToastProvider';

export default function WelcomeToLinkist() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [detectingCountry, setDetectingCountry] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState<string>('India');
  const [formData, setFormData] = useState({
    email: '',
    country: 'India',
    countryCode: '+91',
    mobileNumber: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    // Auto-detect country based on IP
    const detectCountry = async () => {
      try {
        setDetectingCountry(true);
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country_code;
          let country = 'India';
          let phoneCode = '+91';

          // Map country codes to our supported countries
          if (countryCode === 'AE') {
            country = 'UAE';
            phoneCode = '+971';
          } else if (countryCode === 'US') {
            country = 'USA';
            phoneCode = '+1';
          } else if (countryCode === 'GB') {
            country = 'UK';
            phoneCode = '+44';
          } else if (countryCode === 'IN') {
            country = 'India';
            phoneCode = '+91';
          }

          setDetectedCountry(country);
          setFormData(prev => ({
            ...prev,
            country,
            countryCode: phoneCode
          }));
        }
      } catch (error) {
        console.error('Country detection error:', error);
        // Keep default India
      } finally {
        setDetectingCountry(false);
      }
    };

    // Check if user is authenticated and pre-fill email if available
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated && data.user?.email) {
            setFormData(prev => ({ ...prev, email: data.user.email }));
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Don't redirect - allow non-authenticated users to use this page
      }
    };

    detectCountry();
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save user profile data
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          mobile: `${formData.countryCode}${formData.mobileNumber}`,
          onboarded: true
        }),
      });

      if (response.ok) {
        showToast('Profile saved successfully!', 'success');

        // Mark as onboarded
        localStorage.setItem('userOnboarded', 'true');

        // Store user profile data
        localStorage.setItem('userProfile', JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          mobile: `${formData.countryCode}${formData.mobileNumber}`
        }));

        // Redirect to mobile verification with phone number
        const fullPhone = `${formData.countryCode}${formData.mobileNumber}`;
        router.push(`/verify-mobile?phone=${encodeURIComponent(fullPhone)}`);
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to save profile', 'error');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    // Log out and redirect
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo_linkist.png"
            alt="Linkist"
            width={140}
            height={46}
            priority
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Linkist</h1>
          <p className="text-gray-600">Please confirm your country to begin.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Country Detection - Full Width */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
            <div className="flex items-start justify-center">
              <Globe className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
              <div className="text-sm text-gray-700">
                {detectingCountry ? (
                  <>Detecting your country...</>
                ) : (
                  <>
                    We've auto-detected your country as <strong>{detectedCountry}</strong>.
                    You can change it below.
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Country Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country / Region
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => {
                    const country = e.target.value;
                    let code = '+91';
                    if (country === 'UAE') code = '+971';
                    else if (country === 'USA') code = '+1';
                    else if (country === 'UK') code = '+44';
                    setFormData({ ...formData, country, countryCode: code });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="India">🇮🇳 India (INR)</option>
                  <option value="UAE">🇦🇪 UAE (AED)</option>
                  <option value="USA">🇺🇸 USA (USD)</option>
                  <option value="UK">🇬🇧 UK (GBP)</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="w-24">
                    <input
                      type="text"
                      value={formData.countryCode}
                      readOnly
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="50 123 4567"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 leading-relaxed">
                By continuing, you agree to Linkist's{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                , and to receive OTP messages via SMS and WhatsApp. All transactions are subject to Indian tax laws.
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g., alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Alex"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    maxLength={30}
                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {formData.firstName.length} / 30
                  </span>
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Thomas"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    maxLength={30}
                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {formData.lastName.length} / 30
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 justify-center">
            <button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6B7280', color: '#FFFFFF' }}
            >
              Reject
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Agree & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
