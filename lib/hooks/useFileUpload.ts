// React hook for file uploads with Supabase Storage
import { useState, useCallback } from 'react'

export interface UploadOptions {
  folder?: string
  userId?: string
  orderId?: string
  isPublic?: boolean
  maxSize?: number // in bytes
  allowedTypes?: string[]
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadResult {
  success: boolean
  data?: {
    id: string
    path: string
    publicUrl?: string
    fileName: string
    fileSize: number
    mimeType: string
    width?: number
    height?: number
  }
  error?: string
}

export interface UseFileUploadReturn {
  upload: (file: File, options?: UploadOptions) => Promise<UploadResult>
  deleteAsset: (assetId: string) => Promise<{ success: boolean; error?: string }>
  getAssets: (filter: { userId?: string; orderId?: string; assetType?: string }) => Promise<any[]>
  isUploading: boolean
  progress: UploadProgress | null
  error: string | null
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Validate file before upload
  const validateFile = useCallback((file: File, options: UploadOptions = {}): string | null => {
    const maxSize = options.maxSize || 10 * 1024 * 1024 // 10MB default
    const allowedTypes = options.allowedTypes || [
      'image/jpeg',
      'image/jpg',
      'image/png', 
      'image/webp',
      'image/svg+xml',
      'application/pdf'
    ]

    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} not allowed`
    }

    if (!file.name || file.name.length > 255) {
      return 'Invalid file name'
    }

    return null
  }, [])

  // Upload file
  const upload = useCallback(async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
    setIsUploading(true)
    setError(null)
    setProgress({ loaded: 0, total: file.size, percentage: 0 })

    try {
      // Validate file
      const validationError = validateFile(file, options)
      if (validationError) {
        setError(validationError)
        return { success: false, error: validationError }
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      
      if (options.folder) formData.append('folder', options.folder)
      if (options.userId) formData.append('userId', options.userId)
      if (options.orderId) formData.append('orderId', options.orderId)
      if (options.isPublic) formData.append('isPublic', 'true')

      // Upload with progress tracking
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Upload failed')
        return { success: false, error: result.error || 'Upload failed' }
      }

      setProgress({ loaded: file.size, total: file.size, percentage: 100 })
      
      return { success: true, data: result.data }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }

    } finally {
      setIsUploading(false)
      setTimeout(() => {
        setProgress(null)
      }, 2000) // Clear progress after 2 seconds
    }
  }, [validateFile])

  // Delete asset
  const deleteAsset = useCallback(async (assetId: string) => {
    try {
      const response = await fetch(`/api/upload?assetId=${assetId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (!result.success) {
        setError(result.error || 'Delete failed')
      }

      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  // Get assets
  const getAssets = useCallback(async (filter: { 
    userId?: string
    orderId?: string
    assetType?: string 
  }) => {
    try {
      const params = new URLSearchParams()
      if (filter.userId) params.append('userId', filter.userId)
      if (filter.orderId) params.append('orderId', filter.orderId)
      if (filter.assetType) params.append('assetType', filter.assetType)

      const response = await fetch(`/api/upload?${params}`)
      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Failed to fetch assets')
        return []
      }

      return result.data || []

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets'
      setError(errorMessage)
      return []
    }
  }, [])

  return {
    upload,
    deleteAsset,
    getAssets,
    isUploading,
    progress,
    error
  }
}

// File upload utility functions
export const fileUtils = {
  // Format file size for display
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Get file type category
  getFileCategory: (mimeType: string): 'image' | 'document' | 'other' => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType === 'application/pdf') return 'document'
    return 'other'
  },

  // Generate thumbnail URL for images
  getThumbnailUrl: (publicUrl: string, width: number = 150, height: number = 150): string => {
    // If using Supabase image transformations (requires paid plan)
    // return `${publicUrl}?width=${width}&height=${height}&resize=cover`
    
    // For now, return original URL
    return publicUrl
  },

  // Check if file is an image
  isImage: (mimeType: string): boolean => {
    return mimeType.startsWith('image/')
  },

  // Validate image dimensions
  validateImageDimensions: async (
    file: File, 
    minWidth?: number, 
    minHeight?: number,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> => {
    return new Promise((resolve) => {
      const img = new Image()
      
      img.onload = () => {
        const dimensions = { width: img.width, height: img.height }
        
        if (minWidth && img.width < minWidth) {
          resolve({ valid: false, error: `Image width must be at least ${minWidth}px`, dimensions })
          return
        }
        
        if (minHeight && img.height < minHeight) {
          resolve({ valid: false, error: `Image height must be at least ${minHeight}px`, dimensions })
          return
        }
        
        if (maxWidth && img.width > maxWidth) {
          resolve({ valid: false, error: `Image width must not exceed ${maxWidth}px`, dimensions })
          return
        }
        
        if (maxHeight && img.height > maxHeight) {
          resolve({ valid: false, error: `Image height must not exceed ${maxHeight}px`, dimensions })
          return
        }
        
        resolve({ valid: true, dimensions })
      }
      
      img.onerror = () => {
        resolve({ valid: false, error: 'Invalid image file' })
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
}