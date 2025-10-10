'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import { Voucher, CreateVoucherRequest, VoucherStats } from '@/types/voucher';

// Icon aliases
const Search = SearchIcon;
const Filter = FilterListIcon;
const Plus = AddIcon;
const Edit = EditIcon;
const Trash = DeleteIcon;
const Copy = ContentCopyIcon;
const CheckCircle = CheckCircleIcon;
const XCircle = CancelIcon;
const RefreshCw = RefreshIcon;
const Ticket = ConfirmationNumberIcon;
const TrendingUp = TrendingUpIcon;
const Tag = LocalOfferIcon;
const X = CloseIcon;

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [stats, setStats] = useState<VoucherStats>({
    total_vouchers: 0,
    active_vouchers: 0,
    total_usage: 0,
    total_discount_given: 0,
    expiring_soon: 0
  });

  // Quick add state
  const [quickAddCode, setQuickAddCode] = useState('');
  const [quickAddDiscount, setQuickAddDiscount] = useState('10');
  const [quickAddType, setQuickAddType] = useState<'percentage' | 'fixed'>('percentage');

  // Form state
  const [formData, setFormData] = useState<CreateVoucherRequest>({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_value: 0,
    max_discount_amount: undefined,
    usage_limit: undefined,
    user_limit: 1,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: undefined,
    is_active: true
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/vouchers');
      if (response.ok) {
        const data = await response.json();
        setVouchers(data.vouchers || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingVoucher
        ? `/api/admin/vouchers`
        : '/api/admin/vouchers';

      const method = editingVoucher ? 'PUT' : 'POST';

      const payload = editingVoucher
        ? { ...formData, id: editingVoucher.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(editingVoucher ? 'Voucher updated successfully!' : 'Voucher created successfully!');
        setShowModal(false);
        resetForm();
        fetchVouchers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save voucher');
      }
    } catch (error) {
      console.error('Error saving voucher:', error);
      alert('Failed to save voucher');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return;

    try {
      const response = await fetch(`/api/admin/vouchers`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        alert('Voucher deleted successfully!');
        fetchVouchers();
      } else {
        alert('Failed to delete voucher');
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
      alert('Failed to delete voucher');
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      description: voucher.description || '',
      discount_type: voucher.discount_type,
      discount_value: voucher.discount_value,
      min_order_value: voucher.min_order_value,
      max_discount_amount: voucher.max_discount_amount || undefined,
      usage_limit: voucher.usage_limit || undefined,
      user_limit: voucher.user_limit,
      valid_from: voucher.valid_from.split('T')[0],
      valid_until: voucher.valid_until ? voucher.valid_until.split('T')[0] : undefined,
      is_active: voucher.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingVoucher(null);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_value: 0,
      max_discount_amount: undefined,
      usage_limit: undefined,
      user_limit: 1,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: undefined,
      is_active: true
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Voucher code "${code}" copied to clipboard!`);
  };

  const generateCode = () => {
    const code = 'VC' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData({ ...formData, code });
  };

  const handleQuickAdd = async () => {
    if (!quickAddCode.trim()) {
      alert('Please enter a voucher code');
      return;
    }

    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: quickAddCode.toUpperCase(),
          discount_type: quickAddType,
          discount_value: parseFloat(quickAddDiscount),
          is_active: true
        })
      });

      if (response.ok) {
        alert('Voucher added successfully!');
        setQuickAddCode('');
        setQuickAddDiscount('10');
        setQuickAddType('percentage');
        fetchVouchers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add voucher');
      }
    } catch (error) {
      console.error('Error adding voucher:', error);
      alert('Failed to add voucher');
    }
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const isExpiringSoon = (validUntil: string | null) => {
    if (!validUntil) return false;
    const daysUntilExpiry = Math.ceil((new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (voucher.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && voucher.is_active && !isExpired(voucher.valid_until)) ||
      (statusFilter === 'inactive' && !voucher.is_active) ||
      (statusFilter === 'expired' && isExpired(voucher.valid_until));

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Voucher Management</h1>
          <p className="text-gray-600">Create and manage discount vouchers and promotional codes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vouchers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_vouchers}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active_vouchers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_usage}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Discount Given</p>
                <p className="text-2xl font-bold text-gray-900">${stats.total_discount_given.toFixed(2)}</p>
              </div>
              <Tag className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.expiring_soon}</p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vouchers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 appearance-none bg-white min-w-40"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={fetchVouchers}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vouchers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Quick Add Row */}
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-300">
                  <td className="px-6 py-4" colSpan={6}>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border-2 border-blue-300 flex-1 max-w-2xl">
                        <Tag className="h-5 w-5 text-blue-600" />
                        <input
                          type="text"
                          value={quickAddCode}
                          onChange={(e) => setQuickAddCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
                          placeholder="Voucher Code (e.g., SAVE20)"
                          className="flex-1 outline-none font-mono font-semibold text-gray-900 placeholder-gray-400"
                        />
                        <div className="flex items-center space-x-1 border-l pl-2">
                          <input
                            type="number"
                            value={quickAddDiscount}
                            onChange={(e) => setQuickAddDiscount(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
                            placeholder="10"
                            className="w-16 outline-none text-center font-semibold text-gray-900"
                          />
                          <select
                            value={quickAddType}
                            onChange={(e) => setQuickAddType(e.target.value as 'percentage' | 'fixed')}
                            className="outline-none font-semibold text-gray-700 cursor-pointer bg-transparent"
                          >
                            <option value="percentage">%</option>
                            <option value="fixed">$</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={handleQuickAdd}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Voucher</span>
                      </button>
                    </div>
                    <p className="text-xs text-blue-700 mt-2 ml-1">
                      💡 Quick add voucher with default settings • Press Enter or click button
                    </p>
                  </td>
                </tr>

                {filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gray-900">{voucher.code}</span>
                        <button
                          onClick={() => copyToClipboard(voucher.code)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy code"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      {voucher.description && (
                        <p className="text-sm text-gray-500 mt-1">{voucher.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {voucher.discount_type === 'percentage'
                            ? `${voucher.discount_value}%`
                            : `$${voucher.discount_value}`
                          }
                        </p>
                        {voucher.min_order_value > 0 && (
                          <p className="text-gray-500">Min: ${voucher.min_order_value}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {voucher.used_count} / {voucher.usage_limit || '∞'}
                        </p>
                        <p className="text-gray-500">Per user: {voucher.user_limit}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {voucher.valid_until ? (
                        <div>
                          <p className={`font-medium ${isExpired(voucher.valid_until) ? 'text-red-600' : 'text-gray-900'}`}>
                            {new Date(voucher.valid_until).toLocaleDateString()}
                          </p>
                          {isExpiringSoon(voucher.valid_until) && !isExpired(voucher.valid_until) && (
                            <p className="text-yellow-600 text-xs">Expiring soon!</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isExpired(voucher.valid_until) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Expired
                        </span>
                      ) : voucher.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(voucher)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVouchers.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vouchers found</h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter.'
                    : 'Create your first voucher to get started.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voucher Code *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 font-mono"
                    placeholder="WELCOME20"
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Welcome discount for new customers"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                  />
                </div>
              </div>

              {/* Min Order Value & Max Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Order Value ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.min_order_value}
                    onChange={(e) => setFormData({ ...formData, min_order_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.max_discount_amount || ''}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usage_limit || ''}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Per User Limit *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.user_limit}
                    onChange={(e) => setFormData({ ...formData, user_limit: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until || ''}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value || undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="No expiry"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Voucher is active
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingVoucher ? 'Update Voucher' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
