// Supabase-based user management system
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

// User interface matching database schema
export interface SupabaseUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  role: 'user' | 'admin'
  email_verified: boolean
  mobile_verified: boolean
  created_at: string
  updated_at: string
}

// Input type for creating users
export interface CreateUserInput {
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  role?: 'user' | 'admin'
  email_verified?: boolean
  mobile_verified?: boolean
}

export const SupabaseUserStore = {
  /**
   * Create a new user or get existing user by email
   */
  upsertByEmail: async (input: CreateUserInput): Promise<SupabaseUser> => {
    console.log('👤 [SupabaseUserStore.upsertByEmail] Starting user upsert for:', input.email);

    const supabase = createAdminClient()

    // First, try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', input.email)
      .single()

    if (existingUser && !fetchError) {
      console.log('👤 [SupabaseUserStore.upsertByEmail] User already exists, updating:', existingUser.id);

      // Update existing user with new information
      const updates: any = {
        updated_at: new Date().toISOString()
      }

      if (input.first_name) updates.first_name = input.first_name
      if (input.last_name) updates.last_name = input.last_name
      if (input.phone_number) updates.phone_number = input.phone_number
      if (input.email_verified !== undefined) updates.email_verified = input.email_verified
      if (input.mobile_verified !== undefined) updates.mobile_verified = input.mobile_verified
      if (input.role) updates.role = input.role

      const { data: updated, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', existingUser.id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ [SupabaseUserStore.upsertByEmail] Update error:', updateError)
        throw new Error(`Failed to update user: ${updateError.message}`)
      }

      console.log('✅ [SupabaseUserStore.upsertByEmail] User updated successfully');
      return updated
    }

    // User doesn't exist, create new one
    console.log('👤 [SupabaseUserStore.upsertByEmail] Creating new user');

    const newUser = {
      email: input.email,
      first_name: input.first_name || null,
      last_name: input.last_name || null,
      phone_number: input.phone_number || null,
      role: input.role || 'user',
      email_verified: input.email_verified || false,
      mobile_verified: input.mobile_verified || false,
    }

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single()

    if (error) {
      console.error('❌ [SupabaseUserStore.upsertByEmail] Create error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      throw new Error(`Failed to create user: ${error.message}`)
    }

    console.log('✅ [SupabaseUserStore.upsertByEmail] User created successfully:', data.id)
    return data
  },

  /**
   * Get user by email
   */
  getByEmail: async (email: string): Promise<SupabaseUser | null> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching user by email:', error)
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return data
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<SupabaseUser | null> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching user by ID:', error)
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return data
  },

  /**
   * Update user verification status
   */
  updateVerificationStatus: async (
    email: string,
    type: 'email' | 'mobile',
    verified: boolean = true
  ): Promise<SupabaseUser | null> => {
    const supabase = createAdminClient()

    const updates = {
      [type === 'email' ? 'email_verified' : 'mobile_verified']: verified,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', email)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error updating verification status:', error)
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return data
  },

  /**
   * Get all users (for admin)
   */
  getAll: async (): Promise<SupabaseUser[]> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all users:', error)
      throw new Error(`Failed to fetch users: ${error.message}`)
    }

    return data
  },
}
