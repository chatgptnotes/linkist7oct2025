'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import QrCodeIcon from '@mui/icons-material/QrCode';
import WifiIcon from '@mui/icons-material/Wifi';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

// Icon aliases
const QrCode = QrCodeIcon;
const Wifi = WifiIcon;
const Smartphone = SmartphoneIcon;
const Globe = LanguageIcon;
const Mail = EmailIcon;
const Phone = PhoneIcon;
const Linkedin = LinkedInIcon;
const Instagram = InstagramIcon;
const Twitter = XIcon;

interface Card3DPreviewProps {
  cardData: {
    name?: string;
    title?: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    photo?: string;
    cardColor?: string;
    textColor?: string;
    logo?: string;
  };
  cardType?: 'black' | 'white' | 'gold' | 'steel';
  className?: string;
}

export default function Card3DPreview({ cardData, cardType = 'black', className = '' }: Card3DPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animations
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Rotation transforms
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getCardBackground = () => {
    switch (cardType) {
      case 'black':
        return 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
      case 'white':
        return 'linear-gradient(135deg, #ffffff 0%, #f3f3f3 50%, #ffffff 100%)';
      case 'gold':
        return 'linear-gradient(135deg, #d4af37 0%, #f9e7a0 50%, #d4af37 100%)';
      case 'steel':
        return 'linear-gradient(135deg, #71797E 0%, #b4bdc3 50%, #71797E 100%)';
      default:
        return 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
    }
  };

  const getTextColor = () => {
    return cardType === 'white' ? '#1a1a1a' : '#ffffff';
  };

  return (
    <div className={`perspective-1000 ${className}`}>
      <motion.div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto"
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Card Container */}
        <div
          className="relative aspect-[1.586/1] rounded-2xl cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <motion.div
            className="absolute inset-0 rounded-2xl p-8 backface-hidden"
            style={{
              background: getCardBackground(),
              color: getTextColor(),
              backfaceVisibility: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            whileHover={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* NFC Chip */}
            <div className="absolute top-8 left-8">
              <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-90">
                <div className="w-full h-full flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-white/80 rotate-90" />
                </div>
              </div>
            </div>

            {/* Logo */}
            {cardData.logo && (
              <div className="absolute top-8 right-8">
                <img src={cardData.logo} alt="Logo" className="h-12 object-contain" />
              </div>
            )}

            {/* Centered Content */}
            <div className="h-full flex flex-col justify-center items-center text-center">
              {/* Profile Photo */}
              {cardData.photo ? (
                <motion.img
                  src={cardData.photo}
                  alt={cardData.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white/20"
                  whileHover={{ scale: 1.1 }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 mb-4 flex items-center justify-center">
                  <Smartphone className="w-12 h-12 opacity-50" />
                </div>
              )}

              {/* Name & Title */}
              <motion.h2
                className="text-2xl font-bold mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {cardData.name || 'Your Name'}
              </motion.h2>
              <motion.p
                className="text-lg opacity-90 mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {cardData.title || 'Your Title'}
              </motion.p>
              <motion.p
                className="text-md opacity-80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {cardData.company || 'Your Company'}
              </motion.p>
            </div>

            {/* QR Code */}
            <div className="absolute bottom-8 right-8">
              <motion.div
                className="w-16 h-16 bg-white rounded-lg p-1"
                whileHover={{ scale: 1.1 }}
              >
                <QrCode className="w-full h-full text-black" />
              </motion.div>
            </div>

            {/* Tap to Connect */}
            <div className="absolute bottom-8 left-8 flex items-center space-x-2 opacity-60">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs">Tap to Connect</span>
            </div>
          </motion.div>

          {/* Back Side */}
          <motion.div
            className="absolute inset-0 rounded-2xl p-8 backface-hidden"
            style={{
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              color: '#1a1a1a',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div className="h-full flex flex-col justify-between">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>

                {cardData.email && (
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <Mail className="w-5 h-5 text-red-500" />
                    <span className="text-sm">{cardData.email}</span>
                  </motion.div>
                )}

                {cardData.phone && (
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <Phone className="w-5 h-5 text-red-500" />
                    <span className="text-sm">{cardData.phone}</span>
                  </motion.div>
                )}

                {cardData.website && (
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <Globe className="w-5 h-5 text-red-500" />
                    <span className="text-sm">{cardData.website}</span>
                  </motion.div>
                )}
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-bold mb-4">Connect</h3>
                <div className="flex space-x-4">
                  {cardData.linkedin && (
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                  {cardData.instagram && (
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                  {cardData.twitter && (
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-10 h-10 bg-black rounded-full flex items-center justify-center"
                    >
                      <Twitter className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bottom QR and Logo */}
              <div className="flex items-end justify-between">
                <div className="text-xs opacity-60">
                  <p>Powered by Linkist</p>
                  <p>linkist.com</p>
                </div>
                <div className="w-16 h-16 bg-black rounded-lg p-1">
                  <QrCode className="w-full h-full text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Instructions */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Click to flip • Move mouse to tilt
        </p>
      </div>
    </div>
  );
}