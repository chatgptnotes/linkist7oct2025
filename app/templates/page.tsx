'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LanguageIcon from '@mui/icons-material/Language';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ShareIcon from '@mui/icons-material/Share';

// Icon aliases
const Briefcase = WorkIcon;
const Palette = PaletteIcon;
const Code = CodeIcon;
const Heart = FavoriteIcon;
const Camera = CameraAltIcon;
const Music = MusicNoteIcon;
const Zap = FlashOnIcon;
const Globe = LanguageIcon;
const Award = EmojiEventsIcon;
const Users = GroupsIcon;
const Sparkles = AutoAwesomeIcon;
const TrendingUp = TrendingUpIcon;
const Check = CheckIcon;
const Eye = VisibilityIcon;
const Download = CloudDownloadIcon;
const Share2 = ShareIcon;

const templates = [
  {
    id: 'executive',
    name: 'Executive Pro',
    category: 'Business',
    description: 'Sophisticated design for C-suite executives',
    icon: <Briefcase className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: 'white',
      accentColor: '#fbbf24'
    },
    features: ['Minimalist design', 'Gold accents', 'QR code integration'],
    popular: true
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    category: 'Creative',
    description: 'Bold and artistic for designers and creators',
    icon: <Palette className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: 'white',
      accentColor: '#10b981'
    },
    features: ['Gradient backgrounds', 'Portfolio links', 'Social media focus']
  },
  {
    id: 'tech',
    name: 'Tech Innovator',
    category: 'Technology',
    description: 'Modern design for tech professionals',
    icon: <Code className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      textColor: 'white',
      accentColor: '#f59e0b'
    },
    features: ['Dark mode', 'GitHub integration', 'Tech stack display']
  },
  {
    id: 'health',
    name: 'Healthcare Pro',
    category: 'Healthcare',
    description: 'Professional template for medical practitioners',
    icon: <Heart className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      textColor: '#1f2937',
      accentColor: '#ef4444'
    },
    features: ['Appointment booking', 'Credentials display', 'Emergency contact']
  },
  {
    id: 'photo',
    name: 'Photography Master',
    category: 'Creative',
    description: 'Visual-first design for photographers',
    icon: <Camera className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      textColor: '#1f2937',
      accentColor: '#8b5cf6'
    },
    features: ['Portfolio gallery', 'Booking system', 'Instagram feed']
  },
  {
    id: 'music',
    name: 'Music Artist',
    category: 'Entertainment',
    description: 'Dynamic template for musicians and DJs',
    icon: <Music className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      textColor: 'white',
      accentColor: '#14b8a6'
    },
    features: ['Spotify integration', 'Tour dates', 'Merch links']
  },
  {
    id: 'startup',
    name: 'Startup Founder',
    category: 'Business',
    description: 'Energetic design for entrepreneurs',
    icon: <Zap className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      textColor: 'white',
      accentColor: '#3b82f6'
    },
    features: ['Pitch deck link', 'Investment info', 'Team showcase'],
    new: true
  },
  {
    id: 'global',
    name: 'Global Network',
    category: 'Business',
    description: 'International business professional',
    icon: <Globe className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #3f51b1 0%, #5a55ae 100%)',
      textColor: 'white',
      accentColor: '#fbbf24'
    },
    features: ['Multi-language', 'Time zones', 'Global offices']
  },
  {
    id: 'premium',
    name: 'Premium Elite',
    category: 'Luxury',
    description: 'Ultra-luxury design with gold elements',
    icon: <Award className="w-6 h-6" />,
    preview: {
      bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      textColor: '#fbbf24',
      accentColor: '#fbbf24'
    },
    features: ['Gold foil effect', 'Premium materials', 'VIP access'],
    premium: true
  }
];

const categories = ['All', 'Business', 'Creative', 'Technology', 'Healthcare', 'Entertainment', 'Luxury'];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const filteredTemplates = templates.filter(
    template => selectedCategory === 'All' || template.category === selectedCategory
  );

  const handleSelectTemplate = (templateId: string) => {
    localStorage.setItem('selectedTemplate', templateId);
    router.push(`/nfc/configure?template=${templateId}`);
  };

  const handlePreview = (templateId: string) => {
    setSelectedTemplate(templateId);
    setPreviewMode(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Perfect Template
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Start with a professionally designed template and customize it to match your brand
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Badge */}
              {template.popular && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                </div>
              )}
              {template.new && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </div>
                </div>
              )}
              {template.premium && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    PREMIUM
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Preview Card */}
                <div
                  className="h-48 p-6 relative overflow-hidden"
                  style={{ background: template.preview.bg }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      {template.icon}
                      <Sparkles className="w-5 h-5" style={{ color: template.preview.accentColor }} />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/30 rounded w-3/4"></div>
                      <div className="h-2 bg-white/20 rounded w-1/2"></div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {template.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1 mb-6">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <Check className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePreview(template.id)}
                      className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleSelectTemplate(template.id)}
                      className="flex-1 flex items-center justify-center py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Template Preview
                </h2>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Large Preview */}
              <div className="aspect-[1.586/1] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="h-full p-8 relative"
                  style={{
                    background: templates.find(t => t.id === selectedTemplate)?.preview.bg
                  }}
                >
                  <div className="text-white space-y-4">
                    <div className="text-3xl font-bold">John Doe</div>
                    <div className="text-lg opacity-90">CEO & Founder</div>
                    <div className="text-sm opacity-80">TechCorp Industries</div>
                    <div className="mt-8 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-white/30 rounded"></div>
                        <span className="text-sm">john@example.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-white/30 rounded"></div>
                        <span className="text-sm">+1 234 567 890</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-8 right-8">
                    <div className="w-24 h-24 bg-white/20 rounded-xl"></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSelectTemplate(selectedTemplate)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-300 mb-8">
            Our design team can create a custom template tailored to your brand
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Request Custom Design
          </button>
        </div>
      </div>
    </div>
  );
}