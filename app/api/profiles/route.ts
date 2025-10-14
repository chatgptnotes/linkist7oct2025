import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-middleware'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authSession = await getCurrentUser(request)

    if (!authSession.isAuthenticated || !authSession.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = authSession.user.id

    console.log('🔍 Fetching profiles for user_id:', userId)

    // Fetch profiles from Supabase using user_id
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase fetch error:', error)
      return NextResponse.json({
        error: 'Failed to fetch profiles from database',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profiles: profiles || []
    })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authSession = await getCurrentUser(request)

    if (!authSession.isAuthenticated || !authSession.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = authSession.user.id
    const data = await request.json()

    // Generate a unique profile ID (UUID v4)
    const profileId = crypto.randomUUID()

    console.log('💾 Saving profile for user_id:', userId)

    // Prepare data for Supabase with existing columns
    const profileData = {
      id: profileId,
      user_id: userId,
      email: data.email,
      alternate_email: data.alternateEmail || null,
      first_name: data.firstName,
      last_name: data.lastName,
      // Additional fields will be added after migration
      template: data.template || null,
      title: data.title || null,
      bio: data.bio || null,
      phone_number: data.phone || data.mobileNumber || null,
      whatsapp: data.whatsapp || data.whatsappNumber || null,
      location: data.location || null,

      // Professional Information (from Figma design)
      job_title: data.jobTitle || null,
      company_name: data.companyName || data.company || null,
      company_website: data.companyWebsite || null,
      company_address: data.companyAddress || null,
      company_logo_url: data.companyLogo || null,
      industry: data.industry || null,
      sub_domain: data.subDomain || null,
      professional_summary: data.professionalSummary || null,

      skills: data.skills || [],
      social_links: data.socialLinks || data.social_links || {},
      profile_photo_url: data.profilePhoto || null,
      background_image_url: data.backgroundImage || null,
      display_settings: data.displaySettings || data.display_settings || {},
      gallery_urls: data.gallery_urls || [],
      document_urls: data.document_urls || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save to Supabase
    const { data: insertedData, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({
        error: 'Failed to save profile to database',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profileId,
      message: 'Profile created successfully',
      data: insertedData
    })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    const authSession = await getCurrentUser(request)

    if (!authSession.isAuthenticated || !authSession.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = authSession.user.id
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    console.log('✏️ Updating profile for user_id:', userId, 'profile_id:', data.id)

    // TODO: Update in Supabase
    const profileData = {
      template: data.template,
      first_name: data.firstName,
      last_name: data.lastName,
      title: data.title,
      bio: data.bio,
      email: data.email,
      alternate_email: data.alternateEmail,
      phone_number: data.phone || data.mobileNumber,
      whatsapp: data.whatsapp || data.whatsappNumber,
      location: data.location,

      // Professional Information (from Figma design)
      job_title: data.jobTitle,
      company_name: data.companyName || data.company,
      company_website: data.companyWebsite,
      company_address: data.companyAddress,
      company_logo_url: data.companyLogo,
      industry: data.industry,
      sub_domain: data.subDomain,
      professional_summary: data.professionalSummary,

      skills: data.skills,
      social_links: data.socialLinks || data.social_links,
      profile_photo_url: data.profilePhoto,
      background_image_url: data.backgroundImage,
      display_settings: data.displaySettings || data.display_settings,
      gallery_urls: data.gallery_urls,
      document_urls: data.document_urls,
      updated_at: new Date().toISOString()
    }

    // Update in Supabase
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', data.id)
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({
        error: 'Failed to update profile in database',
        details: error.message
      }, { status: 500 })
    }

    if (!updatedData || updatedData.length === 0) {
      return NextResponse.json({
        error: 'Profile not found or unauthorized'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profileId: data.id,
      message: 'Profile updated successfully',
      data: updatedData
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}