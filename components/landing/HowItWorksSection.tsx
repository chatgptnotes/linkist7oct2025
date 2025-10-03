'use client';

import { motion } from 'framer-motion';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaletteIcon from '@mui/icons-material/Palette';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';

// Icon aliases
const UserPlus = PersonAddIcon;
const CreditCard = CreditCardIcon;
const Palette = PaletteIcon;
const User = PersonIcon;
const Share2 = ShareIcon;

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Choose your region (UAE or India) and verify your mobile number with OTP.',
    icon: UserPlus,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    number: '02',
    title: 'Select Your Package',
    description: 'Pick between Physical + Digital bundle or Digital Only options.',
    icon: CreditCard,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    number: '03',
    title: 'Design Your Card',
    description: 'Choose from premium templates, select colors, and personalize with your name.',
    icon: Palette,
    color: 'from-purple-500 to-pink-500'
  },
  {
    number: '04',
    title: 'Build Your Profile',
    description: 'Add your professional information, social links, and showcase your work.',
    icon: User,
    color: 'from-pink-500 to-rose-500'
  },
  {
    number: '05',
    title: 'Start Networking',
    description: 'Share instantly via NFC tap, QR code, or your custom linkist.ai URL.',
    icon: Share2,
    color: 'from-rose-500 to-orange-500'
  }
];

const HowItWorksSection = () => {
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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-white dark:bg-gray-900">
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
            Simple Process
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Get Started in Minutes
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            From sign-up to sharing your first digital business card, our streamlined process gets you networking faster.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 relative"
        >
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-orange-500 rounded-full" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`relative flex items-center lg:justify-center ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full lg:w-5/12 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                    <div className={`flex items-center gap-4 ${isEven ? 'lg:justify-end' : ''}`}>
                      {/* Mobile Icon */}
                      <div className={`lg:hidden flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className={`flex items-center gap-3 mb-2 ${isEven ? 'lg:justify-end' : ''}`}>
                          <span className="text-5xl font-bold text-gray-200 dark:text-gray-700">
                            {step.number}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center Icon - Desktop */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white dark:bg-gray-800 items-center justify-center shadow-xl z-10">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Empty space for layout */}
                  <div className="hidden lg:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
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
            Ready to transform your networking?
          </p>
          <button className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform transition hover:scale-105">
            Get Started Now
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;