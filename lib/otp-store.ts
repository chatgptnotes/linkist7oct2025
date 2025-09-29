// Simple in-memory OTP storage
// In production, this should be replaced with a database

export interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: number;
  verified: boolean;
}

// Global in-memory store
const otpStore = new Map<string, OTPRecord>();

export const OTPStore = {
  set: (email: string, record: OTPRecord) => {
    otpStore.set(email, record);
  },
  
  get: (email: string): OTPRecord | undefined => {
    return otpStore.get(email);
  },
  
  delete: (email: string): boolean => {
    return otpStore.delete(email);
  },
  
  clear: () => {
    otpStore.clear();
  },
  
  getAllForDev: (): Array<[string, OTPRecord]> => {
    return Array.from(otpStore.entries());
  }
};

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired OTPs (should be called periodically)
export function cleanExpiredOTPs(): number {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
      cleaned++;
    }
  }
  
  return cleaned;
}