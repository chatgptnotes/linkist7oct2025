'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';

const Package = Inventory2Icon;
const Truck = LocalShippingIcon;
const CheckCircle = CheckCircleIcon;
const Clock = AccessTimeIcon;
const Info = InfoIcon;

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

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/auth/me');

      if (!authResponse.ok || authResponse.status === 401) {
        router.push('/login?returnUrl=/orders');
        return;
      }

      const authData = await authResponse.json();

      if (!authData.isAuthenticated || !authData.user?.email) {
        router.push('/login?returnUrl=/orders');
        return;
      }

      const email = authData.user.email;
      setUserEmail(email);

      // Load orders from API
      const response = await fetch(`/api/account?email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load orders');
      }

      setOrders(data.data.orders || []);

    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');

      // Try to show localStorage orders as fallback
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
          setError(null);
        } catch (parseError) {
          console.error('Error parsing localStorage order:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; icon: any; text: string } } = {
      confirmed: { color: 'green', icon: CheckCircle, text: 'Confirmed' },
      processing: { color: 'blue', icon: Clock, text: 'Processing' },
      shipped: { color: 'purple', icon: Truck, text: 'Shipped' },
      delivered: { color: 'green', icon: CheckCircle, text: 'Delivered' },
      pending: { color: 'yellow', icon: Clock, text: 'Pending' },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-600 mt-0.5">Track your NFC card orders and delivery status</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/profile-dashboard"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/welcome-to-linkist"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Order New Card
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Return Home
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Get started with your first NFC card!</p>
            <Link
              href="/welcome-to-linkist"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Order Your First Card
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Orders Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    You have {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <Package className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Order Total</p>
                      <p className="text-xl font-bold text-gray-900">${order.pricing.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Subtotal: ${order.pricing.subtotal.toFixed(2)} +
                        Shipping: ${order.pricing.shipping.toFixed(2)}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Shipping To</p>
                      <p className="text-sm font-medium text-gray-900">{order.customerName || 'N/A'}</p>
                      {order.shipping?.address && (
                        <p className="text-xs text-gray-500 mt-1">
                          {order.shipping.address.city}, {order.shipping.address.country}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">
                        {order.trackingNumber ? 'Tracking Number' : 'Estimated Delivery'}
                      </p>
                      {order.trackingNumber ? (
                        <p className="text-sm font-mono font-medium text-gray-900">{order.trackingNumber}</p>
                      ) : order.estimatedDelivery ? (
                        <p className="text-sm font-medium text-gray-900">{order.estimatedDelivery}</p>
                      ) : (
                        <p className="text-sm text-gray-500">To be confirmed</p>
                      )}
                    </div>
                  </div>

                  {/* Tracking Link */}
                  {order.trackingUrl && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>Track your shipment</span>
                      </div>
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Track Order →
                      </a>
                    </div>
                  )}

                  {/* Order Items Info */}
                  {order.cardConfig && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Info className="w-4 h-4" />
                        <span className="font-medium">Order Details</span>
                      </div>
                      <div className="pl-6">
                        <p className="text-sm text-gray-700">
                          NFC Card - {order.cardConfig.cardType || 'Standard'}
                        </p>
                        {order.cardConfig.customization && (
                          <p className="text-xs text-gray-500 mt-1">
                            Customization: {order.cardConfig.customization}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
