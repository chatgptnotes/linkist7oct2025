import { NextRequest, NextResponse } from 'next/server';
import { SupabaseCardConfigStore, type CardConfig } from '@/lib/supabase-card-config-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      firstName,
      lastName,
      title,
      company,
      mobile,
      email,
      whatsapp,
      website,
      linkedin,
      instagram,
      twitter,
      profileImage,
      backgroundImage,
      quantity,
      mobileVerified = false
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !title || !company || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate mobile format (10-15 digits) - only if provided
    if (mobile && mobile.trim() !== '') {
      const digitsOnly = mobile.replace(/\D/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return NextResponse.json(
          { error: 'Invalid mobile number format' },
          { status: 400 }
        );
      }
    }

    // Create card configuration with correct field mapping to actual database structure
    const cardConfig: Omit<CardConfig, 'id' | 'created_at' | 'updated_at'> = {
      full_name: `${firstName} ${lastName}`,
      title,
      company,
      phone: mobile || null,
      email,
      website: website || null,
      linkedin_url: linkedin || null,
      instagram_url: instagram || null,
      twitter_url: twitter || null,
      facebook_url: null, // Not provided from form
      logo_url: profileImage || null,
      photo_url: backgroundImage || null,
      primary_color: '#000000', // Default
      secondary_color: '#FFFFFF', // Default
      background_style: 'gradient', // Default
      card_type: 'standard', // Default
      user_id: null, // Will be set when user auth is implemented
      qr_code_data: null, // Will be generated later
    };

    // Save to Supabase
    const savedConfig = await SupabaseCardConfigStore.create(cardConfig);

    if (!savedConfig) {
      console.error('Failed to save card configuration to database');
      return NextResponse.json(
        { error: 'Failed to save card configuration' },
        { status: 500 }
      );
    }

    console.log(`✅ Card configuration saved for ${email}:`, savedConfig.id);

    return NextResponse.json({
      success: true,
      message: 'Card configuration saved successfully',
      configId: savedConfig.id,
      config: savedConfig,
    });

  } catch (error) {
    console.error('Error saving card configuration:', error);
    return NextResponse.json(
      { error: 'Failed to save card configuration' },
      { status: 500 }
    );
  }
}

// GET endpoint for development - show recent configs
export async function GET() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const configs = await SupabaseCardConfigStore.getAll();
      const recentConfigs = configs.slice(0, 10).map(config => ({
        id: config.id,
        name: config.full_name,
        email: config.email,
        company: config.company,
        cardType: config.card_type,
        createdAt: config.created_at,
      }));
      
      return NextResponse.json({ configs: recentConfigs });
    } catch (error) {
      console.error('Error getting card configs:', error);
      return NextResponse.json({ error: 'Failed to get configs' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}