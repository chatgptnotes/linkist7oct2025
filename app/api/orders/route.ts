import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore, generateOrderNumber } from '@/lib/supabase-order-store';
import { SupabaseUserStore } from '@/lib/supabase-user-store';
import { emailService } from '@/lib/email-service';
import { formatOrderForEmail } from '@/lib/order-store';
import type { Order } from '@/lib/order-store';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Orders API: Received order creation request');

    const body = await request.json();
    console.log('📋 Orders API: Request body:', body);

    // Validate required fields
    if (!body.customerName || !body.email || !body.cardConfig || !body.shipping || !body.pricing) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, email, cardConfig, shipping, pricing' },
        { status: 400 }
      );
    }

    // Create/update user in database
    console.log('👤 Orders API: Creating/updating user...');
    const user = await SupabaseUserStore.upsertByEmail({
      email: body.email,
      first_name: body.cardConfig.firstName || body.firstName || null,
      last_name: body.cardConfig.lastName || body.lastName || null,
      phone_number: body.phoneNumber || body.shipping.phoneNumber || null,
      email_verified: true,
      mobile_verified: !!(body.phoneNumber || body.shipping.phoneNumber),
    });

    console.log('✅ Orders API: User created/updated:', user.id);

    // Generate order number with LFND-XXXXXX prefix
    const orderNumber = await generateOrderNumber();

    // Create order object
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      orderNumber,
      userId: user.id, // Link to user
      status: 'pending',
      customerName: body.customerName,
      email: body.email,
      phoneNumber: body.phoneNumber || '',
      cardConfig: {
        firstName: body.cardConfig.firstName || '',
        lastName: body.cardConfig.lastName || '',
        title: body.cardConfig.title,
        mobile: body.cardConfig.mobile,
        whatsapp: body.cardConfig.whatsapp || false,
        logo: body.cardConfig.logo,
        quantity: body.quantity || 1,
        ...body.cardConfig
      },
      shipping: {
        fullName: `${body.firstName || ''} ${body.lastName || ''}`.trim() || body.customerName,
        addressLine1: body.shipping.addressLine1 || '',
        addressLine2: body.shipping.addressLine2,
        city: body.shipping.city || '',
        state: body.shipping.stateProvince || body.shipping.state || '',
        country: body.shipping.country || '',
        postalCode: body.shipping.postalCode || '',
        phoneNumber: body.phoneNumber || body.shipping.phoneNumber || '',
        ...body.shipping
      },
      pricing: {
        subtotal: body.pricing.subtotal || 0,
        shipping: body.pricing.shippingCost || body.pricing.shipping || 0,
        tax: body.pricing.taxAmount || body.pricing.tax || 0,
        total: body.pricing.total || 0,
        ...body.pricing
      },
      emailsSent: {},
      estimatedDelivery: body.estimatedDelivery,
      trackingNumber: body.trackingNumber,
      trackingUrl: body.trackingUrl,
      proofImages: body.proofImages || [],
      notes: body.notes
    };

    console.log('🔄 Orders API: Creating order with data:', orderData);

    // Create order in database
    const order = await SupabaseOrderStore.create(orderData);
    
    console.log('✅ Orders API: Order created successfully:', order.id);

    // Send confirmation email automatically
    try {
      console.log('📧 Orders API: Sending confirmation email...');
      const emailData = formatOrderForEmail(order);
      const emailResult = await emailService.sendOrderEmail('confirmation', emailData);
      
      if (emailResult.success) {
        console.log('✅ Orders API: Confirmation email sent successfully');
        
        // Update order with email tracking
        await SupabaseOrderStore.update(order.id, {
          emailsSent: {
            ...order.emailsSent,
            confirmation: {
              sent: true,
              timestamp: Date.now(),
              messageId: emailResult.messageId
            }
          }
        });
      } else {
        console.error('❌ Orders API: Failed to send confirmation email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('💥 Orders API: Email sending error:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      order: order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('❌ Orders API: Error creating order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This could be used to get order by order number or email (public lookup)
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const email = searchParams.get('email');

  try {
    if (orderNumber) {
      const order = await SupabaseOrderStore.getByOrderNumber(orderNumber);
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    if (email) {
      const orders = await SupabaseOrderStore.getByEmail(email);
      return NextResponse.json({ success: true, orders });
    }

    return NextResponse.json(
      { error: 'Please provide orderNumber or email parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}