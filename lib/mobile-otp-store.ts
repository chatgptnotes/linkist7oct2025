// Simple in-memory mobile OTP storage
// In production, this should be replaced with a database

export interface MobileOTPRecord {
  mobile: string;
  otp: string;
  expiresAt: number;
  verified: boolean;
}

// Global in-memory store
const mobileOtpStore = new Map<string, MobileOTPRecord>();

export const MobileOTPStore = {
  set: (mobile: string, record: MobileOTPRecord) => {
    mobileOtpStore.set(mobile, record);
  },
  
  get: (mobile: string): MobileOTPRecord | undefined => {
    return mobileOtpStore.get(mobile);
  },
  
  delete: (mobile: string): boolean => {
    return mobileOtpStore.delete(mobile);
  },
  
  clear: () => {
    mobileOtpStore.clear();
  },
  
  getAllForDev: (): Array<[string, MobileOTPRecord]> => {
    return Array.from(mobileOtpStore.entries());
  }
};

// Generate 6-digit OTP
export function generateMobileOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired OTPs (should be called periodically)
export function cleanExpiredMobileOTPs(): number {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [mobile, record] of mobileOtpStore.entries()) {
    if (now > record.expiresAt) {
      mobileOtpStore.delete(mobile);
      cleaned++;
    }
  }
  
  return cleaned;
}