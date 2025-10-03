'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ToastProvider';
import StarsIcon from '@mui/icons-material/Stars';
import StarIcon from '@mui/icons-material/Star';
import CheckIcon from '@mui/icons-material/Check';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Icon aliases
const Crown = StarsIcon;
const Star = StarIcon;
const Check = CheckIcon;
const Zap = FlashOnIcon;
const Gift = CardGiftcardIcon;
const Users = GroupsIcon;
const Trophy = EmojiEventsIcon;
const Sparkles = AutoAwesomeIcon;
const Lock = LockIcon;
const Shield = SecurityIcon;
const TrendingUp = TrendingUpIcon;
const Heart = FavoriteIcon;

export default function FoundingMemberPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('lifetime');
  const [loading, setLoading] = useState(false);

  const benefits = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Lifetime 50% Discount",
      description: "Lock in founding member pricing forever"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Priority Support",
      description: "Get help within 2 hours, 24/7"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Exclusive Designs",
      description: "Access to premium card templates"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Access",
      description: "Join our exclusive founders community"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Early Access",
      description: "Be first to try new features"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Price Lock Guarantee",
      description: "Your price never increases"
    }
  ];

  const plans = [
    {
      id: 'lifetime',
      name: 'Lifetime Founding Member',
      price: 299,
      originalPrice: 999,
      description: 'One-time payment, lifetime benefits',
      features: [
        'Unlimited NFC cards',
        'All premium templates',
        'Priority 24/7 support',
        'Custom branding',
        'API access',
        'White-label options',
        'Founding member badge',
        'Vote on new features'
      ],
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual Founding Member',
      price: 99,
      originalPrice: 199,
      period: '/year',
      description: 'Billed annually, cancel anytime',
      features: [
        'Up to 10 NFC cards',
        'Premium templates',
        'Priority support',
        'Custom branding',
        'Analytics dashboard',
        'Team collaboration',
        'Founding member badge'
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly Founding Member',
      price: 19,
      originalPrice: 39,
      period: '/month',
      description: 'Flexible month-to-month',
      features: [
        'Up to 3 NFC cards',
        'Basic templates',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ]
    }
  ];

  const handleJoin = async () => {
    setLoading(true);

    // Store founding member selection
    localStorage.setItem('foundingMemberPlan', selectedPlan);
    localStorage.setItem('isFoundingMember', 'true');

    showToast('Welcome to the Founding Member program!', 'success');

    // Redirect to product selection with founding member status
    setTimeout(() => {
      router.push('/product-selection?founding=true');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-amber-500/10 to-orange-600/20" />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, gold 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '40px 40px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-2xl opacity-50"
                />
                <Crown className="relative w-20 h-20 text-yellow-400" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Become a{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text">
                Founding Member
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join an exclusive group of early adopters and lock in lifetime benefits at 50% off.
              Only 1,000 spots available.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-full px-6 py-3">
                <span className="text-yellow-400 font-semibold">
                  <Sparkles className="inline w-4 h-4 mr-2" />
                  Limited Time Offer
                </span>
              </div>
              <div className="bg-green-400/10 border border-green-400/30 rounded-full px-6 py-3">
                <span className="text-green-400 font-semibold">
                  <Users className="inline w-4 h-4 mr-2" />
                  847/1000 Spots Remaining
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Exclusive Founding Member Benefits
          </h2>
          <p className="text-gray-400">
            Get lifetime access to premium features at a fraction of the cost
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all"
            >
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Choose Your Founding Member Plan
          </h2>
          <p className="text-gray-400">
            All plans include founding member benefits. Choose what works for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-yellow-400/20 to-amber-500/10 border-2 border-yellow-400'
                  : 'bg-gray-800/50 border border-gray-700'
              } ${selectedPlan === plan.id ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
              style={{ cursor: 'pointer' }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 line-through">
                    ${plan.originalPrice}
                  </span>
                  <span className="ml-2 text-green-400 font-semibold">
                    Save ${plan.originalPrice - plan.price}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center">
                <div className={`w-6 h-6 rounded-full border-2 ${
                  selectedPlan === plan.id
                    ? 'border-yellow-400 bg-yellow-400'
                    : 'border-gray-600'
                }`}>
                  {selectedPlan === plan.id && (
                    <Check className="w-full h-full text-black p-0.5" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={handleJoin}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-lg px-12 py-4 rounded-full hover:shadow-2xl hover:shadow-yellow-400/30 transition-all transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3" />
                Joining...
              </div>
            ) : (
              <>
                <Crown className="inline w-5 h-5 mr-2" />
                Become a Founding Member Now
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center text-gray-400">
              <Lock className="w-4 h-4 mr-2" />
              Secure Payment
            </div>
            <div className="flex items-center text-gray-400">
              <Shield className="w-4 h-4 mr-2" />
              30-Day Money Back
            </div>
            <div className="flex items-center text-gray-400">
              <Heart className="w-4 h-4 mr-2" />
              Cancel Anytime
            </div>
          </div>
        </motion.div>
      </div>

      {/* Urgency Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border border-yellow-400/30 rounded-3xl p-8 text-center"
        >
          <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Prices Increase in 48 Hours
          </h3>
          <p className="text-gray-300 mb-6">
            After the founding member period ends, prices will double.
            Lock in your lifetime discount now.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-black/50 rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-yellow-400">02</div>
              <div className="text-xs text-gray-400">DAYS</div>
            </div>
            <div className="bg-black/50 rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-yellow-400">14</div>
              <div className="text-xs text-gray-400">HOURS</div>
            </div>
            <div className="bg-black/50 rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-yellow-400">37</div>
              <div className="text-xs text-gray-400">MINS</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}