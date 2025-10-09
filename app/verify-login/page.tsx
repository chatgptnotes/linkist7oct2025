'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import Footer from '@/components/Footer';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// Icon aliases
const Mail = EmailIcon;
const ArrowLeft = ArrowBackIcon;
const CheckCircle = CheckCircleIcon;
const Key = VpnKeyIcon;

export default function VerifyLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (emailOrPhone: string) => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Verification code sent to your email!', 'success');
        setResendTimer(60); // Start 60 second timer
        if (data.devOtp && process.env.NODE_ENV === 'development') {
          setDevOtp(data.devOtp);
        }
      } else {
        showToast(data.error || 'Failed to send verification code', 'error');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      showToast('Failed to send verification code', 'error');
    }
  };

  useEffect(() => {
    // Check URL parameters first (coming from verify-mobile redirect)
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email');

    if (emailParam) {
      setEmail(emailParam);
      // Store it for the verification process
      localStorage.setItem('loginEmail', emailParam);

      // Check if OTP was already sent for this email (prevent resend on refresh)
      const otpSentKey = `email_otp_sent_${emailParam}`;
      const alreadySent = sessionStorage.getItem(otpSentKey);

      if (!alreadySent) {
        // Mark as sent in sessionStorage
        sessionStorage.setItem(otpSentKey, Date.now().toString());
        // Send OTP automatically
        handleSendOtp(emailParam);
      }
    } else {
      // Try to get email from user profile (from onboarding)
      const userProfile = localStorage.getItem('userProfile');
      let emailToUse = '';

      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          if (profile.email) {
            emailToUse = profile.email;
          }
        } catch (error) {
          console.error('Error parsing user profile:', error);
        }
      }

      // Fallback to loginIdentifier if no profile email
      if (!emailToUse) {
        const loginIdentifier = localStorage.getItem('loginIdentifier');
        if (loginIdentifier) {
          emailToUse = loginIdentifier;
        }
      }

      if (emailToUse) {
        setEmail(emailToUse);
        // Send OTP automatically for prefilled email/phone
        handleSendOtp(emailToUse);
      } else {
        // No identifier found, redirect to login
        router.push('/login');
        return;
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine if email is actually a phone number
      const isPhone = email && !email.includes('@');

      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isPhone ? { mobile: email, otp } : { email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Email verified successfully!', 'success');

        // Clear login email from localStorage
        localStorage.removeItem('loginEmail');

        // Clear sessionStorage after successful verification
        const otpSentKey = `email_otp_sent_${email}`;
        sessionStorage.removeItem(otpSentKey);

        // Store email as verified
        localStorage.setItem('verifiedEmail', email);
        localStorage.setItem('emailVerified', 'true');

        // Show success state
        setSuccess(true);

        // Redirect to profile dashboard to show user's orders
        setTimeout(() => {
          window.location.href = '/profile-dashboard';
        }, 2000);
      } else {
        showToast(data.error || 'Invalid verification code', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Clear sessionStorage for this email to allow resend
    const otpSentKey = `email_otp_sent_${email}`;
    sessionStorage.removeItem(otpSentKey);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone: email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Verification code resent!', 'success');
        setResendTimer(60); // Start 60 second timer
        if (data.devOtp && process.env.NODE_ENV === 'development') {
          setDevOtp(data.devOtp);
        }
      } else {
        showToast(data.error || 'Failed to resend code', 'error');
      }
    } catch (error) {
      console.error('Resend error:', error);
      showToast('Failed to resend code', 'error');
    }
  };

  // Success screen (same as mobile verification)
  if (success) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 pb-0 px-4">
          <div className="bg-white rounded-none sm:rounded-2xl shadow-xl max-w-md w-full p-8 sm:p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Email Verified!</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Your email has been successfully verified.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
              <span>Redirecting to your dashboard...</span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 pb-0 px-4">
        <div className="bg-white rounded-none sm:rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Verify your email
          </h2>
          <p className="text-center text-xs sm:text-sm text-gray-600 mb-6">
            We sent a verification code to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email field - shown but read-only */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  readOnly
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification code
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  autoFocus
                />
              </div>
            </div>

            {/* Development OTP Display */}
            {devOtp && process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  <strong>Development Mode:</strong> Your verification code is{' '}
                  <span className="font-mono text-lg font-bold">{devOtp}</span>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white cursor-pointer ${
                  loading || otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
                style={{
                  backgroundColor: (loading || otp.length !== 6) ? '#9CA3AF' : '#DC2626',
                  color: '#FFFFFF'
                }}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify & Sign In
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              {resendTimer > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Didn't receive the code?
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    Resend code in {resendTimer}s
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    onClick={handleResendCode}
                    className="font-medium text-red-600 hover:text-red-500 cursor-pointer"
                  >
                    Resend code
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
