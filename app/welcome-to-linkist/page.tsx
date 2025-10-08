'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LanguageIcon from '@mui/icons-material/Language';

const Globe = LanguageIcon;
import { useToast } from '@/components/ToastProvider';
import Footer from '@/components/Footer';

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mobileError, setMobileError] = useState<string>('');

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

    // Validate mobile number
    const validationError = validateMobileNumber(formData.mobileNumber, formData.country);
    if (validationError) {
      setMobileError(validationError);
      showToast(validationError, 'error');
      return;
    }

    setMobileError('');
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

  // Get placeholder based on country
  const getMobilePlaceholder = () => {
    switch (formData.country) {
      case 'India':
        return '98765 43210';
      case 'UAE':
        return '50 123 4567';
      case 'USA':
        return '555 123 4567';
      case 'UK':
        return '7700 900123';
      default:
        return '123456789';
    }
  };

  // Validate mobile number based on country
  const validateMobileNumber = (number: string, country: string): string | null => {
    // Remove spaces and non-digits for validation
    const cleanNumber = number.replace(/\s/g, '');

    switch (country) {
      case 'India':
        // India: 10 digits, should start with 6-9
        if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
          return 'Indian mobile numbers must be 10 digits starting with 6-9';
        }
        break;
      case 'UAE':
        // UAE: 9 digits, typically starts with 5
        if (!/^[5]\d{8}$/.test(cleanNumber)) {
          return 'UAE mobile numbers must be 9 digits starting with 5';
        }
        break;
      case 'USA':
        // USA: 10 digits
        if (!/^\d{10}$/.test(cleanNumber)) {
          return 'USA mobile numbers must be 10 digits';
        }
        break;
      case 'UK':
        // UK: 10 digits, typically starts with 7
        if (!/^[7]\d{9}$/.test(cleanNumber)) {
          return 'UK mobile numbers must be 10 digits starting with 7';
        }
        break;
    }
    return null;
  };

  // Get terms text based on country
  const getTermsText = () => {
    switch (formData.country) {
      case 'India':
        return 'All transactions are subject to Indian tax laws.';
      case 'UAE':
        return 'All transactions are subject to UAE tax laws and regulations.';
      case 'USA':
        return 'All transactions are subject to US federal and state tax laws.';
      case 'UK':
        return 'All transactions are subject to UK tax laws and HMRC regulations.';
      default:
        return 'All transactions are subject to local tax laws.';
    }
  };

  return (
    <>
      <div className="bg-gray-50 flex items-start justify-center pt-4 md:pt-20 pb-4 px-4">
        <div className="bg-white rounded-none sm:rounded-2xl shadow-xl max-w-3xl w-full p-4 sm:p-6 mb-8">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Welcome to Linkist</h1>
          <p className="text-xs sm:text-sm text-gray-600">Please confirm your country to begin.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Country Detection - Full Width */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
            <div className="flex items-start justify-center">
              <Globe className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
              <div className="text-xs text-gray-700">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Country Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    setMobileError(''); // Clear error when country changes
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="India">🇮🇳 India (INR)</option>
                  <option value="UAE">🇦🇪 UAE (AED)</option>
                  <option value="USA">🇺🇸 USA (USD)</option>
                  <option value="UK">🇬🇧 UK (GBP)</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="w-20">
                    <input
                      type="text"
                      value={formData.countryCode}
                      readOnly
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-center"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder={getMobilePlaceholder()}
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9\s]/g, '');
                      setFormData({ ...formData, mobileNumber: value });
                      setMobileError(''); // Clear error on input
                    }}
                    pattern="[0-9\s]+"
                    title="Mobile number should only contain numbers"
                    className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      mobileError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                {mobileError && (
                  <p className="mt-1 text-xs text-red-600">{mobileError}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g., alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Alex"
                    value={formData.firstName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[0-9]/g, '');
                      setFormData({ ...formData, firstName: value });
                    }}
                    minLength={2}
                    maxLength={30}
                    pattern="[A-Za-z\s]+"
                    title="Name should only contain letters"
                    className="w-full px-3 py-2 pr-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                    {formData.firstName.length} / 30
                  </span>
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Thomas"
                    value={formData.lastName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[0-9]/g, '');
                      setFormData({ ...formData, lastName: value });
                    }}
                    minLength={2}
                    maxLength={30}
                    pattern="[A-Za-z\s]+"
                    title="Name should only contain letters"
                    className="w-full px-3 py-2 pr-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                    {formData.lastName.length} / 30
                  </span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="termsCheckbox" className="text-[10px] text-gray-600 cursor-pointer leading-relaxed">
                  I agree to Linkist's{' '}
                  <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                  , and to receive OTP messages via SMS and WhatsApp. {getTermsText()}
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 justify-center">
            <button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: '#6B7280', color: '#FFFFFF' }}
            >
              Reject
            </button>
            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full sm:w-auto px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer"
              style={{ backgroundColor: (loading || !termsAccepted) ? '#9CA3AF' : '#DC2626', color: '#FFFFFF' }}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
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

      <div className="hidden md:block">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>

      <Footer />
    </>
  );
}
