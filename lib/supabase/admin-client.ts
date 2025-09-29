/**
 * Supabase Admin Client Configuration
 * This client is used for all admin dashboard operations with full database access
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Admin client with service role key for full database access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create admin client with service role for full access
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Regular client for client-side operations
export const supabase = createClient<Database>(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

/**
 * Database helper functions for admin operations
 */
export const adminDb = {
  // Admin Users
  async getAdminUsers() {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAdminUserById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createAdminUser(userData: any) {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAdminUser(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Users Management
  async getUsers(filters?: any) {
    let query = supabaseAdmin
      .from('users')
      .select(`
        *,
        user_profiles(*)
      `);

    if (filters?.search) {
      query = query.or(`email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Products
  async getProducts(filters?: any) {
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        product_categories(name, slug)
      `);

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createProduct(productData: any) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Orders
  async getOrders(filters?: any) {
    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items(*),
        order_status_history(*),
        order_notes(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items(*),
        order_status_history(*),
        order_notes(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id: string, status: string, notes?: string, adminId?: string) {
    // Start a transaction
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (orderError) throw orderError;

    // Add to status history
    const { error: historyError } = await supabaseAdmin
      .from('order_status_history')
      .insert({
        order_id: id,
        status,
        notes,
        changed_by: adminId
      });

    if (historyError) throw historyError;

    return order;
  },

  // Inventory
  async getInventoryMovements(productId?: string) {
    let query = supabaseAdmin
      .from('inventory_movements')
      .select(`
        *,
        products(name, sku)
      `);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createInventoryMovement(movementData: any) {
    const { data, error } = await supabaseAdmin
      .from('inventory_movements')
      .insert(movementData)
      .select()
      .single();

    if (error) throw error;

    // Update product stock
    if (movementData.product_id && movementData.quantity) {
      await supabaseAdmin
        .from('products')
        .update({
          stock_quantity: supabaseAdmin.raw('stock_quantity + ?', [movementData.quantity])
        })
        .eq('id', movementData.product_id);
    }

    return data;
  },

  // Support Tickets
  async getTickets(filters?: any) {
    let query = supabaseAdmin
      .from('support_tickets')
      .select(`
        *,
        ticket_messages(*),
        users(email, first_name, last_name),
        admin_users!assigned_to(username, email)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTicket(ticketData: any) {
    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}`;

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        ...ticketData,
        ticket_number: ticketNumber
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTicket(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addTicketMessage(ticketId: string, message: any) {
    const { data, error } = await supabaseAdmin
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        ...message
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Email Campaigns
  async getEmailCampaigns() {
    const { data, error } = await supabaseAdmin
      .from('email_campaigns')
      .select(`
        *,
        email_templates(name),
        admin_users!created_by(username)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createEmailCampaign(campaignData: any) {
    const { data, error } = await supabaseAdmin
      .from('email_campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async sendEmailCampaign(campaignId: string, recipients: string[]) {
    // Add recipients
    const recipientData = recipients.map(email => ({
      campaign_id: campaignId,
      email,
      status: 'pending'
    }));

    const { error: recipientError } = await supabaseAdmin
      .from('email_campaign_recipients')
      .insert(recipientData);

    if (recipientError) throw recipientError;

    // Update campaign status
    const { data, error } = await supabaseAdmin
      .from('email_campaigns')
      .update({
        status: 'sending',
        sent_at: new Date().toISOString(),
        total_recipients: recipients.length
      })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Analytics
  async getAnalyticsEvents(filters?: any) {
    let query = supabaseAdmin
      .from('analytics_events')
      .select('*');

    if (filters?.eventType) {
      query = query.eq('event_type', filters.eventType);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async trackEvent(eventData: any) {
    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Dashboard Metrics
  async getDashboardMetrics(period: string = 'today') {
    // Check cache first
    const { data: cached } = await supabaseAdmin
      .from('dashboard_metrics')
      .select('*')
      .eq('metric_type', 'dashboard')
      .eq('period', period)
      .single();

    // If cache is fresh (less than 5 minutes old), return it
    if (cached && new Date(cached.calculated_at) > new Date(Date.now() - 5 * 60 * 1000)) {
      return cached.value;
    }

    // Calculate fresh metrics
    const { data, error } = await supabaseAdmin.rpc('calculate_dashboard_metrics', { p_period: period });

    if (error) throw error;

    // Update cache
    await supabaseAdmin
      .from('dashboard_metrics')
      .upsert({
        metric_type: 'dashboard',
        period,
        value: data,
        calculated_at: new Date().toISOString()
      });

    return data;
  },

  // Activity Logging
  async logAdminActivity(activity: any) {
    const { data, error } = await supabaseAdmin
      .from('admin_activity_logs')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAdminActivityLogs(adminId?: string) {
    let query = supabaseAdmin
      .from('admin_activity_logs')
      .select(`
        *,
        admin_users(username, email)
      `);

    if (adminId) {
      query = query.eq('admin_user_id', adminId);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(100);

    if (error) throw error;
    return data;
  },

  // System Settings
  async getSettings() {
    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .select('*')
      .order('key');

    if (error) throw error;

    // Convert to key-value object
    return data.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  },

  async updateSetting(key: string, value: any, adminId?: string) {
    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .upsert({
        key,
        value,
        updated_by: adminId,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // File Uploads
  async uploadFile(file: File, entityType?: string, entityId?: string, uploadedBy?: string) {
    const filename = `${Date.now()}-${file.name}`;
    const storagePath = `${entityType || 'general'}/${filename}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(storagePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(storagePath);

    // Save file record
    const { data, error } = await supabaseAdmin
      .from('file_uploads')
      .insert({
        filename,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        storage_path: storagePath,
        public_url: publicUrl,
        entity_type: entityType,
        entity_id: entityId,
        uploaded_by: uploadedBy
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Export types
export type AdminUser = any; // Define based on your schema
export type Product = any;
export type Order = any;
export type SupportTicket = any;
export type EmailCampaign = any;