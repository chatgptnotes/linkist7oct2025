'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { UserStore } from '@/lib/user-store';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '@/components/Footer';

// Icon aliases
const Lock = LockIcon;
const ChevronDown = ExpandMoreIcon;

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    config: {
      firstName: string;
      lastName: string;
      title?: string;
      mobile?: string;
      whatsapp?: boolean;
      logo?: string;
      quantity?: number;
    };
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailAutoFilled, setEmailAutoFilled] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [useCardConfigAddress, setUseCardConfigAddress] = useState(false);
  const [addressEditable, setAddressEditable] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'United States',
    postalCode: '',
    phoneNumber: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load cart data from localStorage
    const savedConfig = localStorage.getItem('cardConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setCartItems([{
        id: 1,
        name: 'Linkist NFC Card',
        price: 29.99,
        quantity: config.quantity || 1,
        config: config
      }]);
    }
    
    // Auto-fill email from user session if available
    autoFillEmailFromSession();
    
    setLoading(false);
  }, []);

  const autoFillEmailFromSession = () => {
    try {
      // Get session from cookie
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
      
      if (sessionId) {
        const session = UserStore.getSession(sessionId);
        if (session && session.email) {
          setEmail(session.email);
          setEmailAutoFilled(true);
          showToast('Email auto-filled from your account', 'info');
        }
      }
    } catch (error) {
      console.log('No user session found, email field will remain empty');
    }
  };

  const duplicateAddressFromCardConfig = () => {
    try {
      const savedConfig = localStorage.getItem('cardConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (config.addressLine1 || config.city || config.country) {
          setFormData({
            ...formData,
            fullName: `${config.firstName || ''} ${config.lastName || ''}`.trim(),
            addressLine1: config.addressLine1 || '',
            addressLine2: config.addressLine2 || '',
            city: config.city || '',
            state: config.state || '',
            country: config.country || 'United States',
            postalCode: config.postalCode || '',
            phoneNumber: config.mobile || ''
          });
          setUseCardConfigAddress(true);
          setAddressEditable(false);
          showToast('Address copied from your card configuration', 'success');
        } else {
          showToast('No address found in your card configuration', 'info');
        }
      } else {
        showToast('No card configuration found', 'info');
      }
    } catch (error) {
      console.error('Error duplicating address:', error);
      showToast('Error copying address from card configuration', 'error');
    }
  };

  const handleUseCardConfigAddress = (checked: boolean) => {
    setUseCardConfigAddress(checked);
    if (checked) {
      duplicateAddressFromCardConfig();
    } else {
      setAddressEditable(true);
      // Reset form data to empty
      setFormData({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'United States',
        postalCode: '',
        phoneNumber: ''
      });
    }
  };

  const handleEditAddress = () => {
    setAddressEditable(true);
    setAddressSaved(false);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 5.00; // Fixed shipping cost
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% VAT as specified in requirements
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleSendCode = async () => {
    if (!email) return;
    
    setSendingOtp(true);
    setOtpError('');
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmailSent(true);
        showToast('Verification code sent to your email!', 'success');
        // Show OTP in development for testing
        if (data.devOtp && process.env.NODE_ENV === 'development') {
          console.log('Development OTP:', data.devOtp);
          setDevOtp(data.devOtp);
        }
      } else {
        setOtpError(data.error || 'Failed to send verification code');
        showToast(data.error || 'Failed to send verification code', 'error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError('Network error. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    
    setVerifyingOtp(true);
    setOtpError('');
    
    try {
      console.log('Verifying OTP:', { email, otp }); // Debug log
      
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      console.log('Verification response:', data); // Debug log
      
      if (response.ok) {
        setEmailVerified(true);
        showToast('Email verified successfully!', 'success');
      } else {
        setOtpError(data.error || 'Invalid verification code');
        showToast(data.error || 'Invalid verification code', 'error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Network error. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName) errors.fullName = 'Full name is required';
    if (!formData.addressLine1) errors.addressLine1 = 'Address line 1 is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!emailVerified) errors.email = 'Please verify your email address first';
    if (!formData.fullName) errors.fullName = 'Full name is required';
    if (!formData.addressLine1) errors.addressLine1 = 'Address line 1 is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSavingAddress(true);
    
    try {
      // Simulate API call to save address
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('deliveryAddress', JSON.stringify({
        ...formData,
        email,
        savedAt: new Date().toISOString()
      }));
      
      setAddressSaved(true);
      showToast('Delivery address saved successfully!', 'success');
      
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('Failed to save address. Please try again.', 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleContinueToPayment = () => {
    if (validateForm()) {
      // Save checkout data
      localStorage.setItem('checkoutData', JSON.stringify({
        email,
        ...formData
      }));
      router.push('/payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            {/* Email Verification */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1. Verify your email</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">We&apos;ll send a 6-digit code to your email for verification.</p>
              
              {emailAutoFilled && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-700">Email auto-filled from your account</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@example.com"
                      disabled={emailVerified}
                      className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pl-10 sm:pl-12 text-sm sm:text-base ${
                        emailVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                      📧
                    </div>
                    {emailVerified && (
                      <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                        ✓
                      </div>
                    )}
                  </div>
                  {formErrors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                {!emailVerified && (
                  <button
                    onClick={handleSendCode}
                    disabled={sendingOtp || !email}
                    className="w-full sm:w-auto bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
                  >
                    {sendingOtp ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send Code'
                    )}
                  </button>
                )}
                
                {emailSent && !emailVerified && (
                  <div className="space-y-4">
                    <div className="text-sm text-green-600">
                      ✓ Verification code sent to your email
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-800">Please wait for your OTP</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            It may take up to 30 seconds for the verification code to arrive in your email. 
                            Please check your inbox and spam folder.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Development OTP Display */}
                    {devOtp && process.env.NODE_ENV === 'development' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-sm text-yellow-800">
                          <strong>Development Mode:</strong> Your verification code is: <span className="font-mono text-lg font-bold">{devOtp}</span>
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">
                          In production, this code would be sent to your email.
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Enter 6-digit verification code
                      </label>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="123456"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-base sm:text-lg tracking-widest min-h-[44px]"
                          maxLength={6}
                        />
                        <button
                          onClick={handleVerifyOtp}
                          disabled={verifyingOtp || otp.length !== 6}
                          className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
                        >
                          {verifyingOtp ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Verifying...
                            </div>
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {otpError && (
                      <div className="text-sm text-red-600">
                        {otpError}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      Didn&apos;t receive the code?{' '}
                      <button 
                        onClick={handleSendCode}
                        disabled={sendingOtp}
                        className="text-red-500 hover:text-red-600 font-medium"
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                )}
                
                {emailVerified && (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Email verified successfully
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">2. Delivery Address</h2>
                {addressSaved && addressEditable && (
                  <button
                    onClick={handleEditAddress}
                    className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium"
                  >
                    Edit Address
                  </button>
                )}
              </div>
              
              {/* Address Duplication Checkbox */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCardConfigAddress}
                    onChange={(e) => handleUseCardConfigAddress(e.target.checked)}
                    className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Use address from my card configuration
                    </span>
                    <p className="text-xs text-gray-500">
                      Copy the address information from your saved card configuration
                    </p>
                  </div>
                </label>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    disabled={!addressEditable}
                    className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base min-h-[44px] ${
                      formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                    } ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                      disabled={!addressEditable}
                      className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base min-h-[44px] ${
                        formErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                      } ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                    {formErrors.addressLine1 && (
                      <div className="flex items-center text-red-500 text-xs sm:text-sm mt-1">
                        <span className="mr-1">⚠</span>
                        Please enter a valid address.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Address Line 2 <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                      disabled={!addressEditable}
                      className={`w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base min-h-[44px] ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      disabled={!addressEditable}
                      className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base min-h-[44px] ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      } ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Region / State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      disabled={!addressEditable}
                      className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base min-h-[44px] ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      } ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        disabled={!addressEditable}
                        className={`w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-sm sm:text-base min-h-[44px] ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      >
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Central African Republic">Central African Republic</option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo">Congo</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Greece">Greece</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">Marshall Islands</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia">Micronesia</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="North Korea">North Korea</option>
                        <option value="North Macedonia">North Macedonia</option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestine">Palestine</option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">Papua New Guinea</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="South Sudan">South Sudan</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syria">Syria</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor-Leste">Timor-Leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Vatican City">Vatican City</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      disabled={!addressEditable}
                      className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base min-h-[44px] ${
                        formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                      } ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="For delivery updates"
                    disabled={!addressEditable}
                    className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base min-h-[44px] ${
                      formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    } ${!addressEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Save Address Button */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveAddress}
                    disabled={savingAddress || addressSaved || !addressEditable}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors text-sm sm:text-base min-h-[44px] ${
                      addressSaved
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : savingAddress
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : !addressEditable
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {savingAddress ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving Address...
                      </div>
                    ) : addressSaved ? (
                      <div className="flex items-center justify-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Address Saved
                      </div>
                    ) : !addressEditable ? (
                      'Address Copied from Card Config'
                    ) : (
                      'Save Delivery Address'
                    )}
                  </button>
                  
                  {addressSaved && (
                    <p className="text-sm text-green-600 text-center mt-2">
                      ✓ Your delivery address has been saved successfully
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-4 sm:p-6 h-fit">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 sm:w-12 h-7 sm:h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                  <img src="/logo.svg" alt="Linkist" className="h-3 sm:h-4 filter brightness-0 invert" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{item.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold text-sm sm:text-base">${item.price}</div>
              </div>
            ))}
            
            <div className="space-y-2 sm:space-y-3 py-3 sm:py-4 border-t border-gray-200">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${calculateShipping().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Tax (5% VAT)</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-semibold">
                <span>Total (USD)</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
              Expected Delivery: Sep 06, 2025
            </div>

            <button
              onClick={handleContinueToPayment}
              className="w-full bg-red-500 text-white py-3 sm:py-4 rounded-lg font-medium hover:bg-red-600 transition-colors mb-3 sm:mb-4 text-sm sm:text-base min-h-[44px]"
            >
              Continue to Payment
            </button>

            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
              <Lock className="h-3 sm:h-4 w-3 sm:w-4" />
              <span>Secure checkout via Stripe. Encrypted.</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}