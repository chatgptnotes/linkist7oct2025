import { NextRequest, NextResponse } from 'next/server';

// Default settings
const defaultSettings = {
  general: {
    siteName: 'Linkist',
    siteDescription: 'Smart NFC Business Cards for Modern Professionals',
    adminEmail: 'admin@linkist.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  },
  branding: {
    logo: '/logo_linkist.png',
    favicon: '/favicon.ico',
    primaryColor: '#DC2626',
    secondaryColor: '#000000',
    companyName: 'Linkist'
  },
  email: {
    provider: 'resend',
    smtpHost: 'smtp.resend.com',
    smtpPort: 587,
    smtpUser: process.env.RESEND_API_KEY || '',
    smtpPassword: '',
    fromEmail: 'noreply@linkist.com',
    fromName: 'Linkist',
    templates: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      orderCancelled: true
    }
  },
  payment: {
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    paypalEnabled: false,
    paypalClientId: '',
    paypalClientSecret: '',
    currency: 'USD',
    taxRate: 0
  },
  shipping: {
    freeShippingThreshold: 100,
    domesticRate: 5,
    internationalRate: 15,
    processingDays: 2,
    carriers: ['USPS', 'FedEx', 'UPS']
  },
  security: {
    twoFactorEnabled: false,
    passwordMinLength: 8,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    ipWhitelist: []
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: false,
    orderAlerts: true,
    lowStockAlerts: true,
    newCustomerAlerts: true
  }
};

export async function GET(request: NextRequest) {
  try {
    // In a real app, fetch settings from database
    // For now, return default settings
    return NextResponse.json({
      success: true,
      settings: defaultSettings
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json();

    // In a real app, save settings to database
    console.log('Settings would be saved:', settings);

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
