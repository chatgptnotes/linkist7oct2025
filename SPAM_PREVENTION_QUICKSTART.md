# WhatsApp/SMS Spam Prevention - Quick Start

## Setup (5 minutes)

### 1. Run Database Migration

Apply the migration to create spam tracking tables:

```bash
# If using Supabase locally
npx supabase db push

# OR if using hosted Supabase, apply via SQL Editor:
# Copy contents of supabase/migrations/create-spam-tracking-table.sql
# and run in your Supabase SQL Editor
```

### 2. Verify Installation

The spam prevention is now automatically integrated into your OTP system. No additional configuration needed!

---

## What's Protected

✅ **Automatically Protected**:
- `/api/send-mobile-otp` - Now includes spam/bot detection

The system will:
- Limit OTP requests to **3 per hour** per phone number
- Require **60 seconds** minimum between requests
- Block phones after **10 requests per day**
- Detect and block bot-like behavior
- Track suspicious IP addresses

---

## Quick Test

### Test Normal Usage (Should Work)

```bash
curl -X POST http://localhost:3000/api/send-mobile-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+1234567890"}'
```

Expected: `{"success": true, "message": "Verification code sent..."}`

### Test Rate Limiting (4th request should be blocked)

```bash
# Make 4 rapid requests
for i in {1..4}; do
  echo "Request $i"
  curl -X POST http://localhost:3000/api/send-mobile-otp \
    -H "Content-Type: application/json" \
    -d '{"mobile": "+1234567890"}'
  echo ""
  sleep 5
done
```

Expected: First 3 succeed, 4th returns error with `retryAfter` time.

### Test Bot Detection

```bash
# Request with suspicious user agent
curl -X POST http://localhost:3000/api/send-mobile-otp \
  -H "Content-Type: application/json" \
  -H "User-Agent: bot-crawler/1.0" \
  -d '{"mobile": "+1234567890"}'
```

Expected: Higher risk score, may be blocked if patterns match bot behavior.

---

## Monitor Activity

### View Spam Statistics

```bash
# Get overall stats
curl http://localhost:3000/api/admin/spam-management?action=stats

# View blocked numbers
curl http://localhost:3000/api/admin/spam-management?action=blocked

# View suspicious IPs
curl http://localhost:3000/api/admin/spam-management?action=suspicious-ips

# Check specific phone
curl "http://localhost:3000/api/admin/spam-management?action=phone-details&phone=%2B1234567890"
```

---

## Common Actions

### Block a Phone Number

```bash
curl -X POST http://localhost:3000/api/admin/spam-management \
  -H "Content-Type: application/json" \
  -d '{
    "action": "block-phone",
    "phone": "+1234567890",
    "reason": "Repeated abuse",
    "blockedBy": "admin"
  }'
```

### Unblock a Phone Number

```bash
curl -X POST http://localhost:3000/api/admin/spam-management \
  -H "Content-Type: application/json" \
  -d '{
    "action": "unblock-phone",
    "phone": "+1234567890"
  }'
```

### Reset Phone Tracking (Give them a fresh start)

```bash
curl -X DELETE "http://localhost:3000/api/admin/spam-management?phone=%2B1234567890"
```

---

## Check Console Logs

Watch for these messages in your console:

```
✅ Mobile number verified: +1234567890
⚠️ Elevated risk score (45) for phone: +1234567890 from IP: 192.168.1.1
🚫 Blocked OTP request - Phone: +1234567890, Reason: Too many requests, Risk Score: 85
```

---

## What Gets Blocked?

| Behavior | Risk Score | Action |
|----------|------------|--------|
| Normal request | 0-29 | ✅ Allowed |
| 2-3 requests/hour | 30-59 | ⚠️ Allowed (monitored) |
| 4+ requests/hour | 60-79 | 🚫 Blocked 1 hour |
| Rapid requests (<10s apart) | 80-99 | 🚫 Blocked 24 hours |
| Bot patterns + high velocity | 100 | 🛑 Permanent block |

---

## Adjust Settings (Optional)

Edit `/lib/spam-detection.ts` to customize limits:

```typescript
const PHONE_RATE_LIMITS = {
  MAX_PER_HOUR: 3,          // Change to 5 for more lenient
  MAX_PER_DAY: 10,          // Change to 20 for more lenient
  MIN_INTERVAL_SECONDS: 60, // Change to 30 for faster retries
};
```

---

## Database Cleanup (Recommended)

Run cleanup weekly to remove old tracking data:

```bash
curl -X POST http://localhost:3000/api/admin/spam-management \
  -H "Content-Type: application/json" \
  -d '{"action": "cleanup"}'
```

Or set up a cron job:

```bash
# Add to your cron (runs daily at 2 AM)
0 2 * * * curl -X POST http://localhost:3000/api/admin/spam-management \
  -H "Content-Type: application/json" \
  -d '{"action": "cleanup"}'
```

---

## Troubleshooting

### "Phone is blocked but shouldn't be"

```bash
# Check why it's blocked
curl "http://localhost:3000/api/admin/spam-management?action=phone-details&phone=%2B1234567890"

# Unblock it
curl -X POST http://localhost:3000/api/admin/spam-management \
  -H "Content-Type: application/json" \
  -d '{"action": "unblock-phone", "phone": "+1234567890"}'
```

### "Too many false positives"

Increase limits in `/lib/spam-detection.ts`:
- `MAX_PER_HOUR`: 3 → 5
- `MAX_PER_DAY`: 10 → 20
- `MIN_INTERVAL_SECONDS`: 60 → 30

### "Not catching spam"

Decrease limits in `/lib/spam-detection.ts`:
- `MAX_PER_HOUR`: 3 → 2
- `MAX_PER_DAY`: 10 → 5
- `MIN_INTERVAL_SECONDS`: 60 → 120

---

## Next Steps

1. ✅ **Migration applied** - Tables created
2. ✅ **System active** - Spam detection running
3. 📊 **Monitor** - Check stats regularly
4. 🔧 **Fine-tune** - Adjust limits based on your usage
5. 🧹 **Cleanup** - Schedule weekly cleanup

For detailed documentation, see `SPAM_PREVENTION_GUIDE.md`

---

**Status**: ✅ Ready to protect against spam!
