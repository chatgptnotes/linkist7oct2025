import { useState, useCallback } from 'react';
import { safeFetch, type ApiResponse } from '@/lib/api-utils';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (url: string, options?: RequestInit) => Promise<ApiResponse<T>>;
  reset: () => void;
}

/**
 * Custom hook for safe API calls with built-in state management
 */
export function useApi<T = any>(initialData: T | null = null): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await safeFetch<T>(url, options);
      
      if (response.ok && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'An error occurred',
        }));
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return {
        ok: false,
        status: 0,
        error: errorMessage,
      };
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for making POST requests with JSON data
 */
export function useApiPost<T = any, D = any>(initialData: T | null = null) {
  const api = useApi<T>(initialData);

  const post = useCallback(async (url: string, data?: D) => {
    return api.execute(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [api.execute]);

  return {
    ...api,
    post,
  };
}

/**
 * Hook for making GET requests
 */
export function useApiGet<T = any>(initialData: T | null = null) {
  const api = useApi<T>(initialData);

  const get = useCallback(async (url: string) => {
    return api.execute(url, { method: 'GET' });
  }, [api.execute]);

  return {
    ...api,
    get,
  };
}