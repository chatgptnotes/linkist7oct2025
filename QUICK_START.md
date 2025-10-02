# 🚀 Quick Start Guide

## ✅ What's Working Right Now

### Test These Features (No Setup Required)
1. **Email Verification**: http://localhost:3000/verify-email
2. **PIN Creation**: http://localhost:3000/account/set-pin
3. **Card Configuration**: http://localhost:3000/nfc/configure
4. **Checkout Flow**: http://localhost:3000/nfc/checkout
5. **Admin Dashboard**: http://localhost:3000/admin

**Login to Admin:**
- Email: `cmd@hopehospital.com`
- Password: `Password@123`

---

## 🔒 What Needs Setup (Get Credentials)

### 1. Twilio (5 min)
```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1xxxxx
```
**Guide:** `TWILIO_INTEGRATION.md`

### 2. Stripe (10 min)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```
**Guide:** `SETUP_GUIDE.md` → Section 2

### 3. Resend (3 min)
```env
RESEND_API_KEY=re_xxxxx
```
**Sign up:** https://resend.com

---

## 🗄️ Database Setup

### Apply PIN Migration
1. Login: https://app.supabase.com
2. Go to: SQL Editor
3. Paste from: `supabase/migrations/005_add_pin_fields.sql`
4. Click: Run

**Or via CLI:**
```bash
supabase db push
```

---

## 🧪 Test PIN Flow

### 1. Create User & Set PIN
```
1. Go to: /account/set-pin
2. Enter: 123456
3. Confirm: 123456
4. ✅ PIN saved to database
```

### 2. Test Checkout
```
1. Go to: /nfc/configure
2. Enter name: John Doe
3. Select options
4. Click: Continue to Checkout
5. Fill form
6. Click: Pay
7. Enter PIN: 123456
8. ✅ Order created
```

---

## 📱 Mobile Test

```bash
# Get your local IP
http://192.168.1.3:3000

# Test on phone:
# - Email verification
# - PIN entry
# - Checkout form
# - Card preview
```

---

## 🐛 Common Issues

### "PIN API returns 401"
- Check user is logged in
- Verify session cookie exists
- Try: Logout → Login → Set PIN

### "Order creation fails"
- Check Supabase credentials in `.env.local`
- Verify `orders` table exists
- Check browser console for errors

### "Email OTP not received"
- In development, check console logs
- OTP is logged: `🔑 Development OTP: 123456`
- For production, need valid Resend API key

---

## 📊 Check Status

### Database
```sql
-- Check if PIN columns exist
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('pin_hash', 'pin_set_at');

-- Check user PINs
SELECT email, pin_hash IS NOT NULL as has_pin, pin_set_at
FROM users;

-- Check orders
SELECT order_number, status, customer_name, created_at
FROM orders
ORDER BY created_at DESC;
```

### Server Logs
```bash
# Check terminal for:
✅ PIN set successfully for user: email@example.com
✅ PIN verified successfully for user: email@example.com
✅ Order created successfully: {...}
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `SETUP_GUIDE.md` | Complete setup for all services |
| `TWILIO_INTEGRATION.md` | SMS setup guide |
| `TESTING_AND_DEBUG_SUMMARY.md` | Test procedures & status |
| `QUICK_START.md` | This file |

---

## ⚡ Production Deployment

### 1. Environment Variables
```bash
# Copy to Vercel
- All Supabase vars
- Twilio vars
- Stripe vars
- Resend API key
```

### 2. Deploy
```bash
vercel --prod
```

### 3. Update Stripe Webhook
```
Old: http://localhost:3000/api/stripe-webhook
New: https://yourdomain.com/api/stripe-webhook
```

---

## 🎯 Priority Next Steps

1. ☐ Apply database migration (5 min)
2. ☐ Get Twilio credentials (5 min)
3. ☐ Get Stripe credentials (10 min)
4. ☐ Get Resend API key (3 min)
5. ☐ Test PIN flow end-to-end
6. ☐ Fix mobile responsiveness
7. ☐ Deploy to staging

---

**Total Setup Time:** ~30 minutes
**Status:** ✅ Core features ready | 🔒 Waiting for credentials
