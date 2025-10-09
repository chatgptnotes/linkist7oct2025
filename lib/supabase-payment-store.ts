// Supabase-based payment management system
// Handles payment records in the payments table

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

// Payment status enum matching database constraint
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'disputed'

// Payment interface matching our needs
export interface Payment {
  id: string
  orderId: string
  paymentIntentId: string
  amount: number  // Amount in cents
  currency: string
  status: PaymentStatus
  paymentMethod?: string
  failureReason?: string
  refundAmount?: number
  stripeFee?: number
  netAmount?: number
  metadata?: Record<string, any>
  createdAt: number
  updatedAt: number
}

// Database row type that matches actual Supabase schema
interface PaymentRow {
  id: string
  order_id: string
  payment_intent_id: string
  amount: number
  currency: string
  status: string
  payment_method?: string
  failure_reason?: string
  refund_amount?: number
  stripe_fee?: number
  net_amount?: number
  metadata?: any
  created_at: string
  updated_at: string
}

// Convert database row to Payment interface
const rowToPayment = (row: PaymentRow): Payment => ({
  id: row.id,
  orderId: row.order_id,
  paymentIntentId: row.payment_intent_id,
  amount: row.amount,
  currency: row.currency,
  status: row.status as PaymentStatus,
  paymentMethod: row.payment_method,
  failureReason: row.failure_reason,
  refundAmount: row.refund_amount,
  stripeFee: row.stripe_fee,
  netAmount: row.net_amount,
  metadata: row.metadata || {},
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
})

// Convert Payment to database insert format
const paymentToInsert = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => ({
  order_id: payment.orderId,
  payment_intent_id: payment.paymentIntentId,
  amount: payment.amount,
  currency: payment.currency || 'USD',
  status: payment.status,
  payment_method: payment.paymentMethod || null,
  failure_reason: payment.failureReason || null,
  refund_amount: payment.refundAmount || 0,
  stripe_fee: payment.stripeFee || 0,
  net_amount: payment.netAmount || null,
  metadata: payment.metadata || {},
})

export const SupabasePaymentStore = {
  /**
   * Create a new payment record
   */
  create: async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
    console.log('💳 [SupabasePaymentStore.create] Starting payment creation...');
    console.log('📦 [SupabasePaymentStore.create] Input payment data:', {
      orderId: payment.orderId,
      paymentIntentId: payment.paymentIntentId,
      amount: payment.amount,
      status: payment.status,
    });

    const supabase = createAdminClient()
    console.log('✅ [SupabasePaymentStore.create] Admin client created');

    const insertData = paymentToInsert(payment);
    console.log('🔄 [SupabasePaymentStore.create] Converted to database format:', insertData);

    const { data, error } = await supabase
      .from('payments')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ [SupabasePaymentStore.create] Database error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      });
      throw new Error(`Failed to create payment: ${error.message}`)
    }

    console.log('✅ [SupabasePaymentStore.create] Payment inserted successfully:', {
      id: data.id,
      order_id: data.order_id
    });

    const paymentResult = rowToPayment(data);
    console.log('🎉 [SupabasePaymentStore.create] Payment creation complete!');

    return paymentResult;
  },

  /**
   * Get payment by ID
   */
  getById: async (id: string): Promise<Payment | null> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching payment by ID:', error)
      throw new Error(`Failed to fetch payment: ${error.message}`)
    }

    return rowToPayment(data)
  },

  /**
   * Get payment by payment intent ID
   */
  getByPaymentIntentId: async (paymentIntentId: string): Promise<Payment | null> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching payment by intent ID:', error)
      throw new Error(`Failed to fetch payment: ${error.message}`)
    }

    return rowToPayment(data)
  },

  /**
   * Get all payments for an order
   */
  getByOrderId: async (orderId: string): Promise<Payment[]> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payments by order ID:', error)
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }

    return data.map(rowToPayment)
  },

  /**
   * Get all payments
   */
  getAll: async (): Promise<Payment[]> => {
    console.log('🔍 SupabasePaymentStore.getAll: Starting database query...')
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ SupabasePaymentStore.getAll: Database error:', error)
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }

    console.log(`📊 SupabasePaymentStore.getAll: Found ${data?.length || 0} rows`)

    const payments = data.map(rowToPayment)
    console.log(`✅ SupabasePaymentStore.getAll: Converted to ${payments.length} payment objects`)

    return payments
  },

  /**
   * Update a payment
   */
  update: async (id: string, updates: Partial<Payment>): Promise<Payment | null> => {
    const supabase = createAdminClient()

    // Convert updates to database format
    const dbUpdates: any = {}
    if (updates.status) dbUpdates.status = updates.status
    if (updates.paymentMethod) dbUpdates.payment_method = updates.paymentMethod
    if (updates.failureReason) dbUpdates.failure_reason = updates.failureReason
    if (updates.refundAmount !== undefined) dbUpdates.refund_amount = updates.refundAmount
    if (updates.stripeFee !== undefined) dbUpdates.stripe_fee = updates.stripeFee
    if (updates.netAmount !== undefined) dbUpdates.net_amount = updates.netAmount
    if (updates.metadata) dbUpdates.metadata = updates.metadata

    const { data, error } = await supabase
      .from('payments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error updating payment:', error)
      throw new Error(`Failed to update payment: ${error.message}`)
    }

    return rowToPayment(data)
  },

  /**
   * Update payment status
   */
  updateStatus: async (id: string, status: PaymentStatus, additionalData?: Partial<Payment>): Promise<Payment | null> => {
    return await SupabasePaymentStore.update(id, { status, ...additionalData })
  },

  /**
   * Delete a payment
   */
  delete: async (id: string): Promise<boolean> => {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting payment:', error)
      throw new Error(`Failed to delete payment: ${error.message}`)
    }

    return true
  },

  /**
   * Get payments by status
   */
  getByStatus: async (status: PaymentStatus): Promise<Payment[]> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payments by status:', error)
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }

    return data.map(rowToPayment)
  },

  /**
   * Get recent payments
   */
  getRecentPayments: async (limit: number = 10): Promise<Payment[]> => {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent payments:', error)
      throw new Error(`Failed to fetch recent payments: ${error.message}`)
    }

    return data.map(rowToPayment)
  },

  /**
   * Get payment statistics
   */
  getStats: async () => {
    const supabase = createAdminClient()

    // Get all payments for statistics
    const { data: payments, error } = await supabase
      .from('payments')
      .select('status, amount, stripe_fee, created_at')

    if (error) {
      console.error('Error fetching payments for stats:', error)
      throw new Error(`Failed to fetch statistics: ${error.message}`)
    }

    // Calculate statistics
    const statusCounts = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1
      return acc
    }, {} as Record<PaymentStatus, number>)

    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    const totalFees = payments.reduce((sum, payment) => sum + (payment.stripe_fee || 0), 0)
    const netAmount = totalAmount - totalFees

    const succeededPayments = payments.filter(p => p.status === 'succeeded')
    const succeededAmount = succeededPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaysPayments = payments.filter(payment => new Date(payment.created_at) >= today)

    return {
      totalPayments: payments.length,
      statusCounts,
      totalAmount: totalAmount / 100, // Convert cents to dollars
      totalFees: totalFees / 100,
      netAmount: netAmount / 100,
      succeededCount: succeededPayments.length,
      succeededAmount: succeededAmount / 100,
      todaysPayments: todaysPayments.length,
      todaysAmount: todaysPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0) / 100,
    }
  },
}

// Export for easy import
export { SupabasePaymentStore as PaymentStore }
