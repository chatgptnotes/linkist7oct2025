/**
 * WhatsApp/SMS Spam Detection and Prevention System
 *
 * Features:
 * - Per-phone-number rate limiting
 * - Bot detection based on request patterns
 * - IP-based abuse prevention
 * - Exponential backoff for repeated attempts
 * - Velocity and pattern analysis
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface SpamCheckResult {
  allowed: boolean;
  reason?: string;
  blockDuration?: number; // milliseconds
  riskScore: number;
  retryAfter?: number; // seconds
}

export interface PhoneSpamRecord {
  id?: string;
  phone_number: string;
  ip_address: string | null;
  user_agent: string | null;
  attempt_count: number;
  first_attempt_at: string;
  last_attempt_at: string;
  is_blocked: boolean;
  block_reason: string | null;
  blocked_until: string | null;
  attempts_last_hour: number;
  attempts_last_day: number;
  different_ips_count: number;
  velocity_score: number;
  pattern_score: number;
  total_risk_score: number;
}

// Risk score thresholds
const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 100,
};

// Rate limits per phone number
const PHONE_RATE_LIMITS = {
  MAX_PER_HOUR: 3,        // Max 3 OTP requests per hour per phone
  MAX_PER_DAY: 10,        // Max 10 OTP requests per day per phone
  MAX_DIFFERENT_IPS: 5,   // Max 5 different IPs per phone (suspicious if exceeded)
  MIN_INTERVAL_SECONDS: 60, // Minimum 60 seconds between requests
};

// IP-based limits
const IP_RATE_LIMITS = {
  MAX_PHONES_PER_HOUR: 5,  // Max 5 different phone numbers from same IP per hour
  MAX_PHONES_PER_DAY: 20,  // Max 20 different phone numbers from same IP per day
  MAX_ATTEMPTS_PER_HOUR: 10, // Max 10 attempts from same IP per hour
};

// Block durations (in milliseconds)
const BLOCK_DURATIONS = {
  SHORT: 15 * 60 * 1000,      // 15 minutes
  MEDIUM: 60 * 60 * 1000,     // 1 hour
  LONG: 24 * 60 * 60 * 1000,  // 24 hours
  PERMANENT: null,             // Permanent block
};

/**
 * Check if a phone number is permanently blocked
 */
async function isPhoneBlocked(phoneNumber: string): Promise<{ blocked: boolean; reason?: string }> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data } = await supabase
    .from('blocked_phone_numbers')
    .select('block_reason')
    .eq('phone_number', phoneNumber)
    .single();

  if (data) {
    return { blocked: true, reason: data.block_reason };
  }

  return { blocked: false };
}

/**
 * Check if an IP is blocked or suspicious
 */
async function checkSuspiciousIP(ipAddress: string): Promise<{ blocked: boolean; riskScore: number }> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data } = await supabase
    .from('suspicious_ips')
    .select('is_blocked, risk_score')
    .eq('ip_address', ipAddress)
    .single();

  if (data) {
    return { blocked: data.is_blocked, riskScore: data.risk_score || 0 };
  }

  return { blocked: false, riskScore: 0 };
}

/**
 * Update or create IP tracking record
 */
async function trackIPAttempt(ipAddress: string, phoneNumber: string): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: existing } = await supabase
    .from('suspicious_ips')
    .select('*')
    .eq('ip_address', ipAddress)
    .single();

  if (existing) {
    // Update existing record
    const phoneNumbers = existing.phone_numbers_attempted || [];
    if (!phoneNumbers.includes(phoneNumber)) {
      phoneNumbers.push(phoneNumber);
    }

    const totalAttempts = existing.total_attempts + 1;
    const uniquePhones = phoneNumbers.length;

    // Calculate risk score based on patterns
    let riskScore = 0;

    // High number of different phones from same IP
    if (uniquePhones > IP_RATE_LIMITS.MAX_PHONES_PER_DAY) {
      riskScore += 50;
    } else if (uniquePhones > IP_RATE_LIMITS.MAX_PHONES_PER_HOUR) {
      riskScore += 30;
    }

    // High total attempts
    if (totalAttempts > 50) {
      riskScore += 40;
    } else if (totalAttempts > 20) {
      riskScore += 20;
    }

    await supabase
      .from('suspicious_ips')
      .update({
        phone_numbers_attempted: phoneNumbers,
        total_attempts: totalAttempts,
        last_seen_at: new Date().toISOString(),
        risk_score: riskScore,
        is_blocked: riskScore >= RISK_THRESHOLDS.CRITICAL,
        updated_at: new Date().toISOString(),
      })
      .eq('ip_address', ipAddress);
  } else {
    // Create new record
    await supabase
      .from('suspicious_ips')
      .insert({
        ip_address: ipAddress,
        phone_numbers_attempted: [phoneNumber],
        total_attempts: 1,
        first_seen_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        is_blocked: false,
        risk_score: 0,
      });
  }
}

/**
 * Calculate velocity score (how fast are requests coming)
 */
function calculateVelocityScore(
  attemptCount: number,
  firstAttemptAt: Date,
  lastAttemptAt: Date,
  attemptsLastHour: number
): number {
  let score = 0;

  // Too many attempts in last hour
  if (attemptsLastHour > PHONE_RATE_LIMITS.MAX_PER_HOUR) {
    score += 40;
  }

  // Very rapid successive requests
  const timeSinceFirst = (lastAttemptAt.getTime() - firstAttemptAt.getTime()) / 1000; // seconds
  const avgInterval = timeSinceFirst / attemptCount;

  if (avgInterval < 10) { // Less than 10 seconds average
    score += 50;
  } else if (avgInterval < 30) { // Less than 30 seconds average
    score += 30;
  } else if (avgInterval < PHONE_RATE_LIMITS.MIN_INTERVAL_SECONDS) {
    score += 20;
  }

  return Math.min(score, 100);
}

/**
 * Calculate pattern score (detecting bot-like behavior)
 */
function calculatePatternScore(
  differentIpsCount: number,
  attemptsLastDay: number,
  userAgent: string | null
): number {
  let score = 0;

  // Too many different IPs for same phone number (credential stuffing/distributed attack)
  if (differentIpsCount > PHONE_RATE_LIMITS.MAX_DIFFERENT_IPS) {
    score += 40;
  }

  // Too many attempts in a day
  if (attemptsLastDay > PHONE_RATE_LIMITS.MAX_PER_DAY) {
    score += 30;
  }

  // Missing or suspicious user agent
  if (!userAgent || userAgent.includes('bot') || userAgent.includes('curl') || userAgent.includes('python')) {
    score += 20;
  }

  // Very short user agent (bots often have short UAs)
  if (userAgent && userAgent.length < 20) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Get or create phone spam tracking record
 */
async function getPhoneTrackingRecord(phoneNumber: string): Promise<PhoneSpamRecord | null> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data } = await supabase
    .from('phone_spam_tracking')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single();

  return data;
}

/**
 * Update phone spam tracking record
 */
async function updatePhoneTrackingRecord(
  phoneNumber: string,
  ipAddress: string,
  userAgent: string | null,
  existing: PhoneSpamRecord | null
): Promise<PhoneSpamRecord> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const now = new Date();

  if (existing) {
    // Calculate time-based counters
    const lastAttempt = new Date(existing.last_attempt_at);
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let attemptsLastHour = existing.attempts_last_hour;
    let attemptsLastDay = existing.attempts_last_day;

    // Reset hourly counter if more than an hour has passed
    if (lastAttempt < hourAgo) {
      attemptsLastHour = 1;
    } else {
      attemptsLastHour += 1;
    }

    // Reset daily counter if more than a day has passed
    if (lastAttempt < dayAgo) {
      attemptsLastDay = 1;
    } else {
      attemptsLastDay += 1;
    }

    // Track different IPs
    let differentIpsCount = existing.different_ips_count;
    if (existing.ip_address !== ipAddress) {
      differentIpsCount += 1;
    }

    // Calculate risk scores
    const velocityScore = calculateVelocityScore(
      existing.attempt_count + 1,
      new Date(existing.first_attempt_at),
      now,
      attemptsLastHour
    );

    const patternScore = calculatePatternScore(
      differentIpsCount,
      attemptsLastDay,
      userAgent
    );

    const totalRiskScore = (velocityScore * 0.6) + (patternScore * 0.4);

    // Determine if should be blocked and for how long
    let isBlocked = existing.is_blocked;
    let blockReason = existing.block_reason;
    let blockedUntil = existing.blocked_until;

    if (totalRiskScore >= RISK_THRESHOLDS.CRITICAL) {
      isBlocked = true;
      blockReason = 'Critical risk score - suspected bot activity';
      blockedUntil = new Date(now.getTime() + BLOCK_DURATIONS.LONG).toISOString();
    } else if (totalRiskScore >= RISK_THRESHOLDS.HIGH) {
      isBlocked = true;
      blockReason = 'High risk score - suspicious activity detected';
      blockedUntil = new Date(now.getTime() + BLOCK_DURATIONS.MEDIUM).toISOString();
    } else if (attemptsLastHour > PHONE_RATE_LIMITS.MAX_PER_HOUR) {
      isBlocked = true;
      blockReason = 'Too many requests in last hour';
      blockedUntil = new Date(now.getTime() + BLOCK_DURATIONS.SHORT).toISOString();
    } else if (attemptsLastDay > PHONE_RATE_LIMITS.MAX_PER_DAY) {
      isBlocked = true;
      blockReason = 'Daily limit exceeded';
      blockedUntil = new Date(now.getTime() + BLOCK_DURATIONS.MEDIUM).toISOString();
    }

    const updated = {
      phone_number: phoneNumber,
      ip_address: ipAddress,
      user_agent: userAgent,
      attempt_count: existing.attempt_count + 1,
      first_attempt_at: existing.first_attempt_at,
      last_attempt_at: now.toISOString(),
      is_blocked: isBlocked,
      block_reason: blockReason,
      blocked_until: blockedUntil,
      attempts_last_hour: attemptsLastHour,
      attempts_last_day: attemptsLastDay,
      different_ips_count: differentIpsCount,
      velocity_score: velocityScore,
      pattern_score: patternScore,
      total_risk_score: totalRiskScore,
    };

    await supabase
      .from('phone_spam_tracking')
      .update({ ...updated, updated_at: now.toISOString() })
      .eq('phone_number', phoneNumber);

    return updated;
  } else {
    // Create new tracking record
    const newRecord = {
      phone_number: phoneNumber,
      ip_address: ipAddress,
      user_agent: userAgent,
      attempt_count: 1,
      first_attempt_at: now.toISOString(),
      last_attempt_at: now.toISOString(),
      is_blocked: false,
      block_reason: null,
      blocked_until: null,
      attempts_last_hour: 1,
      attempts_last_day: 1,
      different_ips_count: 1,
      velocity_score: 0,
      pattern_score: 0,
      total_risk_score: 0,
    };

    await supabase.from('phone_spam_tracking').insert(newRecord);

    return newRecord;
  }
}

/**
 * Main spam check function - call this before sending OTP
 */
export async function checkSpamAndBots(
  phoneNumber: string,
  ipAddress: string,
  userAgent: string | null
): Promise<SpamCheckResult> {
  try {
    // 1. Check if phone number is permanently blocked
    const { blocked: phoneBlocked, reason: blockReason } = await isPhoneBlocked(phoneNumber);
    if (phoneBlocked) {
      return {
        allowed: false,
        reason: blockReason || 'This phone number has been blocked',
        riskScore: 100,
      };
    }

    // 2. Check if IP is blocked
    const { blocked: ipBlocked, riskScore: ipRiskScore } = await checkSuspiciousIP(ipAddress);
    if (ipBlocked) {
      return {
        allowed: false,
        reason: 'This IP address has been blocked due to suspicious activity',
        riskScore: 100,
      };
    }

    // 3. Get or create tracking record for this phone number
    const existing = await getPhoneTrackingRecord(phoneNumber);

    // 4. Check if there's an active temporary block
    if (existing?.is_blocked && existing.blocked_until) {
      const blockedUntil = new Date(existing.blocked_until);
      if (blockedUntil > new Date()) {
        const retryAfter = Math.ceil((blockedUntil.getTime() - Date.now()) / 1000);
        return {
          allowed: false,
          reason: existing.block_reason || 'Too many requests. Please try again later.',
          riskScore: existing.total_risk_score,
          retryAfter,
        };
      }
    }

    // 5. Check minimum interval between requests
    if (existing) {
      const lastAttempt = new Date(existing.last_attempt_at);
      const timeSinceLast = (Date.now() - lastAttempt.getTime()) / 1000; // seconds

      if (timeSinceLast < PHONE_RATE_LIMITS.MIN_INTERVAL_SECONDS) {
        const retryAfter = Math.ceil(PHONE_RATE_LIMITS.MIN_INTERVAL_SECONDS - timeSinceLast);
        return {
          allowed: false,
          reason: `Please wait ${retryAfter} seconds before requesting another code`,
          riskScore: existing.total_risk_score,
          retryAfter,
        };
      }
    }

    // 6. Update tracking record and calculate new risk scores
    const updated = await updatePhoneTrackingRecord(phoneNumber, ipAddress, userAgent, existing);

    // 7. Track IP attempt
    await trackIPAttempt(ipAddress, phoneNumber);

    // 8. Make decision based on updated risk scores
    if (updated.is_blocked) {
      const retryAfter = updated.blocked_until
        ? Math.ceil((new Date(updated.blocked_until).getTime() - Date.now()) / 1000)
        : undefined;

      return {
        allowed: false,
        reason: updated.block_reason || 'Request blocked due to suspicious activity',
        riskScore: updated.total_risk_score,
        retryAfter,
      };
    }

    // 9. Warn if risk score is elevated but still allowed
    if (updated.total_risk_score > RISK_THRESHOLDS.MEDIUM) {
      console.warn(`⚠️ Elevated risk score (${updated.total_risk_score}) for phone: ${phoneNumber}`);
    }

    return {
      allowed: true,
      riskScore: updated.total_risk_score,
    };
  } catch (error) {
    console.error('Error in spam check:', error);
    // On error, allow the request but log it
    // In production, you might want to block on errors for safety
    return {
      allowed: true,
      riskScore: 0,
      reason: 'Spam check failed - allowing request',
    };
  }
}

/**
 * Manually block a phone number (admin function)
 */
export async function blockPhoneNumber(
  phoneNumber: string,
  reason: string,
  blockedBy: string = 'system'
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  await supabase.from('blocked_phone_numbers').insert({
    phone_number: phoneNumber,
    block_reason: reason,
    blocked_by: blockedBy,
    blocked_at: new Date().toISOString(),
  });

  console.log(`🚫 Permanently blocked phone number: ${phoneNumber}`);
}

/**
 * Manually unblock a phone number (admin function)
 */
export async function unblockPhoneNumber(phoneNumber: string): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  await supabase
    .from('blocked_phone_numbers')
    .delete()
    .eq('phone_number', phoneNumber);

  await supabase
    .from('phone_spam_tracking')
    .update({
      is_blocked: false,
      block_reason: null,
      blocked_until: null,
    })
    .eq('phone_number', phoneNumber);

  console.log(`✅ Unblocked phone number: ${phoneNumber}`);
}

/**
 * Get spam statistics for a phone number (admin/debugging)
 */
export async function getPhoneSpamStats(phoneNumber: string): Promise<PhoneSpamRecord | null> {
  return getPhoneTrackingRecord(phoneNumber);
}

/**
 * Cleanup function - should be run periodically (e.g., via cron job)
 */
export async function cleanupOldSpamData(): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { error } = await supabase.rpc('cleanup_spam_tracking');
    if (error) {
      console.error('Error cleaning up spam data:', error);
    } else {
      console.log('✅ Spam tracking data cleaned up successfully');
    }
  } catch (error) {
    console.error('Error in cleanup:', error);
  }
}
