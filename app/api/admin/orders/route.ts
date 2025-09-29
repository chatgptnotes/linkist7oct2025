/**
 * Admin API: Order Management
 * All order data is stored in Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase/admin-client';

// GET /api/admin/orders - Get all orders with details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch orders from Supabase with all related data
    const orders = await adminDb.getOrders({
      status,
      dateFrom,
      dateTo,
      page,
      limit
    });

    // Calculate totals
    const totals = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: any) =>
        sum + (order.pricing?.total || 0), 0
      ),
      averageOrderValue: orders.length > 0
        ? orders.reduce((sum: number, order: any) =>
            sum + (order.pricing?.total || 0), 0) / orders.length
        : 0
    };

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'view_orders',
      entity_type: 'orders',
      details: { filters: { status, dateFrom, dateTo }, page, limit }
    });

    return NextResponse.json({
      success: true,
      data: orders,
      totals,
      pagination: {
        page,
        limit,
        total: orders.length
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/admin/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.customer_name || !data.email || !data.phone_number) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // Generate order number
    const { data: orderNumber } = await adminDb.supabase.rpc('generate_order_number');

    // Create order in Supabase
    const { data: order, error } = await adminDb.supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: data.status || 'pending',
        customer_name: data.customer_name,
        email: data.email,
        phone_number: data.phone_number,
        card_config: data.card_config || {},
        shipping: data.shipping || {},
        pricing: data.pricing || {},
        estimated_delivery: data.estimated_delivery,
        notes: data.notes
      })
      .select()
      .single();

    if (error) throw error;

    // Create order items if provided
    if (data.items && data.items.length > 0) {
      const orderItems = data.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount || 0,
        tax_amount: item.tax_amount || 0,
        total_amount: item.total_amount,
        customization: item.customization || {}
      }));

      const { error: itemsError } = await adminDb.supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Add to order status history
    await adminDb.supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: order.status,
        notes: 'Order created'
      });

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'create_order',
      entity_type: 'orders',
      entity_id: order.id,
      details: { order_number: order.order_number, customer: data.customer_name }
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/orders - Update order
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const orderId = data.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID required' },
        { status: 400 }
      );
    }

    // Get current order
    const { data: currentOrder } = await adminDb.supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    // Update order in Supabase
    const { data: order, error } = await adminDb.supabase
      .from('orders')
      .update({
        status: data.status,
        customer_name: data.customer_name,
        email: data.email,
        phone_number: data.phone_number,
        card_config: data.card_config,
        shipping: data.shipping,
        pricing: data.pricing,
        estimated_delivery: data.estimated_delivery,
        tracking_number: data.tracking_number,
        tracking_url: data.tracking_url,
        proof_images: data.proof_images,
        notes: data.notes
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Add to status history if status changed
    if (currentOrder && currentOrder.status !== data.status) {
      await adminDb.supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: data.status,
          notes: data.status_notes || `Status changed from ${currentOrder.status} to ${data.status}`,
          changed_by: data.admin_id
        });
    }

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'update_order',
      entity_type: 'orders',
      entity_id: orderId,
      details: { changes: data }
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/orders - Cancel order
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID required' },
        { status: 400 }
      );
    }

    // Soft delete - just change status to cancelled
    const { error } = await adminDb.supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (error) throw error;

    // Add to status history
    await adminDb.supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: 'cancelled',
        notes: 'Order cancelled by admin'
      });

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'cancel_order',
      entity_type: 'orders',
      entity_id: orderId,
      details: {}
    });

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}