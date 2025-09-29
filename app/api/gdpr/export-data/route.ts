import { NextRequest, NextResponse } from 'next/server';
import { GDPRStore } from '@/lib/gdpr-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, requestId } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // If requestId is provided, update the request status
    if (requestId) {
      GDPRStore.updateDataRequest(requestId, {
        status: 'processing',
      });
    }

    // Export all user data
    const userData = await GDPRStore.exportUserData(email);

    // Update request status to completed if requestId provided
    if (requestId) {
      GDPRStore.updateDataRequest(requestId, {
        status: 'completed',
        notes: 'Data export completed successfully',
      });
    }

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `linkist-data-export-${email.replace('@', '-at-')}-${timestamp}.json`;

    // Return the data as a downloadable JSON file
    return new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('GDPR data export error:', error);
    
    // Update request status to failed if requestId provided
    const body = await request.json().catch(() => ({}));
    if (body.requestId) {
      GDPRStore.updateDataRequest(body.requestId, {
        status: 'failed',
        notes: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
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

    // Export all user data
    const userData = await GDPRStore.exportUserData(email);

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `linkist-data-export-${email.replace('@', '-at-')}-${timestamp}.json`;

    // Return the data as a downloadable JSON file
    return new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('GDPR data export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}