// Shared OTP storage for email verification
// This is a singleton that both send and verify endpoints will use
// In production, replace with Redis or a database

interface OTPData {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// Use globalThis to persist across Next.js hot reloads in development
declare global {
  var __emailOTPStore: Map<string, OTPData> | undefined;
}

// Global shared Map - this will be shared across all API routes and persist across hot reloads
const globalOTPStore = globalThis.__emailOTPStore ?? new Map<string, OTPData>();
globalThis.__emailOTPStore = globalOTPStore;

export const emailOTPStore = {
  set: (email: string, data: OTPData) => {
    globalOTPStore.set(email.toLowerCase(), data);
    console.log(`🔐 OTP stored for ${email.toLowerCase()}: ${data.otp} (expires: ${new Date(data.expiresAt).toLocaleTimeString()})`);
  },

  get: (email: string): OTPData | undefined => {
    const data = globalOTPStore.get(email.toLowerCase());
    console.log(`🔍 OTP lookup for ${email.toLowerCase()}:`, data ? 'FOUND' : 'NOT FOUND');
    return data;
  },

  delete: (email: string): boolean => {
    const result = globalOTPStore.delete(email.toLowerCase());
    console.log(`🗑️  OTP deleted for ${email.toLowerCase()}: ${result}`);
    return result;
  },

  clear: () => {
    globalOTPStore.clear();
    console.log('🧹 All OTPs cleared');
  },

  // Clean up expired OTPs
  cleanExpired: (): number => {
    const now = Date.now();
    let cleaned = 0;

    for (const [email, data] of globalOTPStore.entries()) {
      if (data.expiresAt < now) {
        globalOTPStore.delete(email);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired OTP(s)`);
    }

    return cleaned;
  },

  // For debugging in development
  getAllForDev: (): Array<[string, OTPData]> => {
    return Array.from(globalOTPStore.entries());
  },

  size: (): number => {
    return globalOTPStore.size;
  }
};

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
