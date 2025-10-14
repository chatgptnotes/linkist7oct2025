// Supabase-based order management system
// Replaces the in-memory order store with proper database persistence

import { createClient } from '@supabase/supabase-js'
import type { Order, OrderStatus } from './order-store'

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

// Database row type that matches actual Supabase schema
interface OrderRow {
  id: string
  order_number: string
  user_id?: string
  card_config_id?: string
  quantity: number
  unit_price: number
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  total_amount: number
  currency?: string
  status: string
  payment_status?: string
  production_status?: string
  shipping_status?: string
  stripe_payment_intent_id?: string
  stripe_checkout_session_id?: string
  paid_at?: string
  produced_at?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  email?: string
  customer_name?: string
  phone_number?: string
  card_config?: any
  shipping?: any
  pricing?: any
  emails_sent?: any
  estimated_delivery?: string
  tracking_number?: string
  tracking_url?: string
  proof_images?: string[]
  notes?: string
  voucher_code?: string
  voucher_discount?: number
}

// Convert database row to Order interface
const rowToOrder = (row: OrderRow): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  userId: row.user_id, // Extract user_id from database
  status: row.status as OrderStatus,
  customerName: row.customer_name || '',
  email: row.email || '',
  phoneNumber: row.phone_number,
  cardConfig: row.card_config || {},
  shipping: row.shipping || {},
  pricing: row.pricing || {
    subtotal: row.subtotal || 0,
    shipping: row.shipping_amount || 0,
    tax: row.tax_amount || 0,
    total: row.total_amount || 0
  },
  emailsSent: row.emails_sent || {},
  estimatedDelivery: row.estimated_delivery,
  trackingNumber: row.tracking_number,
  trackingUrl: row.tracking_url,
  proofImages: row.proof_images || [],
  notes: row.notes,
  voucherCode: row.voucher_code,
  voucherDiscount: row.voucher_discount,
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
})

// Convert Order to database insert format
// Only include columns that actually exist in the database
const orderToInsert = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => ({
  order_number: order.orderNumber,
  user_id: order.userId || null, // Map userId to user_id
  status: order.status,
  customer_name: order.customerName,
  email: order.email,
  phone_number: order.phoneNumber,
  card_config: order.cardConfig,
  shipping: order.shipping,
  pricing: order.pricing,
  emails_sent: order.emailsSent || {},
  estimated_delivery: order.estimatedDelivery,
  tracking_number: order.trackingNumber,
  tracking_url: order.trackingUrl,
  proof_images: order.proofImages || [],
  notes: order.notes,
  voucher_code: order.voucherCode,
  voucher_discount: order.voucherDiscount,
})

export const SupabaseOrderStore = {
  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    console.log('🔵 [SupabaseOrderStore.create] Starting order creation...');
    console.log('📦 [SupabaseOrderStore.create] Input order data:', {
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      email: order.email,
      cardConfigPresent: !!order.cardConfig,
      pricingPresent: !!order.pricing
    });

    const supabase = createAdminClient()
    console.log('✅ [SupabaseOrderStore.create] Admin client created');

    const insertData = orderToInsert(order);
    console.log('🔄 [SupabaseOrderStore.create] Converted to database format:', insertData);

    const { data, error } = await supabase
      .from('orders')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ [SupabaseOrderStore.create] Database error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      });
      throw new Error(`Failed to create order: ${error.message}`)
    }

    console.log('✅ [SupabaseOrderStore.create] Order inserted successfully:', {
      id: data.id,
      order_number: data.order_number
    });

    const orderResult = rowToOrder(data);
    console.log('🎉 [SupabaseOrderStore.create] Order creation complete!');

    return orderResult;
  },

  getById: async (id: string): Promise<Order | null> => {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching order by ID:', error)
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return rowToOrder(data)
  },

  getByOrderNumber: async (orderNumber: string): Promise<Order | null> => {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching order by number:', error)
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return rowToOrder(data)
  },

  getAll: async (): Promise<Order[]> => {
    console.log('🔍 SupabaseOrderStore.getAll: Starting database query...')
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ SupabaseOrderStore.getAll: Database error:', error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    console.log(`📊 SupabaseOrderStore.getAll: Raw database response:`, data)
    console.log(`📈 SupabaseOrderStore.getAll: Found ${data?.length || 0} rows`)
    
    const orders = data.map(rowToOrder)
    console.log(`✅ SupabaseOrderStore.getAll: Converted to ${orders.length} order objects`)
    
    return orders
  },

  getByEmail: async (email: string): Promise<Order[]> => {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders by email:', error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return data.map(rowToOrder)
  },

  update: async (id: string, updates: Partial<Order>): Promise<Order | null> => {
    const supabase = createAdminClient()

    // Convert updates to database format
    const dbUpdates: any = {}
    if (updates.orderNumber) dbUpdates.order_number = updates.orderNumber
    if (updates.userId !== undefined) dbUpdates.user_id = updates.userId // Handle userId updates
    if (updates.status) dbUpdates.status = updates.status
    if (updates.customerName) dbUpdates.customer_name = updates.customerName
    if (updates.email) dbUpdates.email = updates.email
    if (updates.phoneNumber) dbUpdates.phone_number = updates.phoneNumber
    if (updates.cardConfig) dbUpdates.card_config = updates.cardConfig
    if (updates.shipping) dbUpdates.shipping = updates.shipping
    if (updates.pricing) dbUpdates.pricing = updates.pricing
    if (updates.emailsSent) dbUpdates.emails_sent = updates.emailsSent
    if (updates.estimatedDelivery) dbUpdates.estimated_delivery = updates.estimatedDelivery
    if (updates.trackingNumber) dbUpdates.tracking_number = updates.trackingNumber
    if (updates.trackingUrl) dbUpdates.tracking_url = updates.trackingUrl
    if (updates.proofImages) dbUpdates.proof_images = updates.proofImages
    if (updates.notes) dbUpdates.notes = updates.notes
    if (updates.voucherCode !== undefined) dbUpdates.voucher_code = updates.voucherCode
    if (updates.voucherDiscount !== undefined) dbUpdates.voucher_discount = updates.voucherDiscount

    const { data, error } = await supabase
      .from('orders')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error updating order:', error)
      throw new Error(`Failed to update order: ${error.message}`)
    }

    return rowToOrder(data)
  },

  updateStatus: async (id: string, status: OrderStatus, additionalData?: Partial<Order>): Promise<Order | null> => {
    return await SupabaseOrderStore.update(id, { status, ...additionalData })
  },

  delete: async (id: string): Promise<boolean> => {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting order:', error)
      throw new Error(`Failed to delete order: ${error.message}`)
    }

    return true
  },

  // Admin functions
  getByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders by status:', error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return data.map(rowToOrder)
  },

  getRecentOrders: async (limit: number = 10): Promise<Order[]> => {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent orders:', error)
      throw new Error(`Failed to fetch recent orders: ${error.message}`)
    }

    return data.map(rowToOrder)
  },

  searchOrders: async (query: string): Promise<Order[]> => {
    const supabase = createAdminClient()
    
    // Use ILIKE for case-insensitive search on text fields
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`order_number.ilike.%${query}%,customer_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching orders:', error)
      throw new Error(`Failed to search orders: ${error.message}`)
    }

    return data.map(rowToOrder)
  },

  // Statistics
  getStats: async () => {
    const supabase = createAdminClient()
    
    // Get all orders for statistics
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, pricing, created_at')

    if (error) {
      console.error('Error fetching orders for stats:', error)
      throw new Error(`Failed to fetch statistics: ${error.message}`)
    }

    // Calculate statistics
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<OrderStatus, number>)

    const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaysOrders = orders.filter(order => new Date(order.created_at) >= today)

    return {
      totalOrders: orders.length,
      statusCounts,
      totalRevenue,
      todaysOrders: todaysOrders.length,
      todaysRevenue: todaysOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0),
    }
  },
}

// Generate a sequential order number using database sequence
export const generateOrderNumber = async (): Promise<string> => {
  const supabase = createAdminClient()

  try {
    // Call the database function to generate the next order number
    const { data, error } = await supabase
      .rpc('generate_order_number')

    if (error) {
      console.error('Error generating order number:', error)
      // Fallback to timestamp-based order number if sequence fails
      const timestamp = Date.now().toString(36).toUpperCase()
      return `LFND-${timestamp}`
    }

    return data as string
  } catch (err) {
    console.error('Exception generating order number:', err)
    // Fallback to timestamp-based order number
    const timestamp = Date.now().toString(36).toUpperCase()
    return `LFND-${timestamp}`
  }
}

// Export the same interface for easy migration
export { SupabaseOrderStore as OrderStore }