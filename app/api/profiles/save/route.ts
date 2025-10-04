import { NextRequest, NextResponse } from 'next/server'
import { SupabaseProfileStore, ProfileInput } from '@/lib/supabase-profile-store'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [POST /api/profiles/save] Request received')

    const data = await request.json()

    console.log('📦 [POST /api/profiles/save] Request data:', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      hasPreferences: !!data.preferences
    })

    // Validate required fields
    if (!data.email) {
      console.error('❌ [POST /api/profiles/save] Missing required field: email')
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!data.firstName || !data.lastName) {
      console.error('❌ [POST /api/profiles/save] Missing required fields: firstName or lastName')
      return NextResponse.json(
        { success: false, error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Prepare profile data for database
    const profileInput: ProfileInput = {
      email: data.email,
      user_id: data.user_id || null,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.mobileNumber || null,
      company: data.companyName || null,
      is_founder_member: data.isFounderMember || false,
      avatar_url: data.profilePhoto || null,
      preferences: {
        // Basic Information
        secondaryEmail: data.secondaryEmail || '',
        whatsappNumber: data.whatsappNumber || '',
        showEmailPublicly: data.showEmailPublicly ?? true,
        showMobilePublicly: data.showMobilePublicly ?? true,
        showWhatsappPublicly: data.showWhatsappPublicly ?? false,

        // Professional Information
        jobTitle: data.jobTitle || '',
        companyWebsite: data.companyWebsite || '',
        companyAddress: data.companyAddress || '',
        companyLogo: data.companyLogo || null,
        industry: data.industry || '',
        subDomain: data.subDomain || '',
        skills: data.skills || [],
        professionalSummary: data.professionalSummary || '',
        showJobTitle: data.showJobTitle ?? true,
        showCompanyName: data.showCompanyName ?? true,
        showCompanyWebsite: data.showCompanyWebsite ?? true,
        showCompanyAddress: data.showCompanyAddress ?? true,
        showIndustry: data.showIndustry ?? true,
        showSkills: data.showSkills ?? true,

        // Social & Digital Presence
        linkedinUrl: data.linkedinUrl || '',
        instagramUrl: data.instagramUrl || '',
        facebookUrl: data.facebookUrl || '',
        twitterUrl: data.twitterUrl || '',
        behanceUrl: data.behanceUrl || '',
        dribbbleUrl: data.dribbbleUrl || '',
        githubUrl: data.githubUrl || '',
        youtubeUrl: data.youtubeUrl || '',
        showLinkedin: data.showLinkedin ?? false,
        showInstagram: data.showInstagram ?? false,
        showFacebook: data.showFacebook ?? false,
        showTwitter: data.showTwitter ?? false,
        showBehance: data.showBehance ?? false,
        showDribbble: data.showDribbble ?? false,
        showGithub: data.showGithub ?? false,
        showYoutube: data.showYoutube ?? false,

        // Profile Photo & Background
        backgroundImage: data.backgroundImage || null,
        showProfilePhoto: data.showProfilePhoto ?? true,
        showBackgroundImage: data.showBackgroundImage ?? true,

        // Media Gallery
        photos: data.photos || [],
        videos: data.videos || [],
      }
    }

    console.log('💾 [POST /api/profiles/save] Saving profile to database...')

    // Save to database using profile store
    const savedProfile = await SupabaseProfileStore.upsertByEmail(profileInput)

    console.log('✅ [POST /api/profiles/save] Profile saved successfully:', savedProfile.id)

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      profile: {
        id: savedProfile.id,
        email: savedProfile.email,
        first_name: savedProfile.first_name,
        last_name: savedProfile.last_name,
      }
    })

  } catch (error) {
    console.error('❌ [POST /api/profiles/save] Error saving profile:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save profile'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    console.log('🔍 [GET /api/profiles/save] Fetching profile for email:', email)

    const profile = await SupabaseProfileStore.getByEmail(email)

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('❌ [GET /api/profiles/save] Error fetching profile:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile'
      },
      { status: 500 }
    )
  }
}
