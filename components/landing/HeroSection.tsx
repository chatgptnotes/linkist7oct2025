'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LanguageIcon from '@mui/icons-material/Language';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Icon aliases
const ChevronRight = ChevronRightIcon;
const Sparkles = AutoAwesomeIcon;
const CreditCard = CreditCardIcon;
const Smartphone = SmartphoneIcon;
const Globe = LanguageIcon;
const Award = EmojiEventsIcon;

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      rotateY: 15,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const valueBadges = [
    { icon: Award, text: "Founding Member Benefits" },
    { icon: CreditCard, text: "Physical + Digital Card" },
    { icon: Smartphone, text: "Mobile App Coming 2026" },
    { icon: Sparkles, text: "$50 AI Credits Included" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Announcement Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 text-sm font-medium text-indigo-800 dark:text-indigo-300">
              <Sparkles className="mr-2 h-4 w-4" />
              Limited Time: 50% Founding Member Discount
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Make your first
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              impression count
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300"
          >
            Transform your networking with smart NFC business cards. Share your complete professional profile with just a tap. Join 5000+ professionals who've already upgraded their networking game.
          </motion.p>

          {/* Value Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {valueBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2 shadow-md"
              >
                <badge.icon className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {badge.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/templates"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform transition hover:scale-105"
            >
              Browse Templates
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/founding-member"
              className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Become a Founding Member
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30-Day Money Back
            </div>
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure Checkout
            </div>
            <div className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-green-500" />
              Ships Worldwide
            </div>
          </motion.div>
        </motion.div>

        {/* NFC Card Showcase - 3D Animation */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            <motion.div
              className="relative z-10 mx-auto"
              whileHover="hover"
              variants={cardVariants}
              style={{ perspective: 1000 }}
            >
              {/* Card Mockup */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-8 shadow-2xl">
                  {/* Card Content */}
                  <div className="flex h-full flex-col justify-between text-white">
                    <div>
                      <div className="text-2xl font-bold">Linkist</div>
                      <div className="mt-1 text-sm opacity-80">Premium NFC Card</div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <div className="h-12 w-12 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-90" />
                      </div>
                      <div className="text-lg font-semibold">Your Name</div>
                      <div className="text-sm opacity-80">Tap to Connect</div>
                    </div>
                  </div>
                  {/* NFC Icon */}
                  <div className="absolute bottom-4 right-4">
                    <svg className="h-8 w-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -left-10 top-10 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Instant Share</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -right-10 top-20 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -left-5 bottom-10 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium">Lead Capture</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-xs mb-1">Scroll to explore</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;