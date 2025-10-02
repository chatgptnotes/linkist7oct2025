'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

interface StepData {
  firstName: string;
  lastName: string;
  baseMaterial: 'pvc' | 'wood' | 'stainless_steel';
  texture: 'matte' | 'metal_brushed';
  pattern: number;
  color: 'black' | 'silver' | 'gold';
}

export default function ConfigureNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<StepData>({
    firstName: '',
    lastName: '',
    baseMaterial: 'stainless_steel',
    texture: 'metal_brushed',
    pattern: 0,
    color: 'black'
  });

  // Clear any existing corrupted data on component mount
  useEffect(() => {
    // Clear old config data to prevent corruption
    localStorage.removeItem('nfcConfig');
    localStorage.removeItem('cardConfig');
    console.log('Configure: Cleared old localStorage data');
  }, []);

  const steps = [
    { number: 1, title: 'Personalize Your Name', completed: false },
    { number: 2, title: 'Select Base Material', completed: false },
    { number: 3, title: 'Choose Design', completed: false }
  ];

  const materials = [
    { id: 'pvc', name: 'PVC', price: 29, description: 'Lightweight, durable and cost-effective' },
    { id: 'wood', name: 'Wood', price: 49, description: 'Natural texture with sustainable appeal' },
    { id: 'stainless_steel', name: 'Stainless Steel', price: 99, description: 'Premium metal finish with ultimate durability', selected: true }
  ];

  const textures = [
    { id: 'matte', name: 'Matte', description: 'Soft anti-reflective finish with elegant sophistication' },
    { id: 'metal_brushed', name: 'Metal Brushed Steel', description: 'Directional brushed pattern with metallic appeal', selected: true }
  ];

  const colors = [
    { id: 'black', name: 'Black', color: '#000000', hex: '#000000', gradient: 'from-black to-gray-900' },
    { id: 'silver', name: 'Silver', color: '#BFC5CC', hex: '#BFC5CC–#D0D5DB', gradient: 'from-slate-300 to-slate-500' },
    { id: 'gold', name: 'Gold', color: '#FFD700', hex: '#FFD700', gradient: 'from-yellow-400 to-amber-500' }
  ];

  const patterns = [
    { id: 0, name: 'Pattern 1' },
    { id: 1, name: 'Pattern 2' },
    { id: 2, name: 'Pattern 3' },
    { id: 3, name: 'Pattern 4' }
  ];

  const getPrice = () => {
    const basePrices = { pvc: 29, wood: 49, stainless_steel: 99 };
    return basePrices[formData.baseMaterial];
  };

  const getCardGradient = () => {
    const selectedColor = colors.find(c => c.id === formData.color);
    console.log('Selected color:', formData.color, 'Gradient:', selectedColor?.gradient);
    return selectedColor?.gradient || 'from-black to-gray-900';
  };

  const handleContinue = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('Please enter both first and last name');
      return;
    }
    
    // Create clean data object for storage
    const configData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      baseMaterial: formData.baseMaterial,
      texture: formData.texture,
      pattern: formData.pattern,
      color: formData.color
    };
    
    console.log('Configure: Saving data to localStorage:', configData);
    
    // Save to localStorage and redirect to checkout
    localStorage.setItem('nfcConfig', JSON.stringify(configData));
    
    // Verify the data was saved correctly
    const savedData = localStorage.getItem('nfcConfig');
    console.log('Configure: Verified saved data:', savedData);
    
    router.push('/nfc/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Configure Your NFC Card</h1>
          <p className="text-gray-600">Personalize every aspect of your business card</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section - Second on All Screens */}
          <div className="space-y-8 order-2">

            {/* Step 1: Personalize Name */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Personalize Your Name</h2>
                <p className="text-gray-600 mb-8">
                  Enter your name as you'd like it to appear on your card. It will be automatically formatted.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Jane"
                      value={formData.firstName}
                      onChange={(e) => {
                        const newFormData = {...formData, firstName: e.target.value};
                        setFormData(newFormData);
                        console.log('First name updated:', newFormData);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {formData.firstName.length} / 15
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Doe"
                      value={formData.lastName}
                      onChange={(e) => {
                        const newFormData = {...formData, lastName: e.target.value};
                        setFormData(newFormData);
                        console.log('Last name updated:', newFormData);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {formData.lastName.length} / 15
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Select Base Material */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Base Material</h2>
                <p className="text-gray-600 mb-8">Each material offers a unique feel and finish.</p>

                <div className="space-y-4">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      onClick={() => setFormData({...formData, baseMaterial: material.id as any})}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.baseMaterial === material.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{material.name}</h3>
                          <p className="text-sm text-gray-600">{material.description}</p>
                        </div>
                        <div className="text-xl font-bold text-gray-900">${material.price}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Texture</h3>
                  <div className="space-y-4">
                    {textures.map((texture) => (
                      <div
                        key={texture.id}
                        onClick={() => setFormData({...formData, texture: texture.id as any})}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.texture === texture.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900">{texture.name}</h4>
                        <p className="text-sm text-gray-600">{texture.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Choose Design */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Design</h2>
                <p className="text-gray-600 mb-8">Select pattern and color for your card's background.</p>

                <div className="space-y-8">
                  {/* Pattern Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Pattern</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {patterns.map((pattern) => (
                        <div
                          key={pattern.id}
                          onClick={() => setFormData({...formData, pattern: pattern.id})}
                          className={`aspect-square border-2 rounded-lg cursor-pointer flex items-center justify-center ${
                            formData.pattern === pattern.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Color</h3>
                    <div className="flex space-x-4">
                      {colors.map((color) => (
                        <div
                          key={color.id}
                          onClick={() => setFormData({...formData, color: color.id as any})}
                          className={`flex flex-col items-center cursor-pointer transition-all ${
                            formData.color === color.id ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-80'
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full border-4 transition-all ${
                              formData.color === color.id ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color.color }}
                          ></div>
                          <div className="text-center mt-2">
                            <span className="text-sm text-gray-600 block">{color.name}</span>
                            <span className="text-xs text-gray-500">{color.hex}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center pt-8">
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Continue to Checkout
              </button>
            </div>
          </div>

          {/* Preview & Pricing Section - First on All Screens */}
          <div className="space-y-8 order-1">
            {/* Card Preview */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mb-2">
                  Debug: {formData.firstName} {formData.lastName} → {(formData.firstName?.substring(0, 1) || 'B').toUpperCase()}{(formData.lastName?.substring(0, 1) || 'T').toUpperCase()}
                </div>
              )}
              
              {/* Front Card */}
              <div className="space-y-4">
                <div className={`w-full aspect-[1.6/1] bg-gradient-to-br ${getCardGradient()} rounded-xl relative overflow-hidden shadow-lg`}>
                  {/* AI Logo top right */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gray-600 bg-opacity-70 rounded-lg px-2 py-1 text-white text-xs font-semibold">
                      AI
                    </div>
                  </div>
                  
                  {/* User Initials or Name */}
                  <div className="absolute bottom-6 left-6">
                    {(() => {
                      const firstName = formData.firstName?.trim() || '';
                      const lastName = formData.lastName?.trim() || '';

                      // Check if both are single characters (initials only)
                      const isSingleCharOnly = firstName.length <= 1 && lastName.length <= 1;

                      if (isSingleCharOnly) {
                        // Show only initials (large)
                        return (
                          <div className="text-white text-2xl font-light">
                            {(firstName || 'B').toUpperCase()}{(lastName || 'K').toUpperCase()}
                          </div>
                        );
                      } else {
                        // Show full name
                        return (
                          <div className="text-white text-base font-medium">
                            {firstName} {lastName}
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600">Front</div>
              </div>

              {/* Back Card */}
              <div className="space-y-4 mt-6">
                <div className={`w-full aspect-[1.6/1] bg-gradient-to-br ${getCardGradient()} rounded-xl relative overflow-hidden shadow-lg`}>
                  {/* Linkist Logo Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">L</span>
                      </div>
                      <span className="text-white text-xl font-semibold">Linkist</span>
                    </div>
                    <div className="text-gray-400 text-sm font-medium">FOUNDING MEMBER</div>
                  </div>
                  
                  {/* NFC Symbol bottom right */}
                  <div className="absolute bottom-4 right-4">
                    <div className="text-white text-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 7v10m12-10v10M9 9h6m-6 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M3 12h2m14 0h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600">Back</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary - Bottom of Page */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price (Premium Card)</span>
                  <span className="font-medium">${getPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT (@5%)</span>
                  <span className="font-medium">included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping (Within UAE)</span>
                  <span className="font-medium">included</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total Price</span>
                    <span className="text-lg font-bold text-red-500">${getPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}