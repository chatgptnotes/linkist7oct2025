'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import Logo from '@/components/Logo';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';

// Icon aliases
const Mail = EmailIcon;
const ArrowLeft = ArrowBackIcon;
const Phone = PhoneIcon;

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    emailOrPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [returnUrl, setReturnUrl] = useState('/account');
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');
  const [countryCode, setCountryCode] = useState('+971'); // Default to UAE
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrlParam = urlParams.get('returnUrl');
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }

    // Detect user's country and set appropriate country code
    detectUserCountry();
  }, []);

  const detectUserCountry = async () => {
    try {
      // Try to get user's location from IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      const countryCodeMap: { [key: string]: string } = {
        'AE': '+971', // UAE
        'IN': '+91',  // India
        'US': '+1',   // USA
        'GB': '+44',  // UK
        'SA': '+966', // Saudi Arabia
        'QA': '+974', // Qatar
        'OM': '+968', // Oman
        'KW': '+965', // Kuwait
        'BH': '+973', // Bahrain
      };

      if (data.country_code && countryCodeMap[data.country_code]) {
        setCountryCode(countryCodeMap[data.country_code]);
      }
    } catch (error) {
      console.log('Could not detect country, using default UAE (+971)');
    }
  };

  const detectInputType = (value: string) => {
    // Check if input contains @ symbol (email) or is numeric (phone)
    if (value.includes('@')) {
      setInputType('email');
    } else if (/^\d/.test(value)) {
      setInputType('phone');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone: formData.emailOrPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Verification code sent to your email!', 'success');
        // Store email/phone and return URL for verification
        localStorage.setItem('loginIdentifier', formData.emailOrPhone);
        localStorage.setItem('returnUrl', returnUrl);
        router.push('/verify-login');
      } else {
        showToast(data.error || 'Failed to send verification code', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo href="/" width={160} height={50} variant="light" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
                Email or Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {inputType === 'email' ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                {inputType === 'phone' ? (
                  <div className="flex">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none pl-10 pr-2 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-50"
                      style={{ width: '100px' }}
                    >
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+968">🇴🇲 +968</option>
                      <option value="+965">🇰🇼 +965</option>
                      <option value="+973">🇧🇭 +973</option>
                    </select>
                    <input
                      id="emailOrPhone"
                      name="emailOrPhone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.emailOrPhone}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, emailOrPhone: value });
                        detectInputType(value);
                      }}
                      className="appearance-none block w-full px-3 py-2 border border-l-0 border-gray-300 rounded-r-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Enter phone number"
                    />
                  </div>
                ) : (
                  <input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    autoComplete="email tel"
                    required
                    value={formData.emailOrPhone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, emailOrPhone: value });
                      detectInputType(value);
                    }}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Enter your email or phone number"
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We'll send a verification code to your registered {inputType === 'email' ? 'email' : 'phone'}
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
                style={{
                  backgroundColor: loading ? '#9CA3AF' : '#DC2626',
                  color: '#FFFFFF'
                }}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending verification code...
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
