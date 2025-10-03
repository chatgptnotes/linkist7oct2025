'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import QrCodeIcon from '@mui/icons-material/QrCode';

// Icon aliases
const User = PersonIcon;
const Mail = EmailIcon;
const Phone = PhoneIcon;
const Globe = LanguageIcon;
const Linkedin = LinkedInIcon;
const Twitter = XIcon;
const Instagram = InstagramIcon;
const Facebook = FacebookIcon;
const Youtube = YouTubeIcon;
const Github = GitHubIcon;
const MapPin = LocationOnIcon;
const Briefcase = WorkIcon;
const Building = BusinessIcon;
const Calendar = CalendarTodayIcon;
const Save = SaveIcon;
const ArrowRight = ArrowForwardIcon;
const Upload = CloudUploadIcon;
const X = CloseIcon;
const Check = CheckIcon;
const Plus = AddIcon;
const Trash2 = DeleteIcon;
const Eye = VisibilityIcon;
const Copy = ContentCopyIcon;
const Share2 = ShareIcon;
const QrCode = QrCodeIcon;

interface SocialLink {
  platform: string;
  url: string;
  icon: any;
}

export default function DigitalProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'social' | 'preview'>('personal');

  // Form data
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    profileImage: '',
    bio: '',

    // Professional Information
    jobTitle: '',
    company: '',
    department: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',

    // Social Links
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    youtube: '',
    github: '',
    customLink1: '',
    customLink2: '',
  });

  const [profileUrl, setProfileUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate profile URL
    const baseUrl = window.location.origin;
    const userId = localStorage.getItem('userId') || 'demo';
    const url = `${baseUrl}/profile/${userId}`;
    setProfileUrl(url);

    // Generate QR code URL
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`);

    // Load existing profile data if available
    const savedProfile = localStorage.getItem('digitalProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // Save to localStorage for now
      localStorage.setItem('digitalProfile', JSON.stringify(profileData));

      // In production, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast('Digital profile saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    showToast('Profile link copied to clipboard!', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Digital Business Card',
        text: `Check out my digital business card!`,
        url: profileUrl
      });
    } else {
      handleCopyLink();
    }
  };

  const handleProceedToCheckout = () => {
    localStorage.setItem('digitalProfile', JSON.stringify(profileData));
    router.push('/nfc/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Setup Your Digital Profile</h1>
          <p className="mt-2 text-gray-600">Create your digital business card that can be shared instantly</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                1
              </div>
              <span className="ml-3 font-medium text-gray-900">Create Profile</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                2
              </div>
              <span className="ml-3 font-medium text-gray-500">Review & Pay</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'personal'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Personal Info
                  </button>
                  <button
                    onClick={() => setActiveTab('professional')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'professional'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Professional
                  </button>
                  <button
                    onClick={() => setActiveTab('social')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'social'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Social Links
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'preview'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Preview
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    {/* Profile Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                      </label>
                      <div className="flex items-center space-x-4">
                        {profileData.profileImage ? (
                          <img
                            src={profileData.profileImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-upload"
                          />
                          <label
                            htmlFor="profile-upload"
                            className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </label>
                          {profileData.profileImage && (
                            <button
                              onClick={() => setProfileData(prev => ({ ...prev, profileImage: '' }))}
                              className="ml-2 text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="Tell people about yourself..."
                      />
                    </div>
                  </div>
                )}

                {/* Professional Information Tab */}
                {activeTab === 'professional' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={profileData.jobTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="Senior Developer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={profileData.company}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="Tech Corp"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={profileData.department}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="Engineering"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={profileData.website}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="CA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="94102"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          name="country"
                          value={profileData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Linkedin className="inline h-4 w-4 mr-1" />
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={profileData.linkedin}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Twitter className="inline h-4 w-4 mr-1" />
                          Twitter
                        </label>
                        <input
                          type="url"
                          name="twitter"
                          value={profileData.twitter}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Instagram className="inline h-4 w-4 mr-1" />
                          Instagram
                        </label>
                        <input
                          type="url"
                          name="instagram"
                          value={profileData.instagram}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Facebook className="inline h-4 w-4 mr-1" />
                          Facebook
                        </label>
                        <input
                          type="url"
                          name="facebook"
                          value={profileData.facebook}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Youtube className="inline h-4 w-4 mr-1" />
                          YouTube
                        </label>
                        <input
                          type="url"
                          name="youtube"
                          value={profileData.youtube}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="https://youtube.com/@channel"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Github className="inline h-4 w-4 mr-1" />
                          GitHub
                        </label>
                        <input
                          type="url"
                          name="github"
                          value={profileData.github}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-4">Custom Links</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Custom Link 1
                          </label>
                          <input
                            type="url"
                            name="customLink1"
                            value={profileData.customLink1}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            placeholder="https://your-website.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Custom Link 2
                          </label>
                          <input
                            type="url"
                            name="customLink2"
                            value={profileData.customLink2}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            placeholder="https://your-blog.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6">
                      <div className="text-center">
                        {profileData.profileImage ? (
                          <img
                            src={profileData.profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center">
                            <User className="h-16 w-16 text-gray-500" />
                          </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900">
                          {profileData.firstName} {profileData.lastName}
                        </h2>
                        <p className="text-gray-600">{profileData.jobTitle}</p>
                        <p className="text-gray-500">{profileData.company}</p>
                        {profileData.bio && (
                          <p className="mt-4 text-gray-700 max-w-md mx-auto">{profileData.bio}</p>
                        )}
                      </div>

                      <div className="mt-6 space-y-3">
                        {profileData.email && (
                          <div className="flex items-center justify-center space-x-2 text-gray-700">
                            <Mail className="h-5 w-5" />
                            <span>{profileData.email}</span>
                          </div>
                        )}
                        {profileData.phone && (
                          <div className="flex items-center justify-center space-x-2 text-gray-700">
                            <Phone className="h-5 w-5" />
                            <span>{profileData.phone}</span>
                          </div>
                        )}
                        {profileData.website && (
                          <div className="flex items-center justify-center space-x-2 text-gray-700">
                            <Globe className="h-5 w-5" />
                            <span>{profileData.website}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex justify-center space-x-4">
                        {profileData.linkedin && (
                          <a href={profileData.linkedin} className="text-blue-600 hover:text-blue-700">
                            <Linkedin className="h-6 w-6" />
                          </a>
                        )}
                        {profileData.twitter && (
                          <a href={profileData.twitter} className="text-blue-400 hover:text-blue-500">
                            <Twitter className="h-6 w-6" />
                          </a>
                        )}
                        {profileData.instagram && (
                          <a href={profileData.instagram} className="text-pink-600 hover:text-pink-700">
                            <Instagram className="h-6 w-6" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  disabled={!profileData.firstName || !profileData.lastName || !profileData.email || !profileData.phone}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Link & QR Code */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Digital Profile</h3>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Profile URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 text-gray-600 hover:text-gray-800"
                    title="Copy link"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-gray-800"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="mx-auto mb-2"
                />
                <p className="text-sm text-gray-600">Scan to view profile</p>
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Digital Profile Package</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Instant digital business card</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">QR code for easy sharing</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Mobile-optimized profile page</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Analytics dashboard</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Unlimited updates</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Package Price:</span>
                  <span className="text-2xl font-bold text-red-600">$24.99</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">One-time payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}