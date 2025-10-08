'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '@/components/Footer';

const User = PersonIcon;
const Users = GroupsIcon;
const X = CloseIcon;

export default function ChoosePlanPage() {
  const router = useRouter();
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    teamSize: ''
  });

  const handlePersonalUse = () => {
    router.push('/welcome-to-linkist');
  };

  const handleTeamUse = () => {
    setShowTeamModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // WhatsApp number (configurable)
    const whatsappNumber = '+91 74833 71335';

    // Prefilled message
    const message = `I need to buy multiple Linkist Digital cards for my team, please contact me to discuss.

Name: ${formData.fullName}
Email: ${formData.email}
Mobile: ${formData.mobile}
Team Size: ${formData.teamSize}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Redirect to WhatsApp
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');

    // Close modal
    setShowTeamModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Who is this for?
          </h1>
          <p className="text-base md:text-xl text-gray-600">
            Choose the option that best fits your needs
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
          {/* Personal Use Card */}
          <div
            className="bg-white rounded-2xl border-2 border-gray-200 hover:border-red-600 hover:shadow-2xl transition-all p-5 md:p-8 group flex flex-col"
          >
            <div className="text-center flex-grow flex flex-col">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all mb-3 md:mb-6 mx-auto">
                <User className="w-7 h-7 md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                Personal Use
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-6 flex-grow">
                I want to get a Linkist digital card for myself
              </p>
              <button
                onClick={handlePersonalUse}
                className="w-full py-2.5 md:py-3 px-6 rounded-xl font-semibold transition-all mt-auto cursor-pointer text-sm md:text-base"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Team Use Card */}
          <div
            className="bg-white rounded-2xl border-2 border-gray-200 hover:border-red-600 hover:shadow-2xl transition-all p-5 md:p-8 group flex flex-col"
          >
            <div className="text-center flex-grow flex flex-col">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all mb-3 md:mb-6 mx-auto">
                <Users className="w-7 h-7 md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                Multiple Cards for Team
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-6 flex-grow">
                I need Linkist digital cards for my team members
              </p>
              <button
                onClick={handleTeamUse}
                className="w-full py-2.5 md:py-3 px-6 rounded-xl font-semibold transition-all mt-auto cursor-pointer text-sm md:text-base"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                Send a Query
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-4 md:mt-12 text-center">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer text-sm md:text-base"
          >
            ← Go Back
          </button>
        </div>
      </div>

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowTeamModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Team Purchase Inquiry
            </h2>
            <p className="text-gray-600 mb-6">
              Fill in your details and we'll contact you on WhatsApp
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="+971XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Size *
                </label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleFormChange}
                  required
                  min="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="10"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all mt-6 cursor-pointer"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                Continue to WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>

      <Footer />
    </div>
  );
}
