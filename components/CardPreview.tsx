'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// Icon aliases
const Phone = PhoneIcon;
const Mail = EmailIcon;
const Globe = LanguageIcon;
const Linkedin = LinkedInIcon;
const Twitter = XIcon;
const Instagram = InstagramIcon;
const Facebook = FacebookIcon;
const Download = CloudDownloadIcon;

interface CardPreviewProps {
  config: {
    fullName?: string;
    title?: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundStyle?: 'gradient' | 'solid' | 'pattern';
    logoUrl?: string;
    photoUrl?: string;
  };
  qrCodeUrl?: string;
}

export default function CardPreview({ config, qrCodeUrl }: CardPreviewProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const getBackgroundStyle = () => {
    const primary = config.primaryColor || '#000000';
    const secondary = config.secondaryColor || '#FFFFFF';
    
    switch (config.backgroundStyle) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        };
      case 'solid':
        return {
          backgroundColor: primary,
        };
      case 'pattern':
        return {
          backgroundColor: primary,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${secondary}20 10px, ${secondary}20 20px)`,
        };
      default:
        return {
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        };
    }
  };

  const downloadPDF = async () => {
    if (!frontRef.current || !backRef.current) return;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98], // Standard card size
    });

    // Capture front
    const frontCanvas = await html2canvas(frontRef.current, {
      scale: 2,
      backgroundColor: null,
    });
    const frontImg = frontCanvas.toDataURL('image/png');
    pdf.addImage(frontImg, 'PNG', 0, 0, 85.6, 53.98);

    // Capture back
    pdf.addPage();
    const backCanvas = await html2canvas(backRef.current, {
      scale: 2,
      backgroundColor: null,
    });
    const backImg = backCanvas.toDataURL('image/png');
    pdf.addImage(backImg, 'PNG', 0, 0, 85.6, 53.98);

    pdf.save('nfc-card-preview.pdf');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <button
          onClick={downloadPDF}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Card Front */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Front</p>
        <div
          ref={frontRef}
          className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-lg shadow-xl overflow-hidden"
          style={getBackgroundStyle()}
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="h-12 w-auto object-contain bg-white/10 rounded p-1"
                />
              )}
              {/* QR Code */}
              <div className="w-12 h-12 bg-white border border-gray-300 rounded flex items-center justify-center">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-xs text-gray-400 text-center">QR</div>
                )}
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {config.fullName || 'Your Name'}
                </h3>
                {config.title && (
                  <p className="text-sm opacity-90">{config.title}</p>
                )}
                {config.company && (
                  <p className="text-sm opacity-90">{config.company}</p>
                )}
              </div>
              {config.photoUrl && (
                <img
                  src={config.photoUrl}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border-2 border-white/50"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Back */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Back</p>
        <div
          ref={backRef}
          className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-lg shadow-xl overflow-hidden bg-white"
        >
          <div className="absolute inset-0 p-6">
            <div className="h-full flex flex-col justify-center">
              <div className="space-y-3">
                {config.phone && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{config.phone}</span>
                  </div>
                )}
                {config.email && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{config.email}</span>
                  </div>
                )}
                {config.website && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{config.website}</span>
                  </div>
                )}
              </div>

              {/* Social Icons */}
              <div className="flex space-x-4 mt-6">
                {config.linkedinUrl && (
                  <Linkedin className="h-5 w-5 text-gray-600" />
                )}
                {config.twitterUrl && (
                  <Twitter className="h-5 w-5 text-gray-600" />
                )}
                {config.instagramUrl && (
                  <Instagram className="h-5 w-5 text-gray-600" />
                )}
                {config.facebookUrl && (
                  <Facebook className="h-5 w-5 text-gray-600" />
                )}
              </div>

              {/* QR Code */}
              <div className="absolute bottom-6 right-6">
                <div className="w-12 h-12 bg-white border border-gray-300 rounded flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-full h-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-xs text-gray-400 text-center">QR</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}