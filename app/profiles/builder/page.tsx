'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ShareIcon from '@mui/icons-material/Share';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Icon aliases
const Person = PersonIcon;
const Briefcase = WorkIcon;
const Share = ShareIcon;
const Camera = PhotoCameraIcon;
const Collections = CollectionsIcon;
const CheckCircle = CheckCircleIcon;
const Plus = AddIcon;
const X2 = CloseIcon;
const Upload = CloudUploadIcon;
const Info = InfoIcon;
const LinkedIn = LinkedInIcon;
const Instagram = InstagramIcon;
const Facebook = FacebookIcon;
const Twitter = XIcon;
const GitHub = GitHubIcon;
const YouTube = YouTubeIcon;
const Search = SearchIcon;
const Edit = EditIcon;
const Trash = DeleteIcon;

interface ProfileData {
  // Basic Information
  firstName: string;
  lastName: string;
  primaryEmail: string;
  secondaryEmail: string;
  mobileNumber: string;
  whatsappNumber: string;
  showEmailPublicly: boolean;
  showMobilePublicly: boolean;
  showWhatsappPublicly: boolean;

  // Professional Information
  jobTitle: string;
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  companyLogo: string | null;
  industry: string;
  subDomain: string;
  skills: string[];
  professionalSummary: string;
  showJobTitle: boolean;
  showCompanyName: boolean;
  showCompanyWebsite: boolean;
  showCompanyAddress: boolean;
  showIndustry: boolean;
  showSkills: boolean;

  // Social & Digital Presence
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  behanceUrl: string;
  dribbbleUrl: string;
  githubUrl: string;
  youtubeUrl: string;
  showLinkedin: boolean;
  showInstagram: boolean;
  showFacebook: boolean;
  showTwitter: boolean;
  showBehance: boolean;
  showDribbble: boolean;
  showGithub: boolean;
  showYoutube: boolean;

  // Profile Photo & Background
  profilePhoto: string | null;
  backgroundImage: string | null;
  showProfilePhoto: boolean;
  showBackgroundImage: boolean;

  // Media Gallery
  photos: Array<{ id: string; url: string; title: string; showPublicly: boolean }>;
  videos: Array<{ id: string; url: string; title: string; showPublicly: boolean }>;
}

export default function ProfileBuilderPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'basic' | 'professional' | 'social' | 'media-photo' | 'media-gallery'>('basic');
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    primaryEmail: '',
    secondaryEmail: '',
    mobileNumber: '',
    whatsappNumber: '',
    showEmailPublicly: true,
    showMobilePublicly: true,
    showWhatsappPublicly: false,

    jobTitle: '',
    companyName: '',
    companyWebsite: '',
    companyAddress: '',
    companyLogo: null,
    industry: '',
    subDomain: '',
    skills: [],
    professionalSummary: '',
    showJobTitle: true,
    showCompanyName: true,
    showCompanyWebsite: true,
    showCompanyAddress: true,
    showIndustry: true,
    showSkills: true,

    linkedinUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    behanceUrl: '',
    dribbbleUrl: '',
    githubUrl: '',
    youtubeUrl: '',
    showLinkedin: true,
    showInstagram: false,
    showFacebook: false,
    showTwitter: true,
    showBehance: false,
    showDribbble: false,
    showGithub: true,
    showYoutube: false,

    profilePhoto: null,
    backgroundImage: null,
    showProfilePhoto: true,
    showBackgroundImage: true,

    photos: [],
    videos: []
  });

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Validate required fields for each section
  const validateBasicInfo = () => {
    if (!profileData.firstName.trim()) {
      showToast('First name is required', 'error');
      return false;
    }
    if (!profileData.lastName.trim()) {
      showToast('Last name is required', 'error');
      return false;
    }
    if (!profileData.primaryEmail.trim()) {
      showToast('Primary email is required', 'error');
      return false;
    }
    return true;
  };

  // Handle Continue button click for navigation
  const handleContinue = (nextSection: 'professional' | 'social' | 'media-photo') => {
    if (activeSection === 'basic' && !validateBasicInfo()) {
      return;
    }
    setActiveSection(nextSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Submit button - save to database
  const handleSubmit = async () => {
    if (!validateBasicInfo()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 Submitting profile data...');

      const response = await fetch('/api/profiles/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profileData.primaryEmail,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          mobileNumber: profileData.mobileNumber,
          companyName: profileData.companyName,
          profilePhoto: profileData.profilePhoto,
          secondaryEmail: profileData.secondaryEmail,
          whatsappNumber: profileData.whatsappNumber,
          showEmailPublicly: profileData.showEmailPublicly,
          showMobilePublicly: profileData.showMobilePublicly,
          showWhatsappPublicly: profileData.showWhatsappPublicly,
          jobTitle: profileData.jobTitle,
          companyWebsite: profileData.companyWebsite,
          companyAddress: profileData.companyAddress,
          companyLogo: profileData.companyLogo,
          industry: profileData.industry,
          subDomain: profileData.subDomain,
          skills: profileData.skills,
          professionalSummary: profileData.professionalSummary,
          showJobTitle: profileData.showJobTitle,
          showCompanyName: profileData.showCompanyName,
          showCompanyWebsite: profileData.showCompanyWebsite,
          showCompanyAddress: profileData.showCompanyAddress,
          showIndustry: profileData.showIndustry,
          showSkills: profileData.showSkills,
          linkedinUrl: profileData.linkedinUrl,
          instagramUrl: profileData.instagramUrl,
          facebookUrl: profileData.facebookUrl,
          twitterUrl: profileData.twitterUrl,
          behanceUrl: profileData.behanceUrl,
          dribbbleUrl: profileData.dribbbleUrl,
          githubUrl: profileData.githubUrl,
          youtubeUrl: profileData.youtubeUrl,
          showLinkedin: profileData.showLinkedin,
          showInstagram: profileData.showInstagram,
          showFacebook: profileData.showFacebook,
          showTwitter: profileData.showTwitter,
          showBehance: profileData.showBehance,
          showDribbble: profileData.showDribbble,
          showGithub: profileData.showGithub,
          showYoutube: profileData.showYoutube,
          backgroundImage: profileData.backgroundImage,
          showProfilePhoto: profileData.showProfilePhoto,
          showBackgroundImage: profileData.showBackgroundImage,
          photos: profileData.photos,
          videos: profileData.videos,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Profile saved successfully:', result);
        showToast('Profile saved successfully!', 'success');

        // Save to localStorage for dashboard display
        const savedProfiles = localStorage.getItem('userProfiles');
        const profiles = savedProfiles ? JSON.parse(savedProfiles) : [];

        const newProfile = {
          id: result.profile.id || Date.now().toString(),
          name: `${profileData.firstName} ${profileData.lastName}`,
          title: profileData.jobTitle || 'No title',
          company: profileData.companyName || 'No company',
          image: profileData.profilePhoto || null,
          status: 'active' as const,
          views: 0,
          clicks: 0,
          shares: 0,
          lastUpdated: 'Just now',
          publicUrl: `linkist.ai/${profileData.firstName.toLowerCase()}${profileData.lastName.toLowerCase()}`
        };

        // Check if profile already exists
        const existingIndex = profiles.findIndex((p: any) => p.id === newProfile.id);
        if (existingIndex >= 0) {
          profiles[existingIndex] = newProfile;
        } else {
          profiles.push(newProfile);
        }

        localStorage.setItem('userProfiles', JSON.stringify(profiles));

        // Redirect to plan selection page
        setTimeout(() => {
          router.push('/choose-plan');
        }, 2000);
      } else {
        console.error('❌ Failed to save profile:', result.error);
        showToast(result.error || 'Failed to save profile', 'error');
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      showToast('An error occurred while saving your profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = handleSubmit;

  const handlePreviewProfile = () => {
    // Preview profile
    router.push('/profiles/preview');
  };

  const handleCancelChanges = () => {
    // Reset or go back
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.back();
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skill)
    });
  };

  const addPhoto = () => {
    const newPhoto = {
      id: Date.now().toString(),
      url: '/placeholder-image.jpg',
      title: `Photo ${profileData.photos.length + 1}`,
      showPublicly: true
    };
    setProfileData({
      ...profileData,
      photos: [...profileData.photos, newPhoto]
    });
  };

  const removePhoto = (id: string) => {
    setProfileData({
      ...profileData,
      photos: profileData.photos.filter(p => p.id !== id)
    });
  };

  const addVideo = () => {
    const newVideo = {
      id: Date.now().toString(),
      url: '',
      title: `Video ${profileData.videos.length + 1}`,
      showPublicly: true
    };
    setProfileData({
      ...profileData,
      videos: [...profileData.videos, newVideo]
    });
  };

  const sections = [
    { id: 'basic' as const, icon: Person, label: 'Basic Information', description: 'Update your personal details and contact preferences' },
    { id: 'professional' as const, icon: Briefcase, label: 'Professional Information', description: 'Build your professional presence and showcase your expertise' },
    { id: 'social' as const, icon: Share, label: 'Social & Digital Presence', description: 'Connect your social media accounts and showcase your digital footprint' },
    { id: 'media-photo' as const, icon: Camera, label: 'Profile Photo & Background', description: 'Upload and customize your profile visuals for a professional appearance' },
    { id: 'media-gallery' as const, icon: Collections, label: 'Media Gallery', description: 'Upload photos and videos to showcase your work and achievements' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Builder</h1>
              <p className="text-sm text-gray-600 mt-1">Create and manage your professional profile</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelChanges}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
              >
                <X2 className="w-4 h-4" />
                Cancel Changes
              </button>
              <button
                onClick={handlePreviewProfile}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Preview Profile
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Basic Information Section */}
            {activeSection === 'basic' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Person className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Basic Information</h2>
                      <p className="text-white/90 text-sm mt-1">{sections.find(s => s.id === 'basic')?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Full Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Name</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Addresses */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Addresses</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email *</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profileData.primaryEmail}
                            onChange={(e) => setProfileData({ ...profileData, primaryEmail: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="Enter your email address"
                          />
                          <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Verified</span>
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={profileData.showEmailPublicly}
                              onChange={(e) => setProfileData({ ...profileData, showEmailPublicly: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            <span className="text-sm text-gray-700">Show publicly</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profileData.secondaryEmail}
                            onChange={(e) => setProfileData({ ...profileData, secondaryEmail: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="Add secondary email"
                          />
                          <Plus className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone Numbers</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                        <div className="flex gap-2">
                          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white">
                            <option>🇦🇪 +971</option>
                            <option>🇺🇸 +1</option>
                            <option>🇮🇳 +91</option>
                          </select>
                          <div className="relative flex-1">
                            <input
                              type="tel"
                              value={profileData.mobileNumber}
                              onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                              placeholder="50 123 4567"
                            />
                            <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Verified via SMS</span>
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={profileData.showMobilePublicly}
                              onChange={(e) => setProfileData({ ...profileData, showMobilePublicly: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            <span className="text-sm text-gray-700">Show publicly</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                        <div className="flex gap-2">
                          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white">
                            <option>🇦🇪 +971</option>
                            <option>🇺🇸 +1</option>
                            <option>🇮🇳 +91</option>
                          </select>
                          <div className="relative flex-1">
                            <input
                              type="tel"
                              value={profileData.whatsappNumber}
                              onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                              placeholder="50 123 4567"
                            />
                            <svg className="absolute right-3 top-2.5 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center justify-end mt-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={profileData.showWhatsappPublicly}
                              onChange={(e) => setProfileData({ ...profileData, showWhatsappPublicly: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            <span className="text-sm text-gray-700">Show publicly</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Continue Button - Fixed Bottom */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg" style={{ display: 'block', width: '100%', minHeight: '80px' }}>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleContinue('professional')}
                      className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2 shadow-lg"
                      style={{ display: 'flex', opacity: 1, visibility: 'visible', backgroundColor: '#dc2626', color: '#ffffff' }}
                    >
                      Continue
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information Section */}
            {activeSection === 'professional' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Professional Information</h2>
                      <p className="text-white/90 text-sm mt-1">{sections.find(s => s.id === 'professional')?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Job Title & Role */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Title & Role</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Job Title *</label>
                      <select
                        value={profileData.jobTitle}
                        onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                      >
                        <option>Senior Product Manager</option>
                        <option>Product Manager</option>
                        <option>Product Owner</option>
                        <option>Software Engineer</option>
                        <option>UX Designer</option>
                      </select>
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={profileData.showJobTitle}
                          onChange={(e) => setProfileData({ ...profileData, showJobTitle: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span className="text-sm text-gray-700">Show job title on profile</span>
                      </label>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                        <input
                          type="text"
                          value={profileData.companyName}
                          onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                          placeholder="TechCorp Solutions"
                        />
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showCompanyName}
                            onChange={(e) => setProfileData({ ...profileData, showCompanyName: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show company name</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                        <input
                          type="url"
                          value={profileData.companyWebsite}
                          onChange={(e) => setProfileData({ ...profileData, companyWebsite: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                          placeholder="https://techcorp.com"
                        />
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showCompanyWebsite}
                            onChange={(e) => setProfileData({ ...profileData, showCompanyWebsite: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show website</span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                      <input
                        type="text"
                        value={profileData.companyAddress}
                        onChange={(e) => setProfileData({ ...profileData, companyAddress: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Business Bay, Dubai, UAE"
                      />
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={profileData.showCompanyAddress}
                          onChange={(e) => setProfileData({ ...profileData, showCompanyAddress: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span className="text-sm text-gray-700">Show address & map</span>
                      </label>

                      <div className="mt-4 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-sm text-gray-600 font-medium">Google Maps Integration</p>
                          <button className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium">Update Location</button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Logo
                        </button>
                        <span className="text-xs text-gray-500">PNG, JPG up to 2MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Industry & Domain */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry & Domain</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                        <select
                          value={profileData.industry}
                          onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                        >
                          <option>Technology</option>
                          <option>Finance</option>
                          <option>Healthcare</option>
                          <option>Education</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub Domain</label>
                        <select
                          value={profileData.subDomain}
                          onChange={(e) => setProfileData({ ...profileData, subDomain: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                        >
                          <option>Software Development</option>
                          <option>Web Development</option>
                          <option>Mobile Apps</option>
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={profileData.showIndustry}
                        onChange={(e) => setProfileData({ ...profileData, showIndustry: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      <span className="text-sm text-gray-700">Show industry information</span>
                    </label>
                  </div>

                  {/* Skills & Expertise */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search & Add Skills</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                          placeholder="Type to search skills..."
                        />
                        <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {profileData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-full"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="hover:bg-red-700 rounded-full p-0.5"
                            >
                              <X2 className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {profileData.skills.includes('Product Strategy') && (
                          <>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                              Agile Management
                              <button className="hover:bg-blue-700 rounded-full p-0.5">
                                <X2 className="w-3 h-3" />
                              </button>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">
                              Data Analysis
                              <button className="hover:bg-yellow-600 rounded-full p-0.5">
                                <X2 className="w-3 h-3" />
                              </button>
                            </span>
                          </>
                        )}
                      </div>

                      <label className="flex items-center gap-2 mt-3">
                        <input
                          type="checkbox"
                          checked={profileData.showSkills}
                          onChange={(e) => setProfileData({ ...profileData, showSkills: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span className="text-sm text-gray-700">Show skills on profile</span>
                      </label>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                    <textarea
                      value={profileData.professionalSummary}
                      onChange={(e) => setProfileData({ ...profileData, professionalSummary: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                      placeholder="Experienced Product Manager with 8+ years in tech industry. Specialized in building scalable products and leading cross-functional teams. Passionate about user experience an"
                    />
                    <p className="text-xs text-gray-500 mt-1">Write a brief summary of your professional background and expertise</p>
                  </div>
                </div>

                {/* Continue Button - Fixed Bottom */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg" style={{ display: 'block', width: '100%', minHeight: '80px' }}>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleContinue('social')}
                      className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2 shadow-lg"
                      style={{ display: 'flex', opacity: 1, visibility: 'visible', backgroundColor: '#dc2626', color: '#ffffff' }}
                    >
                      Continue
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Social & Digital Presence Section */}
            {activeSection === 'social' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Share className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Social & Digital Presence</h2>
                      <p className="text-white/90 text-sm mt-1">{sections.find(s => s.id === 'social')?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Social Media Accounts */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500 text-xl">#</span>
                      <h3 className="text-lg font-semibold text-gray-900">Social Media Accounts</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* LinkedIn */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                        <div className="relative">
                          <LinkedIn className="absolute left-3 top-2.5 w-5 h-5 text-blue-700" />
                          <input
                            type="url"
                            value={profileData.linkedinUrl}
                            onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="https://linkedin.com/in/sarah-johnson"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showLinkedin}
                            onChange={(e) => setProfileData({ ...profileData, showLinkedin: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-blue-700">Show LinkedIn profile</span>
                        </label>
                      </div>

                      {/* Instagram */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <div className="relative">
                          <Instagram className="absolute left-3 top-2.5 w-5 h-5 text-pink-600" />
                          <input
                            type="url"
                            value={profileData.instagramUrl}
                            onChange={(e) => setProfileData({ ...profileData, instagramUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="https://instagram.com/yourhandle"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showInstagram}
                            onChange={(e) => setProfileData({ ...profileData, showInstagram: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show Instagram profile</span>
                        </label>
                      </div>

                      {/* Facebook */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                        <div className="relative">
                          <Facebook className="absolute left-3 top-2.5 w-5 h-5 text-blue-600" />
                          <input
                            type="url"
                            value={profileData.facebookUrl}
                            onChange={(e) => setProfileData({ ...profileData, facebookUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="https://facebook.com/yourprofile"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showFacebook}
                            onChange={(e) => setProfileData({ ...profileData, showFacebook: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show Facebook profile</span>
                        </label>
                      </div>

                      {/* Twitter/X */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">X (Twitter)</label>
                        <div className="relative">
                          <Twitter className="absolute left-3 top-2.5 w-5 h-5 text-gray-900" />
                          <input
                            type="url"
                            value={profileData.twitterUrl}
                            onChange={(e) => setProfileData({ ...profileData, twitterUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="https://x.com/sarah_product"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showTwitter}
                            onChange={(e) => setProfileData({ ...profileData, showTwitter: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show X profile</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Custom Links & Portfolios */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500 text-xl">🔗</span>
                      <h3 className="text-lg font-semibold text-gray-900">Custom Links & Portfolios</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Behance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Behance Portfolio</label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-blue-500 font-bold text-sm">Bē</div>
                          <input
                            type="url"
                            value={profileData.behanceUrl}
                            onChange={(e) => setProfileData({ ...profileData, behanceUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="https://behance.net/yourportfolio"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showBehance}
                            onChange={(e) => setProfileData({ ...profileData, showBehance: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show Behance portfolio</span>
                        </label>
                      </div>

                      {/* Dribbble */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dribbble</label>
                        <div className="relative">
                          <svg className="absolute left-3 top-2.5 w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
                          </svg>
                          <input
                            type="url"
                            value={profileData.dribbbleUrl}
                            onChange={(e) => setProfileData({ ...profileData, dribbbleUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="https://dribbble.com/yourprofile"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showDribbble}
                            onChange={(e) => setProfileData({ ...profileData, showDribbble: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show Dribbble profile</span>
                        </label>
                      </div>

                      {/* GitHub */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                        <div className="relative">
                          <GitHub className="absolute left-3 top-2.5 w-5 h-5 text-gray-900" />
                          <input
                            type="url"
                            value={profileData.githubUrl}
                            onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="https://github.com/sarahjohnson"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showGithub}
                            onChange={(e) => setProfileData({ ...profileData, showGithub: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show GitHub profile</span>
                        </label>
                      </div>

                      {/* YouTube */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel</label>
                        <div className="relative">
                          <YouTube className="absolute left-3 top-2.5 w-5 h-5 text-red-600" />
                          <input
                            type="url"
                            value={profileData.youtubeUrl}
                            onChange={(e) => setProfileData({ ...profileData, youtubeUrl: e.target.value })}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="https://youtube.com/@yourchannel"
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={profileData.showYoutube}
                            onChange={(e) => setProfileData({ ...profileData, showYoutube: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show YouTube channel</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button - Fixed Bottom */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg" style={{ display: 'block', width: '100%', minHeight: '80px' }}>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleContinue('media-photo')}
                      className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2 shadow-lg"
                      style={{ display: 'flex', opacity: 1, visibility: 'visible', backgroundColor: '#dc2626', color: '#ffffff' }}
                    >
                      Continue
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Photo & Background Section */}
            {activeSection === 'media-photo' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Profile Photo & Background</h2>
                      <p className="text-white/90 text-sm mt-1">{sections.find(s => s.id === 'media-photo')?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Profile Photo */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500 text-xl">📷</span>
                      <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
                          <div className="text-center">
                            <div className="relative inline-block">
                              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                                <img
                                  src="https://ui-avatars.com/api/?name=Jane+Doe&size=128&background=667eea&color=fff"
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -top-2 -right-2 bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                N
                              </div>
                            </div>
                            <button className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto">
                              <Upload className="w-4 h-4" />
                              Upload New Photo
                            </button>
                            <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF up to 10MB</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 text-sm mb-3">Photo Guidelines</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Use a high-quality, professional headshot</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Face should be clearly visible and well-lit</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Square aspect ratio works best</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Minimum resolution: 400x400 pixels</span>
                            </li>
                          </ul>
                        </div>

                        <label className="flex items-center gap-2 mt-4">
                          <input
                            type="checkbox"
                            checked={profileData.showProfilePhoto}
                            onChange={(e) => setProfileData({ ...profileData, showProfilePhoto: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show profile photo publicly</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Background Image */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500 text-xl">🖼️</span>
                      <h3 className="text-lg font-semibold text-gray-900">Background Image</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 h-48">
                          <div className="text-center text-white">
                            <p className="font-medium mb-4">Current Background</p>
                            <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto">
                              <Upload className="w-4 h-4" />
                              Upload Background
                            </button>
                            <p className="text-xs mt-2 opacity-80">JPG or PNG up to 15MB</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 text-sm mb-3">Background Guidelines</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Use professional relevant imagery</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Avoid busy patterns that distract from text</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Recommended size: 1920x1080 pixels</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Ensure good contrast with text overlay</span>
                            </li>
                          </ul>
                        </div>

                        <label className="flex items-center gap-2 mt-4">
                          <input
                            type="checkbox"
                            checked={profileData.showBackgroundImage}
                            onChange={(e) => setProfileData({ ...profileData, showBackgroundImage: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          <span className="text-sm text-gray-700">Show background image</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Profile Preview */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500 text-xl">👁️</span>
                      <h3 className="text-lg font-semibold text-gray-900">Profile Preview</h3>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg h-32"></div>
                    <div className="bg-white border border-gray-200 rounded-b-lg p-6 -mt-16 relative">
                      <div className="flex items-end gap-4 mb-4">
                        <div className="w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src="https://ui-avatars.com/api/?name=Sarah+Johnson&size=96&background=667eea&color=fff"
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">Sarah Johnson</h3>
                          <p className="text-gray-600">Product Manager</p>
                          <p className="text-sm text-gray-500 mt-1">Professional headshot of Sarah Johnson, Product Manager</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Fixed Bottom */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg" style={{ display: 'block', width: '100%', minHeight: '80px', backgroundColor: '#f9fafb' }}>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleCancelChanges}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2"
                      disabled={isSubmitting}
                      style={{ display: 'flex', opacity: 1, visibility: 'visible', backgroundColor: '#e5e7eb', color: '#374151' }}
                    >
                      <X2 className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      style={{ display: 'flex', opacity: 1, visibility: 'visible', backgroundColor: '#dc2626', color: '#ffffff' }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Submit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Media Gallery Section */}
            {activeSection === 'media-gallery' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Collections className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Media Gallery</h2>
                      <p className="text-white/90 text-sm mt-1">{sections.find(s => s.id === 'media-gallery')?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Photos */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-xl">📷</span>
                        <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">3 of 5 photos used</span>
                        <button
                          onClick={addPhoto}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Photo
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {profileData.photos.map((photo) => (
                        <div key={photo.id} className="group relative">
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={`https://ui-avatars.com/api/?name=${photo.title}&size=400&background=random`}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{photo.title}</p>
                              <div className="flex items-center gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => removePhoto(photo.id)}
                                  className="p-1 hover:bg-red-100 rounded"
                                >
                                  <Trash className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                            <label className="flex items-center gap-2 mt-2">
                              <input
                                type="checkbox"
                                checked={photo.showPublicly}
                                onChange={(e) => {
                                  const newPhotos = profileData.photos.map(p =>
                                    p.id === photo.id ? { ...p, showPublicly: e.target.checked } : p
                                  );
                                  setProfileData({ ...profileData, photos: newPhotos });
                                }}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                              <span className="text-xs text-gray-700">Show publicly</span>
                            </label>
                          </div>
                        </div>
                      ))}

                      {/* Add Photo Placeholder */}
                      <button
                        onClick={addPhoto}
                        className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 flex flex-col items-center justify-center transition-colors"
                      >
                        <Plus className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600 mt-2">Add Photo</span>
                        <span className="text-xs text-gray-500">JPG, PNG up to 10MB</span>
                      </button>
                    </div>
                  </div>

                  {/* Videos */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-xl">🎥</span>
                        <h3 className="text-lg font-semibold text-gray-900">Videos</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">1 of 3 videos used</span>
                        <button
                          onClick={addVideo}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Video
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {profileData.videos.map((video) => (
                        <div key={video.id} className="group">
                          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                            <YouTube className="w-8 h-8 text-red-600" />
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">YouTube</div>
                            <button className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </button>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900">{video.title}</p>
                            <p className="text-xs text-gray-600 mt-1">3:45 min</p>
                            <input
                              type="url"
                              value={video.url}
                              onChange={(e) => {
                                const newVideos = profileData.videos.map(v =>
                                  v.id === video.id ? { ...v, url: e.target.value } : v
                                );
                                setProfileData({ ...profileData, videos: newVideos });
                              }}
                              className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                              placeholder="Video URL"
                            />
                            <label className="flex items-center gap-2 mt-2">
                              <input
                                type="checkbox"
                                checked={video.showPublicly}
                                onChange={(e) => {
                                  const newVideos = profileData.videos.map(v =>
                                    v.id === video.id ? { ...v, showPublicly: e.target.checked } : v
                                  );
                                  setProfileData({ ...profileData, videos: newVideos });
                                }}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                              <span className="text-xs text-gray-700">Show publicly</span>
                            </label>
                          </div>
                        </div>
                      ))}

                      {/* Add Video Placeholder */}
                      <button
                        onClick={addVideo}
                        className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 flex flex-col items-center justify-center transition-colors"
                      >
                        <Plus className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600 mt-2">Add Video</span>
                        <span className="text-xs text-gray-500 mt-1">YouTube or Vimeo</span>
                        <div className="flex items-center gap-2 mt-2">
                          <YouTube className="w-4 h-4 text-red-600" />
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <X2 className="w-5 h-5" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-80"
          >
            <X2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
