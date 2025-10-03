'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SecurityIcon from '@mui/icons-material/Security';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Icon aliases
const Mail = EmailIcon;
const Phone = PhoneIcon;
const MapPin = LocationOnIcon;
const Heart = FavoriteIcon;
const Send = SendIcon;
const Linkedin = LinkedInIcon;
const Twitter = XIcon;
const Instagram = InstagramIcon;
const Youtube = YouTubeIcon;
const Shield = SecurityIcon;
const CreditCard = CreditCardIcon;
const Truck = LocalShippingIcon;
const Award = EmojiEventsIcon;
const CheckCircle = CheckCircleIcon;

const FooterSection = () => {
  const currentYear = new Date().getFullYear();
  const [emailSubscription, setEmailSubscription] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubscription.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    setEmailSubscription('');
    setIsLoading(false);

    // Reset success state after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const companyLinks = [
    { href: '/founding-member', label: 'Founding Member' },
    { href: '/templates', label: 'Templates' },
    { href: '/landing#testimonials', label: 'Testimonials' },
    { href: '/landing#faq', label: 'FAQ' },
    { href: '/landing#newsletter', label: 'Newsletter' },
  ];

  const productLinks = [
    { href: '/landing#features', label: 'Features' },
    { href: '/landing#pricing', label: 'Pricing' },
    { href: '/landing#how-it-works', label: 'How It Works' },
    { href: '/templates', label: 'Card Templates' },
    { href: '/founding-member', label: 'Membership' },
  ];

  const supportLinks = [
    { href: '/register', label: 'Get Started' },
    { href: '/login', label: 'Login' },
    { href: '/landing#faq', label: 'FAQs' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/account', label: 'My Account' },
  ];

  const socialLinks = [
    { href: 'https://linkedin.com/company/linkist-nfc', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://twitter.com/linkistnfc', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com/linkistnfc', icon: Instagram, label: 'Instagram' },
    { href: 'https://youtube.com/@linkistnfc', icon: Youtube, label: 'YouTube' },
  ];

  const trustBadges = [
    { icon: Shield, text: 'SSL Secured' },
    { icon: CreditCard, text: 'Stripe Payments' },
    { icon: Truck, text: 'Fast Shipping' },
    { icon: Award, text: '30-Day Guarantee' },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />

      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Company Info & Newsletter */}
          <motion.div
            className="lg:col-span-4"
            variants={itemVariants}
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Linkist NFC
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Transform your networking with smart NFC business cards. Share your complete professional profile with just a tap and make lasting connections effortlessly.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest updates on product launches and exclusive offers.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={emailSubscription}
                    onChange={(e) => setEmailSubscription(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || isSubscribed}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-md transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubscribed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>

                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Successfully subscribed! Welcome aboard.
                  </motion.p>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@linkist.ai"
                className="flex items-center text-gray-400 hover:text-white transition-colors group"
              >
                <Mail className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                support@linkist.ai
              </a>
              <a
                href="tel:+1-800-LINKIST"
                className="flex items-center text-gray-400 hover:text-white transition-colors group"
              >
                <Phone className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                1-800-LINKIST
              </a>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-3" />
                San Francisco, CA
              </div>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <h4 className="font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product Links */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <h4 className="font-semibold text-lg mb-6">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media & Trust Badges */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <h4 className="font-semibold text-lg mb-6">Follow Us</h4>

            {/* Social Links */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm text-gray-300">Trusted & Secure</h5>
              <div className="grid grid-cols-2 gap-2">
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 text-gray-400 text-xs"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <badge.icon className="h-4 w-4 text-green-400" />
                    <span>{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-800"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400 text-sm">
              <p>
                © {currentYear} Linkist NFC. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>

            <motion.div
              className="flex items-center text-gray-400 text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="h-4 w-4 mx-2 text-red-500" />
              </motion.div>
              <span>for better networking</span>
            </motion.div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 pt-6 border-t border-gray-800/50">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-gray-500 text-xs">
                We accept all major payment methods
              </div>
              <div className="flex items-center space-x-2 opacity-60">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  AMEX
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded text-white text-xs flex items-center justify-center">
                  <CreditCard className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default FooterSection;