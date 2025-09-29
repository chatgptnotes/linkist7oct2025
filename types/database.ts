/**
 * Database Types for Admin Dashboard
 * Auto-generated types based on Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Admin Users
      admin_users: {
        Row: {
          id: string
          email: string
          username: string
          password_hash: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          role: 'super_admin' | 'admin' | 'manager' | 'support' | 'viewer'
          permissions: Json
          is_active: boolean
          is_super_admin: boolean
          last_login_at: string | null
          last_login_ip: string | null
          failed_login_attempts: number
          locked_until: string | null
          mfa_enabled: boolean
          mfa_secret: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          email: string
          username: string
          password_hash: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'manager' | 'support' | 'viewer'
          permissions?: Json
          is_active?: boolean
          is_super_admin?: boolean
          last_login_at?: string | null
          last_login_ip?: string | null
          failed_login_attempts?: number
          locked_until?: string | null
          mfa_enabled?: boolean
          mfa_secret?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          password_hash?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'manager' | 'support' | 'viewer'
          permissions?: Json
          is_active?: boolean
          is_super_admin?: boolean
          last_login_at?: string | null
          last_login_ip?: string | null
          failed_login_attempts?: number
          locked_until?: string | null
          mfa_enabled?: boolean
          mfa_secret?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }

      // Admin Sessions
      admin_sessions: {
        Row: {
          id: string
          admin_user_id: string
          token: string
          ip_address: string | null
          user_agent: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          token: string
          ip_address?: string | null
          user_agent?: string | null
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          token?: string
          ip_address?: string | null
          user_agent?: string | null
          expires_at?: string
          created_at?: string
        }
      }

      // Admin Activity Logs
      admin_activity_logs: {
        Row: {
          id: string
          admin_user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }

      // Users (existing table)
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone_number: string | null
          email_verified: boolean
          mobile_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          email_verified?: boolean
          mobile_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          email_verified?: boolean
          mobile_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // User Profiles
      user_profiles: {
        Row: {
          id: string
          user_id: string | null
          company_name: string | null
          job_title: string | null
          bio: string | null
          website: string | null
          social_links: Json
          preferences: Json
          tags: string[] | null
          is_vip: boolean
          total_orders: number
          total_spent: number
          lifetime_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          job_title?: string | null
          bio?: string | null
          website?: string | null
          social_links?: Json
          preferences?: Json
          tags?: string[] | null
          is_vip?: boolean
          total_orders?: number
          total_spent?: number
          lifetime_value?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          job_title?: string | null
          bio?: string | null
          website?: string | null
          social_links?: Json
          preferences?: Json
          tags?: string[] | null
          is_vip?: boolean
          total_orders?: number
          total_spent?: number
          lifetime_value?: number
          created_at?: string
          updated_at?: string
        }
      }

      // Products
      products: {
        Row: {
          id: string
          sku: string
          name: string
          slug: string
          description: string | null
          category_id: string | null
          price: number
          cost: number | null
          compare_at_price: number | null
          currency: string
          stock_quantity: number
          low_stock_threshold: number
          weight: number | null
          dimensions: Json | null
          images: Json
          features: Json
          specifications: Json
          is_active: boolean
          is_featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          name: string
          slug: string
          description?: string | null
          category_id?: string | null
          price: number
          cost?: number | null
          compare_at_price?: number | null
          currency?: string
          stock_quantity?: number
          low_stock_threshold?: number
          weight?: number | null
          dimensions?: Json | null
          images?: Json
          features?: Json
          specifications?: Json
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          name?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          price?: number
          cost?: number | null
          compare_at_price?: number | null
          currency?: string
          stock_quantity?: number
          low_stock_threshold?: number
          weight?: number | null
          dimensions?: Json | null
          images?: Json
          features?: Json
          specifications?: Json
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Product Categories
      product_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          display_order: number
          is_active: boolean
          meta_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          meta_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          meta_data?: Json
          created_at?: string
          updated_at?: string
        }
      }

      // Orders
      orders: {
        Row: {
          id: string
          order_number: string
          status: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled'
          customer_name: string
          email: string
          phone_number: string
          card_config: Json
          shipping: Json
          pricing: Json
          emails_sent: Json
          estimated_delivery: string | null
          tracking_number: string | null
          tracking_url: string | null
          proof_images: string[] | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          status?: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled'
          customer_name: string
          email: string
          phone_number: string
          card_config: Json
          shipping: Json
          pricing: Json
          emails_sent?: Json
          estimated_delivery?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          proof_images?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          status?: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled'
          customer_name?: string
          email?: string
          phone_number?: string
          card_config?: Json
          shipping?: Json
          pricing?: Json
          emails_sent?: Json
          estimated_delivery?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          proof_images?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Order Items
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          unit_price: number
          discount_amount: number
          tax_amount: number
          total_amount: number
          customization: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity?: number
          unit_price: number
          discount_amount?: number
          tax_amount?: number
          total_amount: number
          customization?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          unit_price?: number
          discount_amount?: number
          tax_amount?: number
          total_amount?: number
          customization?: Json | null
          created_at?: string
        }
      }

      // Support Tickets
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          user_id: string | null
          customer_email: string
          customer_name: string | null
          subject: string
          description: string
          category: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
          assigned_to: string | null
          resolved_at: string | null
          satisfaction_rating: number | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_number: string
          user_id?: string | null
          customer_email: string
          customer_name?: string | null
          subject: string
          description: string
          category?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
          assigned_to?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_number?: string
          user_id?: string | null
          customer_email?: string
          customer_name?: string | null
          subject?: string
          description?: string
          category?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
          assigned_to?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }

      // Email Campaigns
      email_campaigns: {
        Row: {
          id: string
          name: string
          subject: string
          template_id: string | null
          from_name: string | null
          from_email: string | null
          reply_to: string | null
          html_content: string | null
          text_content: string | null
          segment_filters: Json | null
          status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
          scheduled_at: string | null
          sent_at: string | null
          total_recipients: number
          sent_count: number
          open_count: number
          click_count: number
          bounce_count: number
          unsubscribe_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          template_id?: string | null
          from_name?: string | null
          from_email?: string | null
          reply_to?: string | null
          html_content?: string | null
          text_content?: string | null
          segment_filters?: Json | null
          status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number
          sent_count?: number
          open_count?: number
          click_count?: number
          bounce_count?: number
          unsubscribe_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject?: string
          template_id?: string | null
          from_name?: string | null
          from_email?: string | null
          reply_to?: string | null
          html_content?: string | null
          text_content?: string | null
          segment_filters?: Json | null
          status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number
          sent_count?: number
          open_count?: number
          click_count?: number
          bounce_count?: number
          unsubscribe_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // System Settings
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          category: string | null
          is_public: boolean
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          category?: string | null
          is_public?: boolean
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          category?: string | null
          is_public?: boolean
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Analytics Events
      analytics_events: {
        Row: {
          id: string
          event_type: string
          event_category: string | null
          event_action: string | null
          event_label: string | null
          event_value: number | null
          user_id: string | null
          session_id: string | null
          page_url: string | null
          referrer_url: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          device_type: string | null
          browser: string | null
          os: string | null
          country: string | null
          city: string | null
          properties: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          event_category?: string | null
          event_action?: string | null
          event_label?: string | null
          event_value?: number | null
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          properties?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          event_category?: string | null
          event_action?: string | null
          event_label?: string | null
          event_value?: number | null
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          properties?: Json | null
          created_at?: string
        }
      }

      // Notifications
      notifications: {
        Row: {
          id: string
          recipient_id: string
          type: string
          title: string
          message: string | null
          data: Json | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          type: string
          title: string
          message?: string | null
          data?: Json | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          type?: string
          title?: string
          message?: string | null
          data?: Json | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      revenue_reports: {
        Row: {
          date: string
          order_count: number
          total_revenue: number
          average_order_value: number
          unique_customers: number
        }
      }
    }
    Functions: {
      calculate_dashboard_metrics: {
        Args: {
          p_period: string
        }
        Returns: Json
      }
      generate_order_number: {
        Args: Record<string, never>
        Returns: string
      }
      clean_expired_otps: {
        Args: Record<string, never>
        Returns: number
      }
      refresh_revenue_reports: {
        Args: Record<string, never>
        Returns: void
      }
    }
  }
}