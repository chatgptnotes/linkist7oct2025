'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Icon aliases
const Shield = SecurityIcon;
const Key = VpnKeyIcon;
const ChevronRight = ChevronRightIcon;
const AlertCircle = ErrorOutlineIcon;
const CheckCircle = CheckCircleIcon;
const ArrowLeft = ArrowBackIcon;

export default function AdminAccessPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if already logged in as admin
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin) {
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.log('Not logged in as admin');
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: '12345678'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: pin
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAccess = () => {
    router.push('/admin');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-login', {
        method: 'DELETE',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      setSuccess(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Admin Login Successful!
          </h2>
          <p className="mt-2 text-gray-600">
            Redirecting to admin dashboard...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Access</h1>
          <p className="mt-2 text-gray-600">
            Multiple ways to access the Linkist admin dashboard
          </p>
        </div>

        {/* Current Status */}
        {isLoggedIn && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-800 font-medium">
                You're already logged in as admin
              </span>
            </div>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={handleDirectAccess}
                className="btn-primary text-sm"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Access Methods */}
        <div className="space-y-6">
          {/* Method 1: Quick Access (Default PIN) */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Access (Default Password)
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  One-click admin login using default credentials
                </p>
                <button
                  onClick={handleQuickLogin}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Quick Admin Login'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Method 2: Custom PIN */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Custom Password Login
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Enter admin password (default: 12345678)
                </p>
                <form onSubmit={handleCustomLogin} className="space-y-3">
                  <div>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter admin password"
                      className="block w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-600 focus:border-red-600"
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !pin}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Login with Password'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Method 3: Direct Access */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Direct Dashboard Access
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Go directly to the admin dashboard (if already logged in)
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                >
                  Open Admin Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Quick URLs */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Access Info:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div><strong>Admin Dashboard:</strong> /admin</div>
            <div><strong>Admin Access Page:</strong> /admin-access</div>
            <div><strong>Admin Email:</strong> admin@gmail.com</div>
            <div><strong>Admin Password:</strong> 12345678</div>
          </div>
        </div>
      </div>
    </div>
  );
}