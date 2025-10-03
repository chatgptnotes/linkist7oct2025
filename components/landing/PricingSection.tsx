'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';

// Icon aliases
const Check = CheckIcon;
const X = CloseIcon;
const Sparkles = AutoAwesomeIcon;
const TrendingUp = TrendingUpIcon;
const Building2 = BusinessIcon;

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: string;
  period: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  popular?: boolean;
  icon: React.ElementType;
  gradient: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'digital',
    name: 'Digital Only',
    description: 'Start digital, upgrade anytime',
    price: 24.99,
    originalPrice: 49,
    currency: '$',
    period: 'one-time',
    features: [
      'Virtual Business Card',
      'QR Code Sharing',
      'Digital Profile',
      'Basic Analytics',
      'Social Media Links',
      'Email Support',
      'Mobile App Access (2026)',
    ],
    notIncluded: [
      'Physical NFC Card',
      'Advanced Analytics',
      'Lead Capture Forms',
      'Priority Support',
    ],
    cta: 'Get Started',
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'bundle',
    name: 'Physical + Digital',
    description: 'The complete professional package',
    price: 49.99,
    originalPrice: 99,
    currency: '$',
    period: 'one-time',
    features: [
      'Premium Metal NFC Card',
      'Custom Card Design',
      'Unlimited Digital Profile',
      'Advanced Analytics Dashboard',
      'Lead Capture Forms',
      'Priority Support',
      'Early App Access',
      '$50 AI Credits',
      'CRM Integration',
      'Calendar Booking',
      'Custom URL',
      'Lifetime Updates'
    ],
    notIncluded: [],
    cta: 'Pre-Order Now',
    popular: true,
    icon: TrendingUp,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: 0,
    originalPrice: 0,
    currency: '',
    period: 'custom',
    features: [
      'Everything in Physical + Digital',
      'Bulk Card Orders (10+)',
      'Team Management Dashboard',
      'Custom Branding',
      'API Access',
      'Dedicated Account Manager',
      'Custom Integrations',
      'Analytics API',
      'SSO Authentication',
      'SLA Support',
      'Training & Onboarding',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    icon: Building2,
    gradient: 'from-purple-500 to-pink-500'
  }
];

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
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

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
            Limited-Time Offer
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Founding Member Pricing
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Join now and lock in 50% off regular pricing. One-time payment, lifetime access.
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-6 py-3">
            <Sparkles className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">
              Offer ends in: 48:23:15
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 lg:grid-cols-3"
        >
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-xl ${
                  tier.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-xs font-semibold text-white">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Tier Icon */}
                <div className={`inline-flex rounded-lg bg-gradient-to-br ${tier.gradient} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Tier Info */}
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {tier.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mt-6">
                  {tier.price > 0 ? (
                    <div>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {tier.currency}{tier.price}
                      </span>
                      {tier.originalPrice > 0 && (
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          {tier.currency}{tier.originalPrice}
                        </span>
                      )}
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        One-time payment
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        Custom
                      </span>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Contact for pricing
                      </div>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="mt-8 space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {tier.notIncluded.map((feature, index) => (
                    <li key={index} className="flex items-start opacity-60">
                      <X className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-8">
                  {tier.id === 'enterprise' ? (
                    <Link
                      href="/founding-member"
                      className={`block w-full rounded-full bg-gradient-to-r ${tier.gradient} py-3 text-center font-semibold text-white shadow-lg hover:shadow-xl transition`}
                    >
                      {tier.cta}
                    </Link>
                  ) : (
                    <Link
                      href="/templates"
                      className={`block w-full rounded-full ${
                        tier.popular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                      } py-3 text-center font-semibold transition`}
                    >
                      {tier.cta}
                    </Link>
                  )}
                </div>

                {/* Money Back Guarantee */}
                {tier.id !== 'enterprise' && (
                  <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                    30-day money-back guarantee
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              SSL Secure Checkout
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Stripe Payments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Free Worldwide Shipping
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;