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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Preview</h1>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push('/profiles/builder')}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push('/choose-plan')}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium whitespace-nowrap cursor-pointer"
              >
                Continue to Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Background Image */}
          {profileData.showBackgroundImage && profileData.backgroundImage ? (
            <div className="h-24 sm:h-32 relative">
              <img src={profileData.backgroundImage} alt="Background" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-24 sm:h-32 bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400"></div>
          )}

          <div className="px-6 sm:px-8 pb-8">
            {/* Profile Section */}
            <div className="flex items-start gap-4 sm:gap-6 -mt-12 sm:-mt-16">
              {/* Left Column - Profile Photo & Info */}
              <div className="flex-1">
                {/* Profile Photo */}
                {profileData.showProfilePhoto && (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 sm:border-6 border-blue-500 bg-white overflow-hidden shadow-xl relative z-10 mb-4">
                    {profileData.profilePhoto ? (
                      <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
                        {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                      </div>
                    )}
                  </div>
                )}

                {/* Name */}
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 capitalize">
                  {profileData.firstName} {profileData.lastName}
                </h1>

                {/* Job Title & Professional Summary */}
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                  {profileData.jobTitle && (
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {profileData.jobTitle}
                      {profileData.companyName && ` @${profileData.companyName}`}
                      {profileData.professionalSummary && ` | ${profileData.professionalSummary}`}
                    </p>
                  )}
                </div>

                {/* Company & Industry */}
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  {profileData.companyName && profileData.industry && (
                    <p>
                      {profileData.companyName} - {profileData.industry}
                    </p>
                  )}
                  {profileData.subDomain && (
                    <p>{profileData.subDomain}</p>
                  )}
                </div>
              </div>

              {/* Company Logo - Right side */}
              {profileData.companyLogo && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg p-2 shadow-md flex-shrink-0 relative z-0">
                  <img src={profileData.companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6 sm:my-8"></div>

            {/* Contact Information Section */}
            <div id="contact-section" className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Contact Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div>
                  <div className="space-y-3">
                    {profileData.primaryEmail && (
                      <div className="flex items-start gap-3">
                        <Email className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <a href={`mailto:${profileData.primaryEmail}`} className="text-sm text-gray-700 hover:text-blue-600 break-all">
                          {profileData.primaryEmail}
                        </a>
                      </div>
                    )}
                    {profileData.mobileNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <a href={`tel:${profileData.mobileNumber}`} className="text-sm text-gray-700 hover:text-blue-600">
                          {profileData.mobileNumber}
                        </a>
                      </div>
                    )}
                    {profileData.companyWebsite && (
                      <div className="flex items-start gap-3">
                        <Language className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <a href={profileData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                          {profileData.companyWebsite}
                        </a>
                      </div>
                    )}
                    {profileData.companyAddress && (
                      <div className="flex items-start gap-3">
                        <LocationOn className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{profileData.companyAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Skills */}
                <div>
                  {profileData.skills && profileData.skills.length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            {(profileData.showLinkedin || profileData.showInstagram || profileData.showFacebook ||
              profileData.showTwitter || profileData.showGithub || profileData.showYoutube) && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Social Profiles</h3>
                <div className="flex flex-wrap gap-3">
                  {profileData.showLinkedin && profileData.linkedinUrl && (
                    <a
                      href={profileData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
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
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-pink-600 hover:bg-pink-50 hover:text-pink-600 transition-colors text-sm"
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
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
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
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-900 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
                    >
                      <Twitter className="w-5 h-5" />
                      X
                    </a>
                  )}
                  {profileData.showGithub && profileData.githubUrl && (
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-900 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
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
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                    >
                      <YouTube className="w-5 h-5" />
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push('/profiles/builder')}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={() => router.push('/choose-plan')}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg text-sm sm:text-base border-0 cursor-pointer"
            style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
          >
            Continue to Choose Plan
          </button>
        </div>
      </div>
    </div>
  );
}
