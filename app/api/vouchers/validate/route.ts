import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VoucherValidationRequest, VoucherValidationResponse } from '@/types/voucher';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body: VoucherValidationRequest = await request.json();

    if (!body.code || body.orderAmount === undefined) {
      return NextResponse.json({
        valid: false,
        message: 'Voucher code and order amount are required',
        error: 'Missing required fields'
      } as VoucherValidationResponse, { status: 400 });
    }

    // Fetch voucher from database
    const { data: voucher, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', body.code.toUpperCase())
      .single();

    if (error || !voucher) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid voucher code',
        error: 'Voucher not found'
      } as VoucherValidationResponse);
    }

    // Check if voucher is active
    if (!voucher.is_active) {
      return NextResponse.json({
        valid: false,
        message: 'This voucher is no longer active',
        error: 'Voucher inactive'
      } as VoucherValidationResponse);
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(voucher.valid_from);
    const validUntil = voucher.valid_until ? new Date(voucher.valid_until) : null;

    if (now < validFrom) {
      return NextResponse.json({
        valid: false,
        message: 'This voucher is not yet valid',
        error: 'Voucher not started'
      } as VoucherValidationResponse);
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json({
        valid: false,
        message: 'This voucher has expired',
        error: 'Voucher expired'
      } as VoucherValidationResponse);
    }

    // Check usage limit
    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      return NextResponse.json({
        valid: false,
        message: 'This voucher has reached its usage limit',
        error: 'Usage limit exceeded'
      } as VoucherValidationResponse);
    }

    // Check minimum order value
    if (body.orderAmount < voucher.min_order_value) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order value of $${voucher.min_order_value} required`,
        error: 'Minimum order value not met'
      } as VoucherValidationResponse);
    }

    // Check per-user usage limit (if userEmail provided)
    if (body.userEmail && voucher.user_limit) {
      const { data: usageData, error: usageError } = await supabase
        .from('voucher_usage')
        .select('id')
        .eq('voucher_id', voucher.id)
        .eq('user_email', body.userEmail);

      if (usageError) {
        console.error('Error checking user usage:', usageError);
      } else if (usageData && usageData.length >= voucher.user_limit) {
        return NextResponse.json({
          valid: false,
          message: 'You have already used this voucher',
          error: 'User limit exceeded'
        } as VoucherValidationResponse);
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.discount_type === 'percentage') {
      discountAmount = (body.orderAmount * voucher.discount_value) / 100;
    } else {
      discountAmount = voucher.discount_value;
    }

    // Apply max discount limit if specified
    if (voucher.max_discount_amount && discountAmount > voucher.max_discount_amount) {
      discountAmount = voucher.max_discount_amount;
    }

    // Ensure discount doesn't exceed order amount
    if (discountAmount > body.orderAmount) {
      discountAmount = body.orderAmount;
    }

    const finalAmount = Math.max(0, body.orderAmount - discountAmount);

    return NextResponse.json({
      valid: true,
      message: `${voucher.discount_value}${voucher.discount_type === 'percentage' ? '%' : '$'} discount applied successfully!`,
      voucher: {
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value,
        discount_amount: discountAmount,
        final_amount: finalAmount
      }
    } as VoucherValidationResponse);

  } catch (error) {
    console.error('Error validating voucher:', error);
    return NextResponse.json({
      valid: false,
      message: 'Failed to validate voucher code',
      error: 'Internal server error'
    } as VoucherValidationResponse, { status: 500 });
  }
}
