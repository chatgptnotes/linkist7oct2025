import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the time window
}

/**
 * Rate limiter for API routes
 * @param identifier - Unique identifier (IP address, email, etc.)
 * @param config - Rate limit configuration
 * @returns true if rate limit exceeded, false otherwise
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  // Initialize or reset if window expired
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }

  // Increment count
  store[key].count++;

  const remaining = Math.max(0, config.maxRequests - store[key].count);
  const limited = store[key].count > config.maxRequests;

  return {
    limited,
    remaining,
    resetTime: store[key].resetTime,
  };
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for proxy/load balancer scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Apply rate limiting to an API route
 * Returns NextResponse with 429 status if rate limit exceeded
 */
export function rateLimitMiddleware(
  request: NextRequest,
  config: RateLimitConfig,
  customIdentifier?: string
): NextResponse | null {
  const identifier = customIdentifier || getClientIdentifier(request);
  const { limited, remaining, resetTime } = checkRateLimit(identifier, config);

  if (limited) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetTime).toISOString(),
        },
      }
    );
  }

  return null; // No rate limit exceeded
}

/**
 * Preset rate limit configurations
 */
export const RateLimits = {
  // Auth endpoints (login, register)
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  // OTP/verification endpoints
  otp: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 3, // 3 OTP requests per minute
  },
  // General API endpoints
  api: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  // Strict rate limit for sensitive operations
  strict: {
    interval: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 attempts per hour
  },
};
