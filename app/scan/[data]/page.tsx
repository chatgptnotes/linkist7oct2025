'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ShareIcon from '@mui/icons-material/Share';

// Icon aliases
const Phone = PhoneIcon;
const Mail = EmailIcon;
const Globe = LanguageIcon;
const MapPin = LocationOnIcon;
const Linkedin = LinkedInIcon;
const Instagram = InstagramIcon;
const Twitter = XIcon;
const Download = CloudDownloadIcon;
const Share2 = ShareIcon;

interface CardData {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  mobile: string;
  email: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  profileImage?: string;
}

export default function ScanPage() {
  const params = useParams();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = decodeURIComponent(params.data as string);
      const parsedData = JSON.parse(data);
      setCardData(parsedData);
    } catch (error) {
      console.error('Error parsing card data:', error);
    } finally {
      setLoading(false);
    }
  }, [params.data]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWebsite = (url: string) => {
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  };

  const handleSocial = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAddToContacts = () => {
    if (!cardData) return;
    
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.firstName} ${cardData.lastName}
ORG:${cardData.company}
TITLE:${cardData.title}
TEL:${cardData.mobile}
EMAIL:${cardData.email}
${cardData.website ? `URL:${cardData.website}` : ''}
${cardData.linkedin ? `URL:${cardData.linkedin}` : ''}
${cardData.instagram ? `URL:${cardData.instagram}` : ''}
${cardData.twitter ? `URL:${cardData.twitter}` : ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.firstName}_${cardData.lastName}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share && cardData) {
      try {
        await navigator.share({
          title: `${cardData.firstName} ${cardData.lastName} - ${cardData.title}`,
          text: `Contact information for ${cardData.firstName} ${cardData.lastName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-2xl font-bold mb-4">Invalid QR Code</h1>
          <p>The QR code you scanned is not valid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Linkist" className="h-8 filter brightness-0 invert" />
            <span className="text-white font-bold text-lg">LINKIST</span>
          </div>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4">
                {cardData.profileImage ? (
                  <img
                    src={cardData.profileImage}
                    alt={`${cardData.firstName} ${cardData.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {cardData.firstName[0]}{cardData.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {cardData.firstName} {cardData.lastName}
              </h1>
              <p className="text-gray-600 mb-1">{cardData.title}</p>
              <p className="text-gray-500 text-sm">{cardData.company}</p>
            </div>

            {/* Contact Actions */}
            <div className="space-y-3">
              {/* Phone */}
              <button
                onClick={() => handleCall(cardData.mobile)}
                className="w-full flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{cardData.mobile}</p>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={() => handleEmail(cardData.email)}
                className="w-full flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{cardData.email}</p>
                </div>
              </button>

              {/* Website */}
              {cardData.website && (
                <button
                  onClick={() => handleWebsite(cardData.website!)}
                  className="w-full flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium text-gray-900">{cardData.website}</p>
                  </div>
                </button>
              )}

              {/* Social Media */}
              <div className="flex space-x-2">
                {cardData.linkedin && (
                  <button
                    onClick={() => handleSocial(cardData.linkedin!)}
                    className="flex-1 flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-600 font-medium">LinkedIn</span>
                  </button>
                )}
                {cardData.instagram && (
                  <button
                    onClick={() => handleSocial(cardData.instagram!)}
                    className="flex-1 flex items-center justify-center space-x-2 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <span className="text-pink-600 font-medium">Instagram</span>
                  </button>
                )}
                {cardData.twitter && (
                  <button
                    onClick={() => handleSocial(cardData.twitter!)}
                    className="flex-1 flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Twitter</span>
                  </button>
                )}
              </div>
            </div>

            {/* Add to Contacts Button */}
            <button
              onClick={handleAddToContacts}
              className="w-full mt-6 flex items-center justify-center space-x-2 p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Add to Contacts</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-white/80 text-sm">
            <p>Powered by Linkist NFC</p>
            <p>Scan any NFC card to instantly connect</p>
          </div>
        </div>
      </div>
    </div>
  );
}
