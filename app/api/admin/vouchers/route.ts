import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Voucher, CreateVoucherRequest, UpdateVoucherRequest, VoucherStats } from '@/types/voucher';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - List all vouchers with stats
export async function GET(request: NextRequest) {
  try {
    // Fetch all vouchers
    const { data: vouchers, error: vouchersError } = await supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (vouchersError) {
      console.error('Error fetching vouchers:', vouchersError);
      return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
    }

    // Calculate stats
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stats: VoucherStats = {
      total_vouchers: vouchers?.length || 0,
      active_vouchers: vouchers?.filter(v => v.is_active && (!v.valid_until || new Date(v.valid_until) > now)).length || 0,
      total_usage: vouchers?.reduce((sum, v) => sum + v.used_count, 0) || 0,
      total_discount_given: 0, // TODO: Calculate from voucher_usage table
      expiring_soon: vouchers?.filter(v =>
        v.is_active &&
        v.valid_until &&
        new Date(v.valid_until) > now &&
        new Date(v.valid_until) <= sevenDaysFromNow
      ).length || 0
    };

    return NextResponse.json({
      success: true,
      vouchers: vouchers || [],
      stats
    });
  } catch (error) {
    console.error('Error in vouchers GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new voucher
export async function POST(request: NextRequest) {
  try {
    const body: CreateVoucherRequest = await request.json();

    // Validate required fields
    if (!body.code || !body.discount_type || body.discount_value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from('vouchers')
      .select('id')
      .eq('code', body.code)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Voucher code already exists' }, { status: 400 });
    }

    // Insert voucher
    const { data, error } = await supabase
      .from('vouchers')
      .insert({
        code: body.code,
        description: body.description || null,
        discount_type: body.discount_type,
        discount_value: body.discount_value,
        min_order_value: body.min_order_value || 0,
        max_discount_amount: body.max_discount_amount || null,
        usage_limit: body.usage_limit || null,
        user_limit: body.user_limit || 1,
        valid_from: body.valid_from || new Date().toISOString(),
        valid_until: body.valid_until || null,
        is_active: body.is_active !== undefined ? body.is_active : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating voucher:', error);
      return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      voucher: data
    });
  } catch (error) {
    console.error('Error in vouchers POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update voucher
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateVoucherRequest = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Voucher ID is required' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};
    if (body.code !== undefined) updateData.code = body.code;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.discount_type !== undefined) updateData.discount_type = body.discount_type;
    if (body.discount_value !== undefined) updateData.discount_value = body.discount_value;
    if (body.min_order_value !== undefined) updateData.min_order_value = body.min_order_value;
    if (body.max_discount_amount !== undefined) updateData.max_discount_amount = body.max_discount_amount;
    if (body.usage_limit !== undefined) updateData.usage_limit = body.usage_limit;
    if (body.user_limit !== undefined) updateData.user_limit = body.user_limit;
    if (body.valid_from !== undefined) updateData.valid_from = body.valid_from;
    if (body.valid_until !== undefined) updateData.valid_until = body.valid_until;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    // Update voucher
    const { data, error } = await supabase
      .from('vouchers')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating voucher:', error);
      return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      voucher: data
    });
  } catch (error) {
    console.error('Error in vouchers PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete voucher
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Voucher ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting voucher:', error);
      return NextResponse.json({ error: 'Failed to delete voucher' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Voucher deleted successfully'
    });
  } catch (error) {
    console.error('Error in vouchers DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
