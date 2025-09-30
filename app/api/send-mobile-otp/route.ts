import { NextRequest, NextResponse } from 'next/server';
import { SupabaseMobileOTPStore, generateMobileOTP, cleanExpiredOTPs, type MobileOTPRecord } from '@/lib/supabase-otp-store';

// Fast2SMS API integration
async function sendSMSViaFast2SMS(mobile: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const senderId = process.env.FAST2SMS_SENDER_ID || 'FSTSMS';
  const templateId = process.env.FAST2SMS_DLT_TEMPLATE_ID || '177970';
  const route = process.env.FAST2SMS_ROUTE || 'dlt';
  
  if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
    console.warn('Fast2SMS API key not configured. SMS will not be sent.');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    // Format mobile number (remove +91 if present for Indian numbers)
    let formattedMobile = mobile.replace(/\D/g, '');
    if (formattedMobile.startsWith('91') && formattedMobile.length === 12) {
      formattedMobile = formattedMobile.substring(2);
    }

    // Method 1: Try GET request (as shown in your example)
    let url = 'https://www.fast2sms.com/dev/bulkV2';
    
    if (route === 'dlt') {
      // DLT route with template - Build query parameters
      const params = new URLSearchParams({
        authorization: apiKey,
        route: 'dlt',
        sender_id: senderId,
        message: templateId,
        variables_values: otp,
        numbers: formattedMobile,
        flash: '0'
      });
      
      url = `${url}?${params.toString()}`;
      
      console.log(`🔗 Fast2SMS GET URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      const data = await response.json();
      console.log('Fast2SMS GET Response:', data);
      
      if (data.return === true || data.status_code === 200 || data.success === true) {
        console.log(`✅ SMS sent successfully to ${mobile} via GET`);
        return { success: true };
      } else {
        console.warn('GET method failed, trying POST...');
        // Fall back to POST method
        return await sendViaPOST(mobile, otp, formattedMobile, route, senderId, templateId, apiKey);
      }
    } else {
      // Quick route
      const params = new URLSearchParams({
        authorization: apiKey,
        route: 'q',
        message: `Your Linkist verification code is: ${otp}. Valid for 5 minutes.`,
        numbers: formattedMobile,
        flash: '0'
      });
      
      url = `${url}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      const data = await response.json();
      
      if (data.return === true || data.status_code === 200 || data.success === true) {
        console.log(`✅ SMS sent successfully to ${mobile}`);
        return { success: true };
      } else {
        console.error('Fast2SMS error:', data);
        return { 
          success: false, 
          error: data.message || 'Failed to send SMS' 
        };
      }
    }
  } catch (error) {
    console.error('Error sending SMS via Fast2SMS:', error);
    return { 
      success: false, 
      error: 'Network error while sending SMS' 
    };
  }
}

// Fallback POST method
async function sendViaPOST(mobile: string, otp: string, formattedMobile: string, route: string, senderId: string, templateId: string, apiKey: string) {
  try {
    let body: any = {};
    
    if (route === 'dlt') {
      body = {
        sender_id: senderId,
        message: templateId,
        variables_values: otp,
        route: 'dlt',
        numbers: formattedMobile,
      };
    } else {
      body = {
        message: `Your Linkist verification code is: ${otp}. Valid for 5 minutes.`,
        language: 'english',
        route: 'q',
        numbers: formattedMobile,
      };
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Fast2SMS POST Response:', data);
    
    if (data.return === true || data.status_code === 200 || data.success === true) {
      console.log(`✅ SMS sent successfully to ${mobile} via POST`);
      return { success: true };
    } else {
      console.error('Fast2SMS POST error:', data);
      return { 
        success: false, 
        error: data.message || 'Failed to send SMS via POST' 
      };
    }
  } catch (error) {
    console.error('POST method error:', error);
    return { 
      success: false, 
      error: 'Network error in POST method' 
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json(
        { error: 'Valid mobile number is required' },
        { status: 400 }
      );
    }

    // Validate mobile number format
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json(
        { error: 'Please enter a valid mobile number (10-15 digits)' },
        { status: 400 }
      );
    }

    // Clean expired OTPs
    await cleanExpiredOTPs();

    // Generate new OTP
    const otp = generateMobileOTP();
    const expiresAt = new Date(Date.now() + (5 * 60 * 1000)).toISOString(); // 5 minutes expiry

    // Store OTP in Supabase
    const stored = await SupabaseMobileOTPStore.set(mobile, {
      mobile,
      otp,
      expires_at: expiresAt,
      verified: false
    });

    if (!stored) {
      console.error('Failed to store mobile OTP in database');
      return NextResponse.json(
        { error: 'Failed to store verification code' },
        { status: 500 }
      );
    }

    // Send SMS via Fast2SMS
    const smsResult = await sendSMSViaFast2SMS(mobile, otp);
    
    // Log for debugging
    console.log(`📱 Mobile OTP for ${mobile}: ${otp} (expires in 5 minutes)`);
    
    if (!smsResult.success) {
      console.warn(`SMS send failed: ${smsResult.error}`);
      // Still return success but indicate SMS wasn't sent
      return NextResponse.json({
        success: true,
        message: 'Verification code generated. Check console for OTP.',
        smsStatus: 'not_sent',
        smsError: smsResult.error,
        // For development/testing purposes, include the OTP in response
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your mobile number',
      smsStatus: 'sent',
      // For development/testing purposes, include the OTP in response
      // Remove this in production!
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Error sending mobile OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

// GET endpoint for development - show current OTPs
export async function GET() {
  if (process.env.NODE_ENV === 'development') {
    await cleanExpiredOTPs();
    const records = await SupabaseMobileOTPStore.getAllForDev();
    const currentOTPs = records.map((record) => ({
      mobile: record.mobile,
      otp: record.otp,
      expiresAt: record.expires_at,
      expired: new Date() > new Date(record.expires_at),
      verified: record.verified
    }));
    
    return NextResponse.json({ otps: currentOTPs });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}