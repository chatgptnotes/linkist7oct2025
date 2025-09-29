/**
 * Utility functions for safe API response handling
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

/**
 * Safely parse API response with proper error handling for non-JSON responses
 */
export async function safeApiResponse<T = any>(response: Response): Promise<ApiResponse<T>> {
  try {
    // Check if response is ok
    if (!response.ok) {
      // Try to parse as JSON for error message
      try {
        const errorData = await response.json();
        return {
          ok: false,
          status: response.status,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
        };
      } catch {
        // If JSON parsing fails, return status text
        return {
          ok: false,
          status: response.status,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    }

    // Try to parse successful response as JSON
    try {
      const data = await response.json();
      return {
        ok: true,
        status: response.status,
        data
      };
    } catch (jsonError) {
      // If JSON parsing fails on successful response, it might be HTML or text
      const text = await response.text();
      
      // Check if it looks like an HTML error page
      if (text.includes('<html>') || text.includes('<!DOCTYPE')) {
        return {
          ok: false,
          status: response.status,
          error: 'Server returned an HTML page instead of JSON. This might be an internal server error.'
        };
      }
      
      // Return the text as error
      return {
        ok: false,
        status: response.status,
        error: text || 'Invalid response format'
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * Wrapper for fetch that returns a safe API response
 */
export async function safeFetch<T = any>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    return safeApiResponse<T>(response);
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}