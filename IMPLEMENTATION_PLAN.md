# Linkist NFC - Implementation Plan

## Status: In Progress

### ✅ Completed Tasks

1. **Figma Design Integration**
   - ✅ Extracted design tokens from Figma API
   - ✅ Updated color scheme to red (#ff0000)
   - ✅ Fixed gold color (#ca8d00)
   - ✅ Updated all button colors to red
   - ✅ Added DM Sans font from Figma

2. **Button Color Updates**
   - ✅ Updated 21+ component files with red buttons
   - ✅ All primary buttons use red-600
   - ✅ All hover states use red-700
   - ✅ Focus rings updated to red-600

3. **Admin Order Prefix**
   - ✅ Changed from "ORD-" to "LNK-"
   - ✅ Updated in lib/order-store.ts
   - ✅ Order numbers now: LNK-XXXXXX

4. **Auto-Accept System**
   - ✅ Complete hook system
   - ✅ Configuration & logging
   - ✅ Slash commands
   - ✅ 100% test coverage (8/8 passing)

---

## 🚧 Remaining Tasks

### Priority 1: Critical Features

#### 1. Mobile Responsiveness
**Status**: Pending
**Complexity**: High
**Estimated Time**: 8-12 hours

**Requirements**:
- Make all pages responsive across breakpoints (320px, 768px, 1024px, 1440px)
- Test on mobile devices
- Ensure touch-friendly interactions
- Update navigation for mobile
- Fix layout issues on small screens

**Files to Update**:
- `app/globals.css` - Add mobile media queries
- `app/page.tsx` - Main landing page
- `app/checkout/page.tsx` - Checkout flow
- `app/cart/page.tsx` - Cart page
- `app/account/page.tsx` - Account dashboard
- All admin pages
- Navigation components

**Implementation Steps**:
1. Add Tailwind responsive classes (sm:, md:, lg:, xl:)
2. Test on Chrome DevTools mobile emulator
3. Fix overflow issues
4. Adjust font sizes for mobile
5. Make buttons touch-friendly (min 44px)

---

#### 2. Email Verification Page
**Status**: Pending
**Complexity**: Medium
**Estimated Time**: 4-6 hours

**Requirements**:
- Create alternative to phone verification
- Email OTP system
- Verification page UI matching Figma
- Email template for verification code

**Files to Create**:
- `app/verify-email/page.tsx` - Email verification page
- `app/api/send-email-otp/route.ts` - Send email OTP
- `app/api/verify-email-otp/route.ts` - Verify email OTP
- `lib/email-otp-store.ts` - Store email OTPs

**Implementation Steps**:
1. Create email verification page with OTP input
2. Implement email OTP generation (6-digit code)
3. Send OTP via email service
4. Verify OTP on submission
5. Store verification state in session/database

---

#### 3. PIN Generation Page
**Status**: Pending
**Complexity**: Medium
**Estimated Time**: 4-6 hours

**Requirements**:
- Page to generate/set PIN (as per Figma design)
- PIN encryption before storage
- Store encrypted PIN in database
- Use PIN for checkout authentication

**Files to Create**:
- `app/account/set-pin/page.tsx` - PIN generation page
- `lib/pin-service.ts` - PIN encryption/validation
- Update `app/checkout/page.tsx` - Add PIN auth

**Implementation Steps**:
1. Create PIN setup page (4-6 digit PIN)
2. Implement PIN encryption (bcrypt or similar)
3. Store encrypted PIN in database
4. Add PIN verification at checkout
5. Add "Forgot PIN" flow

---

### Priority 2: Navigation & UI

#### 4. Remove Unnecessary Links
**Status**: Pending
**Complexity**: Low
**Estimated Time**: 1-2 hours

**Requirements**:
- Remove About, Support, Order Now, Login links from ordering pages
- Remove footer links from inner pages
- Clean navigation for focused user experience

**Files to Update**:
- `app/checkout/page.tsx`
- `app/cart/page.tsx`
- `app/payment/page.tsx`
- `app/nfc/*/page.tsx`
- `components/Footer.tsx`

**Implementation Steps**:
1. Create conditional navigation component
2. Hide footer on inner pages
3. Remove header links on ordering flow
4. Test navigation flow

---

#### 5. Add Logout Button
**Status**: Pending
**Complexity**: Low
**Estimated Time**: 2-3 hours

**Requirements**:
- Add Logout button at top of inner pages
- Logout functionality
- Redirect to home after logout
- Clear session/cookies

**Files to Update**:
- Create `components/LogoutButton.tsx`
- Update inner page layouts
- `app/api/auth/logout/route.ts`

**Implementation Steps**:
1. Create Logout button component
2. Implement logout API endpoint
3. Clear session storage
4. Add to all inner pages
5. Test logout flow

---

### Priority 3: Admin Panel

#### 6. Complete Non-Functional Admin Pages
**Status**: Pending
**Complexity**: High
**Estimated Time**: 10-15 hours

**Requirements**:
- Identify non-functional admin pages
- Implement missing functionality
- Connect to database
- Add CRUD operations

**Files to Update**:
- `app/admin/products/page.tsx`
- `app/admin/ecommerce/page.tsx`
- `app/admin/content/page.tsx`
- `app/admin/communications/page.tsx`
- `app/admin/settings/page.tsx`

**Implementation Steps**:
1. Audit each admin page for missing features
2. Implement product management
3. Add e-commerce settings
4. Content management system
5. Communication tools
6. Settings panel

---

#### 7. Fix Broken Action Buttons
**Status**: Pending
**Complexity**: Medium
**Estimated Time**: 4-6 hours

**Requirements**:
- Identify broken buttons in admin
- Fix onclick handlers
- Connect to proper API endpoints
- Add loading states
- Error handling

**Files to Update**:
- All `app/admin/*/page.tsx` files
- API routes for admin actions

**Implementation Steps**:
1. Test all admin buttons
2. Identify broken/non-functional ones
3. Fix event handlers
4. Add proper API calls
5. Implement feedback (success/error messages)

---

### Priority 4: Digital Profiles

#### 8. Generate Unique URLs
**Status**: Pending
**Complexity**: Medium
**Estimated Time**: 4-6 hours

**Requirements**:
- Generate unique URLs for each digital profile
- URL format: linkist.io/username or linkist.io/id
- Store URL mappings in database
- Handle collisions/duplicates

**Files to Create**:
- `lib/url-generator.ts` - URL generation logic
- `app/api/profile-url/route.ts` - URL management
- Database table for URL mappings

**Implementation Steps**:
1. Create URL generation algorithm
2. Check for uniqueness
3. Store in database
4. Create short URL service
5. Handle custom URLs

---

#### 9. Complete Digital Profile Pages
**Status**: Pending
**Complexity**: High
**Estimated Time**: 8-12 hours

**Requirements**:
- Create digital profile page template
- Display user info from card config
- QR code generation
- Social links
- Contact info
- Matching Figma design

**Files to Create**:
- `app/profile/[username]/page.tsx` - Profile page
- `components/ProfileCard.tsx` - Profile component
- `lib/qr-generator.ts` - QR code service

**Implementation Steps**:
1. Create profile page route
2. Fetch user data by URL/username
3. Display card information
4. Generate QR code
5. Add social links
6. Style matching Figma
7. Make shareable

---

### Priority 5: Third-Party Integrations

#### 10. Twilio SMS Integration
**Status**: Pending - Awaiting Client Credentials
**Complexity**: Medium
**Estimated Time**: 3-4 hours

**Requirements**:
- Integrate Twilio for SMS verification
- Send OTP via SMS
- Phone number verification
- International support

**Files to Create**:
- `lib/twilio-service.ts` - Twilio integration
- Update `app/api/send-mobile-otp/route.ts`
- Environment variables for Twilio credentials

**Implementation Steps**:
1. Set up Twilio account (client to provide)
2. Install Twilio SDK
3. Create SMS service
4. Send OTP via SMS
5. Verify phone numbers
6. Handle international numbers

---

#### 11. Streetmap.org Integration
**Status**: Pending
**Complexity**: Medium
**Estimated Time**: 3-4 hours

**Requirements**:
- Integrate Streetmap.org for location display
- Show business location on digital profiles
- Address search/autocomplete
- Map display

**Files to Create**:
- `lib/map-service.ts` - Map integration
- `components/LocationMap.tsx` - Map component
- Update profile pages with location

**Implementation Steps**:
1. Set up Streetmap.org free account
2. Get API keys
3. Implement map component
4. Add to profile pages
5. Location search
6. Display business location

---

#### 12. Stripe Integration
**Status**: Pending - Awaiting Client Credentials
**Complexity**: Low (Already Partially Implemented)
**Estimated Time**: 1-2 hours

**Requirements**:
- Client to provide Stripe credentials
- Update environment variables
- Test payment flow
- Switch from test to live mode

**Files to Update**:
- `.env` - Add live Stripe keys
- Test checkout flow
- Verify webhooks

**Implementation Steps**:
1. Receive Stripe credentials from client
2. Update .env with live keys
3. Test payment flow
4. Configure webhooks
5. Verify email notifications

---

## 📋 Implementation Priority Order

### Phase 1: Critical (Do First) ✅ COMPLETED
1. ✅ Button colors & order prefix (DONE)
2. ✅ Remove unnecessary links (DONE - 1h)
3. ✅ Add Logout button (DONE - 1h)
4. ✅ PIN generation page (DONE - 4h)

### Phase 2: Essential (IN PROGRESS)
5. ✅ Email verification page (DONE - 5h)
6. 🚧 Mobile responsiveness (12h) - IN PROGRESS
7. ⏳ Fix broken admin buttons (6h)

### Phase 3: Core Features
8. Complete admin pages (15h)
9. Generate unique URLs (6h)
10. Digital profile pages (12h)

### Phase 4: Integrations (Awaiting Credentials)
11. Twilio SMS (4h)
12. Streetmap.org (4h)
13. Stripe live mode (2h)

---

## 🎯 Total Estimated Time

- **Completed**: ~31 hours (Phase 1 + Email Verification)
- **In Progress**: ~12 hours (Mobile responsiveness)
- **Remaining**: ~67 hours
- **Total Project**: ~110 hours
- **Progress**: 28% Complete

---

## 📝 Notes

### Blockers
- Stripe credentials needed from client
- Twilio account setup pending
- Figma design access for detailed specs

### Assumptions
- Using existing Supabase database
- Email service is configured (Gmail/Resend)
- Node.js v18+ environment

### Recommendations
1. Focus on Phase 1 & 2 first (critical user-facing features)
2. Phase 3 can be done iteratively
3. Phase 4 requires client credentials

---

## 🚀 Next Steps

1. **Immediate**: Remove unnecessary links (Quick win)
2. **Today**: Add logout button, start PIN page
3. **This Week**: Email verification, mobile responsiveness
4. **Next Week**: Admin panel completion
5. **Later**: Digital profiles & integrations

---

*Last Updated: 2025-10-01*
*Status: 28% Complete (5 of 13 tasks done)*

## 📊 Recent Completions (Today)

### ✅ Phase 1 Tasks (All Complete)
- **Remove Unnecessary Links**: Cleaned checkout, confirm-payment, and thank-you pages
- **Logout Button**: Created reusable component, verified existing functionality in admin/account
- **PIN Generation Page**: Full 6-digit PIN system with secure hashing and verification API

### ✅ Email Verification (Complete)
- **Verification Page** (`/verify-email`): Two-step OTP flow with auto-focus and keyboard navigation
- **Send OTP API**: 6-digit codes with 5-min expiration, rate limiting, email integration
- **Verify OTP API**: Attempt tracking (max 5), expiration checking, security features
- **Features**: Resend with countdown, auto-submit, development mode debugging

### 🔄 Current Work
- Mobile responsiveness improvements across all pages
- Admin button functionality fixes
- Digital profile system planning
