# WhatsApp/SMS Spam Prevention System

## Overview

This system prevents spam and bot abuse of your WhatsApp/SMS OTP functionality by:

1. **Per-Phone-Number Rate Limiting** - Limits OTP requests per phone number
2. **IP-Based Tracking** - Monitors suspicious IP addresses
3. **Bot Detection** - Identifies automated/bot-like behavior patterns
4. **Risk Scoring** - Assigns risk scores based on multiple factors
5. **Automatic Blocking** - Temporarily or permanently blocks suspicious activity
6. **Pattern Analysis** - Detects velocity, timing, and distribution patterns

---

## Features

### 🛡️ Multi-Layer Protection

- **Phone Number Limits**: Max 3 requests/hour, 10 requests/day per phone
- **Minimum Interval**: 60 seconds between consecutive requests from same phone
- **IP Tracking**: Monitors unique phone numbers requested from each IP
- **Velocity Analysis**: Detects rapid-fire requests
- **Pattern Matching**: Identifies bot-like behavior (suspicious user agents, timing patterns)
- **Exponential Backoff**: Progressively longer blocks for repeated violations

### 📊 Risk Scoring System

Risk scores range from 0-100:

- **0-29**: Low risk (allowed)
- **30-59**: Medium risk (allowed with warning)
- **60-79**: High risk (temporary block: 1 hour)
- **80-99**: Critical risk (temporary block: 24 hours)
- **100**: Permanent block

---

## Database Setup

Run the migration to create necessary tables:

```bash
# Apply the migration
psql -d your_database -f supabase/migrations/create-spam-tracking-table.sql
```

This creates three tables:

1. **phone_spam_tracking** - Tracks all phone number OTP requests
2. **blocked_phone_numbers** - Permanent blacklist
3. **suspicious_ips** - Monitors IP addresses

---

## How It Works

### Request Flow

```
1. User requests OTP for phone number
         ↓
2. Basic rate limiting (IP-based)
         ↓
3. Spam/Bot Detection Check
   - Is phone permanently blocked?
   - Is IP blocked?
   - Is there an active temporary block?
   - Check minimum interval between requests
   - Calculate risk scores
         ↓
4. If allowed: Send OTP
   If blocked: Return error with retry-after time
```

### Risk Score Calculation

**Velocity Score (60% weight)**:
- +50 points: Average interval < 10 seconds
- +30 points: Average interval < 30 seconds
- +20 points: Average interval < 60 seconds
- +40 points: More than 3 requests in last hour

**Pattern Score (40% weight)**:
- +40 points: Phone used from 5+ different IPs
- +30 points: More than 10 requests in a day
- +20 points: Suspicious user agent (bot, curl, python, etc.)
- +10 points: Very short user agent string

**Total Risk Score** = (Velocity × 0.6) + (Pattern × 0.4)

---

## Configuration

### Rate Limits (Customizable in `lib/spam-detection.ts`)

```typescript
const PHONE_RATE_LIMITS = {
  MAX_PER_HOUR: 3,           // Max OTP requests per hour per phone
  MAX_PER_DAY: 10,           // Max OTP requests per day per phone
  MAX_DIFFERENT_IPS: 5,      // Max different IPs per phone
  MIN_INTERVAL_SECONDS: 60,  // Minimum seconds between requests
};

const IP_RATE_LIMITS = {
  MAX_PHONES_PER_HOUR: 5,    // Max different phones from same IP/hour
  MAX_PHONES_PER_DAY: 20,    // Max different phones from same IP/day
  MAX_ATTEMPTS_PER_HOUR: 10, // Max total attempts from same IP/hour
};
```

### Block Durations

```typescript
const BLOCK_DURATIONS = {
  SHORT: 15 * 60 * 1000,      // 15 minutes
  MEDIUM: 60 * 60 * 1000,     // 1 hour
  LONG: 24 * 60 * 60 * 1000,  // 24 hours
  PERMANENT: null,             // Permanent block
};
```

---

## API Usage

### Admin Endpoints

#### View Spam Statistics

```bash
# Get overall statistics
GET /api/admin/spam-management?action=stats

# Get blocked numbers
GET /api/admin/spam-management?action=blocked

# Get suspicious IPs
GET /api/admin/spam-management?action=suspicious-ips

# Get details for specific phone
GET /api/admin/spam-management?action=phone-details&phone=+1234567890
```

**Response Example**:
```json
{
  "stats": {
    "totalPhonesTracked": 1523,
    "currentlyBlocked": 12,
    "permanentlyBlocked": 5,
    "highRiskCount": 23
  },
  "recentAttempts": [...],
  "topRiskPhones": [...]
}
```

#### Block a Phone Number

```bash
POST /api/admin/spam-management
Content-Type: application/json

{
  "action": "block-phone",
  "phone": "+1234567890",
  "reason": "Repeated abuse",
  "blockedBy": "admin@example.com"
}
```

#### Unblock a Phone Number

```bash
POST /api/admin/spam-management
Content-Type: application/json

{
  "action": "unblock-phone",
  "phone": "+1234567890"
}
```

#### Block an IP Address

```bash
POST /api/admin/spam-management
Content-Type: application/json

{
  "action": "block-ip",
  "ip": "192.168.1.100"
}
```

#### Cleanup Old Data

```bash
POST /api/admin/spam-management
Content-Type: application/json

{
  "action": "cleanup"
}
```

#### Reset Phone Tracking

```bash
DELETE /api/admin/spam-management?phone=+1234567890
```

---

## Monitoring

### Console Logs

The system logs important events:

```
✅ Phone number verified: +1234567890
⚠️ Elevated risk score (45) for phone: +1234567890 from IP: 1.2.3.4
🚫 Blocked OTP request - Phone: +1234567890, Reason: Too many requests
```

### Database Queries

Check high-risk phones:

```sql
SELECT phone_number, total_risk_score, attempt_count, is_blocked
FROM phone_spam_tracking
WHERE total_risk_score > 60
ORDER BY total_risk_score DESC;
```

Check recent attempts:

```sql
SELECT phone_number, ip_address, attempt_count, last_attempt_at
FROM phone_spam_tracking
WHERE last_attempt_at > NOW() - INTERVAL '1 hour'
ORDER BY last_attempt_at DESC;
```

Check blocked numbers:

```sql
SELECT phone_number, block_reason, blocked_at, blocked_by
FROM blocked_phone_numbers;
```

---

## Maintenance

### Automatic Cleanup

Run the cleanup function periodically (recommended: daily via cron):

```typescript
import { cleanupOldSpamData } from '@/lib/spam-detection';

// In a cron job or scheduled task
await cleanupOldSpamData();
```

This will:
- Delete tracking records older than 30 days (non-blocked)
- Reset hourly/daily counters
- Unblock expired temporary blocks
- Clean suspicious IPs older than 60 days

### Manual Database Cleanup

```sql
-- Call the cleanup function
SELECT cleanup_spam_tracking();
```

---

## Testing

### Test Normal Flow

```bash
# Request OTP (should work)
curl -X POST http://localhost:3000/api/send-mobile-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+1234567890"}'
```

### Test Rate Limiting

```bash
# Make 4 rapid requests (4th should be blocked)
for i in {1..4}; do
  curl -X POST http://localhost:3000/api/send-mobile-otp \
    -H "Content-Type: application/json" \
    -d '{"mobile": "+1234567890"}'
  sleep 1
done
```

### Test Bot Detection

```bash
# Request with bot-like user agent
curl -X POST http://localhost:3000/api/send-mobile-otp \
  -H "Content-Type: application/json" \
  -H "User-Agent: python-requests/2.28.0" \
  -d '{"mobile": "+1234567890"}'
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | OTP sent successfully |
| 400 | Invalid phone number or request |
| 429 | Rate limited or spam detected |
| 500 | Server error |

### Error Response Example

```json
{
  "success": false,
  "error": "Too many requests. Please wait 847 seconds before requesting another code",
  "retryAfter": 847,
  "riskScore": 75
}
```

---

## Best Practices

1. **Monitor Regularly**: Check spam statistics weekly
2. **Review High-Risk Phones**: Investigate phones with risk scores > 60
3. **Block Persistent Abusers**: Permanently block repeated offenders
4. **Cleanup Often**: Run cleanup function daily
5. **Adjust Thresholds**: Fine-tune limits based on your traffic patterns
6. **Log Analysis**: Review console logs for patterns

---

## Troubleshooting

### Legitimate Users Getting Blocked

If legitimate users are being blocked:

1. Check their risk score and reason:
   ```bash
   GET /api/admin/spam-management?action=phone-details&phone=+1234567890
   ```

2. Reset their tracking:
   ```bash
   DELETE /api/admin/spam-management?phone=+1234567890
   ```

3. Consider adjusting rate limits in `lib/spam-detection.ts`

### High False Positives

- Increase `MAX_PER_HOUR` and `MAX_PER_DAY` limits
- Reduce risk score thresholds
- Adjust pattern detection weights

### Not Catching Spam

- Decrease rate limits
- Increase risk score thresholds
- Add more pattern detection rules

---

## Security Considerations

1. **Admin Endpoints**: Protect `/api/admin/spam-management` with authentication
2. **Database Access**: Use service role only for spam tables
3. **Log Sensitive Data**: Avoid logging full phone numbers in production
4. **Rate Limit Admin APIs**: Prevent abuse of management endpoints
5. **Regular Audits**: Review blocked numbers monthly

---

## Future Enhancements

Potential improvements:

- Machine learning-based bot detection
- Geographic IP analysis
- Phone number validation via carrier lookup
- Real-time dashboard for monitoring
- Email alerts for high-risk activity
- Webhook notifications for blocks
- Whitelist for trusted phones/IPs

---

## Support

For issues or questions:
1. Check console logs for error details
2. Query database for tracking records
3. Review this guide's troubleshooting section
4. Adjust configuration as needed

---

**Last Updated**: October 3, 2025
