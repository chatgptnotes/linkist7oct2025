// Suppress expected console errors in development
// This helps keep the console clean during development

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Store original console.error
  const originalError = console.error;

  // Override console.error to filter out expected errors
  console.error = (...args: any[]) => {
    // Suppress expected 401 errors from auth checks
    if (
      args[0]?.includes?.('401') ||
      args[0]?.includes?.('Unauthorized') ||
      args[0]?.includes?.('/api/auth/me')
    ) {
      return; // Silently ignore these errors
    }

    // Call original console.error for all other errors
    originalError.apply(console, args);
  };
}

export {};
