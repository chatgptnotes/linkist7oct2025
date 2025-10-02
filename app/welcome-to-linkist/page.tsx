'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function WelcomeToLinkist() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    country: 'India',
    countryCode: '+91',
    mobileNumber: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated && data.user?.email) {
            setEmail(data.user.email);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

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
          email,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Country Detection */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div className="text-sm text-gray-700">
                    We've auto-detected your country as <strong>India</strong>.
                    <br />
                    You can change it below.
                  </div>
                </div>
              </div>

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
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Alex"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  maxLength={30}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.firstName.length} / 30
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Thomas"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  maxLength={30}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.lastName.length} / 30
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
              className="px-8 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
