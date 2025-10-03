# ✅ Complete User Flow - Linkist NFC

## 🎯 **User Journey Mapping (Based on Figma)**

### Full Journey Overview
```
Landing → Register → Verify Mobile → Welcome → Product Selection
    ↓
Configure NFC Card → Checkout → Payment (Card/UPI/Voucher) → Success
    ↓
Profile Builder (6 Steps) → Save Profile → Profile Dashboard
    ↓
Profile Card Live (Shareable URL)
```

---

## 📍 **Phase 1: Onboarding & Purchase**

### Step 1-5: User Registration
1. **Landing Page** (`/landing`)
   - Product showcase
   - Get Started button

2. **Register** (`/register`)
   - Email & password
   - Basic details

3. **Mobile Verification** (`/verify-mobile`)
   - OTP verification
   - Phone number confirmation

4. **Welcome** (`/welcome-to-linkist`)
   - Onboarding introduction
   - Feature overview

5. **Product Selection** (`/product-selection`)
   - Choose NFC card type
   - Select quantity

---

### Step 6-10: Card Configuration & Payment

6. **Configure Card** (`/nfc/configure`)
   - Material: Wood / Metal / Plastic
   - Pattern selection
   - Color customization
   - Name engraving

7. **Checkout** (`/nfc/checkout`)
   - Shipping address
   - Contact information
   - Founder member option

8. **Payment** (`/nfc/payment`)
   - **Card Payment** (Stripe integration)
   - **UPI Payment** (QR code + direct link)
   - **Voucher Codes**:
     - FOUNDER50: 50% off
     - WELCOME20: 20% off
     - LINKIST10: 10% off
     - EARLY100: 100% off

9. **Success** (`/nfc/success`)
   - Order confirmation
   - Order number
   - Email notification sent
   - **"Start building Profile"** button → `/profiles/builder`

---

## 📍 **Phase 2: Profile Building** (Post-Purchase)

### Profile Builder Journey (`/profiles/builder`)

Based on Figma design, the profile builder has **6 steps**:

#### Step 1: **Basic Info** (Bio & Background)
**Figma Screen 1: "Bio & Background"**
- Profile photo upload
- First name, last name
- Job title, company
- Email, phone
- Location, website
- Bio/description

**Progress Tracking:**
- Individual/Complete ✓
- Media/Social/Complete
- Professional/Complete
- Preferences/Complete
- Invitation/Complete

#### Step 2: **Professional**
- Work experience
- Education
- Skills
- Certifications
- Awards

#### Step 3: **Social Links**
- LinkedIn
- Twitter / X
- Instagram
- Facebook
- YouTube
- GitHub
- Custom links

#### Step 4: **Media** (Media Gallery)
**Figma Screen 2: "Media Gallery"**
- Upload photos
- Upload videos (with thumbnails)
- Manage gallery
- Add/delete media

**Progress shown:**
- Onboarding/Complete ✓
- Media Upload/Complete ✓
- Professional/Complete ✓
- More Links/Complete
- Preferences/Complete
- Publication/Deploy

#### Step 5: **Settings** (Profile Settings)
**Figma Screen 3: "Profile Settings"**

**A. Layout & Branding:**
- Brand color selection (6 color options)
- Logo style:
  - Logo + Title
  - Text Only
  - Symbol

**B. Privacy & Visibility Controls:**
- Content Preferences (toggle)
- Direct Actions (toggle)
- Personal Profile visibility (toggle)
- Social & Digital IDs (toggle)
- Media Gallery visibility (toggle)
- Content Ranking (toggle)

#### Step 6: **Preview**
**Figma Screen 4: "Profile Card View"**
- See live profile card
- Example: Sarah Johnson profile
- Shows how profile appears when NFC card is tapped
- All contact buttons visible
- About section
- Professional details
- Social links

---

## 📍 **Phase 3: Profile Management**

### Profile Dashboard (`/profiles/dashboard`)
**Main Navigation Tabs (from Figma):**
1. **Dashboard** - Overview & stats
2. **Profile** - Edit profile
3. **Creatives** - Media management
4. **Analytics** - Performance metrics

**Dashboard Features:**
- View all profiles
- Analytics overview
  - Profile views
  - Button clicks
  - Shares
- Quick actions:
  - Edit profile
  - View profile
  - Share QR code
  - Analytics

### Profile Card View (`/p/[id]`)
**Public-facing profile** (Example: Sarah Johnson)
- Profile photo
- Name & title
- Contact buttons (WhatsApp, LinkedIn, etc.)
- About section
- Professional details
- Bio data
- Social links
- Contact information

---

## 🔄 **Complete Flow Map**

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING PAGE                         │
│                    /landing                             │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│              AUTHENTICATION FLOW                        │
│  /register → /verify-mobile → /welcome-to-linkist      │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│              PRODUCT & CARD FLOW                        │
│  /product-selection → /nfc/configure →                 │
│  /nfc/checkout → /nfc/payment → /nfc/success           │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│              PROFILE BUILDING FLOW                      │
│           /profiles/builder (6 Steps)                   │
│  1. Basic Info                                          │
│  2. Professional                                        │
│  3. Social Links                                        │
│  4. Media Gallery                                       │
│  5. Settings (Layout, Privacy)                          │
│  6. Preview                                             │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│           PROFILE DASHBOARD & MANAGEMENT                │
│               /profiles/dashboard                       │
│  - View profiles                                        │
│  - Analytics                                            │
│  - Media management                                     │
│  - Settings                                             │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│              PUBLIC PROFILE CARD                        │
│                   /p/[id]                               │
│  - Live profile view                                    │
│  - Accessible via NFC tap                               │
│  - Shareable URL                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 **Implementation Checklist**

### ✅ Completed
- [x] Landing page
- [x] Registration flow
- [x] Mobile verification
- [x] Welcome page
- [x] Product selection
- [x] Card configuration
- [x] Checkout process
- [x] Payment integration (Stripe/UPI/Voucher)
- [x] Success page with redirect
- [x] Profile builder structure exists
- [x] Profile dashboard exists

### ⚠️ Needs Figma Design Implementation
- [ ] Profile builder UI match with Figma designs
- [ ] Media gallery page match with Figma
- [ ] Profile settings page match with Figma
- [ ] Profile card view match with Figma (Sarah Johnson example)
- [ ] Progress tracking system
- [ ] Dashboard navigation tabs (Dashboard, Profile, Creatives, Analytics)

### 🎯 Priority Actions
1. **High Priority:**
   - Update profile builder to match Figma design exactly
   - Implement progress tracking in profile builder
   - Create profile card view page matching Sarah Johnson design

2. **Medium Priority:**
   - Update media gallery to match Figma
   - Implement profile settings with privacy toggles
   - Add brand color customization

3. **Low Priority:**
   - Analytics page
   - Advanced features
   - Admin tools

---

## 🎨 **Design System (From Figma)**

### Colors
- **Primary Black:** #000000 (buttons, headers)
- **Accent Red:** #FF0000 (action buttons, highlights)
- **Success Green:** For completed items
- **Background:** #F5F5F5 (light gray)
- **Cards:** #FFFFFF (white)
- **Text:** #333333 (dark gray)

### Typography
- Headers: Bold, large
- Body: Regular weight
- Labels: Medium weight, smaller size

### Components
- **Progress bars:** Show completion percentage
- **Toggle switches:** Enable/disable features
- **Color picker:** 6 color options
- **Action buttons:** Red background, white text
- **Card layouts:** White background, subtle shadow

---

## 📱 **Mobile Responsiveness**
All pages should be mobile-responsive with:
- Touch-friendly buttons
- Responsive layouts
- Mobile-optimized forms
- Touch gestures for image upload

---

## 🔗 **Related Files**
- User flow mapping: `/USER_FLOW_MAPPING.md`
- Profile builder: `/app/profiles/builder/page.tsx`
- Profile dashboard: `/app/profiles/dashboard/page.tsx`
- Success page: `/app/nfc/success/page.tsx`
- Media gallery: `/app/profiles/media/page.tsx`

---

**Last Updated:** October 2, 2025
**Status:** Flow mapped, success page updated, ready for Figma design implementation