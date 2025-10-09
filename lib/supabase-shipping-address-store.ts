// Supabase-based shipping address management system
// Handles shipping address records in the shipping_addresses table

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

// ShippingAddress interface matching our needs
export interface ShippingAddress {
  id: string
  userId?: string
  orderId?: string
  fullName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phoneNumber?: string
  isDefault?: boolean
  createdAt: number
}

// Database row type that matches actual Supabase schema
interface ShippingAddressRow {
  id: string
  user_id?: string
  order_id?: string
  full_name: string
  company?: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone_number?: string
  is_default?: boolean
  created_at: string
}

// Convert database row to ShippingAddress interface
const rowToShippingAddress = (row: ShippingAddressRow): ShippingAddress => ({
  id: row.id,
  userId: row.user_id,
  orderId: row.order_id,
  fullName: row.full_name,
  company: row.company,
  addressLine1: row.address_line1,
  addressLine2: row.address_line2,
  city: row.city,
  state: row.state,
  postalCode: row.postal_code,
  country: row.country,
  phoneNumber: row.phone_number,
  isDefault: row.is_default,
  createdAt: new Date(row.created_at).getTime(),
})

// Convert ShippingAddress to database insert format
const shippingAddressToInsert = (address: Omit<ShippingAddress, 'id' | 'createdAt'>) => ({
  user_id: address.userId || null,
  order_id: address.orderId || null,
  full_name: address.fullName,
  company: address.company || null,
  address_line1: address.addressLine1,
  address_line2: address.addressLine2 || null,
  city: address.city,
  state: address.state || null,
  postal_code: address.postalCode,
  country: address.country,
  phone_number: address.phoneNumber || null,
  is_default: address.isDefault || false,
})

export const SupabaseShippingAddressStore = {
  /**
   * Create a new shipping address record
   */
  create: async (address: Omit<ShippingAddress, 'id' | 'createdAt'>): Promise<ShippingAddress> => {
    console.log('📍 [SupabaseShippingAddressStore.create] Starting shipping address creation...');
    console.log('📦 [SupabaseShippingAddressStore.create] Input address data:', {
      userId: address.userId,
      orderId: address.orderId,
      fullName: address.fullName,
      city: address.city,
      country: address.country,
    });

    const supabase = createAdminClient()
    console.log('✅ [SupabaseShippingAddressStore.create] Admin client created');

    // If this is being set as default, unset all other default addresses for this user
    if (address.isDefault && address.userId) {
      console.log('🔄 [SupabaseShippingAddressStore.create] Unsetting other default addresses for user...');
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', address.userId)
        .eq('is_default', true);
    }

    const insertData = shippingAddressToInsert(address);
    console.log('🔄 [SupabaseShippingAddressStore.create] Converted to database format:', insertData);

    const { data, error } = await supabase
      .from('shipping_addresses')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ [SupabaseShippingAddressStore.create] Database error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      });
      throw new Error(`Failed to create shipping address: ${error.message}`)
    }

    console.log('✅ [SupabaseShippingAddressStore.create] Shipping address inserted successfully:', {
      id: data.id,
      user_id: data.user_id,
      order_id: data.order_id
    });

    const addressResult = rowToShippingAddress(data);
    console.log('🎉 [SupabaseShippingAddressStore.create] Shipping address creation complete!');

    return addressResult;
  },

  /**
   * Get shipping address by ID
   */
  getById: async (id: string): Promise<ShippingAddress | null> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching shipping address by ID:', error)
      throw new Error(`Failed to fetch shipping address: ${error.message}`)
    }

    return rowToShippingAddress(data)
  },

  /**
   * Get all shipping addresses for a user
   */
  getByUserId: async (userId: string): Promise<ShippingAddress[]> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching shipping addresses by user ID:', error)
      throw new Error(`Failed to fetch shipping addresses: ${error.message}`)
    }

    return data.map(rowToShippingAddress)
  },

  /**
   * Get shipping address for an order
   */
  getByOrderId: async (orderId: string): Promise<ShippingAddress | null> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching shipping address by order ID:', error)
      throw new Error(`Failed to fetch shipping address: ${error.message}`)
    }

    return rowToShippingAddress(data)
  },

  /**
   * Get default shipping address for a user
   */
  getDefaultByUserId: async (userId: string): Promise<ShippingAddress | null> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching default shipping address:', error)
      throw new Error(`Failed to fetch default shipping address: ${error.message}`)
    }

    return rowToShippingAddress(data)
  },

  /**
   * Get all shipping addresses
   */
  getAll: async (): Promise<ShippingAddress[]> => {
    console.log('🔍 SupabaseShippingAddressStore.getAll: Starting database query...')
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ SupabaseShippingAddressStore.getAll: Database error:', error)
      throw new Error(`Failed to fetch shipping addresses: ${error.message}`)
    }

    console.log(`📊 SupabaseShippingAddressStore.getAll: Found ${data?.length || 0} rows`)

    const addresses = data.map(rowToShippingAddress)
    console.log(`✅ SupabaseShippingAddressStore.getAll: Converted to ${addresses.length} address objects`)

    return addresses
  },

  /**
   * Update a shipping address
   */
  update: async (id: string, updates: Partial<ShippingAddress>): Promise<ShippingAddress | null> => {
    const supabase = createAdminClient()

    // If setting as default, unset all other default addresses for this user
    if (updates.isDefault && updates.userId) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', updates.userId)
        .eq('is_default', true)
        .neq('id', id); // Don't update the current address
    }

    // Convert updates to database format
    const dbUpdates: any = {}
    if (updates.fullName) dbUpdates.full_name = updates.fullName
    if (updates.company !== undefined) dbUpdates.company = updates.company
    if (updates.addressLine1) dbUpdates.address_line1 = updates.addressLine1
    if (updates.addressLine2 !== undefined) dbUpdates.address_line2 = updates.addressLine2
    if (updates.city) dbUpdates.city = updates.city
    if (updates.state !== undefined) dbUpdates.state = updates.state
    if (updates.postalCode) dbUpdates.postal_code = updates.postalCode
    if (updates.country) dbUpdates.country = updates.country
    if (updates.phoneNumber !== undefined) dbUpdates.phone_number = updates.phoneNumber
    if (updates.isDefault !== undefined) dbUpdates.is_default = updates.isDefault

    const { data, error } = await supabase
      .from('shipping_addresses')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error updating shipping address:', error)
      throw new Error(`Failed to update shipping address: ${error.message}`)
    }

    return rowToShippingAddress(data)
  },

  /**
   * Set address as default for a user
   */
  setAsDefault: async (id: string, userId: string): Promise<ShippingAddress | null> => {
    return await SupabaseShippingAddressStore.update(id, { isDefault: true, userId })
  },

  /**
   * Delete a shipping address
   */
  delete: async (id: string): Promise<boolean> => {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('shipping_addresses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting shipping address:', error)
      throw new Error(`Failed to delete shipping address: ${error.message}`)
    }

    return true
  },

  /**
   * Get statistics
   */
  getStats: async () => {
    const supabase = createAdminClient()

    // Get all addresses for statistics
    const { data: addresses, error } = await supabase
      .from('shipping_addresses')
      .select('user_id, order_id, country, created_at')

    if (error) {
      console.error('Error fetching addresses for stats:', error)
      throw new Error(`Failed to fetch statistics: ${error.message}`)
    }

    // Calculate statistics
    const uniqueUsers = new Set(addresses.filter(a => a.user_id).map(a => a.user_id)).size
    const linkedToOrders = addresses.filter(a => a.order_id).length
    const countryCounts = addresses.reduce((acc, address) => {
      acc[address.country] = (acc[address.country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaysAddresses = addresses.filter(address => new Date(address.created_at) >= today)

    return {
      totalAddresses: addresses.length,
      uniqueUsers,
      linkedToOrders,
      countryCounts,
      todaysAddresses: todaysAddresses.length,
    }
  },
}

// Export for easy import
export { SupabaseShippingAddressStore as ShippingAddressStore }
