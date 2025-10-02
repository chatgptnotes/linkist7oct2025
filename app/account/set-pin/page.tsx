'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { Check, X } from 'lucide-react';

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

    // Auto-submit on last digit for confirm step
    if (isConfirm && index === 5 && value) {
      setTimeout(() => handleSubmit([...confirmPin.slice(0, 5), value]), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    if (e.key === 'Backspace' && index > 0) {
      const pinArray = isConfirm ? [...confirmPin] : [...pin];
      if (!pinArray[index]) {
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

  const handleSubmit = async (confirmPinArray?: string[]) => {
    const pinValue = pin.join('');
    const confirmPinValue = confirmPinArray ? confirmPinArray.join('') : confirmPin.join('');

    if (confirmPinValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (pinValue !== confirmPinValue) {
      setError('PINs do not match');
      setConfirmPin(['', '', '', '', '', '']);
      const firstInput = document.getElementById('confirm-pin-0');
      firstInput?.focus();
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
      localStorage.setItem('pinSet', 'true');

      const productSelection = localStorage.getItem('productSelection');

      setTimeout(() => {
        if (productSelection === 'physical-digital') {
          router.push('/nfc/configure');
        } else if (productSelection === 'digital-only') {
          router.push('/nfc/digital-profile');
        } else {
          router.push('/account');
        }
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set PIN');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">PIN Set Successfully!</h2>
          <p className="text-gray-600 text-lg">
            Your account is secure. Redirecting...
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
              {step === 'create' ? 'Set Your PIN' : 'Confirm PIN'}
            </h1>
            <p className="text-gray-600 text-lg">
              {step === 'create'
                ? 'Create a 6-digit PIN to secure your account'
                : 'Re-enter your PIN to confirm'}
            </p>
          </div>

          {/* PIN Input */}
          <div className="mb-8">
            <div className="flex justify-center gap-3 mb-6">
              {(step === 'create' ? pin : confirmPin).map((digit, index) => (
                <input
                  key={index}
                  id={step === 'create' ? `pin-${index}` : `confirm-pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, step === 'confirm')}
                  onKeyDown={(e) => handleKeyDown(index, e, step === 'confirm')}
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

          {/* Info Message */}
          {step === 'create' && (
            <div className="mb-8 text-center">
              <p className="text-sm text-gray-500">
                Don't forget this PIN - you'll need it to access your account
              </p>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={step === 'create' ? handleContinue : () => handleSubmit()}
            disabled={loading || (step === 'create' ? pin.join('').length !== 6 : confirmPin.join('').length !== 6)}
            className="w-full bg-red-600 text-white text-lg font-semibold px-6 py-4 rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Setting up your account...
              </div>
            ) : (
              step === 'create' ? 'Continue' : 'Create Account'
            )}
          </button>

          {/* Back to Create */}
          {step === 'confirm' && (
            <button
              onClick={() => {
                setStep('create');
                setConfirmPin(['', '', '', '', '', '']);
                setError('');
              }}
              className="w-full mt-4 text-gray-600 hover:text-gray-900 font-medium py-3"
            >
              Back to Create PIN
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Your PIN is encrypted and securely stored
        </p>
      </div>
    </div>
  );
}
