'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TargetIcon from '@mui/icons-material/GpsFixed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import ShareIcon from '@mui/icons-material/Share';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SecurityIcon from '@mui/icons-material/Security';

// Icon aliases
const Brain = PsychologyIcon;
const Target = TargetIcon;
const TrendingUp = TrendingUpIcon;
const Users = GroupsIcon;
const Share2 = ShareIcon;
const Sparkles = AutoAwesomeIcon;
const Check = CheckIcon;
const ChevronDown = ExpandMoreIcon;
const Calendar = CalendarTodayIcon;
const Rocket = RocketLaunchIcon;
const Zap = FlashOnIcon;
const Shield = SecurityIcon;

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'offer', 'why', 'timeline', 'faq'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'PRM, not CRM',
      description: 'Relationships over records: remember context, warmth, and timing; reduce "lead fatigue" and increase real outcomes.'
    },
    {
      icon: Sparkles,
      title: 'AI Nudges & Smart Recall',
      description: 'Never forget names, details, or promises; get timely prompts to reach out with purpose.'
    },
    {
      icon: Target,
      title: 'ICP Scoring & Matchmaking',
      description: 'Instantly see fit vs. your Ideal Customer Profile; focus time on high-yield connections.'
    },
    {
      icon: TrendingUp,
      title: 'Engagement Insights',
      description: 'Track card views, link clicks, and replies to prioritize who\'s ready now.'
    },
    {
      icon: Users,
      title: 'Org-Wide Knowledge',
      description: 'Team-safe contact intelligence so relationships don\'t leave when people do.'
    },
    {
      icon: Share2,
      title: 'Seamless Sharing & Search',
      description: 'NFC/QR/link, multi-SSO, fast import, context-aware search across your network.'
    }
  ];

  const pricingTiers = [
    { name: 'Metal', price: 89, popular: true },
    { name: 'Wood', price: 69, popular: false },
    { name: 'PVC', price: 59, popular: false },
    { name: 'Digital + AI', price: 55, popular: false },
    { name: 'Digital Only', price: 19, popular: false }
  ];

  const stats = [
    { value: '88%', label: 'of paper business cards discarded within a week' },
    { value: '80%', label: 'of professionals forget key details within days' },
    { value: '70%', label: 'of leads lost to poor or late follow-up' },
    { value: '60%', label: 'struggle to recall context when reconnecting' }
  ];

  const benefits = [
    { value: '50%', label: 'faster follow-ups and more conversions' },
    { value: '40%', label: 'more timely post-event follow-ups' },
    { value: '70%', label: 'faster prospect identification' },
    { value: '4×', label: 'more relevant contact surfacing' },
    { value: '90%', label: 'contact recall efficiency increase' },
    { value: '80%', label: 'AI-driven lead capture lift' }
  ];

  const timeline = [
    { date: 'Today', title: 'Become a Founding Member', description: 'Gain an edge in your networking' },
    { date: 'Dec 2025', title: 'MVP Launch', description: 'Start using Linkist PRM' },
    { date: 'Mar 2026', title: 'AI Analytics', description: 'Smart relationship building' },
    { date: 'Dec 2026', title: 'Enterprise Ready', description: 'Global scale deployment' }
  ];

  const faqs = [
    {
      q: 'What is Linkist PRM™?',
      a: 'Linkist is a Personal Relationship Manager that remembers context, prioritizes who matters, and nudges you to follow up — so you build meaningful, lasting business relationships.'
    },
    {
      q: 'How is PRM different from a CRM?',
      a: 'CRMs track deals and pipelines; PRM focuses on people, context, and timing — helping you nurture relationships beyond transactions.'
    },
    {
      q: 'What do I get as a Founding Member?',
      a: 'A limited-edition NFC card (Metal/Wood/PVC), a personal digital profile + unique URL, 1-year Linkist Pro (worth ~$120) at app launch, and $50 AI credits.'
    },
    {
      q: 'What are the prices?',
      a: 'Metal $89, Wood $69, PVC $59, Digital+AI $55, Digital Only $19. Founding prices are limited-time and exclusive.'
    },
    {
      q: 'When is the app launching?',
      a: 'Linkist targets Jan 2026 launch for the Pro experience; MVP milestones begin earlier per roadmap.'
    },
    {
      q: 'What does the 1-year Pro include?',
      a: 'Advanced insights, ICP scoring, AI nudges, engagement analytics, and priority support.'
    },
    {
      q: 'How do the AI credits work?',
      a: 'Your $50 AI credit can be used for AI-powered features like enrichment, nudges, and insights; visible as a wallet/balance at launch.'
    },
    {
      q: 'How fast will I get my NFC card?',
      a: 'Production begins immediately after confirmation. Typical dispatch window 7–14 business days, depending on material and engraving queue.'
    },
    {
      q: 'Is the digital profile included if I buy an NFC card?',
      a: 'Yes. Every physical NFC card includes a hosted digital profile page and unique shareable link.'
    },
    {
      q: 'Can teams or companies buy in bulk?',
      a: 'Yes. We support team onboarding and branded cards; contact sales from the /welcome page.'
    },
    {
      q: 'What about privacy and security?',
      a: 'Linkist is built with human-first design and privacy at the core; you control visibility of fields and can revoke sharing at any time.'
    },
    {
      q: 'Refunds or cancellations?',
      a: 'Customized NFC cards follow standard personalization policies. For digital tiers, you can cancel before shipment/activation; see terms at checkout.'
    }
  ];

  return (
    <div className="bg-[#0F0F12] text-[#F5F7FA] min-h-screen">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 w-full bg-[#0F0F12]/95 backdrop-blur-sm border-b border-[#1C1C22] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 py-3">
            {/* Logo */}
            <Logo href="/" width={120} height={40} variant="dark" />

            {/* Center Nav */}
            <div className="hidden md:flex space-x-8">
              {['features', 'offer', 'why', 'timeline', 'faq'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`text-sm capitalize transition-colors ${
                    activeSection === item ? 'text-[#E02424]' : 'text-[#A3A8B3] hover:text-[#F5F7FA]'
                  }`}
                >
                  {item === 'why' ? 'Why Linkist' : item === 'offer' ? 'Offer' : item}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-[#F5F7FA] px-6 py-2 rounded-full font-medium hover:text-[#E02424] transition-all"
              >
                Login
              </Link>
              <Link
                href="/choose-plan"
                className="bg-[#E02424] text-white px-6 py-2 rounded-full font-medium hover:bg-[#C01E1E] transition-all hover:shadow-lg hover:shadow-[#E02424]/20"
                style={{ backgroundColor: '#E02424', color: '#FFFFFF' }}
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E02424]/10 via-transparent to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pr-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                Remember better.
                <br />
                <span className="text-[#E02424]">Network with intention.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#A3A8B3] mb-8 leading-relaxed">
                Linkist is the world's first <span className="text-[#E02424] font-semibold">PRM™</span> — an AI-powered Personal Relationship Manager that remembers every contact, adds context, scores who matters most, and nudges you at the right time.
              </p>

              <ul className="space-y-4 mb-8 pr-2">
                {[
                  'Turn introductions into lasting opportunities',
                  'Prioritize your most valuable relationships',
                  'Follow up on time — every time'
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start"
                  >
                    <Check className="w-6 h-6 text-[#E02424] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#F5F7FA] text-sm sm:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-3 bg-[#1C1C22] text-white rounded-full font-medium hover:bg-[#2C2C32] transition-all border border-[#E02424]/20"
                  style={{ backgroundColor: '#1C1C22', color: '#FFFFFF' }}
                >
                  Know More
                </button>
                <Link
                  href="/choose-plan"
                  className="px-8 py-3 bg-[#E02424] text-white rounded-full font-medium hover:bg-[#C01E1E] transition-all hover:shadow-lg hover:shadow-[#E02424]/20"
                  style={{ backgroundColor: '#E02424', color: '#FFFFFF' }}
                >
                  Join Now
                </Link>
              </div>

              <p className="text-sm text-[#A3A8B3]">
                Built by experienced founders in CX, product, and enterprise tech
              </p>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl bg-gradient-to-br from-[#1C1C22] to-[#0F0F12] p-6 border border-[#E02424]/10 shadow-2xl">
                {/* Phone Mockup */}
                <div className="relative mx-auto w-56 h-[420px] bg-[#0F0F12] rounded-[3rem] border-4 border-[#2C2C32] shadow-2xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-6 bg-[#1C1C22] flex items-center justify-center">
                    <div className="w-24 h-4 bg-[#0F0F12] rounded-full" />
                  </div>
                  <div className="p-4 pt-8 h-full bg-gradient-to-b from-[#1C1C22] to-[#0F0F12]">
                    <div className="text-center mb-6">
                      <h3 className="text-sm font-semibold text-[#E02424]">Linkist PRM™</h3>
                      <p className="text-xs text-[#A3A8B3]">Your Network, Organized</p>
                    </div>

                    {/* Contact Cards Preview */}
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#1C1C22] rounded-xl p-3 border border-[#2C2C32]">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#E02424]/20 flex items-center justify-center">
                              <span className="text-[#E02424] text-sm font-bold">A</span>
                            </div>
                            <div className="flex-1">
                              <div className="h-3 bg-[#2C2C32] rounded w-24 mb-1" />
                              <div className="h-2 bg-[#2C2C32]/50 rounded w-16" />
                            </div>
                            <div className="text-[#E02424] text-xs font-bold">95</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NFC Card Overlay */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-3 -right-3 w-40 h-28 bg-gradient-to-br from-[#2C2C32] to-[#1C1C22] rounded-2xl shadow-2xl border border-[#E02424]/20 p-3"
                >
                  <div className="text-[10px] text-[#A3A8B3] mb-1">FOUNDING MEMBER</div>
                  <div className="text-[#E02424] text-lg font-bold mb-1">LINKIST</div>
                  <div className="text-[10px] text-[#A3A8B3]">Premium NFC Card</div>
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 border-2 border-[#E02424] rounded-lg flex items-center justify-center">
                      <Zap className="w-3 h-3 text-[#E02424]" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1: Features */}
      <section id="features" className="py-12 bg-[#0F0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">
              What makes <span className="text-[#E02424]">Linkist</span> different
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[#1C1C22] rounded-2xl p-6 border border-[#2C2C32] hover:border-[#E02424]/30 transition-all"
              >
                <feature.icon className="w-8 h-8 text-[#E02424] mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#A3A8B3] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/choose-plan"
              className="inline-block px-8 py-3 bg-[#E02424] text-white rounded-full font-medium hover:bg-[#C01E1E] transition-all hover:shadow-lg hover:shadow-[#E02424]/20"
              style={{ backgroundColor: '#E02424', color: '#FFFFFF' }}
            >
              Become a Founding Member
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Pricing */}
      <section id="offer" className="py-12 bg-[#1C1C22]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-[#E02424]">Founding Member:</span> limited cards, lifetime bragging rights
            </h2>
            <p className="text-xl text-[#A3A8B3] max-w-3xl mx-auto">
              Reserve your Founding Member NFC card today and unlock premium networking benefits when the app launches.
            </p>
          </motion.div>

          {/* Perks */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Sparkles, text: 'Premium NFC Card with FOUNDING MEMBER tag' },
              { icon: Calendar, text: '1-year Linkist Pro (≈ $120 value)' },
              { icon: Zap, text: '$50 in AI credits' },
              { icon: Share2, text: 'Personal digital profile + unique URL' }
            ].map((perk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#1C1C22] rounded-xl p-4 border border-[#E02424]/10 flex items-start space-x-3"
              >
                <perk.icon className="w-5 h-5 text-[#E02424] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#F5F7FA]">{perk.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Pricing Tiers */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative bg-[#1C1C22] rounded-2xl p-6 border transition-all ${
                  tier.popular
                    ? 'border-[#E02424] shadow-lg shadow-[#E02424]/20'
                    : 'border-[#2C2C32] hover:border-[#E02424]/30'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E02424] text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-[#E02424] mb-4">
                  ${tier.price}
                </div>
                <Link
                  href="/choose-plan"
                  className={`block w-full py-2 rounded-full text-center font-medium transition-all ${
                    tier.popular
                      ? 'bg-[#E02424] text-white hover:bg-[#C01E1E]'
                      : 'bg-[#2C2C32] text-[#F5F7FA] hover:bg-[#3C3C42]'
                  }`}
                  style={{
                    backgroundColor: tier.popular ? '#E02424' : '#2C2C32',
                    color: '#FFFFFF'
                  }}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-[#A3A8B3]">
            Founding prices are limited-time and exclusive. Digital profile is included with any physical NFC card.
          </p>
        </div>
      </section>

      {/* Section 3: Stats */}
      <section id="why" className="py-12 bg-[#0F0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Don't let great connections <span className="text-[#E02424]">go cold</span>
            </h2>
            <p className="text-xl text-[#A3A8B3] max-w-3xl mx-auto">
              Networking breaks down after the handshake — you forget context, delay follow-ups, and lose momentum. Linkist fixes that with memory, timing, and intelligent focus.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#1C1C22] rounded-2xl p-6 border border-[#2C2C32] text-center"
              >
                <div className="text-5xl font-bold text-[#E02424] mb-3">{stat.value}</div>
                <p className="text-sm text-[#A3A8B3]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#1C1C22] rounded-3xl p-8 border border-[#E02424]/20">
            <h3 className="text-2xl font-bold mb-8 text-center">
              The <span className="text-[#E02424]">Linkist Advantage</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <Check className="w-5 h-5 text-[#E02424] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-2xl font-bold text-[#E02424] mb-1">{benefit.value}</div>
                    <p className="text-sm text-[#A3A8B3]">{benefit.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/choose-plan"
              className="inline-block px-8 py-3 bg-[#E02424] text-white rounded-full font-medium hover:bg-[#C01E1E] transition-all hover:shadow-lg hover:shadow-[#E02424]/20"
              style={{ backgroundColor: '#E02424', color: '#FFFFFF' }}
            >
              Secure Your Advantage
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Timeline */}
      <section id="timeline" className="py-12 bg-[#1C1C22]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">
              The <span className="text-[#E02424]">Linkist</span> Roadmap
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="bg-[#1C1C22] rounded-2xl p-6 border border-[#2C2C32] hover:border-[#E02424]/30 transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-[#E02424]/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-[#E02424]" />
                  </div>
                  <div className="text-sm text-[#E02424] font-semibold mb-2">{item.date}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[#A3A8B3] flex-grow">{item.description}</p>
                </div>
                {idx < timeline.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[#E02424]/20" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/choose-plan"
              className="inline-block px-8 py-3 bg-[#E02424] text-white rounded-full font-medium hover:bg-[#C01E1E] transition-all hover:shadow-lg hover:shadow-[#E02424]/20"
              style={{ backgroundColor: '#E02424', color: '#FFFFFF' }}
            >
              Shape the Future of Networking
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: FAQ */}
      <section id="faq" className="py-12 bg-[#0F0F12]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked <span className="text-[#E02424]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#1C1C22] rounded-2xl border border-[#2C2C32] overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-[#2C2C32]/50 transition-colors"
                >
                  <span className="font-semibold text-lg pr-8">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#E02424] transition-transform flex-shrink-0 ${
                      faqOpen === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[#A3A8B3] leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0F0F12]/95 backdrop-blur-sm border-t border-[#2C2C32] z-50">
        <Link
          href="/choose-plan"
          className="block w-full py-3 bg-[#E02424] text-white rounded-full font-medium text-center hover:bg-[#C01E1E] transition-all"
          style={{ backgroundColor: '#E02424', color: '#FFFFFF' }}
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}
