'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingCart, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { safeFetch } from '@/lib/api-utils';

const cardConfigSchema = z.object({
  // Mandatory fields
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(25, 'First name too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(25, 'Last name too long'),
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  mobile: z.string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true; // Allow empty
      // Remove all non-digit characters to check actual number length
      const digitsOnly = val.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }, 'Please enter a valid mobile number (10-15 digits)')
    .refine((val) => {
      if (!val || val === '') return true; // Allow empty
      // Allow digits, spaces, hyphens, plus sign, and parentheses
      return /^[\d\s\-\+\(\)]+$/.test(val);
    }, 'Mobile number contains invalid characters'),
  email: z.string().email('Please enter a valid email address'),
  
  // Optional fields
  whatsapp: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  
  // Address fields (optional)
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  
  // Other fields
  quantity: z.number().min(1, 'Minimum 1 card required').max(10, 'Maximum 10 cards allowed'),
  agreeToPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the data policy to proceed'
  })
});

type CardConfig = z.infer<typeof cardConfigSchema>;

export default function ConfigurePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Mobile verification state
  const [countryCode, setCountryCode] = useState('+91'); // Default to India
  const [mobileVerificationSent, setMobileVerificationSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileVerificationLoading, setMobileVerificationLoading] = useState(false);
  const [mobileVerificationError, setMobileVerificationError] = useState('');
  
  // Form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Card customization state
  const [selectedBase, setSelectedBase] = useState<'pvc' | 'wood' | 'steel'>('steel');
  const [selectedTexture, setSelectedTexture] = useState<'matte' | 'brushed'>('brushed');
  const [selectedPattern, setSelectedPattern] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<'black' | 'silver' | 'gray' | 'gold'>('black');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CardConfig>({
    resolver: zodResolver(cardConfigSchema),
    defaultValues: {
      quantity: 1,
      agreeToPolicy: false,
    },
  });

  const watchedValues = watch();

  // Load existing configuration from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('cardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        console.log('Loading existing config:', config);
        
        // Pre-fill form with existing data
        if (config.firstName) setValue('firstName', config.firstName);
        if (config.lastName) setValue('lastName', config.lastName);
        if (config.title) setValue('title', config.title);
        if (config.company) setValue('company', config.company);
        if (config.email) setValue('email', config.email);
        if (config.website) setValue('website', config.website);
        if (config.linkedin) setValue('linkedin', config.linkedin);
        if (config.instagram) setValue('instagram', config.instagram);
        if (config.twitter) setValue('twitter', config.twitter);
        if (config.quantity) setValue('quantity', config.quantity);
        if (config.agreeToPolicy) setValue('agreeToPolicy', config.agreeToPolicy);
        
        // Handle mobile number (extract country code and number)
        if (config.mobile) {
          const mobileParts = config.mobile.split(' ');
          if (mobileParts.length >= 2) {
            setCountryCode(mobileParts[0]);
            setValue('mobile', mobileParts.slice(1).join(' '));
          } else {
            setValue('mobile', config.mobile);
          }
        }
        
        // Handle WhatsApp
        if (config.whatsapp) {
          setValue('whatsapp', config.whatsapp);
          setSameAsMobile(config.whatsapp === config.mobile);
        }
        
        // Load images
        if (config.profileImage) setProfileImage(config.profileImage);
        if (config.backgroundImage) setBackgroundImage(config.backgroundImage);
        
        // Set mobile verification status
        if (config.mobileVerified) setMobileVerified(config.mobileVerified);
        
        console.log('✅ Form pre-filled with existing data');
      } catch (error) {
        console.error('Error loading existing config:', error);
      }
    }
  }, [setValue]);

  // Handle "Same as mobile" toggle
  const handleSameAsMobileToggle = () => {
    setSameAsMobile(!sameAsMobile);
    if (!sameAsMobile && watchedValues.mobile) {
      setValue('whatsapp', watchedValues.mobile);
    } else {
      setValue('whatsapp', '');
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const removeProfileImage = () => {
    setProfileImage(null);
  };

  // Remove background image
  const removeBackgroundImage = () => {
    setBackgroundImage(null);
  };

  // Mobile verification handlers
  const handleMobileVerify = async () => {
    const mobileValue = watchedValues.mobile;
    if (!mobileValue) {
      setMobileVerificationError('Please enter a mobile number first');
      return;
    }

    // Combine country code with mobile number
    const fullMobileNumber = `${countryCode} ${mobileValue}`;

    setMobileVerificationLoading(true);
    setMobileVerificationError('');

    try {
      const response = await safeFetch('/api/send-mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: fullMobileNumber }),
      });

      if (response.ok && response.data) {
        setMobileVerificationSent(true);
        console.log('Mobile OTP sent:', response.data.devOtp); // For development
      } else {
        setMobileVerificationError(response.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Mobile verification error:', error);
      setMobileVerificationError('Network error. Please try again.');
    } finally {
      setMobileVerificationLoading(false);
    }
  };

  const handleMobileOtpVerify = async () => {
    if (!mobileOtp) {
      setMobileVerificationError('Please enter the verification code');
      return;
    }

    setMobileVerificationLoading(true);
    setMobileVerificationError('');

    try {
      // Use the same full mobile number format as when sending OTP
      const fullMobileNumber = `${countryCode} ${watchedValues.mobile}`;
      
      const response = await safeFetch('/api/verify-mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile: fullMobileNumber, 
          otp: mobileOtp 
        }),
      });

      if (response.ok) {
        setMobileVerified(true);
        setMobileVerificationSent(false);
        setMobileOtp('');
      } else {
        setMobileVerificationError(response.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Mobile OTP verification error:', error);
      setMobileVerificationError('Network error. Please try again.');
    } finally {
      setMobileVerificationLoading(false);
    }
  };

  const handleBypassVerification = () => {
    setMobileVerified(true);
    setMobileVerificationSent(false);
    setMobileOtp('');
    setMobileVerificationError('');
  };

  const onSubmit = async (data: CardConfig) => {
    setIsSubmitting(true);
    try {
      // Store card configuration
      const cardConfig = {
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        company: data.company,
        // Store full mobile number with country code (if provided)
        mobile: watchedValues.mobile ? `${countryCode} ${watchedValues.mobile}` : null,
        whatsapp: data.whatsapp,
        email: data.email,
        website: data.website,
        linkedin: data.linkedin,
        instagram: data.instagram,
        twitter: data.twitter,
        profileImage: profileImage,
        backgroundImage: backgroundImage,
        quantity: data.quantity,
        mobileVerified: mobileVerified,
      };

      // Save to Supabase database
      const response = await safeFetch('/api/save-card-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardConfig),
      });

      if (response.ok && response.data) {
        console.log('✅ Card configuration saved:', response.data.configId);
        
        // Also save to localStorage for compatibility
        const localConfig = {
          ...cardConfig,
          fullName: `${data.firstName} ${data.lastName}`,
          timestamp: new Date().toISOString(),
          status: 'draft',
          configId: response.data.configId, // Store the Supabase ID
        };
        localStorage.setItem('cardConfig', JSON.stringify(localConfig));
        
        // Show success toast
        showToast('Card configuration saved successfully!', 'success');
        
        // Clear form and reset all states
        reset();
        setProfileImage('');
        setBackgroundImage('');
        setMobileVerified(false);
        setMobileOtp('');
        setMobileVerificationError('');
        setCountryCode('+91');
        
        // Navigate directly to checkout page
        router.push('/nfc/checkout');
      } else {
        console.error('Failed to save card configuration:', response.error);
        showToast(response.error || 'Failed to save card configuration. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section with Card Animation */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-red-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Premium NFC Cards</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent mb-6">
            Configure Your NFC Card
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your perfect digital business card in minutes with our advanced customization tools
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Live Preview</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Professional Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Exact Figma Layout */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configure Your Card</h1>
                <p className="text-gray-500 text-sm">Step 1 of 3</p>
              </div>
            </div>
            <p className="text-gray-600 mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              💡 <strong>Tip:</strong> Fields marked with <span className="text-red-500 font-semibold">*</span> are required for card printing. Preview updates in real-time!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields - MANDATORY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Jane"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Title and Company - MANDATORY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Founder & CEO"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('company')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g. Linkist Inc."
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                  )}
                </div>
              </div>

              {/* Mobile Number - OPTIONAL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="flex">
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-l focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-gray-50 min-w-[80px]"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+1">🇨🇦 +1</option>
                    <option value="+7">🇷🇺 +7</option>
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+27">🇿🇦 +27</option>
                    <option value="+30">🇬🇷 +30</option>
                    <option value="+31">🇳🇱 +31</option>
                    <option value="+32">🇧🇪 +32</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+36">🇭🇺 +36</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+40">🇷🇴 +40</option>
                    <option value="+41">🇨🇭 +41</option>
                    <option value="+43">🇦🇹 +43</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+45">🇩🇰 +45</option>
                    <option value="+46">🇸🇪 +46</option>
                    <option value="+47">🇳🇴 +47</option>
                    <option value="+48">🇵🇱 +48</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+53">🇨🇺 +53</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+64">🇳🇿 +64</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+90">🇹🇷 +90</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+92">🇵🇰 +92</option>
                    <option value="+93">🇦🇫 +93</option>
                    <option value="+94">🇱🇰 +94</option>
                    <option value="+95">🇲🇲 +95</option>
                    <option value="+98">🇮🇷 +98</option>
                    <option value="+212">🇲🇦 +212</option>
                    <option value="+213">🇩🇿 +213</option>
                    <option value="+216">🇹🇳 +216</option>
                    <option value="+218">🇱🇾 +218</option>
                    <option value="+220">🇬🇲 +220</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+222">🇲🇷 +222</option>
                    <option value="+223">🇲🇱 +223</option>
                    <option value="+224">🇬🇳 +224</option>
                    <option value="+225">🇨🇮 +225</option>
                    <option value="+226">🇧🇫 +226</option>
                    <option value="+227">🇳🇪 +227</option>
                    <option value="+228">🇹🇬 +228</option>
                    <option value="+229">🇧🇯 +229</option>
                    <option value="+230">🇲🇺 +230</option>
                    <option value="+231">🇱🇷 +231</option>
                    <option value="+232">🇸🇱 +232</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+235">🇹🇩 +235</option>
                    <option value="+236">🇨🇫 +236</option>
                    <option value="+237">🇨🇲 +237</option>
                    <option value="+238">🇨🇻 +238</option>
                    <option value="+239">🇸🇹 +239</option>
                    <option value="+240">🇬🇶 +240</option>
                    <option value="+241">🇬🇦 +241</option>
                    <option value="+242">🇨🇬 +242</option>
                    <option value="+243">🇨🇩 +243</option>
                    <option value="+244">🇦🇴 +244</option>
                    <option value="+245">🇬🇼 +245</option>
                    <option value="+246">🇮🇴 +246</option>
                    <option value="+248">🇸🇨 +248</option>
                    <option value="+249">🇸🇩 +249</option>
                    <option value="+250">🇷🇼 +250</option>
                    <option value="+251">🇪🇹 +251</option>
                    <option value="+252">🇸🇴 +252</option>
                    <option value="+253">🇩🇯 +253</option>
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+255">🇹🇿 +255</option>
                    <option value="+256">🇺🇬 +256</option>
                    <option value="+257">🇧🇮 +257</option>
                    <option value="+258">🇲🇿 +258</option>
                    <option value="+260">🇿🇲 +260</option>
                    <option value="+261">🇲🇬 +261</option>
                    <option value="+262">🇾🇹 +262</option>
                    <option value="+263">🇿🇼 +263</option>
                    <option value="+264">🇳🇦 +264</option>
                    <option value="+265">🇲🇼 +265</option>
                    <option value="+266">🇱🇸 +266</option>
                    <option value="+267">🇧🇼 +267</option>
                    <option value="+268">🇸🇿 +268</option>
                    <option value="+269">🇰🇲 +269</option>
                    <option value="+290">🇸🇭 +290</option>
                    <option value="+291">🇪🇷 +291</option>
                    <option value="+297">🇦🇼 +297</option>
                    <option value="+298">🇫🇴 +298</option>
                    <option value="+299">🇬🇱 +299</option>
                    <option value="+350">🇬🇮 +350</option>
                    <option value="+351">🇵🇹 +351</option>
                    <option value="+352">🇱🇺 +352</option>
                    <option value="+353">🇮🇪 +353</option>
                    <option value="+354">🇮🇸 +354</option>
                    <option value="+355">🇦🇱 +355</option>
                    <option value="+356">🇲🇹 +356</option>
                    <option value="+357">🇨🇾 +357</option>
                    <option value="+358">🇫🇮 +358</option>
                    <option value="+359">🇧🇬 +359</option>
                    <option value="+370">🇱🇹 +370</option>
                    <option value="+371">🇱🇻 +371</option>
                    <option value="+372">🇪🇪 +372</option>
                    <option value="+373">🇲🇩 +373</option>
                    <option value="+374">🇦🇲 +374</option>
                    <option value="+375">🇧🇾 +375</option>
                    <option value="+376">🇦🇩 +376</option>
                    <option value="+377">🇲🇨 +377</option>
                    <option value="+378">🇸🇲 +378</option>
                    <option value="+380">🇺🇦 +380</option>
                    <option value="+381">🇷🇸 +381</option>
                    <option value="+382">🇲🇪 +382</option>
                    <option value="+383">🇽🇰 +383</option>
                    <option value="+385">🇭🇷 +385</option>
                    <option value="+386">🇸🇮 +386</option>
                    <option value="+387">🇧🇦 +387</option>
                    <option value="+389">🇲🇰 +389</option>
                    <option value="+420">🇨🇿 +420</option>
                    <option value="+421">🇸🇰 +421</option>
                    <option value="+423">🇱🇮 +423</option>
                    <option value="+500">🇫🇰 +500</option>
                    <option value="+501">🇧🇿 +501</option>
                    <option value="+502">🇬🇹 +502</option>
                    <option value="+503">🇸🇻 +503</option>
                    <option value="+504">🇭🇳 +504</option>
                    <option value="+505">🇳🇮 +505</option>
                    <option value="+506">🇨🇷 +506</option>
                    <option value="+507">🇵🇦 +507</option>
                    <option value="+508">🇵🇲 +508</option>
                    <option value="+509">🇭🇹 +509</option>
                    <option value="+590">🇬🇵 +590</option>
                    <option value="+591">🇧🇴 +591</option>
                    <option value="+592">🇬🇾 +592</option>
                    <option value="+593">🇪🇨 +593</option>
                    <option value="+594">🇬🇫 +594</option>
                    <option value="+595">🇵🇾 +595</option>
                    <option value="+596">🇲🇶 +596</option>
                    <option value="+597">🇸🇷 +597</option>
                    <option value="+598">🇺🇾 +598</option>
                    <option value="+599">🇧🇶 +599</option>
                    <option value="+670">🇹🇱 +670</option>
                    <option value="+672">🇦🇶 +672</option>
                    <option value="+673">🇧🇳 +673</option>
                    <option value="+674">🇳🇷 +674</option>
                    <option value="+675">🇵🇬 +675</option>
                    <option value="+676">🇹🇴 +676</option>
                    <option value="+677">🇸🇧 +677</option>
                    <option value="+678">🇻🇺 +678</option>
                    <option value="+679">🇫🇯 +679</option>
                    <option value="+680">🇵🇼 +680</option>
                    <option value="+681">🇼🇫 +681</option>
                    <option value="+682">🇨🇰 +682</option>
                    <option value="+683">🇳🇺 +683</option>
                    <option value="+684">🇦🇸 +684</option>
                    <option value="+685">🇼🇸 +685</option>
                    <option value="+686">🇰🇮 +686</option>
                    <option value="+687">🇳🇨 +687</option>
                    <option value="+688">🇹🇻 +688</option>
                    <option value="+689">🇵🇫 +689</option>
                    <option value="+690">🇹🇰 +690</option>
                    <option value="+691">🇫🇲 +691</option>
                    <option value="+692">🇲🇭 +692</option>
                    <option value="+850">🇰🇵 +850</option>
                    <option value="+852">🇭🇰 +852</option>
                    <option value="+853">🇲🇴 +853</option>
                    <option value="+855">🇰🇭 +855</option>
                    <option value="+856">🇱🇦 +856</option>
                    <option value="+880">🇧🇩 +880</option>
                    <option value="+886">🇹🇼 +886</option>
                    <option value="+960">🇲🇻 +960</option>
                    <option value="+961">🇱🇧 +961</option>
                    <option value="+962">🇯🇴 +962</option>
                    <option value="+963">🇸🇾 +963</option>
                    <option value="+964">🇮🇶 +964</option>
                    <option value="+965">🇰🇼 +965</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+967">🇾🇪 +967</option>
                    <option value="+968">🇴🇲 +968</option>
                    <option value="+970">🇵🇸 +970</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+972">🇮🇱 +972</option>
                    <option value="+973">🇧🇭 +973</option>
                    <option value="+974">🇶🇦 +974</option>
                    <option value="+975">🇧🇹 +975</option>
                    <option value="+976">🇲🇳 +976</option>
                    <option value="+977">🇳🇵 +977</option>
                    <option value="+992">🇹🇯 +992</option>
                    <option value="+993">🇹🇲 +993</option>
                    <option value="+994">🇦🇿 +994</option>
                    <option value="+995">🇬🇪 +995</option>
                    <option value="+996">🇰🇬 +996</option>
                    <option value="+998">🇺🇿 +998</option>
                  </select>
                  <input
                    {...register('mobile')}
                    className="flex-1 px-3 py-2 border-l-0 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter mobile number (10-15 digits)"
                    disabled={mobileVerified}
                  />
                  <button 
                    type="button"
                    onClick={handleMobileVerify}
                    disabled={mobileVerificationLoading || mobileVerified || !watchedValues.mobile}
                    className={`px-4 py-2 border border-l-0 border-gray-200 rounded-r font-medium transition-colors ${
                      mobileVerified 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : watchedValues.mobile && !mobileVerificationLoading
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {mobileVerificationLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : mobileVerified ? (
                      '✓ Verified'
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
                
                {/* Bypass Verification Button */}
                {!mobileVerified && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleBypassVerification}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Skip Verification</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Skip mobile verification for development/testing</p>
                  </div>
                )}
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                )}
                
                {/* Mobile OTP Input */}
                {mobileVerificationSent && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 mb-3">Enter the verification code sent to your mobile</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="flex-1 px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleMobileOtpVerify}
                        disabled={mobileVerificationLoading || !mobileOtp}
                        className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {mobileVerificationLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Mobile verification error */}
                {mobileVerificationError && (
                  <p className="text-red-500 text-sm mt-2">{mobileVerificationError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Text & NFC format<br />
                  recommended.
                </p>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                <div className="flex items-center space-x-3 mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={handleSameAsMobileToggle}
                      className="mr-2 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">Same as mobile</span>
                  </label>
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <input
                  {...register('whatsapp')}
                  disabled={sameAsMobile}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50"
                  placeholder="+971 50 123 4567"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="jane@doe.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>



              {/* Optional: Address Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Address Information (Optional)</h4>
                <p className="text-xs text-gray-500">This address can be used for delivery purposes during checkout</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 1</label>
                  <input
                    {...register('addressLine1')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Street address, P.O. box, company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                  <input
                    {...register('addressLine2')}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                    <input
                      {...register('city')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">State/Province</label>
                    <input
                      {...register('state')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="State or Province"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                    <select
                      {...register('country')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                    <input
                      {...register('postalCode')}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                </div>
              </div>



              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  {...register('quantity', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  defaultValue={1}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-4">
                <label className="flex items-start space-x-3">
                  <input
                    {...register('agreeToPolicy')}
                    type="checkbox"
                    className="mt-1 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to the data policy and confirm my print proof is correct.
                    By checking this, you approve the live preview for printing.
                  </span>
                </label>
                {errors.agreeToPolicy && (
                  <p className="text-red-500 text-sm mt-1">{errors.agreeToPolicy.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-coral py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
              
              {/* Progress Bar */}
              {isSubmitting && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full animate-pulse" style={{
                      width: '100%',
                      animation: 'progress 3s ease-in-out infinite'
                    }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Processing your card configuration and generating preview...
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Card Preview Section - Live Preview */}
          <div className="space-y-6">
            {/* Live Preview Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Updates automatically</span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('front')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'front'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setActiveTab('back')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'back'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Back
              </button>
            </div>

            {/* Card Preview */}
            <div className="bg-white rounded-lg p-6">
              {activeTab === 'front' ? (
                <div className="max-w-sm mx-auto">
                  {/* Front Card */}
                  <div 
                    className="w-full aspect-[1.586/1] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white relative overflow-hidden"
                    style={backgroundImage ? {
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : {}}
                  >
                    {/* Linkist Logo */}
                    <div className="flex items-center space-x-2 mb-4">
                      <img src="/logo.svg" alt="Linkist" className="h-6 filter brightness-0 invert" />
                      <div className="ml-auto">
                        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          FOUNDER
                        </div>
                      </div>
                    </div>

                    {/* Profile Image - Positioned lower to avoid overlap */}
                    <div className="absolute top-16 right-6 w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                      <img 
                        src={profileImage || "https://images.unsplash.com/photo-1494790108755-2616b612b5b0?w=150&h=150&fit=crop&crop=face"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name and Title */}
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
                        {watchedValues.firstName && watchedValues.lastName
                          ? `${watchedValues.firstName} ${watchedValues.lastName}`
                          : 'Your Name'
                        }
                      </h3>
                      <p className="text-gray-300 text-sm drop-shadow-md">
                        {watchedValues.title && watchedValues.company
                          ? `${watchedValues.title}, ${watchedValues.company}`
                          : 'Your Title, Your Company'
                        }
                      </p>
                      {watchedValues.email && (
                        <p className="text-gray-300 text-xs mt-1 drop-shadow-md">
                          {watchedValues.email}
                        </p>
                      )}
                    </div>

                    {/* NFC Icon */}
                    <div className="absolute bottom-6 right-6">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,4 22,2 20,2M20,20H4V4H20V20Z" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    This is a digital representation. Final product may vary slightly.
                  </p>
                </div>
              ) : (
                <div className="max-w-sm mx-auto">
                  {/* Back Card */}
                  <div className="w-full aspect-[1.586/1] bg-white border border-gray-200 rounded-lg p-6 relative overflow-hidden">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      {/* Mobile */}
                      {watchedValues.mobile && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <span className="text-gray-800 text-sm">{countryCode} {watchedValues.mobile}</span>
                        </div>
                      )}
                      
                      {/* Email */}
                      {watchedValues.email && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <span className="text-gray-800 text-sm">{watchedValues.email}</span>
                        </div>
                      )}
                      
                      {/* Website */}
                      {watchedValues.website && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-800 text-sm">{watchedValues.website}</span>
                        </div>
                      )}

                      {/* Social Media Links */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-xs mb-3 uppercase tracking-wide">Connect With Me</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {watchedValues.linkedin && (
                            <div className="text-center">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                <span className="text-white text-xs font-bold">in</span>
                              </div>
                              <p className="text-xs text-gray-600">LinkedIn</p>
                            </div>
                          )}
                          
                          {watchedValues.instagram && (
                            <div className="text-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </div>
                              <p className="text-xs text-gray-600">Instagram</p>
                            </div>
                          )}
                          
                          {watchedValues.twitter && (
                            <div className="text-center">
                              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                              </div>
                              <p className="text-xs text-gray-600">Twitter</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                      <div className="text-xs text-gray-400 text-center">
                        <div className="w-8 h-8 bg-gray-300 rounded mb-1 mx-auto"></div>
                        <span>QR</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Description */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700">Contact Information</p>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      QR code will contain all your contact details for easy sharing.
                    </p>
                  </div>
                </div>
              )}
            </div>

            
            {/* Card Customization Interface */}
            <div className="mt-8 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Customize Your Card</h2>
              </div>
              
              {/* 1. Select Base */}
              <div className="mb-10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">1. Select Base Material</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6 ml-9">Choose the foundation of your card - each material offers a unique feel and finish.</p>
                
                <div className="space-y-4 ml-9">
                  <div 
                    onClick={() => setSelectedBase('pvc')}
                    className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                      selectedBase === 'pvc' 
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          id="base-pvc" 
                          name="base-material" 
                          value="pvc"
                          checked={selectedBase === 'pvc'}
                          onChange={(e) => setSelectedBase(e.target.value as 'pvc' | 'wood' | 'steel')}
                          className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg">PVC</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Popular</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Lightweight, durable, and cost-effective</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">$29</span>
                        <p className="text-xs text-gray-500">Starting price</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setSelectedBase('wood')}
                    className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                      selectedBase === 'wood' 
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          id="base-wood" 
                          name="base-material" 
                          value="wood"
                          checked={selectedBase === 'wood'}
                          onChange={(e) => setSelectedBase(e.target.value as 'pvc' | 'wood' | 'steel')}
                          className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg">Wood</span>
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Eco-Friendly</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Natural texture with sustainable appeal</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">$49</span>
                        <p className="text-xs text-gray-500">Premium option</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setSelectedBase('steel')}
                    className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                      selectedBase === 'steel' 
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          id="base-steel" 
                          name="base-material" 
                          value="steel"
                          checked={selectedBase === 'steel'}
                          onChange={(e) => setSelectedBase(e.target.value as 'pvc' | 'wood' | 'steel')}
                          className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg text-red-600">Stainless Steel</span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Luxury</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Premium metal finish with ultimate durability</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-red-600">$99</span>
                        <p className="text-xs text-gray-500">Luxury choice</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Select Texture */}
              <div className="mb-10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">2. Select Texture</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6 ml-9">Choose the surface finish that matches your style and preferences.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-9">
                  <div 
                    onClick={() => setSelectedTexture('matte')}
                    className={`group p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                      selectedTexture === 'matte' 
                        ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <input 
                        type="radio" 
                        id="texture-matte" 
                        name="card-texture" 
                        value="matte"
                        checked={selectedTexture === 'matte'}
                        onChange={(e) => setSelectedTexture(e.target.value as 'matte' | 'brushed')}
                        className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg">Matte</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Smooth</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-9">Non-reflective finish with elegant sophistication</p>
                  </div>
                  
                  <div 
                    onClick={() => setSelectedTexture('brushed')}
                    className={`group p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                      selectedTexture === 'brushed' 
                        ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <input 
                        type="radio" 
                        id="texture-brushed" 
                        name="card-texture" 
                        value="brushed"
                        checked={selectedTexture === 'brushed'}
                        onChange={(e) => setSelectedTexture(e.target.value as 'matte' | 'brushed')}
                        className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg text-red-600">Metal Brushed</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Premium</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-9">Directional brushed pattern with metallic appeal</p>
                  </div>
                </div>
              </div>

              {/* 3. Select Pattern */}
              <div className="mb-10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">3. Select Pattern</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6 ml-9">Choose a background pattern that reflects your personality.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-9">
                  {[
                    { id: 0, name: 'Minimal', desc: 'Clean & Simple' },
                    { id: 1, name: 'Geometric', desc: 'Modern Lines' },
                    { id: 2, name: 'Abstract', desc: 'Creative Flow' },
                    { id: 3, name: 'Classic', desc: 'Timeless Design' }
                  ].map((pattern) => (
                    <div
                      key={pattern.id}
                      onClick={() => setSelectedPattern(pattern.id)}
                      className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedPattern === pattern.id ? 'scale-105' : ''
                      }`}
                    >
                      <div className={`aspect-square border-3 rounded-xl transition-all duration-300 mb-3 ${
                        selectedPattern === pattern.id
                          ? 'border-red-500 ring-4 ring-red-200 shadow-lg'
                          : 'border-gray-200 hover:border-green-300 shadow-md'
                      }`}>
                        <div className={`w-full h-full rounded-lg flex items-center justify-center ${
                          selectedPattern === pattern.id 
                            ? 'bg-gradient-to-br from-red-50 to-red-100' 
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-green-50 group-hover:to-green-100'
                        }`}>
                          <div className="text-center">
                            <div className={`text-lg font-bold mb-1 ${
                              selectedPattern === pattern.id ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {pattern.id + 1}
                            </div>
                            <div className="text-xs text-gray-500">Pattern</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold text-sm ${
                          selectedPattern === pattern.id ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          {pattern.name}
                        </div>
                        <div className="text-xs text-gray-500">{pattern.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Select Color */}
              <div className="mb-12">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">4. Select Color</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6 ml-9">Choose a color that represents your style and brand.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ml-9">
                  {[
                    { value: 'black', bg: 'bg-gray-800', name: 'Midnight Black', desc: 'Classic & Professional' },
                    { value: 'silver', bg: 'bg-gray-300', name: 'Silver', desc: 'Modern & Sleek' },
                    { value: 'gray', bg: 'bg-gray-500', name: 'Space Gray', desc: 'Sophisticated' },
                    { value: 'gold', bg: 'bg-yellow-500', name: 'Royal Gold', desc: 'Luxury & Premium' }
                  ].map((color) => (
                    <div key={color.value} className="flex flex-col items-center">
                      <div
                        onClick={() => setSelectedColor(color.value as 'black' | 'silver' | 'gray' | 'gold')}
                        className={`group w-16 h-12 ${color.bg} rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-110 hover:shadow-lg mb-3 ${
                          selectedColor === color.value 
                            ? 'ring-4 ring-red-500 ring-offset-2 scale-110 shadow-xl' 
                            : 'ring-2 ring-gray-200 hover:ring-pink-300'
                        }`}
                      ></div>
                      
                      <div className="text-center">
                        <input 
                          type="radio" 
                          id={`color-${color.value}`}
                          name="card-color" 
                          value={color.value}
                          checked={selectedColor === color.value}
                          onChange={(e) => setSelectedColor(e.target.value as 'black' | 'silver' | 'gray' | 'gold')}
                          className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2 mb-2"
                        />
                        <div className={`font-semibold text-sm ${
                          selectedColor === color.value ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          {color.name}
                        </div>
                        <div className="text-xs text-gray-500">{color.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Pricing Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Pricing Summary</h3>
                </div>

                <div className="space-y-4">
                  {/* Base Price */}
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Base Price</span>
                      <div className="text-sm text-gray-600">
                        {selectedBase === 'pvc' && 'PVC Material - Popular Choice'}
                        {selectedBase === 'wood' && 'Wood Material - Eco-Friendly'}
                        {selectedBase === 'steel' && 'Stainless Steel - Luxury'}
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      ${selectedBase === 'pvc' ? '29.00' : selectedBase === 'wood' ? '49.00' : '99.00'}
                    </span>
                  </div>

                  {/* Texture & Pattern */}
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Customization</span>
                      <div className="text-sm text-gray-600">
                        {selectedTexture === 'matte' ? 'Matte Finish' : 'Metal Brushed Finish'} • Pattern {selectedPattern + 1} • {
                          selectedColor === 'black' ? 'Midnight Black' :
                          selectedColor === 'silver' ? 'Silver' :
                          selectedColor === 'gray' ? 'Space Gray' : 'Royal Gold'
                        }
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-green-600">Free</span>
                  </div>

                  {/* Included Services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-100">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-green-800">VAT (5%)</div>
                        <div className="text-xs text-green-600">Included</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-blue-800">Shipping</div>
                        <div className="text-xs text-blue-600">Free in UAE</div>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-2 border-red-200">
                      <div>
                        <span className="text-xl font-bold text-gray-900">Total Price</span>
                        <div className="text-sm text-gray-600">Everything included</div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-red-600">
                          ${selectedBase === 'pvc' ? '29.00' : selectedBase === 'wood' ? '49.00' : '99.00'}
                        </span>
                        <div className="text-sm text-gray-600">One-time payment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}