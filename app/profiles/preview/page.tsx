'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Email,
  Phone,
  Work,
  Business,
  LinkedIn,
  Instagram,
  Facebook,
  Twitter,
  GitHub,
  YouTube,
  Language,
  LocationOn,
  Star
} from '@mui/icons-material';

interface ProfileData {
  firstName: string;
  lastName: string;
  primaryEmail: string;
  secondaryEmail: string;
  mobileNumber: string;
  whatsappNumber: string;
  jobTitle: string;
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  companyLogo: string | null;
  industry: string;
  subDomain: string;
  skills: string[];
  professionalSummary: string;
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
  profilePhoto: string | null;
  backgroundImage: string | null;
  showProfilePhoto: boolean;
  showBackgroundImage: boolean;
}

export default function ProfilePreviewPage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile data from localStorage
    const profilesStr = localStorage.getItem('userProfiles');
    if (profilesStr) {
      const profiles = JSON.parse(profilesStr);
      if (profiles && profiles.length > 0) {
        // Get the most recent profile
        setProfileData(profiles[profiles.length - 1]);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data found</p>
          <button
            onClick={() => router.push('/profiles/builder')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile Preview</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/profiles/builder')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push('/choose-plan')}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Continue to Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Background Image */}
          {profileData.showBackgroundImage && profileData.backgroundImage ? (
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <img src={profileData.backgroundImage} alt="Background" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-r from-red-500 to-orange-600"></div>
          )}

          <div className="px-8 pb-8">
            {/* Profile Photo & Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
              {profileData.showProfilePhoto && (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                  {profileData.profilePhoto ? (
                    <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                {profileData.jobTitle && (
                  <p className="text-xl text-gray-600 mt-1">{profileData.jobTitle}</p>
                )}
                {profileData.companyName && (
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <Business className="w-5 h-5" />
                    <span>{profileData.companyName}</span>
                  </div>
                )}
              </div>

              {profileData.companyLogo && (
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg p-2">
                  <img src={profileData.companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Professional Summary */}
            {profileData.professionalSummary && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{profileData.professionalSummary}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {profileData.primaryEmail && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Email className="w-5 h-5 text-red-600" />
                      <span>{profileData.primaryEmail}</span>
                    </div>
                  )}
                  {profileData.mobileNumber && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-red-600" />
                      <span>{profileData.mobileNumber}</span>
                    </div>
                  )}
                  {profileData.companyAddress && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <LocationOn className="w-5 h-5 text-red-600" />
                      <span>{profileData.companyAddress}</span>
                    </div>
                  )}
                  {profileData.companyWebsite && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Language className="w-5 h-5 text-red-600" />
                      <a href={profileData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                        {profileData.companyWebsite}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                <div className="space-y-3">
                  {profileData.industry && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Work className="w-5 h-5 text-red-600" />
                      <span>{profileData.industry}</span>
                    </div>
                  )}
                  {profileData.subDomain && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                      <span>{profileData.subDomain}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {profileData.skills && profileData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Links */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Me</h3>
              <div className="flex flex-wrap gap-3">
                {profileData.showLinkedin && profileData.linkedinUrl && (
                  <a
                    href={profileData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <LinkedIn className="w-5 h-5" />
                    LinkedIn
                  </a>
                )}
                {profileData.showInstagram && profileData.instagramUrl && (
                  <a
                    href={profileData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    Instagram
                  </a>
                )}
                {profileData.showFacebook && profileData.facebookUrl && (
                  <a
                    href={profileData.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </a>
                )}
                {profileData.showTwitter && profileData.twitterUrl && (
                  <a
                    href={profileData.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    X (Twitter)
                  </a>
                )}
                {profileData.showGithub && profileData.githubUrl && (
                  <a
                    href={profileData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <GitHub className="w-5 h-5" />
                    GitHub
                  </a>
                )}
                {profileData.showYoutube && profileData.youtubeUrl && (
                  <a
                    href={profileData.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <YouTube className="w-5 h-5" />
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/profiles/builder')}
            className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={() => router.push('/choose-plan')}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg"
          >
            Continue to Choose Plan
          </button>
        </div>
      </div>
    </div>
  );
}
