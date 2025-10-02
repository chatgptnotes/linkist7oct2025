# Linkist NFC - Complete Setup Guide

## 📋 Overview
This guide contains all the information needed to complete the Linkist NFC platform setup, including required third-party credentials and configuration steps.

---

## ✅ Completed Features

### Authentication & Security
- ✅ **Email Verification System** - Fully functional OTP-based email verification
- ✅ **PIN Generation** - Secure 6-digit PIN creation with bcrypt encryption
- ✅ **PIN Checkout Integration** - PIN verification modal integrated into checkout flow
- ✅ **Database Storage** - PIN stored securely in Supabase users table

### UI/UX
- ✅ **Red Button Colors** - All buttons match Figma design (red theme)
- ✅ **Gold Color Fix** - Updated to #FFD700 (true gold, not brown)
- ✅ **Order Prefix** - All orders use "LNK-" prefix
- ✅ **Navigation** - Inner pages show only logo + logout button

### Database
- ✅ **Users Table** - Complete with email, password_hash, pin_hash, verification fields
- ✅ **Orders Table** - Complete order management system
- ✅ **Admin System** - Full admin dashboard with order management

---

## 🔒 Required Third-Party Credentials

### 1. Twilio (SMS Verification)
**Status:** ❌ NOT CONFIGURED - Requires client credentials

**What it's for:**
- Send SMS OTP codes for mobile verification
- Alternative to email verification

**Required Credentials:**
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

**Setup Steps:**
1. Go to [https://www.twilio.com/console](https://www.twilio.com/console)
2. Create account or login
3. Navigate to: Console → Account → Account Info
4. Copy **Account SID** and **Auth Token**
5. Go to: Phone Numbers → Manage → Active Numbers
6. Copy your Twilio phone number
7. Add credentials to `.env.local` file

**Implementation Location:**
- SMS API: `/app/api/send-sms-otp/route.ts`
- Verification: `/app/api/verify-mobile-otp/route.ts`
- UI: `/app/verify-mobile/page.tsx`

---

### 2. Stripe (Payment Processing)
**Status:** ❌ NOT CONFIGURED - Requires client credentials

**What it's for:**
- Process NFC card purchases
- Handle checkout and payments
- Webhook integration for order automation

**Required Credentials:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Setup Steps:**
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Create account or login
3. Navigate to: Developers → API keys
4. Copy **Publishable key** and **Secret key**
5. For webhook secret:
   - Go to: Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://yourdomain.com/api/stripe-webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy **Signing secret**
6. Add all credentials to `.env.local` file

**Implementation Location:**
- Config: `/lib/stripe.ts`
- Webhook: `/app/api/stripe-webhook/route.ts`
- Checkout: `/app/nfc/checkout/page.tsx`

---

### 3. Resend (Email Service)
**Status:** ⚠️ PARTIALLY CONFIGURED - API key invalid

**What it's for:**
- Send transactional emails (OTPs, order confirmations)
- Production email delivery

**Required Credential:**
```env
RESEND_API_KEY=re_xxxxx
```

**Setup Steps:**
1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Create account or login
3. Create new API key
4. Copy the key
5. Add to `.env.local` file

**Implementation Location:**
- Service: `/lib/email-service.ts`
- OTP API: `/app/api/send-email-otp/route.ts`
- Templates: `/lib/email-templates.ts`

---

### 4. Supabase (Database)
**Status:** ✅ CONFIGURED - Credentials in `.env.local`

**Migration Needed:**
The PIN fields migration needs to be applied to your Supabase database.

**Apply Migration:**
```bash
# Option 1: Via Supabase Dashboard
1. Login to https://app.supabase.com
2. Select your project
3. Go to: SQL Editor
4. Paste contents of: supabase/migrations/005_add_pin_fields.sql
5. Click "Run"

# Option 2: Via Supabase CLI
supabase db push
```

**Migration File:**
- Location: `/supabase/migrations/005_add_pin_fields.sql`
- Adds: `pin_hash` and `pin_set_at` columns to users table

---

## 🚧 Pending Implementation Tasks

### 1. Streetmap.org Integration
**Status:** ❌ NOT IMPLEMENTED

**What it's for:**
- Interactive map for address selection during checkout
- Better UX for shipping address entry

**Requirements:**
- Free Streetmap.org account
- Integrate OpenStreetMap API

**Implementation Steps:**
```typescript
// 1. Install leaflet (map library)
npm install leaflet react-leaflet @types/leaflet

// 2. Create map component
// File: /components/AddressMapPicker.tsx

// 3. Integrate into checkout
// File: /app/nfc/checkout/page.tsx
```

**Reference:**
- OpenStreetMap API: https://wiki.openstreetmap.org/wiki/API
- Leaflet Docs: https://leafletjs.com/

---

### 2. Mobile Responsiveness
**Status:** ⚠️ NEEDS IMPROVEMENT

**Issues Found:**
- Landing page needs responsive breakpoints
- Card preview not optimal on mobile
- Navigation menu needs mobile optimization

**Fix Approach:**
- Use design tokens from `/design-tokens.js`
- Add Tailwind responsive classes: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple screen sizes

**Priority Files:**
1. `/app/page.tsx` - Landing page
2. `/app/nfc/configure/page.tsx` - Card configuration
3. `/app/nfc/checkout/page.tsx` - Checkout page
4. `/components/Navbar.tsx` - Navigation

---

### 3. Digital Profile URL Verification
**Status:** ✅ IMPLEMENTED - Needs testing

**Implementation:**
- File: `/app/scan/[data]/page.tsx`
- Dynamic routing for unique profile URLs
- Format: `https://linkist.com/scan/[unique-id]`

**Test:**
1. Create an order
2. Check generated profile URL
3. Verify uniqueness in database

---

## 📝 Environment Variables Checklist

Create/update `.env.local` file with all required credentials:

```env
# Database (✅ Configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio (❌ Not configured)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Stripe (❌ Not configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (⚠️ Invalid key)
RESEND_API_KEY=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🧪 Testing Checklist

### User Flow Testing
- [ ] Register new user
- [ ] Verify email with OTP
- [ ] Set 6-digit PIN
- [ ] Configure NFC card
- [ ] Complete checkout with PIN verification
- [ ] Verify order created in admin
- [ ] Test email notifications

### Admin Testing
- [ ] Login to admin dashboard
- [ ] View all orders
- [ ] Update order status
- [ ] Resend confirmation emails
- [ ] Test action buttons

### Mobile Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify responsive layouts
- [ ] Test touch interactions

---

## 🚀 Deployment Steps

### 1. Pre-Deployment
```bash
# Apply all migrations
supabase db push

# Build production
npm run build

# Run tests
npm test
```

### 2. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Environment Variables in Vercel
1. Go to: Vercel Dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy after adding variables

### 4. Stripe Webhook
Update Stripe webhook endpoint URL to production:
- Change from: `http://localhost:3000/api/stripe-webhook`
- Change to: `https://yourdomain.com/api/stripe-webhook`

---

## 📞 Support & Questions

**Documentation:**
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- Twilio: https://www.twilio.com/docs
- Resend: https://resend.com/docs

**Key Files for Reference:**
- Design Tokens: `/design-tokens.js`
- Auth System: `/lib/auth-middleware.ts`
- Order System: `/lib/supabase-order-store.ts`
- Email Service: `/lib/email-service.ts`

---

## 🎯 Next Immediate Steps

1. **Get Credentials** (Blocked):
   - [ ] Twilio Account SID + Auth Token
   - [ ] Stripe API keys
   - [ ] Valid Resend API key

2. **Apply Migration**:
   - [ ] Run `/supabase/migrations/005_add_pin_fields.sql` in Supabase

3. **Test Features**:
   - [ ] Email verification flow
   - [ ] PIN creation and verification
   - [ ] Checkout with PIN
   - [ ] Admin dashboard

4. **Implement Remaining**:
   - [ ] Streetmap.org integration
   - [ ] Mobile responsiveness fixes
   - [ ] Production deployment

---

**Last Updated:** 2025-10-02
**System Status:** Development - Awaiting credentials for production deployment
