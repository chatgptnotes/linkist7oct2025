# Twilio SMS Verification Setup

This guide explains how to set up Twilio for mobile number verification in Linkist NFC.

## Why Twilio?

Twilio provides reliable SMS delivery worldwide with:
- Twilio Verify API for OTP management
- Automatic retry and delivery tracking
- Rate limiting and fraud prevention
- Support for 200+ countries

## Setup Instructions

### 1. Create Twilio Account

1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. You'll receive $15 in trial credit

### 2. Create a Verify Service

1. In Twilio Console, navigate to **Verify** → **Services**
2. Click **Create new Service**
3. Enter a friendly name: `Linkist NFC Verification`
4. Click **Create**
5. Copy the **Service SID** (starts with `VA...`)

### 3. Get Your Credentials

From the Twilio Console:
- **Account SID**: Found on the dashboard home page
- **Auth Token**: Click "View" next to Auth Token on dashboard
- **Verify Service SID**: From the Verify service you just created

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Test the Integration

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/verify-mobile` in your app

3. Enter your phone number with country code (e.g., `+1234567890`)

4. You should receive an SMS with a 6-digit verification code

## Phone Number Format

**IMPORTANT**: Phone numbers must include the country code:

- ✅ Correct: `+1234567890` (US)
- ✅ Correct: `+919876543210` (India)
- ✅ Correct: `+447911123456` (UK)
- ❌ Wrong: `234567890` (missing country code)

## Twilio Verify Features

### Automatic Features

The Twilio Verify API automatically handles:
- **Code Generation**: 6-digit codes by default
- **Expiration**: Codes expire after 10 minutes
- **Rate Limiting**: Prevents spam and abuse
- **Delivery Tracking**: Retry failed messages
- **Fraud Detection**: Blocks suspicious patterns

### Customization (Optional)

You can customize in Twilio Console under Verify → Services → Settings:

- Code length (4-10 digits)
- Code expiration time (60-900 seconds)
- Max verification attempts
- Templates for SMS messages

## Testing

### Trial Account Limitations

With a trial account:
- SMS only sent to verified numbers
- Verify your test numbers in: Console → Phone Numbers → Verified Caller IDs

### Production Account

To go live:
1. Upgrade your Twilio account
2. Purchase a phone number (if using SMS, not Verify)
3. Complete regulatory requirements for your country

## Fallback Mode

If Twilio credentials are not configured, the app will:
1. Generate OTP codes locally
2. Store them in Supabase database
3. Display the code in server console logs (development only)
4. Return `devOtp` in API response (development only)

This allows testing without Twilio credentials.

## API Endpoints

### Send OTP

**POST** `/api/send-mobile-otp`

Request:
```json
{
  "mobile": "+1234567890"
}
```

Response:
```json
{
  "success": true,
  "message": "Verification code sent to your mobile number",
  "status": "pending",
  "smsStatus": "sent"
}
```

### Verify OTP

**POST** `/api/verify-mobile-otp`

Request:
```json
{
  "mobile": "+1234567890",
  "otp": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Mobile number verified successfully",
  "verified": true
}
```

## Error Handling

Common Twilio errors:

| Error Code | Description | Solution |
|------------|-------------|----------|
| 60200 | Invalid phone number | Check format includes country code |
| 60203 | Max send attempts | Wait before requesting new code |
| 60212 | Too many requests | Rate limited, try again later |
| 60202 | Max check attempts | Request new verification code |

## Security Best Practices

1. **Never expose credentials**: Keep them in `.env.local`, not in code
2. **Use environment variables**: Different keys for dev/staging/production
3. **Enable rate limiting**: Prevent abuse (built into Twilio Verify)
4. **Verify on server**: Never verify OTPs on client side
5. **Short expiration**: Default 10 minutes is good
6. **HTTPS only**: Use secure connections in production

## Costs

### Twilio Verify Pricing (as of 2024)

- **Verification**: $0.05 per verification
- **Free trial**: $15 credit (~300 verifications)
- **No monthly fees** for Verify API

Note: Prices vary by country. Check [Twilio Pricing](https://www.twilio.com/verify/pricing) for details.

## Troubleshooting

### SMS not received

1. Check phone number format includes country code
2. Verify number is not blocked in Twilio console
3. Check Twilio logs: Console → Monitor → Logs → Verify
4. Ensure sufficient account balance

### "SMS service not configured" error

- Verify all three env variables are set correctly
- Restart Next.js server after updating `.env.local`
- Check for typos in Service SID (starts with `VA`)

### Verification fails

- Verify code hasn't expired (10 min default)
- Check for typos in entered code
- Ensure using same phone number for send and verify
- Check Twilio logs for detailed error messages

## Alternative: Database-only Mode

If you prefer not to use Twilio, the system works with database storage:

1. Don't set Twilio environment variables
2. OTPs will be generated and stored in Supabase
3. Codes will appear in server console logs
4. Verification works against database, not Twilio API

This is useful for:
- Development/testing
- Regions where Twilio doesn't operate
- Cost-sensitive applications

## Support

- [Twilio Documentation](https://www.twilio.com/docs/verify/api)
- [Twilio Support](https://support.twilio.com/)
- Linkist NFC: Check project documentation
