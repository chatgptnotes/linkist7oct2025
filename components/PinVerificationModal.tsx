'use client';

import { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Icon aliases
const Lock = LockIcon;
const X = CloseIcon;
const AlertCircle = ErrorOutlineIcon;

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => Promise<boolean>;
  loading?: boolean;
}

export default function PinVerificationModal({
  isOpen,
  onClose,
  onVerify,
  loading = false
}: PinVerificationModalProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Only take the last digit
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`checkout-pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value && newPin.every(digit => digit !== '')) {
      setTimeout(() => handleVerify(newPin.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && index > 0 && !pin[index]) {
      const prevInput = document.getElementById(`checkout-pin-${index - 1}`);
      prevInput?.focus();
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
    }
  };

  const handleVerify = async (pinValue?: string) => {
    const pinToVerify = pinValue || pin.join('');

    if (pinToVerify.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const success = await onVerify(pinToVerify);

      if (!success) {
        setError('Incorrect PIN. Please try again.');
        setPin(['', '', '', '', '', '']);
        const firstInput = document.getElementById('checkout-pin-0');
        firstInput?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      setPin(['', '', '', '', '', '']);
      const firstInput = document.getElementById('checkout-pin-0');
      firstInput?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    if (!verifying && !loading) {
      setPin(['', '', '', '', '', '']);
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        {!verifying && !loading && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verify Your PIN
          </h2>
          <p className="text-gray-600">
            Enter your 6-digit PIN to authorize this purchase
          </p>
        </div>

        {/* PIN Input */}
        <div className="mb-6">
          <div className="flex justify-center space-x-3 mb-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`checkout-pin-${index}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                autoFocus={index === 0}
                disabled={verifying || loading}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleVerify()}
            disabled={verifying || loading || pin.join('').length !== 6}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {verifying || loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify & Complete Purchase'
            )}
          </button>

          {!verifying && !loading && (
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your PIN is required to authorize this purchase securely
        </p>
      </div>
    </div>
  );
}
