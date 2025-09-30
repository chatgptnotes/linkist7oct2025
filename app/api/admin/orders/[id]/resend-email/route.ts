import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { formatOrderForEmail } from '@/lib/order-store';
import { emailService, type EmailType } from '@/lib/email-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    const session = await import('@/lib/auth-middleware').then(m => m.getCurrentUser(request));
    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }
    
    const { emailType } = await request.json();
    
    const { id: orderId } = await params;

    if (!emailType || !['confirmation', 'receipt', 'production', 'shipped', 'delivered'].includes(emailType)) {
      return NextResponse.json(
        { error: 'Invalid email type provided' },
        { status: 400 }
      );
    }

    const order = await SupabaseOrderStore.getById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format order data for email template
    const emailData = formatOrderForEmail(order);

    // Send the email
    const result = await emailService.sendOrderEmail(emailType as EmailType, emailData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update order's email tracking
    const emailTracking = {
      sent: true,
      timestamp: Date.now(),
      messageId: result.messageId
    };

    const updatedOrder = await SupabaseOrderStore.update(orderId, {
      emailsSent: {
        ...order.emailsSent,
        [emailType]: emailTracking
      }
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      emailResult: result
    });
  } catch (error) {
    console.error('Error resending email:', error);
    return NextResponse.json(
      { error: 'Failed to resend email' },
      { status: 500 }
    );
  }
}