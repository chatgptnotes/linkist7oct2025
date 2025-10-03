'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';
import type { NewsletterFormState, NewsletterSubscriptionRequest } from '@/types/newsletter';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LoopIcon from '@mui/icons-material/Loop';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Icon aliases
const Mail = EmailIcon;
const CheckCircle = CheckCircleIcon;
const AlertCircle = ErrorOutlineIcon;
const Loader2 = LoopIcon;
const Gift = CardGiftcardIcon;
const Sparkles = AutoAwesomeIcon;
const TrendingUp = TrendingUpIcon;

// Email validation schema
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to our privacy policy'
  })
});

type NewsletterFormData = z.infer<typeof emailSchema>;

const NewsletterSection = () => {
  const [state, setState] = useState<NewsletterFormState>({
    email: '',
    consent: false,
    isSubmitting: false,
    message: { type: null, text: '' },
    errors: {}
  });

  const supabase = createClient();

  // Validation helper
  const validateForm = useCallback((data: { email: string; consent: boolean }) => {
    try {
      emailSchema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { email?: string; consent?: string } = {};
        error.errors.forEach(err => {
          if (err.path[0] === 'email') {
            errors.email = err.message;
          } else if (err.path[0] === 'consent') {
            errors.consent = err.message;
          }
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { email: 'Validation failed' } };
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      email: state.email.trim(),
      consent: state.consent
    };

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        errors: validation.errors,
        message: { type: null, text: '' }
      }));
      return;
    }

    // Clear errors and start submission
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      errors: {},
      message: { type: null, text: '' }
    }));

    try {
      // Check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned", which is expected for new subscribers
        throw new Error('Failed to check existing subscription');
      }

      if (existingSubscriber) {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          message: {
            type: 'success',
            text: "You're already subscribed! Thanks for your continued interest."
          }
        }));
        return;
      }

      // Insert new subscriber
      const subscriptionData: NewsletterSubscriptionRequest = {
        email: formData.email,
        source: 'landing_page',
        consent_given: true,
        ip_address: null, // Could be added if needed for compliance
        user_agent: navigator.userAgent,
        tags: ['landing_page', 'founding_member_interest'],
        preferences: { marketing: true, product_updates: true }
      };

      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          ...subscriptionData,
          subscribed_at: new Date().toISOString(),
          status: 'active'
        }]);

      if (insertError) {
        throw insertError;
      }

      // Success
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        email: '',
        consent: false,
        message: {
          type: 'success',
          text: "Welcome aboard! You'll be the first to know about our latest updates and exclusive offers."
        }
      }));

      // Track successful subscription (optional analytics)
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // @ts-ignore
        window.gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: 'landing_page'
        });
      }

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        message: {
          type: 'error',
          text: 'Something went wrong. Please try again or contact support if the issue persists.'
        }
      }));
    }
  }, [state.email, state.consent, supabase, validateForm]);

  // Handle input changes
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setState(prev => ({
      ...prev,
      email,
      errors: { ...prev.errors, email: undefined },
      message: prev.message.type === 'error' ? { type: null, text: '' } : prev.message
    }));
  }, []);

  const handleConsentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const consent = e.target.checked;
    setState(prev => ({
      ...prev,
      consent,
      errors: { ...prev.errors, consent: undefined },
      message: prev.message.type === 'error' ? { type: null, text: '' } : prev.message
    }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: 'Exclusive Early Access',
      description: 'Be first to try new features and get founder member pricing'
    },
    {
      icon: Sparkles,
      title: 'Special Offers',
      description: 'Receive member-only discounts and limited-time promotions'
    },
    {
      icon: TrendingUp,
      title: 'Industry Insights',
      description: 'Get networking tips and digital business card best practices'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99, 102, 241) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-6">
              <Mail className="mr-2 h-4 w-4" />
              Join 5,000+ Smart Networkers
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Stay Ahead of the
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Networking Game
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Get exclusive updates, early access to new features, and insider tips to maximize your networking potential. Plus, founding members get special perks!
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <benefit.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={state.email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    disabled={state.isSubmitting}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                      state.errors.email
                        ? 'border-red-300 dark:border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {state.errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {state.errors.email}
                  </motion.p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={state.consent}
                  onChange={handleConsentChange}
                  disabled={state.isSubmitting}
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 disabled:opacity-50"
                />
                <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to receive marketing emails and understand that I can unsubscribe at any time.
                  View our{' '}
                  <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {state.errors.consent && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {state.errors.consent}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={state.isSubmitting || !state.email || !state.consent}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={!state.isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!state.isSubmitting ? { scale: 0.98 } : {}}
              >
                {state.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Subscribing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Subscribe for Exclusive Updates
                  </div>
                )}
              </motion.button>

              {/* Status Message */}
              {state.message.type && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl flex items-center ${
                    state.message.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {state.message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  )}
                  <span className="text-sm">{state.message.text}</span>
                </motion.div>
              )}
            </form>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  GDPR Compliant
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No Spam, Ever
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Unsubscribe Anytime
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;