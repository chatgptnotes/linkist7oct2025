'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import SecurityIcon from '@mui/icons-material/Security';

const Settings = SettingsIcon;
const ArrowLeft = ArrowBackIcon;
const Palette = PaletteIcon;
const Shield = SecurityIcon;

const accentColors = [
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Yellow', value: '#F59E0B', class: 'bg-yellow-500' },
  { name: 'Green', value: '#10B981', class: 'bg-green-500' },
  { name: 'Purple', value: '#A855F7', class: 'bg-purple-500' },
  { name: 'Orange', value: '#F97316', class: 'bg-orange-500' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [selectedAccent, setSelectedAccent] = useState('#EF4444');
  const [backgroundStyle, setBackgroundStyle] = useState('solid');

  // Privacy toggles
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showProfessional, setShowProfessional] = useState(true);
  const [showSocial, setShowSocial] = useState(true);
  const [showGallery, setShowGallery] = useState(false);

  // Contact preferences
  const [allowDirectContact, setAllowDirectContact] = useState(true);
  const [allowCalendarBooking, setAllowCalendarBooking] = useState(false);

  const profileCompletion = 100; // Example completion

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/profile-dashboard" className="hover:text-gray-900">Dashboard</Link>
          <span>›</span>
          <Link href="/profile-dashboard?tab=profile" className="hover:text-gray-900">Profile</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Settings</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Customize your profile appearance, privacy controls, and visibility settings</p>
          </div>
          <Link
            href="/profile-dashboard"
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Profile Completion Progress</h2>
            <span className="text-2xl font-bold text-red-500">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Personal Info - Complete
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Professional - Complete
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Social & Digital - Complete
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Profile Photo - Complete
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Media Gallery - Complete
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Settings - Current
            </span>
          </div>
        </div>

        {/* Profile Settings Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-t-xl p-6 mb-0">
          <div className="flex items-center space-x-3 text-white">
            <Settings className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Profile Settings</h2>
              <p className="text-blue-200 text-sm">Customize your profile layout, branding, and privacy controls</p>
            </div>
          </div>
        </div>

        {/* Layout & Branding */}
        <div className="bg-white rounded-b-xl shadow-sm p-8 mb-8">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Palette className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Layout & Branding</h3>
            </div>

            {/* Accent Color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
              <div className="flex items-center space-x-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedAccent(color.value)}
                    className={`w-12 h-12 rounded-full ${color.class} transition-all ${
                      selectedAccent === color.value ? 'ring-4 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Background Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Background Style</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="background"
                    value="solid"
                    checked={backgroundStyle === 'solid'}
                    onChange={(e) => setBackgroundStyle(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>
                    <span className="text-sm text-gray-700">Solid Color</span>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="background"
                    value="gradient"
                    checked={backgroundStyle === 'gradient'}
                    onChange={(e) => setBackgroundStyle(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Gradient</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="background"
                    value="pattern"
                    checked={backgroundStyle === 'pattern'}
                    onChange={(e) => setBackgroundStyle(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Pattern</span>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Visibility Controls */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Visibility Controls</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Sections */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Profile Sections</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Personal Information</p>
                      <p className="text-xs text-gray-500">Name, contact details, location</p>
                    </div>
                    <button
                      onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showPersonalInfo ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showPersonalInfo ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Professional Profile</p>
                      <p className="text-xs text-gray-500">Job title, company, skills</p>
                    </div>
                    <button
                      onClick={() => setShowProfessional(!showProfessional)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showProfessional ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showProfessional ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Social & Digital Links</p>
                      <p className="text-xs text-gray-500">Social media, portfolios, documents</p>
                    </div>
                    <button
                      onClick={() => setShowSocial(!showSocial)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showSocial ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showSocial ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Media Gallery</p>
                      <p className="text-xs text-gray-500">Photos and videos</p>
                    </div>
                    <button
                      onClick={() => setShowGallery(!showGallery)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showGallery ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showGallery ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Preferences */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Direct Contact Form</p>
                      <p className="text-xs text-gray-500">Allow visitors to contact you</p>
                    </div>
                    <button
                      onClick={() => setAllowDirectContact(!allowDirectContact)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        allowDirectContact ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          allowDirectContact ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Calendar Booking</p>
                      <p className="text-xs text-gray-500">Enable meeting scheduling</p>
                    </div>
                    <button
                      onClick={() => setAllowCalendarBooking(!allowCalendarBooking)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        allowCalendarBooking ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          allowCalendarBooking ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
