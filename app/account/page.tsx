'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EmailIcon from '@mui/icons-material/Email';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

// Icon aliases
const Package = Inventory2Icon;
const Truck = LocalShippingIcon;
const CheckCircle = CheckCircleIcon;
const Clock = AccessTimeIcon;
const User = PersonIcon;
const Settings = SettingsIcon;
const CreditCard = CreditCardIcon;
const Mail = EmailIcon;
const AlertCircle = ErrorOutlineIcon;
const Edit2 = EditIcon;
const Shield = SecurityIcon;
const Download = CloudDownloadIcon;
const Trash2 = DeleteIcon;
const Save = SaveIcon;
const X = CloseIcon;

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email_verified: boolean;
  mobile_verified: boolean;
  role: 'user' | 'admin';
  created_at: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  email: string;
  cardConfig: any;
  shipping: any;
  pricing: {
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
  };
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: number;
  updatedAt: number;
}

interface AccountStats {
  totalOrders: number;
  totalSpent: number;
  recentOrders: Order[];
  founderMember: boolean;
  joinDate: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'billing'>('orders');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated via API
      const authResponse = await fetch('/api/auth/me');

      if (!authResponse.ok || authResponse.status === 401) {
        // Not authenticated, redirect to login
        router.push('/login?returnUrl=/account');
        return;
      }

      const authData = await authResponse.json();

      if (!authData.isAuthenticated || !authData.user?.email) {
        // Not authenticated, redirect to login
        router.push('/login?returnUrl=/account');
        return;
      }

      const userEmail = authData.user.email;
      console.log('🔍 Loading account data for:', userEmail);

      // Load account data from API
      const response = await fetch(`/api/account?email=${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load account data');
      }

      console.log('✅ Account data loaded:', data.data);

      setUser(data.data.user);
      setOrders(data.data.orders);
      setStats(data.data.stats);

    } catch (error) {
      console.error('Error loading account data:', error);
      setError('Failed to load account information');
      
      // If account data fails, try to show any localStorage order data as fallback
      const currentOrder = localStorage.getItem('currentOrder');
      if (currentOrder) {
        try {
          const order = JSON.parse(currentOrder);
          setOrders([{
            ...order,
            id: 'local-' + Date.now(),
            status: 'confirmed',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }]);
          setUser({
            id: 'local-user',
            email: order.email || 'user@example.com',
            email_verified: false,
            mobile_verified: false,
            role: 'user',
            created_at: new Date().toISOString()
          });
          setError(null); // Clear error if we have fallback data
        } catch (parseError) {
          console.error('Error parsing localStorage order:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'production':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Payment Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'production':
        return 'In Production';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-700';
      case 'production':
        return 'text-blue-700';
      case 'shipped':
        return 'text-purple-700';
      case 'delivered':
        return 'text-green-800';
      case 'cancelled':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Account Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="bg-red-500 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                  <User className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-sm sm:text-base truncate">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.email.split('@')[0]}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email}</p>
                  <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                    {user?.email_verified && (
                      <div className="flex items-center space-x-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>Email Verified</span>
                      </div>
                    )}
                    {user?.mobile_verified && (
                      <div className="flex items-center space-x-1 text-xs text-blue-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>Mobile Verified</span>
                      </div>
                    )}
                  </div>
                  {user && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {stats?.founderMember && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-2.5 sm:p-3 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">Founder Member</span>
                  </div>
                  <p className="text-xs opacity-90 mt-1">
                    1 year free app access included
                  </p>
                </div>
              )}

              {/* Account Stats Summary */}
              {stats && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Account Summary</h3>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-medium">{stats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium">${stats.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">{new Date(stats.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <nav className="space-y-1.5 sm:space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 rounded-lg px-2.5 sm:px-3 py-2 text-sm sm:text-base min-h-[44px] ${
                    activeTab === 'orders' ? 'text-black bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 rounded-lg px-2.5 sm:px-3 py-2 text-sm sm:text-base min-h-[44px] ${
                    activeTab === 'profile' ? 'text-black bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 rounded-lg px-2.5 sm:px-3 py-2 text-sm sm:text-base min-h-[44px] ${
                    activeTab === 'billing' ? 'text-black bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  <span>Billing</span>
                </button>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center space-x-2 sm:space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-2.5 sm:px-3 py-2 text-sm sm:text-base min-h-[44px]">
                    <Settings className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Section */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h1 className="text-xl sm:text-2xl font-bold">My Orders</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Track your NFC card orders and delivery status</p>
                </div>

              <div className="p-4 sm:p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Package className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Start by designing your first NFC card</p>
                    <Link
                      href="/nfc/configure"
                      className="inline-flex items-center bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm sm:text-base min-h-[44px]"
                    >
                      Design Your Card
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg">Order #{order.orderNumber}</h3>
                            <p className="text-sm sm:text-base text-gray-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            {order.estimatedDelivery && (
                              <p className="text-xs sm:text-sm text-blue-600">
                                Expected: {order.estimatedDelivery}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-1.5 sm:space-x-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Card Details</h4>
                            <p className="text-sm text-gray-600">
                              {order.cardConfig?.firstName && order.cardConfig?.lastName
                                ? `${order.cardConfig.firstName} ${order.cardConfig.lastName}`
                                : order.customerName}
                            </p>
                            {order.cardConfig?.title && (
                              <p className="text-sm text-gray-500">{order.cardConfig.title}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              Quantity: {order.cardConfig?.quantity || 1}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Shipping To</h4>
                            <p className="text-sm text-gray-600">
                              {order.shipping?.fullName || order.customerName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shipping?.city}, {order.shipping?.country}
                            </p>
                            {order.trackingNumber && (
                              <p className="text-sm text-blue-600 font-medium">
                                Tracking: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Order Total</h4>
                            <p className="text-lg font-semibold">
                              ${order.pricing?.total.toFixed(2)}
                            </p>
                            <div className="text-sm text-gray-600 mt-1">
                              <div>Subtotal: ${order.pricing?.subtotal.toFixed(2)}</div>
                              {order.pricing?.shipping > 0 && (
                                <div>Shipping: ${order.pricing.shipping.toFixed(2)}</div>
                              )}
                              {order.pricing?.tax > 0 && (
                                <div>Tax: ${order.pricing.tax.toFixed(2)}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">Order Progress</h4>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-700">Confirmed</span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">In Production</span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Shipped</span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Delivered</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            Estimated delivery: 7-10 business days
                          </p>
                          <Link
                            href="/help"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Need Help?
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Profile Settings Section */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h1 className="text-xl sm:text-2xl font-bold">Profile Settings</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your personal information and preferences</p>
                </div>

                <div className="p-4 sm:p-6">
                  <form className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            defaultValue={user?.first_name || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            defaultValue={user?.last_name || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div className="flex items-center">
                            <input
                              type="email"
                              defaultValue={user?.email || ''}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                            {user?.email_verified && (
                              <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            defaultValue={user?.phone_number || ''}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Shield className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                          >
                            Enable
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-600">Update your password regularly for better security</p>
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="h-4 w-4 text-red-600 rounded" />
                          <span className="text-sm text-gray-700">Allow marketing emails</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="h-4 w-4 text-red-600 rounded" defaultChecked />
                          <span className="text-sm text-gray-700">Allow order status notifications</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="h-4 w-4 text-red-600 rounded" />
                          <span className="text-sm text-gray-700">Share usage analytics</span>
                        </label>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                      <div className="space-y-4">
                        <button
                          type="button"
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download My Data</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeTab === 'billing' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h1 className="text-xl sm:text-2xl font-bold">Billing & Payments</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your payment methods and billing information</p>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Payment Methods */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                    <div className="space-y-4">
                      {/* Saved Card */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded px-3 py-1 text-xs font-bold">
                              VISA
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                              <p className="text-sm text-gray-600">Expires 12/2025</p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                Default
                              </span>
                            </div>
                          </div>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                        </div>
                      </div>

                      {/* Add New Card */}
                      <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <CreditCard className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-gray-700">Add Payment Method</span>
                      </button>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                          <input
                            type="text"
                            placeholder="123 Main St"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apartment/Suite</label>
                          <input
                            type="text"
                            placeholder="Apt 4B"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            placeholder="San Francisco"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                          <input
                            type="text"
                            placeholder="CA"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                          <input
                            type="text"
                            placeholder="94102"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Oct 1, 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Premium NFC Card Bundle</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$49.99</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1">
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sep 15, 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Digital Profile Setup</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$24.99</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1">
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Save Billing Info
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}