// Supabase-powered card configuration management system
import { createClient } from '@supabase/supabase-js';

export interface CardConfig {
  id?: string;
  user_id?: string;
  card_type?: string;
  full_name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  photo_url?: string;
  background_style?: string;
  qr_code_data?: string;
  created_at?: string;
  updated_at?: string;
}

// Get Supabase client with service role key for server operations
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export const SupabaseCardConfigStore = {
  create: async (config: Omit<CardConfig, 'id' | 'created_at' | 'updated_at'>): Promise<CardConfig | null> => {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('card_configs')
        .insert([{
          user_id: config.user_id,
          card_type: config.card_type,
          full_name: config.full_name,
          title: config.title,
          company: config.company,
          email: config.email,
          phone: config.phone,
          website: config.website,
          linkedin_url: config.linkedin_url,
          twitter_url: config.twitter_url,
          instagram_url: config.instagram_url,
          facebook_url: config.facebook_url,
          primary_color: config.primary_color,
          secondary_color: config.secondary_color,
          logo_url: config.logo_url,
          photo_url: config.photo_url,
          background_style: config.background_style,
          qr_code_data: config.qr_code_data,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating card config:', error);
        return null;
      }

      return data as CardConfig;
    } catch (error) {
      console.error('Exception creating card config:', error);
      return null;
    }
  },

  getById: async (id: string): Promise<CardConfig | null> => {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('card_configs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error getting card config by ID:', error);
        return null;
      }

      return data as CardConfig;
    } catch (error) {
      console.error('Exception getting card config by ID:', error);
      return null;
    }
  },

  getByEmail: async (email: string): Promise<CardConfig[]> => {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('card_configs')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting card configs by email:', error);
        return [];
      }

      return data as CardConfig[];
    } catch (error) {
      console.error('Exception getting card configs by email:', error);
      return [];
    }
  },

  update: async (id: string, updates: Partial<CardConfig>): Promise<CardConfig | null> => {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('card_configs')
        .update({
          ...(updates.first_name !== undefined && { first_name: updates.first_name }),
          ...(updates.last_name !== undefined && { last_name: updates.last_name }),
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.company !== undefined && { company: updates.company }),
          ...(updates.mobile !== undefined && { mobile: updates.mobile }),
          ...(updates.email !== undefined && { email: updates.email }),
          ...(updates.whatsapp !== undefined && { whatsapp: updates.whatsapp }),
          ...(updates.website !== undefined && { website: updates.website }),
          ...(updates.linkedin !== undefined && { linkedin: updates.linkedin }),
          ...(updates.instagram !== undefined && { instagram: updates.instagram }),
          ...(updates.twitter !== undefined && { twitter: updates.twitter }),
          ...(updates.profile_image !== undefined && { profile_image: updates.profile_image }),
          // ...(updates.background_image !== undefined && { background_image: updates.background_image }), // Field doesn't exist in table
          ...(updates.quantity !== undefined && { quantity: updates.quantity }),
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.mobile_verified !== undefined && { mobile_verified: updates.mobile_verified }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating card config:', error);
        return null;
      }

      return data as CardConfig;
    } catch (error) {
      console.error('Exception updating card config:', error);
      return null;
    }
  },

  updateStatus: async (id: string, status: CardConfig['status']): Promise<CardConfig | null> => {
    return SupabaseCardConfigStore.update(id, { status });
  },

  delete: async (id: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    
    try {
      const { error } = await supabase
        .from('card_configs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting card config:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting card config:', error);
      return false;
    }
  },

  // Admin functions
  getAll: async (): Promise<CardConfig[]> => {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('card_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting all card configs:', error);
        return [];
      }

      return data as CardConfig[];
    } catch (error) {
      console.error('Exception getting all card configs:', error);
      return [];
    }
  },

  getByStatus: async (status: CardConfig['status']): Promise<CardConfig[]> => {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('card_configs')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting card configs by status:', error);
        return [];
      }

      return data as CardConfig[];
    } catch (error) {
      console.error('Exception getting card configs by status:', error);
      return [];
    }
  },
};

export default SupabaseCardConfigStore;