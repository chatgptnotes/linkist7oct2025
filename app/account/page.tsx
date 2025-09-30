'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, User, Settings, CreditCard, LogOut, Mail, AlertCircle } from 'lucide-react';

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

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // For now, we'll use email from localStorage or prompt user
      // In production, this would come from your auth system
      let userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        // Try to get from any existing order data
        const currentOrder = localStorage.getItem('currentOrder');
        if (currentOrder) {
          const order = JSON.parse(currentOrder);
          userEmail = order.email;
          if (userEmail) {
            localStorage.setItem('userEmail', userEmail);
          }
        }
      }

      if (!userEmail) {
        // No user data found, redirect to home
        router.push('/?auth=required');
        return;
      }

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Linkist NFC
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/nfc/configure" 
                className="text-gray-700 hover:text-gray-900"
              >
                Design Card
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-red-500 rounded-full p-2">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user?.email.split('@')[0]}
                  </h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
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
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Founder Member</span>
                  </div>
                  <p className="text-xs opacity-90 mt-1">
                    1 year free app access included
                  </p>
                </div>
              )}

              {/* Account Stats Summary */}
              {stats && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Account Summary</h3>
                  <div className="space-y-2 text-sm">
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

              <nav className="space-y-2">
                <a href="#orders" className="flex items-center space-x-3 text-black bg-gray-100 rounded-lg px-3 py-2">
                  <Package className="h-4 w-4" />
                  <span>My Orders</span>
                </a>
                <a href="#profile" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2">
                  <Settings className="h-4 w-4" />
                  <span>Profile Settings</span>
                </a>
                <a href="#billing" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Billing</span>
                </a>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-2">
                    <Settings className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Section */}
            <div id="orders" className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="text-gray-600 mt-1">Track your NFC card orders and delivery status</p>
              </div>

              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start by designing your first NFC card</p>
                    <Link
                      href="/nfc/configure"
                      className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                      Design Your Card
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                            <p className="text-gray-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            {order.estimatedDelivery && (
                              <p className="text-sm text-blue-600">
                                Expected: {order.estimatedDelivery}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}