'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Icon aliases
const ArrowLeft = ArrowBackIcon;
const Download = CloudDownloadIcon;
const Trash2 = DeleteIcon;
const Mail = EmailIcon;
const Shield = SecurityIcon;
const AlertCircle = ErrorOutlineIcon;
const CheckCircle = CheckCircleIcon;

export default function PrivacyManagePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDataExport = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Create data request first
      const requestResponse = await fetch('/api/gdpr/data-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'export',
        }),
      });

      if (!requestResponse.ok) {
        const error = await requestResponse.json();
        throw new Error(error.error || 'Failed to create data export request');
      }

      const requestData = await requestResponse.json();
      
      // Trigger the actual export
      const exportResponse = await fetch('/api/gdpr/export-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          requestId: requestData.request.id,
        }),
      });

      if (!exportResponse.ok) {
        throw new Error('Failed to export data');
      }

      // Download the file
      const blob = await exportResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linkist-data-export-${email.replace('@', '-at-')}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ 
        type: 'success', 
        text: 'Your data has been exported and downloaded successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to export data' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete all your data? This action cannot be undone. All your orders, account information, and preferences will be permanently removed.'
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage(null);

    try {
      // Create data request first
      const requestResponse = await fetch('/api/gdpr/data-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'deletion',
        }),
      });

      if (!requestResponse.ok) {
        const error = await requestResponse.json();
        throw new Error(error.error || 'Failed to create data deletion request');
      }

      const requestData = await requestResponse.json();
      
      // Trigger the actual deletion
      const deleteResponse = await fetch('/api/gdpr/delete-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          requestId: requestData.request.id,
          confirmDeletion: true,
        }),
      });

      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        throw new Error(error.error || 'Failed to delete data');
      }

      setMessage({ 
        type: 'success', 
        text: 'All your data has been permanently deleted from our systems.' 
      });
      setEmail(''); // Clear the email field
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to delete data' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConsentUpdate = async (purposes: { analytics: boolean; marketing: boolean }) => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/gdpr/consent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          purposes,
          consentGiven: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update consent preferences');
      }

      setMessage({ 
        type: 'success', 
        text: 'Your privacy preferences have been updated successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update preferences' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/privacy"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Privacy Policy
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Management</h1>
          </div>
          
          <p className="text-gray-600">
            Manage your privacy settings and exercise your data rights under GDPR.
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Email Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Email Address</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter the email address associated with your Linkist account to manage your privacy settings.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Data Export */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Export Your Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Download a complete copy of all personal data we have stored about you, 
              including orders, preferences, and account information.
            </p>
            
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <p>• Order history and shipping information</p>
              <p>• Account preferences and settings</p>
              <p>• Communication history</p>
              <p>• Privacy consent records</p>
            </div>
            
            <button
              onClick={handleDataExport}
              disabled={loading || !email}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Exporting...' : 'Export My Data'}
            </button>
          </div>

          {/* Data Deletion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Delete Your Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Permanently delete all your personal data from our systems. 
              This action cannot be undone.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Warning: This action is irreversible</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All order history will be deleted</li>
                    <li>Account preferences will be removed</li>
                    <li>You will not receive order updates</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDataDeletion}
              disabled={loading || !email}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {loading ? 'Deleting...' : 'Delete My Data'}
            </button>
          </div>
        </div>

        {/* Consent Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Privacy Preferences</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Control how your data is used for analytics and marketing purposes.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Essential Cookies</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Required for website functionality and order processing. Cannot be disabled.
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">Always On</span>
                <div className="w-12 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Help us understand website usage and improve our services.
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleConsentUpdate({ analytics: true, marketing: false })}
                  disabled={loading || !email}
                  className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded disabled:opacity-50"
                >
                  Allow
                </button>
                <button
                  onClick={() => handleConsentUpdate({ analytics: false, marketing: false })}
                  disabled={loading || !email}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  Deny
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Marketing Communications</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Receive promotional emails about new products and special offers.
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleConsentUpdate({ analytics: false, marketing: true })}
                  disabled={loading || !email}
                  className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded disabled:opacity-50"
                >
                  Allow
                </button>
                <button
                  onClick={() => handleConsentUpdate({ analytics: false, marketing: false })}
                  disabled={loading || !email}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-900">Need Help?</h2>
          </div>
          
          <p className="text-blue-800 mb-4">
            If you have questions about your privacy or need assistance with your data rights, 
            please contact our Data Protection Officer.
          </p>
          
          <div className="space-y-2 text-blue-800">
            <p><strong>Email:</strong> privacy@linkist.ai</p>
            <p><strong>Data Protection Officer:</strong> dpo@linkist.ai</p>
            <p><strong>Response Time:</strong> Within 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}