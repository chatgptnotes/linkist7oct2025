'use client';

import { motion } from 'framer-motion';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShareIcon from '@mui/icons-material/Share';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LinkIcon from '@mui/icons-material/Link';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';
import LanguageIcon from '@mui/icons-material/Language';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import PaletteIcon from '@mui/icons-material/Palette';
import TranslateIcon from '@mui/icons-material/Translate';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Icon aliases
const Zap = FlashOnIcon;
const Share2 = ShareIcon;
const QrCode = QrCodeIcon;
const Link2 = LinkIcon;
const Download = CloudDownloadIcon;
const Users = GroupsIcon;
const BarChart = BarChartIcon;
const Globe = LanguageIcon;
const Smartphone = SmartphoneIcon;
const CreditCard = CreditCardIcon;
const Calendar = CalendarTodayIcon;
const Shield = SecurityIcon;
const Palette = PaletteIcon;
const Languages = TranslateIcon;
const Clock = AccessTimeIcon;
const TrendingUp = TrendingUpIcon;

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  category: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "NFC Technology",
    description: "Tap any phone to share your profile instantly. No app needed for recipients.",
    category: "Smart Sharing",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Universal compatibility with QR codes for devices without NFC support.",
    category: "Smart Sharing",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    icon: Link2,
    title: "Custom Links",
    description: "Get your personalized linkist.ai/yourname URL for easy sharing.",
    category: "Smart Sharing",
    gradient: "from-purple-400 to-pink-500"
  },
  {
    icon: Share2,
    title: "WhatsApp Integration",
    description: "Share your profile directly through WhatsApp with one click.",
    category: "Smart Sharing",
    gradient: "from-green-400 to-teal-500"
  },
  {
    icon: BarChart,
    title: "Visitor Analytics",
    description: "Track who viewed your profile with detailed engagement metrics.",
    category: "Analytics",
    gradient: "from-indigo-400 to-blue-500"
  },
  {
    icon: Globe,
    title: "Geographic Insights",
    description: "See where your connections come from with location analytics.",
    category: "Analytics",
    gradient: "from-red-400 to-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Monitor link clicks, conversion rates, and ROI metrics.",
    category: "Analytics",
    gradient: "from-emerald-400 to-green-500"
  },
  {
    icon: Users,
    title: "Lead Capture",
    description: "Collect contact information with customizable lead forms.",
    category: "Professional",
    gradient: "from-violet-400 to-purple-500"
  },
  {
    icon: Calendar,
    title: "Calendar Booking",
    description: "Let contacts book meetings directly through Calendly integration.",
    category: "Professional",
    gradient: "from-sky-400 to-blue-500"
  },
  {
    icon: CreditCard,
    title: "Payment Links",
    description: "Accept payments directly through your profile with Stripe.",
    category: "Professional",
    gradient: "from-pink-400 to-rose-500"
  },
  {
    icon: Palette,
    title: "Custom Design",
    description: "Personalize your card and profile with premium templates.",
    category: "Customization",
    gradient: "from-amber-400 to-yellow-500"
  },
  {
    icon: Languages,
    title: "Multi-language",
    description: "Support for multiple languages for global networking.",
    category: "Customization",
    gradient: "from-teal-400 to-cyan-500"
  }
];

const FeaturesGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
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

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <section id="features" className="py-20 lg:py-32 bg-white dark:bg-gray-900">
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
            Powerful Features
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Everything You Need to Network Smarter
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            From instant sharing to detailed analytics, our platform gives you the tools to build meaningful professional connections.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          <button className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
            All Features
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                {/* Icon */}
                <div className={`inline-flex rounded-lg bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>

                {/* Category Badge */}
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {feature.category}
                  </span>
                </div>

                {/* Hover Effect Line */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 rounded-b-2xl bg-gradient-to-r ${feature.gradient}`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            And that's just the beginning...
          </p>
          <button className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition">
            Explore All Features
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;