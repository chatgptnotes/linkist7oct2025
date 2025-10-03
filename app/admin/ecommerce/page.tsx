'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';

// Icon aliases
const ShoppingCart = ShoppingCartIcon;
const CreditCard = CreditCardIcon;
const TrendingUp = TrendingUpIcon;
const DollarSign = AttachMoneyIcon;
const Package = Inventory2Icon;
const Users = GroupsIcon;
const Calendar = CalendarTodayIcon;
const Filter = FilterListIcon;
const Search = SearchIcon;
const Download = CloudDownloadIcon;
const RefreshCw = RefreshIcon;
const ArrowUpRight = NorthEastIcon;
const ArrowDownRight = SouthEastIcon;

interface EcommerceStats {
  totalSales: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  totalProducts: number;
  activeProducts: number;
  totalCustomers: number;
  returningCustomers: number;
  salesGrowth: number;
  revenueGrowth: number;
}

interface SalesData {
  name: string;
  sales: number;
  revenue: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  category: string;
}

export default function EcommercePage() {
  const [stats, setStats] = useState<EcommerceStats>({
    totalSales: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalCustomers: 0,
    returningCustomers: 0,
    salesGrowth: 0,
    revenueGrowth: 0
  });

  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productData, setProductData] = useState<ProductPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalSales: 1247,
        totalRevenue: 36714,
        avgOrderValue: 29.45,
        conversionRate: 3.2,
        totalProducts: 15,
        activeProducts: 12,
        totalCustomers: 892,
        returningCustomers: 234,
        salesGrowth: 12.5,
        revenueGrowth: 15.3
      });

      setSalesData([
        { name: 'Jan', sales: 120, revenue: 3500 },
        { name: 'Feb', sales: 135, revenue: 3890 },
        { name: 'Mar', sales: 145, revenue: 4200 },
        { name: 'Apr', sales: 160, revenue: 4600 },
        { name: 'May', sales: 175, revenue: 5100 },
        { name: 'Jun', sales: 190, revenue: 5500 },
        { name: 'Jul', sales: 210, revenue: 6200 }
      ]);

      setProductData([
        { name: 'Premium NFC Card', sales: 450, revenue: 13500, category: 'NFC Cards' },
        { name: 'Standard NFC Card', sales: 380, revenue: 7600, category: 'NFC Cards' },
        { name: 'Wooden NFC Card', sales: 220, revenue: 7700, category: 'NFC Cards' },
        { name: 'Metal NFC Card', sales: 197, revenue: 7880, category: 'NFC Cards' }
      ]);

      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const categoryData = [
    { name: 'NFC Cards', value: 85, color: '#3b82f6' },
    { name: 'Accessories', value: 10, color: '#10b981' },
    { name: 'Services', value: 5, color: '#f59e0b' }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">E-commerce Analytics</h1>
            <p className="text-gray-500">Track sales performance and customer behavior</p>
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
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSales.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {stats.salesGrowth >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${stats.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(stats.salesGrowth)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {stats.revenueGrowth >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(stats.revenueGrowth)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
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
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.avgOrderValue}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-500 ml-1">Per transaction</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                    <div className="flex items-center mt-2">
                      <Users className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-500 ml-1">Visitors to buyers</span>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Trend */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Trend */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Performance */}
              <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Product</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Sales</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Revenue</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((product, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center mr-3">
                                <Package className="h-4 w-4 text-gray-500" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-gray-900">{product.sales}</td>
                          <td className="py-3 text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sales by Category */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    <p className="text-xs text-gray-500">{stats.activeProducts} active</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-pink-100 rounded-full">
                    <Users className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    <p className="text-xs text-gray-500">{stats.returningCustomers} returning</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Order Frequency</p>
                    <p className="text-2xl font-bold text-gray-900">2.3</p>
                    <p className="text-xs text-gray-500">orders per customer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-gray-900">+{stats.salesGrowth}%</p>
                    <p className="text-xs text-gray-500">month over month</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}