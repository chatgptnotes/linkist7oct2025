'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { Check, X, RefreshCw } from 'lucide-react';

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
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const phoneParam = searchParams.get('phone');
    if (phoneParam && !otpSent) {
      setPhone(phoneParam);
      setOtpSent(true);
      // Automatically trigger OTP sending when phone is provided
      setTimeout(() => {
        handleSendOtpWithPhone(phoneParam);
      }, 500);
    }
  }, [searchParams, otpSent]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtpWithPhone = async (phoneNumber: string) => {
    if (!validatePhone(phoneNumber)) {
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
        body: JSON.stringify({ mobile: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep('verify');
      setResendTimer(60);

      if (data.devOtp) {
        console.log('🔑 Development OTP:', data.devOtp);
        alert(`⚠️ SMS delivery issue!\n\nYour OTP: ${data.devOtp}\n\nCopy this code for verification.`);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSendOtp = async () => {
    await handleSendOtpWithPhone(phone);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

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
      localStorage.setItem('verifiedPhone', phone);
      localStorage.setItem('mobileVerified', 'true');

      setTimeout(() => {
        router.push('/product-selection');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setLoading(false);
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
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Number Verified!</h2>
          <p className="text-gray-600 text-lg">
            Your mobile number has been successfully verified.
          </p>
          <div className="mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <Logo width={120} height={40} />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {step === 'phone' ? 'Verify Your Number' : 'Enter Verification Code'}
            </h1>
            <p className="text-gray-600 text-lg">
              {step === 'phone'
                ? 'Enter your mobile number to receive a verification code'
                : `We sent a 6-digit code to ${phone}`}
            </p>
          </div>

          {/* Phone Input Step */}
          {step === 'phone' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition-all bg-gray-50"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOtp()}
                />
                <p className="text-sm text-gray-500 mt-3">
                  Include country code (e.g., +1 for US, +91 for India)
                </p>
              </div>

              {error && (
                <div className="flex items-center text-red-600 text-sm bg-red-50 py-3 px-4 rounded-lg">
                  <X className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={sendingOtp || !phone}
                className="w-full text-lg font-semibold px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: sendingOtp || !phone ? '#D1D5DB' : '#DC2626',
                  color: '#FFFFFF'
                }}
              >
                {sendingOtp ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending Code...
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>
          )}

          {/* OTP Verification Step */}
          {step === 'verify' && (
            <div className="space-y-8">
              <div>
                <div className="flex justify-center gap-3 mb-6">
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
                      className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition-all bg-gray-50"
                      autoFocus={index === 0}
                      disabled={loading}
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-center justify-center text-red-600 text-sm bg-red-50 py-3 px-4 rounded-lg">
                    <X className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.join('').length !== 6}
                className="w-full text-lg font-semibold px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: loading || otp.join('').length !== 6 ? '#D1D5DB' : '#DC2626',
                  color: '#FFFFFF'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Number'
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Didn't receive the code?
                </p>
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500 font-medium">
                    Resend code in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={sendingOtp}
                    className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Code</span>
                  </button>
                )}
              </div>

              {/* Change Number */}
              <button
                onClick={() => {
                  setStep('phone');
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
                className="w-full text-gray-600 hover:text-gray-900 font-medium py-3 transition-colors"
              >
                Change Phone Number
              </button>
            </div>
          )}

          {/* Verify Email Instead */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => {
                // Get user email from profile
                const userProfile = localStorage.getItem('userProfile');
                if (userProfile) {
                  try {
                    const profile = JSON.parse(userProfile);
                    if (profile.email) {
                      // Redirect to email verification with email as parameter
                      router.push(`/verify-login?email=${encodeURIComponent(profile.email)}`);
                    } else {
                      router.push('/verify-login');
                    }
                  } catch (error) {
                    router.push('/verify-login');
                  }
                } else {
                  router.push('/verify-login');
                }
              }}
              className="w-full text-lg font-semibold px-6 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              Verify Email Instead
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Standard SMS rates may apply
        </p>
      </div>
    </div>
  );
}

export default function VerifyMobilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyMobileContent />
    </Suspense>
  );
}
