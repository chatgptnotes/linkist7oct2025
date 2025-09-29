import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/storage-service'
import { getCurrentUser } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('filePath')
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600')

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: 'File path required' },
        { status: 400 }
      )
    }

    // Get current user for authorization
    const session = await getCurrentUser(request)
    
    // For now, allow anyone to get signed URLs
    // In production, you'd implement proper access control here
    console.log(`🔗 Creating signed URL for: ${filePath}`)

    const signedUrl = await storageService.getSignedUrl(filePath, expiresIn)

    if (!signedUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to create signed URL' },
        { status: 500 }
      )
    }

    console.log('✅ Signed URL created')

    return NextResponse.json({
      success: true,
      data: {
        signedUrl,
        expiresIn,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
      }
    })

  } catch (error) {
    console.error('💥 Signed URL API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create signed URL' 
      },
      { status: 500 }
    )
  }
}