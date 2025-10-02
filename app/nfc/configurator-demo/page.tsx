'use client';

import { useState } from 'react';
import NFCCardConfigurator from '@/components/NFCCardConfigurator';

export default function ConfiguratorDemoPage() {
  const [configuration, setConfiguration] = useState<any>(null);

  // Mock admin-configured prices
  const adminPrices = {
    pvc: 29,
    wood: 49,
    metal: 99
  };

  // Mock admin-configured patterns
  const adminPatterns = [
    { id: 1, name: 'Geometric', image: '/patterns/geometric.png' },
    { id: 2, name: 'Minimalist', image: '/patterns/minimalist.png' },
    { id: 3, name: 'Abstract', image: '/patterns/abstract.png' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            NFC Card Configurator Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configure your NFC card with material, texture, colour, and pattern options.
            The configurator enforces dependencies between options automatically.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <NFCCardConfigurator
            prices={adminPrices}
            patterns={adminPatterns}
            onConfigChange={(config) => {
              setConfiguration(config);
              console.log('Configuration updated:', config);
            }}
          />
        </div>

        {/* Debug output for development */}
        {configuration && (
          <div className="mt-8 bg-gray-900 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Configuration Output (Debug)</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(configuration, null, 2)}
            </pre>
          </div>
        )}

        {/* Feature Explanation */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Dynamic Dependencies</h3>
            <p className="text-sm text-gray-600">
              Texture and colour options automatically adjust based on the selected base material.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Disabled States</h3>
            <p className="text-sm text-gray-600">
              Unavailable options remain visible but are greyed out and non-interactive.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Smart Clearing</h3>
            <p className="text-sm text-gray-600">
              Invalid selections are automatically cleared when the base material changes.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Admin Control</h3>
            <p className="text-sm text-gray-600">
              Prices and patterns can be configured through the admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}