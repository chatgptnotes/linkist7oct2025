'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Profile {
  id: string;
  name: string;
  email?: string;
  isActive?: boolean;
}

interface ProfileSwitcherProps {
  profiles?: Profile[];
  currentProfile?: Profile;
  onProfileSwitch?: (profileId: string) => void;
}

export default function ProfileSwitcher({
  profiles = [],
  currentProfile,
  onProfileSwitch
}: ProfileSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Default profiles if none provided
  const defaultProfiles: Profile[] = [
    { id: '1', name: 'Dr Murali BK', email: 'murali@example.com', isActive: true },
    { id: '2', name: 'Neeraj Varma', email: 'neeraj@example.com', isActive: false }
  ];

  const displayProfiles = profiles.length > 0 ? profiles : defaultProfiles;
  const activeProfile = currentProfile || displayProfiles.find(p => p.isActive) || displayProfiles[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileSwitch = (profileId: string) => {
    if (onProfileSwitch) {
      onProfileSwitch(profileId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        aria-label="Switch profile"
      >
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(activeProfile.name)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900 truncate max-w-32">
            {activeProfile.name}
          </p>
        </div>
        <ExpandMoreIcon className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Switch Profile
            </p>
          </div>

          {/* Profile List */}
          <div className="py-1">
            {displayProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleProfileSwitch(profile.id)}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                  profile.id === activeProfile.id ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(profile.name)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{profile.name}</p>
                    {profile.email && (
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    )}
                  </div>
                </div>
                {profile.id === activeProfile.id && (
                  <CheckIcon className="h-5 w-5 text-red-500" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/profiles/builder');
              }}
              className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              + Add New Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
