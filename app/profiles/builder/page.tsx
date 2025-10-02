'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  Link2,
  Image,
  Settings,
  Eye,
  Save,
  Check,
  Upload,
  Plus,
  X,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Award,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react'

const steps = [
  { id: 'basic', name: 'Basic Info', icon: User },
  { id: 'professional', name: 'Professional', icon: Briefcase },
  { id: 'links', name: 'Social Links', icon: Link2 },
  { id: 'media', name: 'Media', icon: Image },
  { id: 'settings', name: 'Settings', icon: Settings },
  { id: 'preview', name: 'Preview', icon: Eye }
]

const socialPlatforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/username' },
  { id: 'github', name: 'GitHub', icon: Github, placeholder: 'github.com/username' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, placeholder: 'twitter.com/username' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'instagram.com/username' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, placeholder: 'facebook.com/username' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'youtube.com/c/channel' },
  { id: 'website', name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
  { id: 'email', name: 'Email', icon: Mail, placeholder: 'you@example.com' }
]

export default function ProfileBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const template = searchParams.get('template') || 'professional'
  const profileId = searchParams.get('id')

  const [currentStep, setCurrentStep] = useState(0)
  const [profileData, setProfileData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profileImage: null as File | null,

    // Professional
    company: '',
    position: '',
    experience: [] as Array<{
      company: string
      position: string
      startDate: string
      endDate: string
      description: string
    }>,
    education: [] as Array<{
      institution: string
      degree: string
      field: string
      graduationYear: string
    }>,
    skills: [] as string[],

    // Social Links
    socialLinks: {} as Record<string, string>,

    // Media
    coverImage: null as File | null,
    gallery: [] as File[],
    documents: [] as File[],

    // Settings
    visibility: 'public' as 'public' | 'private' | 'unlisted',
    customUrl: '',
    theme: 'light' as 'light' | 'dark' | 'auto',
    allowContact: true,
    showAnalytics: false
  })

  const [newSkill, setNewSkill] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load existing profile data if editing
    if (profileId) {
      // TODO: Fetch profile data from Supabase
      console.log('Loading profile:', profileId)
    }

    // Apply template defaults
    if (template && !profileId) {
      // TODO: Apply template-specific defaults
      console.log('Using template:', template)
    }
  }, [profileId, template])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // TODO: Save to Supabase
      const response = await fetch('/api/profiles', {
        method: profileId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          template,
          id: profileId
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/p/${data.profileId || profileId}`)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addExperience = () => {
    setProfileData({
      ...profileData,
      experience: [
        ...profileData.experience,
        { company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    })
  }

  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [
        ...profileData.education,
        { institution: '', degree: '', field: '', graduationYear: '' }
      ]
    })
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

            {/* Profile Image Upload */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.profileImage ? (
                    <img
                      src={URL.createObjectURL(profileData.profileImage)}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setProfileData({ ...profileData, profileImage: e.target.files[0] })
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                <p className="text-xs text-gray-500">Upload a professional photo. Recommended: 400x400px</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-32 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        )

      case 'professional':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Professional Information</h2>

            {/* Current Position */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Current Position
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Senior Developer"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-medium mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Work Experience
                </span>
                <button
                  onClick={addExperience}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </button>
              </h3>
              <div className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    <button
                      onClick={() => {
                        const newExperience = [...profileData.experience]
                        newExperience.splice(index, 1)
                        setProfileData({ ...profileData, experience: newExperience })
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExperience = [...profileData.experience]
                          newExperience[index].company = e.target.value
                          setProfileData({ ...profileData, experience: newExperience })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Company Name"
                      />
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const newExperience = [...profileData.experience]
                          newExperience[index].position = e.target.value
                          setProfileData({ ...profileData, experience: newExperience })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Position"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => {
                          const newExperience = [...profileData.experience]
                          newExperience[index].startDate = e.target.value
                          setProfileData({ ...profileData, experience: newExperience })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => {
                          const newExperience = [...profileData.experience]
                          newExperience[index].endDate = e.target.value
                          setProfileData({ ...profileData, experience: newExperience })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExperience = [...profileData.experience]
                        newExperience[index].description = e.target.value
                        setProfileData({ ...profileData, experience: newExperience })
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none"
                      placeholder="Description of responsibilities..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="font-medium mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </span>
                <button
                  onClick={addEducation}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </button>
              </h3>
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    <button
                      onClick={() => {
                        const newEducation = [...profileData.education]
                        newEducation.splice(index, 1)
                        setProfileData({ ...profileData, education: newEducation })
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEducation = [...profileData.education]
                          newEducation[index].institution = e.target.value
                          setProfileData({ ...profileData, education: newEducation })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="University Name"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...profileData.education]
                          newEducation[index].degree = e.target.value
                          setProfileData({ ...profileData, education: newEducation })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Degree (e.g., Bachelor's)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => {
                          const newEducation = [...profileData.education]
                          newEducation[index].field = e.target.value
                          setProfileData({ ...profileData, education: newEducation })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Field of Study"
                      />
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) => {
                          const newEducation = [...profileData.education]
                          newEducation[index].graduationYear = e.target.value
                          setProfileData({ ...profileData, education: newEducation })
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Graduation Year"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Skills
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-4 py-2 border rounded-lg"
                  placeholder="Add a skill..."
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      onClick={() => {
                        const newSkills = profileData.skills.filter((_, i) => i !== index)
                        setProfileData({ ...profileData, skills: newSkills })
                      }}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )

      case 'links':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Social Links</h2>
            <p className="text-gray-600">Add your social media profiles and contact information</p>

            <div className="space-y-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <div key={platform.id} className="flex items-center gap-4">
                    <div className="w-40 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                    <input
                      type="text"
                      value={profileData.socialLinks[platform.id] || ''}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          socialLinks: {
                            ...profileData.socialLinks,
                            [platform.id]: e.target.value
                          }
                        })
                      }
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder={platform.placeholder}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'media':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Media & Documents</h2>

            {/* Cover Image */}
            <div>
              <h3 className="font-medium mb-4">Cover Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                {profileData.coverImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(profileData.coverImage)}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setProfileData({ ...profileData, coverImage: null })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">Click to upload cover image</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 1920x600px</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setProfileData({ ...profileData, coverImage: e.target.files[0] })
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h3 className="font-medium mb-4">Photo Gallery</h3>
              <div className="grid grid-cols-4 gap-4">
                {profileData.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const newGallery = profileData.gallery.filter((_, i) => i !== index)
                        setProfileData({ ...profileData, gallery: newGallery })
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-gray-400">
                  <Plus className="h-8 w-8 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const newImages = Array.from(e.target.files)
                        setProfileData({
                          ...profileData,
                          gallery: [...profileData.gallery, ...newImages]
                        })
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="font-medium mb-4">Documents</h3>
              <div className="space-y-2">
                {profileData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        const newDocs = profileData.documents.filter((_, i) => i !== index)
                        setProfileData({ ...profileData, documents: newDocs })
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload documents (PDF, DOC, etc.)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newDocs = Array.from(e.target.files)
                          setProfileData({
                            ...profileData,
                            documents: [...profileData.documents, ...newDocs]
                          })
                        }
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Visibility
              </label>
              <div className="space-y-2">
                {['public', 'unlisted', 'private'].map((visibility) => (
                  <label key={visibility} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibility"
                      value={visibility}
                      checked={profileData.visibility === visibility}
                      onChange={(e) =>
                        setProfileData({ ...profileData, visibility: e.target.value as any })
                      }
                      className="text-black"
                    />
                    <div>
                      <p className="font-medium capitalize">{visibility}</p>
                      <p className="text-xs text-gray-500">
                        {visibility === 'public' && 'Anyone can view your profile'}
                        {visibility === 'unlisted' && 'Only people with the link can view'}
                        {visibility === 'private' && 'Only you can view your profile'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Profile URL
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">linkist.com/p/</span>
                <input
                  type="text"
                  value={profileData.customUrl}
                  onChange={(e) => setProfileData({ ...profileData, customUrl: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="your-custom-url"
                />
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'auto'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setProfileData({ ...profileData, theme: theme as any })}
                    className={`p-3 border rounded-lg capitalize ${
                      profileData.theme === theme
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium">Allow Contact</p>
                  <p className="text-xs text-gray-500">Let visitors contact you through your profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.allowContact}
                  onChange={(e) => setProfileData({ ...profileData, allowContact: e.target.checked })}
                  className="h-5 w-5"
                />
              </label>

              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium">Show Analytics</p>
                  <p className="text-xs text-gray-500">Display visitor statistics on your profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.showAnalytics}
                  onChange={(e) => setProfileData({ ...profileData, showAnalytics: e.target.checked })}
                  className="h-5 w-5"
                />
              </label>
            </div>
          </div>
        )

      case 'preview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Profile Preview</h2>

            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Cover Image */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {profileData.coverImage && (
                  <img
                    src={URL.createObjectURL(profileData.coverImage)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-4 -mt-12 mb-6">
                  <div className="h-24 w-24 bg-gray-200 rounded-full border-4 border-white overflow-hidden">
                    {profileData.profileImage ? (
                      <img
                        src={URL.createObjectURL(profileData.profileImage)}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-300">
                        <User className="h-12 w-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pt-12">
                    <h3 className="text-2xl font-bold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-gray-600">{profileData.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{profileData.location}</p>
                  </div>
                </div>

                {/* Bio */}
                {profileData.bio && (
                  <div className="mb-6">
                    <p className="text-gray-700">{profileData.bio}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {profileData.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                  {profileData.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>

                {/* Current Position */}
                {(profileData.company || profileData.position) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Position</h4>
                    <p className="text-sm">
                      {profileData.position} {profileData.company && `at ${profileData.company}`}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {profileData.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-3">
                  {Object.entries(profileData.socialLinks).map(([platform, url]) => {
                    if (!url) return null
                    const platformData = socialPlatforms.find((p) => p.id === platform)
                    if (!platformData) return null
                    const Icon = platformData.icon
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => window.open(`/p/preview?data=${encodeURIComponent(JSON.stringify(profileData))}`, '_blank')}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-5 w-5" />
                View Full Preview
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/profiles/dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">
                {profileId ? 'Edit Profile' : 'Create New Profile'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Save Draft
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-black text-white'
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-2">
                      <div className={`h-1 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              <Check className="h-5 w-5" />
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}