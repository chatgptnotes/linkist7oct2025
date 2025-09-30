import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/storage-service'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 File upload request received')

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const orderId = formData.get('orderId') as string
    const folder = formData.get('folder') as string
    const isPublic = formData.get('isPublic') === 'true'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`📁 Uploading file: ${file.name} (${file.size} bytes, ${file.type})`)

    // Upload file using storage service
    const uploadResult = await storageService.uploadFile(file, file.name, {
      folder: folder as any,
      userId: userId || undefined,
      orderId: orderId || undefined,
      isPublic,
      generateThumbnail: file.type.startsWith('image/')
    })

    if (!uploadResult.success) {
      console.error('❌ Upload failed:', uploadResult.error)
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      )
    }

    console.log('✅ Upload successful:', uploadResult.data?.id)

    return NextResponse.json({
      success: true,
      data: uploadResult.data
    })

  } catch (error) {
    console.error('💥 Upload API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId')

    if (!assetId) {
      return NextResponse.json(
        { success: false, error: 'Asset ID required' },
        { status: 400 }
      )
    }

    console.log(`🗑️  Deleting asset: ${assetId}`)

    const deleteResult = await storageService.deleteFile(assetId)

    if (!deleteResult.success) {
      console.error('❌ Delete failed:', deleteResult.error)
      return NextResponse.json(
        { success: false, error: deleteResult.error },
        { status: 500 }
      )
    }

    console.log('✅ Asset deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully'
    })

  } catch (error) {
    console.error('💥 Delete API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const orderId = searchParams.get('orderId')
    const assetType = searchParams.get('assetType')

    console.log(`📋 Getting assets - User: ${userId}, Order: ${orderId}, Type: ${assetType}`)

    const assetsResult = await storageService.getAssets({
      userId: userId || undefined,
      orderId: orderId || undefined,
      assetType: assetType || undefined
    })

    if (!assetsResult.success) {
      console.error('❌ Get assets failed:', assetsResult.error)
      return NextResponse.json(
        { success: false, error: assetsResult.error },
        { status: 500 }
      )
    }

    console.log(`✅ Retrieved ${assetsResult.data?.length || 0} assets`)

    return NextResponse.json({
      success: true,
      data: assetsResult.data
    })

  } catch (error) {
    console.error('💥 Get assets API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Fetch failed' 
      },
      { status: 500 }
    )
  }
}