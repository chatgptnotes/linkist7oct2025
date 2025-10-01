'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Check, X, ArrowLeft } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function SetPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const pinArray = isConfirm ? [...confirmPin] : [...pin];
    pinArray[index] = value.slice(-1); // Only take the last digit

    if (isConfirm) {
      setConfirmPin(pinArray);
    } else {
      setPin(pinArray);
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        isConfirm ? `confirm-pin-${index + 1}` : `pin-${index + 1}`
      );
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    if (e.key === 'Backspace' && index > 0) {
      const pinArray = isConfirm ? [...confirmPin] : [...pin];
      if (!pinArray[index]) {
        // If current input is empty, go back and clear previous
        const prevInput = document.getElementById(
          isConfirm ? `confirm-pin-${index - 1}` : `pin-${index - 1}`
        );
        prevInput?.focus();
        pinArray[index - 1] = '';
        if (isConfirm) {
          setConfirmPin(pinArray);
        } else {
          setPin(pinArray);
        }
      }
    }
  };

  const handleContinue = () => {
    const pinValue = pin.join('');
    if (pinValue.length !== 6) {
      setError('Please enter a 6-digit PIN');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleSubmit = async () => {
    const pinValue = pin.join('');
    const confirmPinValue = confirmPin.join('');

    if (confirmPinValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (pinValue !== confirmPinValue) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/account/set-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pinValue }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to set PIN');
      }

      setSuccess(true);

      // Redirect to account after 2 seconds
      setTimeout(() => {
        router.push('/account');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set PIN');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPin(['', '', '', '', '', '']);
    setConfirmPin(['', '', '', '', '', '']);
    setStep('create');
    setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">PIN Set Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your checkout PIN has been created. Redirecting to your account...
          </p>
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
            <Link href="/account" className="text-xl font-bold text-gray-900">
              Linkist NFC
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Back Button */}
          <button
            onClick={() => step === 'confirm' ? handleReset() : router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 'confirm' ? 'Start Over' : 'Back'}
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {step === 'create' ? 'Create Your PIN' : 'Confirm Your PIN'}
            </h1>
            <p className="text-gray-600">
              {step === 'create'
                ? 'Enter a 6-digit PIN to secure your checkout'
                : 'Re-enter your PIN to confirm'}
            </p>
          </div>

          {/* PIN Input */}
          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-4">
              {(step === 'create' ? pin : confirmPin).map((digit, index) => (
                <input
                  key={index}
                  id={step === 'create' ? `pin-${index}` : `confirm-pin-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, step === 'confirm')}
                  onKeyDown={(e) => handleKeyDown(index, e, step === 'confirm')}
                  className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center justify-center text-red-600 text-sm">
                <X className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
          </div>

          {/* Requirements */}
          {step === 'create' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">PIN Requirements:</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <Check className={`w-4 h-4 mr-2 ${pin.join('').length === 6 ? 'text-green-600' : 'text-gray-400'}`} />
                  Must be 6 digits
                </li>
                <li className="flex items-center">
                  <Check className={`w-4 h-4 mr-2 ${/^\d+$/.test(pin.join('')) && pin.join('').length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                  Numbers only
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-gray-400" />
                  Easy to remember
                </li>
              </ul>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={step === 'create' ? handleContinue : handleSubmit}
            disabled={loading || (step === 'create' ? pin.join('').length !== 6 : confirmPin.join('').length !== 6)}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Setting PIN...' : step === 'create' ? 'Continue' : 'Set PIN'}
          </button>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Your PIN will be used to authorize purchases during checkout
          </p>
        </div>
      </div>
    </div>
  );
}
