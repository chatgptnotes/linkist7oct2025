'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, CreditCard, Shield, ArrowLeft } from 'lucide-react';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  stateProvince: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  quantity: z.number().min(1).max(10),
  isFounderMember: z.boolean(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [cardConfig, setCardConfig] = useState<{ 
    fullName?: string; 
    firstName?: string; 
    lastName?: string;
    baseMaterial?: string;
    color?: string;
    [key: string]: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      quantity: 1,
      isFounderMember: true,
      country: 'US',
    },
  });

  const watchedValues = watch();
  const quantity = watchedValues.quantity || 1;
  const isFounderMember = watchedValues.isFounderMember || false;

  useEffect(() => {
    console.log('Checkout: Loading configuration data...');
    
    // Check for nfcConfig first (this is what configure page saves)
    const nfcConfigStr = localStorage.getItem('nfcConfig');
    
    if (nfcConfigStr) {
      try {
        const config = JSON.parse(nfcConfigStr);
        console.log('Checkout: Raw loaded config:', config);
        
        // Validate that we have required fields
        if (config.firstName && config.lastName) {
          const processedConfig = {
            firstName: config.firstName,
            lastName: config.lastName,
            baseMaterial: config.baseMaterial,
            texture: config.texture,
            pattern: config.pattern,
            color: config.color,
            fullName: `${config.firstName} ${config.lastName}`.trim()
          };
          
          console.log('Checkout: Processed config for display:', processedConfig);
          setCardConfig(processedConfig);
          
          // Auto-populate form fields with configured data
          setValue('firstName', config.firstName);
          setValue('lastName', config.lastName);
          console.log('Checkout: Auto-populated form fields:', config.firstName, config.lastName);
        } else {
          console.error('Checkout: Invalid config data - missing firstName or lastName');
          router.push('/nfc/configure');
        }
      } catch (error) {
        console.error('Checkout: Error parsing config:', error);
        router.push('/nfc/configure');
      }
    } else {
      console.log('Checkout: No config found, redirecting to configure');
      router.push('/nfc/configure');
    }
  }, [router]);

  const calculatePricing = () => {
    // Get price based on selected material
    const materialPrices = { pvc: 29, wood: 49, stainless_steel: 99 };
    const basePrice = cardConfig?.baseMaterial ? materialPrices[cardConfig.baseMaterial] || 29.99 : 29.99;
    const subtotal = basePrice * quantity;
    const taxRate = 0.05; // 5% default tax
    const taxAmount = subtotal * taxRate;
    const shippingCost = watchedValues.country !== 'AE' ? 10 : 0; // Free shipping in UAE
    const total = subtotal + taxAmount + shippingCost;

    return {
      basePrice,
      subtotal,
      taxAmount,
      shippingCost,
      total,
    };
  };

  const pricing = calculatePricing();

  const processOrder = async (formData: CheckoutForm) => {
    setIsLoading(true);
    try {
      console.log('💳 Checkout: Processing order with form data:', formData);
      console.log('💳 Checkout: Card config:', cardConfig);
      console.log('💳 Checkout: Pricing:', pricing);

      // Prepare order data for API
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        quantity: formData.quantity,
        cardConfig: {
          ...cardConfig,
          quantity: formData.quantity
        },
        shipping: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          country: formData.country,
          postalCode: formData.postalCode,
          phoneNumber: formData.phone
        },
        pricing: {
          subtotal: pricing.subtotal,
          shippingCost: pricing.shippingCost,
          taxAmount: pricing.taxAmount,
          total: pricing.total
        },
        isFounderMember: formData.isFounderMember
      };

      console.log('📤 Checkout: Sending order to API:', orderPayload);

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create order');
      }

      const result = await response.json();
      console.log('✅ Checkout: Order created successfully:', result.order);

      // Save order data to localStorage for success page
      localStorage.setItem('currentOrder', JSON.stringify(result.order));
      
      // Redirect to success page
      router.push('/nfc/success');
    } catch (error) {
      console.error('❌ Checkout: Order processing error:', error);
      alert(`Order creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cardConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading your card configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/nfc/configure')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Design</span>
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Checkout</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Checkout Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Order</h2>
              <p className="text-gray-600 mt-2">Fill in your details to get your NFC card</p>
            </div>

            <form onSubmit={handleSubmit(processOrder)} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        {...register('firstName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        {...register('lastName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="+1 234 567 8900"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      {...register('addressLine1')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="123 Main St"
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      {...register('addressLine2')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        {...register('city')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        {...register('stateProvince')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        {...register('postalCode')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="10001"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        {...register('country')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="US">United States</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IN">India</option>
                        <option value="SG">Singapore</option>
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Order Options</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <select
                      {...register('quantity', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {[1, 2, 3, 4, 5, 10].map(num => (
                        <option key={num} value={num}>{num} card{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-start">
                    <input
                      {...register('isFounderMember')}
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      <span className="font-medium">Join as Founder Member</span>
                      <p className="text-gray-500">Get 1 year free app access when we launch (normally $12/month)</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <CreditCard className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Processing...' : `Pay $${pricing.total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Card Preview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Your NFC Card</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {cardConfig?.fullName || 'Custom NFC Card'}
                </p>
                {cardConfig?.baseMaterial && (
                  <p className="text-xs text-gray-500 mb-2">
                    Material: {cardConfig.baseMaterial.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                    Color: {cardConfig.color?.charAt(0).toUpperCase() + cardConfig.color?.slice(1) || 'Black'}
                  </p>
                )}
                <div className="w-32 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Initials */}
                  <div className="absolute bottom-2 left-2 text-white text-xs font-light">
                    {cardConfig?.firstName && cardConfig?.lastName 
                      ? `${cardConfig.firstName.charAt(0).toUpperCase()}${cardConfig.lastName.charAt(0).toUpperCase()}`
                      : 'NN'}
                  </div>
                  {/* Linkist logo bottom right */}
                  <div className="absolute bottom-1 right-1">
                    <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>NFC Card × {quantity}</span>
                  <span>${pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>${pricing.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{pricing.shippingCost === 0 ? 'Free' : `$${pricing.shippingCost.toFixed(2)}`}</span>
                </div>
                {isFounderMember && (
                  <div className="flex justify-between text-green-600">
                    <span>Founder Member Benefits</span>
                    <span>Included</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${pricing.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 flex items-start space-x-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p>Your payment info is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}