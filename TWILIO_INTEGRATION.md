# Twilio SMS Integration Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Twilio Account
1. Visit: https://www.twilio.com/try-twilio
2. Sign up with email
3. Verify your phone number
4. Select "SMS" as primary use case

### Step 2: Get Credentials
After signup, you'll land on the Console Dashboard:

```
Dashboard → Account Info Panel (right side)
```

Copy these 3 values:
- **Account SID**: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- **Auth Token**: Click "Show" then copy
- **Phone Number**: From "Trial Number" section

### Step 3: Add to Environment
Open `.env.local` and add:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Restart Server
```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

## ✅ Done!
SMS verification will now work in the app.

---

## 🧪 Testing SMS

### Test Endpoint
```bash
curl -X POST http://localhost:3000/api/send-sms-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'
```

### Expected Response
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "devOtp": "123456"
}
```

---

## ⚠️ Trial Account Limitations

**Free Tier Restrictions:**
- Only verified phone numbers can receive SMS
- All messages include "Sent from your Twilio trial account" prefix
- Limited to ~500 messages

**To Remove Restrictions:**
- Upgrade to paid account ($20+ credit)
- Verify your business details
- Remove trial messaging prefix

**Upgrade Link:**
https://www.twilio.com/console/billing/upgrade

---

## 📱 Verify Phone Numbers (Trial Mode)

While on trial, add test numbers:

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click "+" to add new verified number
3. Enter phone number with country code
4. Enter verification code received via SMS/call
5. Number is now whitelisted for testing

---

## 🔧 Implementation Details

### Files Modified
- `/app/api/send-sms-otp/route.ts` - Sends OTP via Twilio
- `/app/api/verify-mobile-otp/route.ts` - Verifies OTP
- `/app/verify-mobile/page.tsx` - Mobile verification UI

### Code Example
```typescript
// Send SMS OTP
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: `Your Linkist verification code is: ${otp}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phoneNumber
});
```

---

## 🐛 Troubleshooting

### Error: "Account SID must start with AC"
- Check you copied Account SID, not Auth Token
- Account SID format: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Error: "The From phone number ... is not a valid"
- Phone number must include country code: `+1234567890`
- Number must be from your Twilio account
- Check: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming

### Error: "Permission to send an SMS has not been enabled"
- Trial account can only send to verified numbers
- Either verify recipient number OR upgrade account

### SMS Not Received
1. Check phone number format includes country code
2. Verify number in Twilio Console (trial mode)
3. Check Twilio logs: https://console.twilio.com/us1/monitor/logs/sms
4. Ensure phone has signal/service

---

## 💰 Pricing

**Trial Account:**
- $15.50 free credit
- ~500 SMS messages
- Must verify recipients

**Pay-as-you-go:**
- $0.0079/SMS (USA)
- $0.0118/SMS (Canada)
- Varies by country

**Monthly Cost Estimate:**
- 1,000 SMS/month ≈ $8-10
- 10,000 SMS/month ≈ $80-100

**Pricing Calculator:**
https://www.twilio.com/sms/pricing

---

## 🌍 International SMS

**Supported Countries:** 180+

**Format Phone Numbers:**
```
USA:      +1234567890
UK:       +441234567890
India:    +911234567890
UAE:      +971123456789
```

**Country Pricing:**
https://www.twilio.com/sms/pricing/us

---

## 🔐 Security Best Practices

1. **Never commit credentials to git**
   ```bash
   # Already in .gitignore
   .env.local
   .env
   ```

2. **Rotate Auth Token regularly**
   - Console → Settings → Auth Tokens → Create new token

3. **Set up IP whitelisting** (Production)
   - Console → Settings → Security → IP Access Lists

4. **Monitor usage**
   - Console → Monitor → Usage
   - Set up alerts for unusual activity

---

## 📞 Twilio Support

**Documentation:**
https://www.twilio.com/docs/sms

**Quick Start Guide:**
https://www.twilio.com/docs/sms/quickstart

**Support:**
- Email: help@twilio.com
- Community: https://www.twilio.com/community

---

## ✨ Bonus Features

### SMS Templates
Create reusable templates:
```typescript
const templates = {
  otp: (code) => `Your Linkist code: ${code}. Valid for 10 minutes.`,
  welcome: (name) => `Welcome ${name}! Your NFC card is being prepared.`,
  shipped: (tracking) => `Your order has shipped! Track: ${tracking}`
};
```

### Rate Limiting
Already implemented in the code:
- Max 3 SMS per phone number per hour
- Prevents spam/abuse

### Analytics
Track SMS delivery in Twilio Console:
- Delivery rate
- Error codes
- Cost analysis

---

**Status:** Ready to implement once credentials are provided
**Time to Setup:** ~5 minutes
**Cost:** Free trial → $8-10/month for production
