'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ToastProvider';
import FlashOnIcon from '@mui/icons-material/FlashOn';

// Icon aliases
const Zap = FlashOnIcon;

interface ExpressCheckoutProps {
  amount: number;
  onSuccess?: () => void;
  className?: string;
}

export default function ExpressCheckout({ amount, onSuccess, className = '' }: ExpressCheckoutProps) {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplePay = async () => {
    setIsProcessing(true);

    // Check if Apple Pay is available
    if ((window as any).ApplePaySession && (window as any).ApplePaySession.canMakePayments()) {
      showToast('Initiating Apple Pay...', 'info');
      // Implement actual Apple Pay logic here
      setTimeout(() => {
        showToast('Apple Pay initiated successfully', 'success');
        setIsProcessing(false);
        onSuccess?.();
      }, 2000);
    } else {
      showToast('Apple Pay is not available on this device', 'error');
      setIsProcessing(false);
    }
  };

  const handleGooglePay = async () => {
    setIsProcessing(true);
    showToast('Initiating Google Pay...', 'info');

    // Implement actual Google Pay logic here
    setTimeout(() => {
      showToast('Google Pay initiated successfully', 'success');
      setIsProcessing(false);
      onSuccess?.();
    }, 2000);
  };

  const handlePayPal = async () => {
    setIsProcessing(true);
    showToast('Redirecting to PayPal...', 'info');

    // Implement actual PayPal logic here
    setTimeout(() => {
      showToast('PayPal checkout initiated', 'success');
      setIsProcessing(false);
      onSuccess?.();
    }, 2000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Express Checkout Header */}
      <div className="flex items-center justify-center space-x-2 text-gray-600">
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="flex items-center space-x-2 px-4">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">Express Checkout</span>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Express Checkout Buttons */}
      <div className="space-y-3">
        {/* Apple Pay */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplePay}
          disabled={isProcessing}
          className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-3 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-12 h-6" viewBox="0 0 50 20" fill="currentColor">
            <path d="M9.53 3.71c.52-.63.87-1.5.77-2.38-.75.03-1.65.5-2.18 1.12-.48.56-.9 1.44-.78 2.29.82.06 1.67-.42 2.19-1.03zM10.3 5.04c-.69-.04-1.28.2-1.74.37-.3.11-.56.21-.78.21-.24 0-.52-.1-.82-.21-.41-.15-.86-.31-1.36-.3-.9.02-1.74.52-2.2 1.33-.94 1.63-.25 4.05 1.02 5.38.41.42.89.9 1.53.88.38-.01.64-.12.92-.24.31-.13.64-.27 1.13-.27.47 0 .78.13 1.08.26.29.12.57.24.98.23.66-.02 1.08-.43 1.48-.85a5.9 5.9 0 00.67-.96l.01-.02c-.08-.03-.71-.3-1.14-.93a2.24 2.24 0 01-.3-1.52c.09-.61.44-1.13.88-1.43.14-.1.29-.17.43-.22a2.29 2.29 0 00-.92-.91c-.27-.14-.57-.24-.87-.24z"/>
            <path d="M17.3 13.24h-.95V6.65h2.63c1.4 0 2.37.96 2.37 2.35 0 1.39-.97 2.36-2.37 2.36h-1.68v1.88zm0-5.75v2.03h1.54c.94 0 1.48-.5 1.48-1.01 0-.52-.54-1.02-1.48-1.02H17.3zm7.34 5.82c-.6 0-1.1-.27-1.3-.71h-.02v.64h-.85V9.62h.88v1.35h.01c.19-.42.68-.71 1.28-.71 1.03 0 1.71.8 1.71 2.01 0 1.2-.68 2.04-1.71 2.04zm-.23-3.28c-.65 0-1.08.54-1.08 1.26 0 .73.43 1.27 1.08 1.27.64 0 1.06-.53 1.06-1.27s-.42-1.26-1.06-1.26zm3.69 4.5c-.47 0-.81-.1-1.08-.2v-.74c.27.11.59.2.96.2.48 0 .77-.2.92-.63l.08-.21-1.54-4.03h.94l1.02 3.04h.02l1.02-3.04h.91l-1.68 4.38c-.34.91-.78 1.23-1.57 1.23z"/>
          </svg>
          <span>Pay</span>
        </motion.button>

        {/* Google Pay */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGooglePay}
          disabled={isProcessing}
          className="w-full bg-white text-gray-700 py-4 rounded-xl font-medium flex items-center justify-center space-x-3 border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-12 h-6" viewBox="0 0 50 20" fill="none">
            <path d="M22.54 10.37c0-.37-.03-.73-.1-1.07h-5.16v2.03h2.95a2.52 2.52 0 01-1.09 1.65v1.37h1.77c1.03-.95 1.63-2.35 1.63-3.98z" fill="#4285F4"/>
            <path d="M17.28 15.59c1.48 0 2.72-.49 3.63-1.33l-1.77-1.37c-.49.33-1.12.52-1.86.52-1.43 0-2.64-.96-3.07-2.26H12.4v1.42a5.5 5.5 0 004.88 3.02z" fill="#34A853"/>
            <path d="M14.21 11.15a3.31 3.31 0 010-2.13V7.6H12.4a5.5 5.5 0 000 4.96l1.81-1.41z" fill="#FBBC04"/>
            <path d="M17.28 6.68c.8 0 1.53.28 2.1.82l1.57-1.57A5.47 5.47 0 0017.28 4.5 5.5 5.5 0 0012.4 7.6l1.81 1.41c.43-1.3 1.64-2.33 3.07-2.33z" fill="#EA4335"/>
            <path d="M29.25 7.73c1.13 0 2.03.38 2.62 1.1l.75-.75c-.82-.77-1.9-1.24-3.37-1.24-2.09 0-3.79 1.36-3.79 3.52 0 2.13 1.7 3.52 3.87 3.52 1.13 0 2.24-.37 2.98-1.14.77-.77 1.01-1.86 1.01-2.74 0-.22-.02-.44-.05-.63h-4.02v.9h3.06c-.03.52-.23.91-.5 1.17-.42.41-1.08.68-1.94.68-1.49 0-2.67-1.2-2.67-2.62 0-1.43 1.18-2.63 2.67-2.63.9 0 1.54.36 1.94.76l.66-.66c-.52-.49-1.33-1.1-2.6-1.1-2.16 0-3.86 1.57-3.86 3.52 0 1.94 1.7 3.52 3.86 3.52 2.25 0 3.74-1.58 3.74-3.8 0-.25-.02-.45-.06-.58h.02zM40.86 9.27c-1.38 0-2.51 1.05-2.51 2.52s1.13 2.55 2.51 2.55c1.39 0 2.51-1.08 2.51-2.55 0-1.47-1.12-2.52-2.51-2.52zm0 4.09c-.76 0-1.41-.62-1.41-1.57 0-.93.65-1.55 1.41-1.55s1.42.62 1.42 1.55c0 .95-.66 1.57-1.42 1.57zM37.32 9.4h-1.54v-.97h-1.04v.97h-.9v.89h.9v2.41c0 1.04.41 1.66 1.58 1.66.43 0 .74-.1.93-.18l-.27-.91c-.13.05-.3.1-.54.1-.48 0-.68-.31-.68-.78v-2.3h1.56v-.89z" fill="#5F6368"/>
          </svg>
          <span>Pay</span>
        </motion.button>

        {/* PayPal */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayPal}
          disabled={isProcessing}
          className="w-full bg-[#FFC439] text-[#003087] py-4 rounded-xl font-medium flex items-center justify-center space-x-3 hover:bg-[#FFB51F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-20 h-6" viewBox="0 0 100 24" fill="currentColor">
            <path d="M12.43 7.1H7.57c-.33 0-.61.25-.66.58L5.04 19.03c-.04.24.15.45.39.45h2.32c.33 0 .61-.25.66-.58l.5-3.19c.05-.33.33-.58.66-.58h1.53c3.19 0 5.03-1.54 5.51-4.6.22-1.33.01-2.38-.62-3.12-.7-.81-1.94-1.31-3.56-1.31zm.56 4.53c-.26 1.72-1.58 1.72-2.85 1.72h-.72l.51-3.22c.03-.2.2-.35.4-.35h.33c.87 0 1.69 0 2.11.49.25.3.33.73.22 1.36zm13.89-.04h-2.31c-.2 0-.37.15-.4.35l-.1.67-.16-.24c-.51-.73-1.64-.98-2.77-.98-2.59 0-4.81 1.97-5.24 4.73-.22 1.37.09 2.69.86 3.61.71.85 1.72 1.2 2.92 1.2 2.07 0 3.22-1.33 3.22-1.33l-.1.66c-.04.24.15.45.39.45h2.09c.33 0 .61-.25.66-.58l1.25-7.88c.03-.25-.16-.46-.41-.46zm-3.24 4.58c-.23 1.35-1.3 2.25-2.66 2.25-.68 0-1.23-.22-1.58-.63-.35-.41-.48-1-.37-1.65.21-1.33 1.3-2.27 2.64-2.27.67 0 1.21.22 1.57.64.36.43.5 1.02.4 1.66z"/>
            <path d="M41.63 11.59h-2.32c-.22 0-.43.11-.56.29l-3.21 4.73-1.36-4.55c-.09-.28-.34-.47-.64-.47h-2.28c-.27 0-.47.27-.39.53l2.57 7.53-2.41 3.4c-.19.27 0 .64.33.64h2.31c.22 0 .42-.11.55-.28l7.74-11.18c.19-.27 0-.64-.33-.64z"/>
            <path d="M52.61 7.1h-4.86c-.33 0-.61.25-.66.58l-1.87 11.35c-.04.24.15.45.39.45h2.48c.23 0 .43-.17.46-.4l.53-3.34c.05-.33.33-.58.66-.58h1.53c3.19 0 5.03-1.54 5.51-4.6.22-1.33.01-2.38-.62-3.12-.7-.83-1.93-1.34-3.55-1.34zm.56 4.53c-.26 1.72-1.58 1.72-2.85 1.72h-.72l.51-3.22c.03-.2.2-.35.4-.35h.33c.87 0 1.69 0 2.11.49.25.3.33.73.22 1.36z"/>
            <path d="M67.07 11.59h-2.31c-.2 0-.37.15-.4.35l-.1.67-.16-.24c-.51-.73-1.64-.98-2.77-.98-2.59 0-4.81 1.97-5.24 4.73-.22 1.37.09 2.69.86 3.61.71.85 1.72 1.2 2.92 1.2 2.07 0 3.22-1.33 3.22-1.33l-.1.66c-.04.24.15.45.39.45h2.09c.33 0 .61-.25.66-.58l1.25-7.88c.03-.25-.16-.46-.41-.46zm-3.24 4.58c-.23 1.35-1.3 2.25-2.66 2.25-.68 0-1.23-.22-1.58-.63-.35-.41-.48-1-.37-1.65.21-1.33 1.3-2.27 2.64-2.27.67 0 1.21.22 1.57.64.36.43.5 1.02.4 1.66z"/>
            <path d="M71.46 7.37l-1.9 12.11c-.04.24.15.45.39.45h1.91c.33 0 .61-.25.66-.58l1.87-11.35c.04-.24-.15-.45-.39-.45h-2.14c-.21 0-.37.15-.4.37z"/>
          </svg>
        </motion.button>
      </div>

      {/* Or Divider */}
      <div className="flex items-center justify-center space-x-2 text-gray-600">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm font-medium px-4">or continue with card</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
}