# Fast2SMS Integration Setup Guide

## Overview
Fast2SMS is integrated for sending mobile OTP verification codes to users in India.

## Configuration

### 1. Get Fast2SMS API Credentials

1. Sign up at [Fast2SMS](https://www.fast2sms.com)
2. Complete KYC verification
3. Get your API key from Dashboard → Dev API
4. Note your Sender ID (if using DLT route)
5. Register your DLT template if required

### 2. Update Environment Variables

Add these to your `.env.local` file:

```env
# Fast2SMS Configuration
FAST2SMS_API_KEY=your_actual_api_key_here
FAST2SMS_SENDER_ID=RAFHES        # Your registered sender ID
FAST2SMS_DLT_TEMPLATE_ID=177970  # Your DLT template ID
FAST2SMS_ROUTE=dlt                # Use 'dlt' or 'q' (quick)
```

### 3. Route Types

#### DLT Route (Recommended for Transactional)
- Requires DLT registration
- Uses template with variables
- Better delivery rate
- For transactional messages

#### Quick Route ('q')
- No DLT required
- For promotional messages
- Lower cost
- May have lower delivery rate

### 4. DLT Template Format

If using DLT route, your template should be like:
```
Your verification code is {#var#}. Valid for 5 minutes.
```

The `{#var#}` will be replaced with the actual OTP.

## API Integration Details

The integration is in `/app/api/send-mobile-otp/route.ts`:

- Automatically formats Indian mobile numbers
- Removes +91 prefix if present
- Supports both DLT and Quick routes
- Falls back to console logging if API key not configured
- Returns OTP in response for development mode

## Testing

### Without Real SMS (Development)
1. Keep `FAST2SMS_API_KEY` as `your_fast2sms_api_key_here`
2. OTP will be logged to console
3. OTP will be returned in API response

### With Real SMS
1. Add your actual Fast2SMS API key
2. Ensure you have SMS credits in your account
3. Test with a real Indian mobile number

## Troubleshooting

### Common Issues

1. **SMS not sending**: Check API key is correct
2. **Invalid sender ID**: Ensure sender ID is registered with DLT
3. **Template error**: Verify template ID matches your registered template
4. **Number format**: Ensure mobile number is 10 digits (without +91)

### API Response Codes

- `true` / `200`: Success
- `false`: Failed - check error message
- Common errors:
  - Invalid API key
  - Insufficient balance
  - Invalid mobile number
  - DLT template not found

## Cost

- Check current SMS rates at Fast2SMS dashboard
- DLT route: ~₹0.20 per SMS
- Quick route: ~₹0.18 per SMS
- Bulk discounts available

## Support

- Fast2SMS Support: support@fast2sms.com
- Documentation: https://docs.fast2sms.com