// Supabase-based profile management system
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key for server-side operations
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Profile interface matching database schema
export interface SupabaseProfile {
  id: string
  user_id: string | null
  email: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  company: string | null
  is_founder_member: boolean
  avatar_url: string | null
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

// Input type for creating/updating profiles
export interface ProfileInput {
  email: string
  user_id?: string | null
  first_name?: string | null
  last_name?: string | null
  phone_number?: string | null
  company?: string | null
  is_founder_member?: boolean
  avatar_url?: string | null
  preferences?: {
    // Basic Information
    secondaryEmail?: string
    whatsappNumber?: string
    showEmailPublicly?: boolean
    showMobilePublicly?: boolean
    showWhatsappPublicly?: boolean

    // Professional Information
    jobTitle?: string
    companyWebsite?: string
    companyAddress?: string
    companyLogo?: string | null
    industry?: string
    subDomain?: string
    skills?: string[]
    professionalSummary?: string
    showJobTitle?: boolean
    showCompanyName?: boolean
    showCompanyWebsite?: boolean
    showCompanyAddress?: boolean
    showIndustry?: boolean
    showSkills?: boolean

    // Social & Digital Presence
    linkedinUrl?: string
    instagramUrl?: string
    facebookUrl?: string
    twitterUrl?: string
    behanceUrl?: string
    dribbbleUrl?: string
    githubUrl?: string
    youtubeUrl?: string
    showLinkedin?: boolean
    showInstagram?: boolean
    showFacebook?: boolean
    showTwitter?: boolean
    showBehance?: boolean
    showDribbble?: boolean
    showGithub?: boolean
    showYoutube?: boolean

    // Profile Photo & Background
    backgroundImage?: string | null
    showProfilePhoto?: boolean
    showBackgroundImage?: boolean

    // Media Gallery
    photos?: Array<{ id: string; url: string; title: string; showPublicly: boolean }>
    videos?: Array<{ id: string; url: string; title: string; showPublicly: boolean }>
  }
}

export const SupabaseProfileStore = {
  /**
   * Create a new profile or update existing profile by email
   */
  upsertByEmail: async (input: ProfileInput): Promise<SupabaseProfile> => {
    const supabase = createAdminClient()

    console.log('🔍 [SupabaseProfileStore] Upserting profile for email:', input.email)

    // First, try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', input.email)
      .single()

    if (existingProfile && !fetchError) {
      // Update existing profile
      console.log('📝 [SupabaseProfileStore] Profile exists, updating...')

      const updates: any = {
        updated_at: new Date().toISOString()
      }

      if (input.user_id !== undefined) updates.user_id = input.user_id
      if (input.first_name !== undefined) updates.first_name = input.first_name
      if (input.last_name !== undefined) updates.last_name = input.last_name
      if (input.phone_number !== undefined) updates.phone_number = input.phone_number
      if (input.company !== undefined) updates.company = input.company
      if (input.is_founder_member !== undefined) updates.is_founder_member = input.is_founder_member
      if (input.avatar_url !== undefined) updates.avatar_url = input.avatar_url

      // Merge preferences with existing ones
      if (input.preferences) {
        updates.preferences = {
          ...(existingProfile.preferences || {}),
          ...input.preferences
        }
      }

      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', existingProfile.id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ [SupabaseProfileStore] Error updating profile:', updateError)
        throw new Error(`Failed to update profile: ${updateError.message}`)
      }

      console.log('✅ [SupabaseProfileStore] Profile updated successfully')
      return updated
    }

    // Create new profile
    console.log('➕ [SupabaseProfileStore] Creating new profile...')

    const newProfile = {
      email: input.email,
      user_id: input.user_id || null,
      first_name: input.first_name || null,
      last_name: input.last_name || null,
      phone_number: input.phone_number || null,
      company: input.company || null,
      is_founder_member: input.is_founder_member || false,
      avatar_url: input.avatar_url || null,
      preferences: input.preferences || {},
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single()

    if (error) {
      console.error('❌ [SupabaseProfileStore] Error creating profile:', error)
      throw new Error(`Failed to create profile: ${error.message}`)
    }

    console.log('✅ [SupabaseProfileStore] Profile created successfully')
    return data
  },

  /**
   * Get profile by email
   */
  getByEmail: async (email: string): Promise<SupabaseProfile | null> => {
    const supabase = createAdminClient()

    console.log('🔍 [SupabaseProfileStore] Fetching profile for email:', email)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.log('ℹ️ [SupabaseProfileStore] No profile found for email:', email)
        return null
      }
      console.error('❌ [SupabaseProfileStore] Error fetching profile:', error)
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    console.log('✅ [SupabaseProfileStore] Profile fetched successfully')
    return data
  },

  /**
   * Get profile by ID
   */
  getById: async (id: string): Promise<SupabaseProfile | null> => {
    const supabase = createAdminClient()

    console.log('🔍 [SupabaseProfileStore] Fetching profile by ID:', id)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [SupabaseProfileStore] No profile found for ID:', id)
        return null
      }
      console.error('❌ [SupabaseProfileStore] Error fetching profile:', error)
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    console.log('✅ [SupabaseProfileStore] Profile fetched successfully')
    return data
  },

  /**
   * Get all profiles
   */
  getAll: async (): Promise<SupabaseProfile[]> => {
    const supabase = createAdminClient()

    console.log('🔍 [SupabaseProfileStore] Fetching all profiles')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ [SupabaseProfileStore] Error fetching profiles:', error)
      throw new Error(`Failed to fetch profiles: ${error.message}`)
    }

    console.log(`✅ [SupabaseProfileStore] Fetched ${data.length} profiles`)
    return data
  },

  /**
   * Delete profile by email
   */
  deleteByEmail: async (email: string): Promise<void> => {
    const supabase = createAdminClient()

    console.log('🗑️ [SupabaseProfileStore] Deleting profile for email:', email)

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('email', email)

    if (error) {
      console.error('❌ [SupabaseProfileStore] Error deleting profile:', error)
      throw new Error(`Failed to delete profile: ${error.message}`)
    }

    console.log('✅ [SupabaseProfileStore] Profile deleted successfully')
  }
}
