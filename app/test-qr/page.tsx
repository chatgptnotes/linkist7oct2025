'use client';

import { useState } from 'react';

export default function TestQRPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testQRGeneration = async () => {
    setLoading(true);
    setError(null);
    
    const testData = {
      fullName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      title: 'CEO',
      company: 'Test Company',
      mobile: '+91 9876543210',
      email: 'test@example.com',
      website: 'https://example.com',
      profileImage: null,
      backgroundImage: null,
      quantity: 1,
      status: 'pending'
    };

    try {
      console.log('🧪 Testing QR code generation...');
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardData: testData }),
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ QR code data:', data);
        setQrCodeUrl(data.qrCodeDataUrl);
      } else {
        const errorData = await response.json();
        console.error('❌ Error:', errorData);
        setError(errorData.error || 'Failed to generate QR code');
      }
    } catch (err) {
      console.error('💥 Exception:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Code Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test QR Code Generation</h2>
          
          <button
            onClick={testQRGeneration}
            disabled={loading}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Test QR Code'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {qrCodeUrl && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Generated QR Code</h2>
            <div className="flex flex-col items-center">
              <img 
                src={qrCodeUrl} 
                alt="Test QR Code" 
                className="border border-gray-300 rounded"
                onLoad={() => console.log('🖼️ QR code image loaded')}
                onError={(e) => console.error('❌ QR code image failed to load:', e)}
              />
              <p className="mt-4 text-sm text-gray-600">
                QR Code generated successfully! Check browser console for details.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Generate Test QR Code" button</li>
            <li>Check browser console (F12) for detailed logs</li>
            <li>If QR code appears, the API is working correctly</li>
            <li>If it fails, check console for error details</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
