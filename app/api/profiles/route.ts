import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('userEmail')?.value || 'guest@linkist.com'

    // Fetch profiles from Supabase
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_email', userEmail)
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

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('userEmail')?.value || 'guest@linkist.com'

    const data = await request.json()

    // Generate a unique profile ID (UUID v4)
    const profileId = crypto.randomUUID()

    // Prepare data for Supabase with existing columns
    const profileData = {
      id: profileId,
      user_email: userEmail,
      email: data.email,
      alternate_email: data.alternateEmail || null,
      first_name: data.firstName,
      last_name: data.lastName,
      // Additional fields will be added after migration
      template: data.template || null,
      title: data.title || null,
      bio: data.bio || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      location: data.location || null,

      // Professional Information (from Figma design)
      job_title: data.jobTitle || null,
      current_role: data.currentRole || null,
      company: data.company || null,
      company_website: data.companyWebsite || null,
      industry: data.industry || null,
      sub_domain: data.subDomain || null,
      professional_summary: data.professionalSummary || null,

      position: data.position || null,
      skills: data.skills || [],
      social_links: data.socialLinks || {},
      visibility: data.visibility || 'public',
      custom_url: data.customUrl || null,
      theme: data.theme || 'light',
      allow_contact: data.allowContact !== false,
      show_analytics: data.showAnalytics || false,
      profile_image_url: data.profile_image_url || null,
      cover_image_url: data.cover_image_url || null,
      gallery_urls: data.gallery_urls || [],
      document_urls: data.document_urls || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save to Supabase
    const { data: insertedData, error } = await supabase
      .from('user_profiles')
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

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('userEmail')?.value || 'guest@linkist.com'

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    // TODO: Update in Supabase
    const profileData = {
      template: data.template,
      first_name: data.firstName,
      last_name: data.lastName,
      title: data.title,
      bio: data.bio,
      email: data.email,
      alternate_email: data.alternateEmail,
      phone: data.phone,
      whatsapp: data.whatsapp,
      location: data.location,

      // Professional Information (from Figma design)
      job_title: data.jobTitle,
      current_role: data.currentRole,
      company: data.company,
      company_website: data.companyWebsite,
      industry: data.industry,
      sub_domain: data.subDomain,
      professional_summary: data.professionalSummary,

      position: data.position,
      skills: data.skills,
      social_links: data.socialLinks,
      visibility: data.visibility,
      custom_url: data.customUrl,
      theme: data.theme,
      allow_contact: data.allowContact,
      show_analytics: data.showAnalytics,
      profile_image_url: data.profile_image_url,
      cover_image_url: data.cover_image_url,
      gallery_urls: data.gallery_urls,
      document_urls: data.document_urls,
      updated_at: new Date().toISOString()
    }

    // Update in Supabase
    const { data: updatedData, error } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('id', data.id)
      .eq('user_email', userEmail)
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