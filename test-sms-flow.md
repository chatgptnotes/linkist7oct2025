# SMS OTP Flow Test Guide

## ✅ Fix Applied
**Problem:** Database OTP and SMS OTP were different
**Solution:** Removed database storage when using Twilio Verify API

## How it works now:

### 1. **Twilio Mode** (Production - SMS enabled)
When Twilio credentials are configured:
- ✅ Twilio Verify API generates OTP
- ✅ Twilio sends SMS with OTP
- ✅ Verification done via Twilio API
- ❌ No database storage (Twilio manages everything)

**Flow:**
```
User enters mobile →
Twilio generates OTP →
SMS sent to phone →
User enters OTP from SMS →
Twilio verifies OTP →
Success!
```

### 2. **Database Mode** (Development - No Twilio)
When Twilio credentials NOT configured:
- ✅ Our code generates OTP
- ✅ OTP stored in database
- ✅ OTP shown in browser alert
- ✅ Verification done against database

**Flow:**
```
User enters mobile →
Generate random OTP →
Store in database →
Show in alert →
User enters OTP from alert →
Verify against database →
Success!
```

## Test Steps

### Test 1: SMS Mode (Current Setup)
```bash
# 1. Verify Twilio is configured
node -e "require('dotenv').config(); console.log('Twilio:', process.env.TWILIO_VERIFY_SERVICE_SID ? '✅ Configured' : '❌ Not configured')"

# 2. Go to verify-mobile page
http://localhost:3001/verify-mobile?phone=%2B918999355932

# 3. SMS will be sent to real phone
# 4. Enter OTP from SMS (NOT from database!)
# 5. Verification will work ✅
```

### Test 2: Database Mode (Fallback)
```bash
# 1. Temporarily disable Twilio
# Comment out TWILIO_VERIFY_SERVICE_SID in .env

# 2. Restart server
npm run dev

# 3. Go to verify-mobile page
# 4. OTP will show in browser alert
# 5. Check database - OTP will be stored
# 6. Enter OTP from alert
# 7. Verification will work ✅
```

## Current Status
- ✅ Twilio configured
- ✅ SMS will be sent
- ✅ Database storage removed for Twilio mode
- ✅ Same OTP in SMS and verification!

## Next Test
Clear database mobile_otps table and test fresh SMS flow.
