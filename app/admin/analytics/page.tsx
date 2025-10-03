'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// Icon aliases
const TrendingUp = TrendingUpIcon;
const Users = GroupsIcon;
const Package = Inventory2Icon;
const DollarSign = AttachMoneyIcon;
const Calendar = CalendarTodayIcon;
const Download = CloudDownloadIcon;
const Filter = FilterListIcon;
const RefreshCw = RefreshIcon;
const ArrowUpRight = NorthEastIcon;
const ArrowDownRight = SouthEastIcon;
const BarChart = BarChartIcon;
const PieChart = PieChartIcon;
const Eye = VisibilityIcon;
const Target = GpsFixedIcon;

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: Array<{ month: string; revenue: number; orders: number }>;
  };
  orders: {
    total: number;
    growth: number;
    byStatus: Record<string, number>;
    trends: Array<{ date: string; orders: number }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retention: number;
    ltv: number;
  };
  products: {
    topPerforming: Array<{ name: string; sales: number; revenue: number }>;
    categories: Array<{ name: string; value: number }>;
  };
  geographic: Array<{ country: string; orders: number; revenue: number }>;
  conversion: {
    rate: number;
    funnel: Array<{ stage: string; count: number; rate: number }>;
  };
}

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  production: '#8b5cf6',
  shipped: '#f97316',
  delivered: '#10b981',
  cancelled: '#ef4444'
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!data) return;
    
    const report = {
      generatedAt: new Date().toISOString(),
      dateRange,
      summary: {
        totalRevenue: data.revenue.total,
        totalOrders: data.orders.total,
        totalCustomers: data.customers.total,
        conversionRate: data.conversion.rate
      },
      detailed: data
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading analytics...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <BarChart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
            <p className="mt-1 text-sm text-gray-500">Analytics data will appear here once you have orders.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const orderStatusData = Object.entries(data.orders.byStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: statusColors[name as keyof typeof statusColors] || '#6b7280'
  }));

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-500">Track your business performance and growth metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center space-x-2 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${data.revenue.total.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {data.revenue.growth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${data.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.revenue.growth)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs previous period</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{data.orders.total.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {data.orders.growth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${data.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.orders.growth)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs previous period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{data.customers.total.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500 ml-1">{data.customers.new} new this period</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.conversion.rate.toFixed(1)}%</p>
                <div className="flex items-center mt-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-500 ml-1">Average order rate</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Orders Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenue.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.revenue.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <div className="flex">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-32 space-y-2">
                {orderStatusData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-500">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
            <div className="space-y-4">
              {data.products.topPerforming.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${product.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.customers.new}</div>
                <div className="text-sm text-gray-600">New Customers</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.customers.returning}</div>
                <div className="text-sm text-gray-600">Returning Customers</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.customers.retention.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Retention Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">${data.customers.ltv.toFixed(0)}</div>
                <div className="text-sm text-gray-600">Avg. LTV</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <div className="space-y-3">
              {data.geographic.slice(0, 6).map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 rounded mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">{location.country}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{location.orders} orders</span>
                    <span className="text-sm font-medium text-gray-900">${location.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {data.conversion.funnel.map((stage, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-900">{stage.stage}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-red-700 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${stage.rate}%` }}
                    >
                      {stage.rate.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-500 text-right">{stage.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}