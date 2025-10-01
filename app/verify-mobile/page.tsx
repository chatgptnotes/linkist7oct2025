'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, Check, ArrowLeft, RefreshCw, Mail, X } from 'lucide-react';

function VerifyMobileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Pre-fill phone if provided in URL
    const phoneParam = searchParams.get('phone');
    if (phoneParam) {
      setPhone(phoneParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhone = (phone: string): boolean => {
    // Simple validation - accepts digits, spaces, hyphens, parentheses
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setSendingOtp(true);
    setError('');

    try {
      const response = await fetch('/api/send-mobile-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep('verify');
      setResendTimer(60); // 60 second cooldown

      // In development, show the OTP in console
      if (data.devOtp) {
        console.log('🔑 Development OTP:', data.devOtp);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      setTimeout(() => handleVerifyOtp(newOtp.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp.join('');

    if (otpToVerify.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-mobile-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phone, otp: otpToVerify }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setSuccess(true);

      // Store verified phone in localStorage
      localStorage.setItem('verifiedPhone', phone);
      localStorage.setItem('mobileVerified', 'true');

      // Redirect to PIN setup page
      setTimeout(() => {
        router.push('/account/set-pin');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setLoading(false);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    handleSendOtp();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Number Verified!</h2>
          <p className="text-gray-600 mb-6">
            Your mobile number has been successfully verified. Redirecting to PIN setup...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Back Button */}
          {step === 'verify' && (
            <button
              onClick={() => {
                setStep('phone');
                setOtp(['', '', '', '', '', '']);
                setError('');
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Number
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {step === 'phone' ? 'Verify Your Number' : 'Enter Verification Code'}
            </h1>
            <p className="text-gray-600">
              {step === 'phone'
                ? 'Enter your mobile number to receive a verification code'
                : `We sent a 6-digit code to ${phone}`}
            </p>
          </div>

          {/* Phone Input */}
          {step === 'phone' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOtp()}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Include country code (e.g., +1 for US, +91 for India)
                </p>
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </div>

              <button
                onClick={handleSendOtp}
                disabled={sendingOtp || !phone}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {sendingOtp ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </div>
          )}

          {/* OTP Input */}
          {step === 'verify' && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-center space-x-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                      autoFocus={index === 0}
                      disabled={loading}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}
              </div>

              <button
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Verifying...' : 'Verify Number'}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={sendingOtp}
                    className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 font-medium mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Code</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Email Verification & Skip Options */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <button
              onClick={() => router.push('/verify-email')}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Mail className="w-5 h-5" />
              <span>Verify Email Instead</span>
            </button>

            <button
              onClick={() => {
                // Skip verification and go to next step
                const productSelection = localStorage.getItem('productSelection');
                const pinSet = localStorage.getItem('pinSet');

                if (!pinSet) {
                  router.push('/account/set-pin');
                } else if (productSelection === 'physical-digital') {
                  router.push('/nfc/configure');
                } else if (productSelection === 'digital-only') {
                  router.push('/nfc/digital-profile');
                } else {
                  router.push('/account');
                }
              }}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              <X className="w-5 h-5" />
              <span>Skip Verification</span>
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Standard SMS rates may apply
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyMobilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <VerifyMobileContent />
    </Suspense>
  );
}
