import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  blockPhoneNumber,
  unblockPhoneNumber,
  getPhoneSpamStats,
  cleanupOldSpamData,
} from '@/lib/spam-detection';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET - View spam statistics and blocked numbers
 * Query params:
 * - action: 'stats' | 'blocked' | 'suspicious-ips' | 'phone-details'
 * - phone: phone number (for phone-details action)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';
    const phone = searchParams.get('phone');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case 'phone-details': {
        if (!phone) {
          return NextResponse.json(
            { error: 'Phone number required' },
            { status: 400 }
          );
        }

        const stats = await getPhoneSpamStats(phone);
        return NextResponse.json({ stats });
      }

      case 'blocked': {
        const { data: blockedNumbers } = await supabase
          .from('blocked_phone_numbers')
          .select('*')
          .order('blocked_at', { ascending: false })
          .limit(100);

        return NextResponse.json({ blockedNumbers });
      }

      case 'suspicious-ips': {
        const { data: suspiciousIps } = await supabase
          .from('suspicious_ips')
          .select('*')
          .gte('risk_score', 30)
          .order('risk_score', { ascending: false })
          .limit(100);

        return NextResponse.json({ suspiciousIps });
      }

      case 'stats':
      default: {
        // Get overall statistics
        const { data: totalTracked } = await supabase
          .from('phone_spam_tracking')
          .select('count');

        const { data: currentlyBlocked } = await supabase
          .from('phone_spam_tracking')
          .select('count')
          .eq('is_blocked', true);

        const { data: permanentlyBlocked } = await supabase
          .from('blocked_phone_numbers')
          .select('count');

        const { data: highRisk } = await supabase
          .from('phone_spam_tracking')
          .select('count')
          .gte('total_risk_score', 60);

        const { data: recentAttempts } = await supabase
          .from('phone_spam_tracking')
          .select('*')
          .gte('last_attempt_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .order('last_attempt_at', { ascending: false })
          .limit(50);

        const { data: topRiskPhones } = await supabase
          .from('phone_spam_tracking')
          .select('phone_number, total_risk_score, attempt_count, last_attempt_at, is_blocked')
          .order('total_risk_score', { ascending: false })
          .limit(20);

        return NextResponse.json({
          stats: {
            totalPhonesTracked: totalTracked?.[0]?.count || 0,
            currentlyBlocked: currentlyBlocked?.[0]?.count || 0,
            permanentlyBlocked: permanentlyBlocked?.[0]?.count || 0,
            highRiskCount: highRisk?.[0]?.count || 0,
          },
          recentAttempts,
          topRiskPhones,
        });
      }
    }
  } catch (error) {
    console.error('Error in spam management GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Block a phone number or IP
 * Body:
 * - action: 'block-phone' | 'unblock-phone' | 'block-ip' | 'cleanup'
 * - phone: phone number (for block-phone/unblock-phone)
 * - reason: reason for blocking (for block-phone)
 * - ip: IP address (for block-ip)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, phone, reason, ip, blockedBy } = body;

    switch (action) {
      case 'block-phone': {
        if (!phone || !reason) {
          return NextResponse.json(
            { error: 'Phone number and reason required' },
            { status: 400 }
          );
        }

        await blockPhoneNumber(phone, reason, blockedBy || 'admin');

        return NextResponse.json({
          success: true,
          message: `Phone number ${phone} has been blocked`,
        });
      }

      case 'unblock-phone': {
        if (!phone) {
          return NextResponse.json(
            { error: 'Phone number required' },
            { status: 400 }
          );
        }

        await unblockPhoneNumber(phone);

        return NextResponse.json({
          success: true,
          message: `Phone number ${phone} has been unblocked`,
        });
      }

      case 'block-ip': {
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required' },
            { status: 400 }
          );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        await supabase
          .from('suspicious_ips')
          .update({
            is_blocked: true,
            risk_score: 100,
            updated_at: new Date().toISOString(),
          })
          .eq('ip_address', ip);

        return NextResponse.json({
          success: true,
          message: `IP address ${ip} has been blocked`,
        });
      }

      case 'cleanup': {
        await cleanupOldSpamData();

        return NextResponse.json({
          success: true,
          message: 'Old spam data cleaned up successfully',
        });
      }

      default: {
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Error in spam management POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear spam tracking for a phone number (reset)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase
      .from('phone_spam_tracking')
      .delete()
      .eq('phone_number', phone);

    return NextResponse.json({
      success: true,
      message: `Spam tracking reset for ${phone}`,
    });
  } catch (error) {
    console.error('Error in spam management DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
