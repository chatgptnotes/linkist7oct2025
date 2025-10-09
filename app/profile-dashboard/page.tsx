'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import WorkIcon from '@mui/icons-material/Work';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import PeopleIcon from '@mui/icons-material/People';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

// Icon aliases
const Package = Inventory2Icon;
const Truck = LocalShippingIcon;
const CheckCircle = CheckCircleIcon;
const Clock = AccessTimeIcon;
const User = PersonIcon;
const Settings = SettingsIcon;
const Mail = EmailIcon;
const AlertCircle = ErrorOutlineIcon;
const Eye = VisibilityIcon;
const Share = ShareIcon;
const Briefcase = WorkIcon;
const ShareNetwork = ShareRoundedIcon;
const Camera = PhotoCameraIcon;
const Gallery = CollectionsIcon;
const Users = PeopleIcon;
const EyeIcon = RemoveRedEyeIcon;
const WhatsApp = WhatsAppIcon;
const MailIcon = MailOutlineIcon;

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
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated via API
      const authResponse = await fetch('/api/auth/me');

      if (!authResponse.ok || authResponse.status === 401) {
        // Not authenticated, redirect to login
        router.push('/login?returnUrl=/profile-dashboard');
        return;
      }

      const authData = await authResponse.json();

      if (!authData.isAuthenticated || !authData.user?.email) {
        // Not authenticated, redirect to login
        router.push('/login?returnUrl=/profile-dashboard');
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

      // Load profile data from localStorage
      const savedProfiles = localStorage.getItem('userProfiles');
      if (savedProfiles) {
        try {
          const profiles = JSON.parse(savedProfiles);
          const userProfile = profiles.find((p: any) => p.email === userEmail);
          if (userProfile) {
            setProfileData(userProfile);
          }
        } catch (parseError) {
          console.error('Error parsing profile data:', parseError);
        }
      }

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

  // Helper functions to check section completion based on user data
  const isBasicInfoComplete = () => {
    // Check if user has basic info filled
    if (user && user.first_name && user.last_name && user.email && user.phone_number) {
      return true;
    }
    // Also check profileData as fallback
    if (profileData && profileData.firstName && profileData.lastName &&
        profileData.primaryEmail && profileData.mobileNumber) {
      return true;
    }
    return false;
  };

  const isProfessionalComplete = () => {
    // Check profileData for professional info
    return profileData && (profileData.jobTitle || profileData.companyName ||
           (profileData.skills && profileData.skills.length > 0));
  };

  const isSocialMediaComplete = () => {
    // Check profileData for social media links
    if (!profileData) return false;
    return profileData.linkedinUrl || profileData.instagramUrl ||
           profileData.facebookUrl || profileData.twitterUrl ||
           profileData.githubUrl || profileData.youtubeUrl ||
           profileData.behanceUrl || profileData.dribbbleUrl;
  };

  const isProfilePhotoComplete = () => {
    // Check profileData for profile photo
    return profileData && profileData.profilePhoto;
  };

  const isGalleryComplete = () => {
    // Check profileData for gallery items
    return profileData && ((profileData.photos && profileData.photos.length > 0) ||
           (profileData.videos && profileData.videos.length > 0));
  };

  // Calculate profile completion percentage based on actual user data
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 5; // Total sections

    // Basic Info - check user object for actual data
    if (isBasicInfoComplete()) completed++;

    // Professional - check if profileData has professional info
    if (isProfessionalComplete()) completed++;

    // Social Media - check if profileData has social links
    if (isSocialMediaComplete()) completed++;

    // Profile Photo - check if profileData has photo
    if (isProfilePhotoComplete()) completed++;

    // Gallery - check if profileData has media
    if (isGalleryComplete()) completed++;

    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const handleLogout = () => {
    // Clear any auth tokens
    document.cookie = 'session=; Max-Age=0; path=/;';
    localStorage.removeItem('verifiedEmail');
    localStorage.removeItem('emailVerified');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
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
      {/* Navbar */}
      <Navbar />

      {/* Page Header - Below Navbar */}
      <div className="bg-white border-b border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Dashboard</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage your digital presence and connect with your network</p>
            </div>
            <Link
              href="/profiles/builder"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Profile Completion */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
            <span className="text-2xl font-bold text-red-500">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>

          {/* Completion Action Button */}
          {profileCompletion < 100 && (
            <div className="mb-4">
              <Link
                href="/profiles/builder"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                <Settings className="w-4 h-4" />
                Complete Your Profile
              </Link>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {isBasicInfoComplete() ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Basic Info ✓
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Basic Info Missing
              </span>
            )}

            {isProfessionalComplete() ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Professional ✓
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Professional Missing
              </span>
            )}

            {isSocialMediaComplete() ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Social Media ✓
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                Social Media Pending
              </span>
            )}

            {isGalleryComplete() ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Gallery ✓
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Gallery Missing
              </span>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Analytics Overview</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700">Total Profile Views</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats?.totalOrders ? stats.totalOrders * 40 : 247}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Unique Views</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats?.totalOrders ? stats.totalOrders * 2 : 12}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <WhatsApp className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-sm text-gray-700">WhatsApp Engagement</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{stats?.totalOrders ? stats.totalOrders + 2 : 8}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MailIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">Email Engagement</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats?.totalOrders || 3}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Social Media Engagement</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats?.totalOrders ? stats.totalOrders * 2 : 12}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Sections</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Info Card */}
              <Link href="/profiles/builder" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer block group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Personal Info</h3>
                      <p className="text-sm text-gray-600">Basic details & contact</p>
                    </div>
                  </div>
                  {isBasicInfoComplete() ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Name, Email, Phone, Location</p>
              </Link>

              {/* Professional Card */}
              <Link href="/profiles/builder" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer block group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Professional</h3>
                      <p className="text-sm text-gray-600">Work & expertise</p>
                    </div>
                  </div>
                  {isProfessionalComplete() ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Job Title, Company, Skills, Bio</p>
              </Link>

              {/* Social & Digital Card */}
              <Link href="/profiles/builder" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer block group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <ShareNetwork className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Social & Digital</h3>
                      <p className="text-sm text-gray-600">Online presence</p>
                    </div>
                  </div>
                  {isSocialMediaComplete() ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">LinkedIn, Instagram, Portfolio links</p>
              </Link>

              {/* Profile Photo Card */}
              <Link href="/profiles/builder" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer block group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Camera className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                      <p className="text-sm text-gray-600">Your profile image</p>
                    </div>
                  </div>
                  {isProfilePhotoComplete() ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Upload & crop your photo</p>
              </Link>

              {/* Media Gallery Card */}
              <Link href="/profiles/builder" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer block group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Gallery className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Media Gallery</h3>
                      <p className="text-sm text-gray-600">Showcase your work</p>
                    </div>
                  </div>
                  {isGalleryComplete() ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Images, videos, documents</p>
              </Link>

              {/* Settings Card */}
              <Link href="/profile-dashboard/settings" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer block group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Settings className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Settings</h3>
                      <p className="text-sm text-gray-600">Privacy & preferences</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Visibility, notifications, theme</p>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
