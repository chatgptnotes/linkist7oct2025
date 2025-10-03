'use client';

import { useState, useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';

// Icon aliases
const Check = CheckIcon;

// Define types for our configuration
type BaseMaterial = 'pvc' | 'wood' | 'metal';
type TextureOption = 'matte' | 'glossy' | 'brushed' | 'none';
type ColourOption = 'white' | 'black' | 'cherry' | 'birch' | 'silver' | 'rose-gold';

interface ConfiguratorState {
  baseMaterial: BaseMaterial | null;
  texture: TextureOption | null;
  colour: ColourOption | null;
  pattern: number | null;
}

interface PriceConfig {
  pvc: number;
  wood: number;
  metal: number;
}

interface NFCCardConfiguratorProps {
  prices?: PriceConfig;
  patterns?: Array<{ id: number; name: string; image?: string }>;
  onConfigChange?: (config: ConfiguratorState) => void;
}

export default function NFCCardConfigurator({
  prices = { pvc: 29, wood: 49, metal: 99 },
  patterns = [
    { id: 1, name: 'Pattern 1' },
    { id: 2, name: 'Pattern 2' },
    { id: 3, name: 'Pattern 3' }
  ],
  onConfigChange
}: NFCCardConfiguratorProps) {
  const [config, setConfig] = useState<ConfiguratorState>({
    baseMaterial: null,
    texture: null,
    colour: null,
    pattern: null
  });

  // Define dependencies
  const textureOptions: Record<BaseMaterial, TextureOption[]> = {
    pvc: ['matte', 'glossy'],
    wood: ['none'],
    metal: ['matte', 'brushed']
  };

  const colourOptions: Record<BaseMaterial, ColourOption[]> = {
    pvc: ['white', 'black'],
    wood: ['cherry', 'birch'],
    metal: ['black', 'silver', 'rose-gold']
  };

  // All available options for display
  const allTextures: Array<{ value: TextureOption; label: string }> = [
    { value: 'matte', label: 'Matte' },
    { value: 'glossy', label: 'Glossy' },
    { value: 'brushed', label: 'Brushed' },
    { value: 'none', label: 'None' }
  ];

  const allColours: Array<{ value: ColourOption; label: string; hex: string }> = [
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'cherry', label: 'Cherry', hex: '#8B4513' },
    { value: 'birch', label: 'Birch', hex: '#D2B48C' },
    { value: 'silver', label: 'Silver', hex: '#C0C0C0' },
    { value: 'rose-gold', label: 'Rose Gold', hex: '#E8B4B8' }
  ];

  const baseMaterials: Array<{ value: BaseMaterial; label: string; description: string }> = [
    { value: 'pvc', label: 'PVC', description: 'Lightweight and affordable' },
    { value: 'wood', label: 'Wood', description: 'Natural and sustainable' },
    { value: 'metal', label: 'Metal', description: 'Premium and durable' }
  ];

  // Check if an option is available based on current base selection
  const isTextureAvailable = (texture: TextureOption): boolean => {
    if (!config.baseMaterial) return false;
    return textureOptions[config.baseMaterial].includes(texture);
  };

  const isColourAvailable = (colour: ColourOption): boolean => {
    if (!config.baseMaterial) return false;
    return colourOptions[config.baseMaterial].includes(colour);
  };

  // Handle base material change
  const handleBaseMaterialChange = (material: BaseMaterial) => {
    const newConfig: ConfiguratorState = {
      ...config,
      baseMaterial: material,
      // Clear texture if not valid for new base
      texture: config.texture && textureOptions[material].includes(config.texture)
        ? config.texture
        : null,
      // Clear colour if not valid for new base
      colour: config.colour && colourOptions[material].includes(config.colour)
        ? config.colour
        : null
    };
    setConfig(newConfig);
  };

  // Handle other selections
  const handleTextureChange = (texture: TextureOption) => {
    if (isTextureAvailable(texture)) {
      setConfig({ ...config, texture });
    }
  };

  const handleColourChange = (colour: ColourOption) => {
    if (isColourAvailable(colour)) {
      setConfig({ ...config, colour });
    }
  };

  const handlePatternChange = (patternId: number) => {
    setConfig({ ...config, pattern: patternId });
  };

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Base Material Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Base Material</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {baseMaterials.map((material) => (
            <button
              key={material.value}
              onClick={() => handleBaseMaterialChange(material.value)}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${config.baseMaterial === material.value
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{material.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                </div>
                {config.baseMaterial === material.value && (
                  <Check className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-lg font-bold text-gray-900">
                ${prices[material.value]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Texture Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Texture</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allTextures.map((texture) => {
            const isAvailable = isTextureAvailable(texture.value);
            const isSelected = config.texture === texture.value;

            return (
              <button
                key={texture.value}
                onClick={() => handleTextureChange(texture.value)}
                disabled={!isAvailable}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${!isAvailable
                    ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50'
                    : isSelected
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
                  }
                `}
              >
                <div className="flex items-center justify-center">
                  <span className={`text-sm font-medium ${!isAvailable ? 'text-gray-400' : isSelected ? 'text-red-600' : 'text-gray-900'}`}>
                    {texture.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {!config.baseMaterial && (
          <p className="text-sm text-gray-500 italic">Please select a base material first</p>
        )}
      </div>

      {/* Colour Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Colour</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {allColours.map((colour) => {
            const isAvailable = isColourAvailable(colour.value);
            const isSelected = config.colour === colour.value;

            return (
              <button
                key={colour.value}
                onClick={() => handleColourChange(colour.value)}
                disabled={!isAvailable}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${!isAvailable
                    ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50'
                    : isSelected
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      !isAvailable
                        ? 'border-gray-200'
                        : isSelected
                          ? 'border-red-500 scale-110'
                          : 'border-gray-300'
                    }`}
                    style={{
                      backgroundColor: colour.hex,
                      opacity: !isAvailable ? 0.4 : 1
                    }}
                  />
                  <span className={`text-xs font-medium ${!isAvailable ? 'text-gray-400' : isSelected ? 'text-red-600' : 'text-gray-700'}`}>
                    {colour.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {!config.baseMaterial && (
          <p className="text-sm text-gray-500 italic">Please select a base material first</p>
        )}
      </div>

      {/* Pattern Selection - Always Active */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Pattern</h3>
        <div className="grid grid-cols-3 gap-4">
          {patterns.map((pattern) => {
            const isSelected = config.pattern === pattern.id;

            return (
              <button
                key={pattern.id}
                onClick={() => handlePatternChange(pattern.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${isSelected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
              >
                <div className="space-y-2">
                  {pattern.image ? (
                    <img
                      src={pattern.image}
                      alt={pattern.name}
                      className="w-full h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-sm">{pattern.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{pattern.name}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Configuration</h3>
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-gray-600">Base Material:</span>{' '}
            <span className="font-medium text-gray-900">
              {config.baseMaterial ? baseMaterials.find(m => m.value === config.baseMaterial)?.label : 'Not selected'}
            </span>
            {config.baseMaterial && (
              <span className="ml-2 text-green-600">(${prices[config.baseMaterial]})</span>
            )}
          </div>
          <div>
            <span className="text-gray-600">Texture:</span>{' '}
            <span className="font-medium text-gray-900">
              {config.texture ? allTextures.find(t => t.value === config.texture)?.label : 'Not selected'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Colour:</span>{' '}
            <span className="font-medium text-gray-900">
              {config.colour ? allColours.find(c => c.value === config.colour)?.label : 'Not selected'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Pattern:</span>{' '}
            <span className="font-medium text-gray-900">
              {config.pattern ? patterns.find(p => p.id === config.pattern)?.name : 'Not selected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}