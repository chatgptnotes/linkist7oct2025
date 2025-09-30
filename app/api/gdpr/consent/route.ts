import { NextRequest, NextResponse } from 'next/server';
import { GDPRStore, getClientInfo } from '@/lib/gdpr-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { purposes, consentGiven, email } = body;

    if (!purposes) {
      return NextResponse.json(
        { success: false, error: 'Consent purposes are required' },
        { status: 400 }
      );
    }

    // Get client information for audit trail
    const { ipAddress, userAgent } = getClientInfo(request);

    // For anonymous users, we'll use a session-based approach
    // In a real app, you'd get the email from the authenticated user
    const userEmail = email || 'anonymous@session';

    const consentRecord = GDPRStore.recordConsent({
      email: userEmail,
      consentGiven: consentGiven ?? true,
      consentDate: Date.now(),
      ipAddress,
      userAgent,
      purposes: {
        essential: true, // Always true
        analytics: purposes.analytics ?? false,
        marketing: purposes.marketing ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      consent: {
        id: userEmail,
        consentGiven: consentRecord.consentGiven,
        purposes: consentRecord.purposes,
        consentDate: consentRecord.consentDate,
      },
    });
  } catch (error) {
    console.error('GDPR consent error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record consent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const consent = GDPRStore.getConsent(email);
    
    if (!consent) {
      return NextResponse.json(
        { success: false, error: 'No consent record found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      consent: {
        email: consent.email,
        consentGiven: consent.consentGiven,
        purposes: consent.purposes,
        consentDate: consent.consentDate,
        updatedAt: consent.updatedAt,
      },
    });
  } catch (error) {
    console.error('GDPR consent retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve consent' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, purposes, consentGiven } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    
    if (purposes !== undefined) {
      updates.purposes = {
        essential: true, // Always true
        analytics: purposes.analytics ?? false,
        marketing: purposes.marketing ?? false,
      };
    }
    
    if (consentGiven !== undefined) {
      updates.consentGiven = consentGiven;
    }

    const updatedConsent = GDPRStore.updateConsent(email, updates);
    
    if (!updatedConsent) {
      return NextResponse.json(
        { success: false, error: 'Consent record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      consent: {
        email: updatedConsent.email,
        consentGiven: updatedConsent.consentGiven,
        purposes: updatedConsent.purposes,
        consentDate: updatedConsent.consentDate,
        updatedAt: updatedConsent.updatedAt,
      },
    });
  } catch (error) {
    console.error('GDPR consent update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update consent' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const success = GDPRStore.withdrawConsent(email);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Consent record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Consent withdrawn successfully',
    });
  } catch (error) {
    console.error('GDPR consent withdrawal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to withdraw consent' },
      { status: 500 }
    );
  }
}