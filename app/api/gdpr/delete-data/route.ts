import { NextRequest, NextResponse } from 'next/server';
import { GDPRStore } from '@/lib/gdpr-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, requestId, confirmDeletion } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!confirmDeletion) {
      return NextResponse.json(
        { success: false, error: 'Deletion confirmation is required' },
        { status: 400 }
      );
    }

    // If requestId is provided, update the request status
    if (requestId) {
      GDPRStore.updateDataRequest(requestId, {
        status: 'processing',
      });
    }

    // Delete all user data
    const success = await GDPRStore.deleteUserData(email);

    if (!success) {
      // Update request status to failed if requestId provided
      if (requestId) {
        GDPRStore.updateDataRequest(requestId, {
          status: 'failed',
          notes: 'Failed to delete user data',
        });
      }

      return NextResponse.json(
        { success: false, error: 'Failed to delete user data' },
        { status: 500 }
      );
    }

    // Note: The request status is updated to completed within deleteUserData function

    return NextResponse.json({
      success: true,
      message: 'All user data has been permanently deleted',
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GDPR data deletion error:', error);
    
    // Update request status to failed if requestId provided
    const body = await request.json().catch(() => ({}));
    if (body.requestId) {
      GDPRStore.updateDataRequest(body.requestId, {
        status: 'failed',
        notes: `Deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to preview what would be deleted
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

    // Get preview of data that would be deleted
    const userData = await GDPRStore.exportUserData(email);

    // Count items that would be deleted
    const deletionSummary = {
      email,
      ordersToDelete: userData.order_data.length,
      consentRecord: userData.personal_data.consent_record ? 'Will be deleted' : 'None found',
      dataRequests: userData.personal_data.data_requests.length,
      estimatedDeletionTime: '< 1 minute',
      warning: 'This action cannot be undone. All data will be permanently deleted.',
    };

    return NextResponse.json({
      success: true,
      deletionSummary,
      userData: userData, // Include full data for admin review
    });
  } catch (error) {
    console.error('GDPR data deletion preview error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to preview data deletion' },
      { status: 500 }
    );
  }
}