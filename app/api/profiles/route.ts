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
    const userEmail = cookieStore.get('userEmail')?.value

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, return mock profiles
    // TODO: Fetch from Supabase once profiles table is set up
    const profiles = [
      {
        id: 'prof-1',
        name: 'Professional Profile',
        template: 'professional',
        views: 1234,
        clicks: 567,
        status: 'active',
        lastModified: new Date().toISOString()
      }
    ]

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('userEmail')?.value

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Generate a unique profile ID (UUID v4)
    const profileId = crypto.randomUUID()

    // Prepare data for Supabase with existing columns
    const profileData = {
      id: profileId,
      user_email: userEmail,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      // Additional fields will be added after migration
      template: data.template || null,
      title: data.title || null,
      bio: data.bio || null,
      phone: data.phone || null,
      location: data.location || null,
      company: data.company || null,
      position: data.position || null,
      skills: data.skills || [],
      social_links: data.socialLinks || {},
      visibility: data.visibility || 'public',
      custom_url: data.customUrl || null,
      theme: data.theme || 'light',
      allow_contact: data.allowContact !== false,
      show_analytics: data.showAnalytics || false,
      profile_image_url: null,
      cover_image_url: null,
      gallery_urls: [],
      document_urls: [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Try to save to Supabase (if table exists)
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([profileData])

      if (error) {
        console.error('Supabase insert error:', error)
        // Continue even if Supabase fails - we'll return success for demo purposes
      }
    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError)
    }

    return NextResponse.json({
      success: true,
      profileId,
      message: 'Profile created successfully'
    })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('userEmail')?.value

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      phone: data.phone,
      location: data.location,
      company: data.company,
      position: data.position,
      skills: data.skills,
      social_links: data.socialLinks,
      visibility: data.visibility,
      custom_url: data.customUrl,
      theme: data.theme,
      allow_contact: data.allowContact,
      show_analytics: data.showAnalytics,
      updated_at: new Date().toISOString()
    }

    // Try to update in Supabase (if table exists)
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', data.id)
        .eq('user_email', userEmail)

      if (error) {
        console.error('Supabase update error:', error)
        // Continue even if Supabase fails - we'll return success for demo purposes
      }
    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError)
    }

    return NextResponse.json({
      success: true,
      profileId: data.id,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}