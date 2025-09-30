import { NextRequest, NextResponse } from 'next/server';
import { GDPRStore } from '@/lib/gdpr-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, type } = body;

    if (!email || !type) {
      return NextResponse.json(
        { success: false, error: 'Email and request type are required' },
        { status: 400 }
      );
    }

    if (!['export', 'deletion'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request type. Must be "export" or "deletion"' },
        { status: 400 }
      );
    }

    // Check if there's already a pending request of the same type
    const existingRequests = GDPRStore.getDataRequestsByEmail(email);
    const pendingRequest = existingRequests.find(req => 
      req.type === type && req.status === 'pending'
    );

    if (pendingRequest) {
      return NextResponse.json(
        { success: false, error: `A ${type} request is already pending for this email` },
        { status: 409 }
      );
    }

    const dataRequest = GDPRStore.createDataRequest({
      email,
      type: type as 'export' | 'deletion',
    });

    return NextResponse.json({
      success: true,
      request: {
        id: dataRequest.id,
        email: dataRequest.email,
        type: dataRequest.type,
        status: dataRequest.status,
        requestDate: dataRequest.requestDate,
      },
    });
  } catch (error) {
    console.error('GDPR data request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const requestId = searchParams.get('id');

    if (requestId) {
      // Get specific request
      const dataRequest = GDPRStore.getDataRequest(requestId);
      
      if (!dataRequest) {
        return NextResponse.json(
          { success: false, error: 'Data request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        request: dataRequest,
      });
    } else if (email) {
      // Get all requests for email
      const requests = GDPRStore.getDataRequestsByEmail(email);
      
      return NextResponse.json({
        success: true,
        requests,
      });
    } else {
      // Admin endpoint - get all requests
      const allRequests = GDPRStore.getAllDataRequests();
      
      return NextResponse.json({
        success: true,
        requests: allRequests,
      });
    }
  } catch (error) {
    console.error('GDPR data request retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve data requests' },
      { status: 500 }
    );
  }
}