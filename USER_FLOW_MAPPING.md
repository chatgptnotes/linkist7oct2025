# Complete User Flow - Linkist NFC

## Based on Figma Designs

### 🎯 Main User Journey

```
Landing Page → Register → Mobile Verification → Welcome → Product Selection
    → Configure Card → Checkout → Payment → Success → Profile Builder → Dashboard
```

## Detailed Flow

### 1. **Landing & Authentication**
- `/landing` - Landing page
- `/register` - User registration
- `/verify-mobile` - Mobile OTP verification
- `/welcome-to-linkist` - Welcome page
- `/login` - Login page
- `/verify-login` - Login verification

### 2. **Product Selection & Card Configuration**
- `/product-selection` - Choose NFC card type
- `/nfc/configure` - Design your NFC card
  - Material selection (wood, metal, plastic)
  - Pattern & color customization
  - Name/text configuration
- `/nfc/checkout` - Enter shipping details
- `/nfc/payment` - Payment (Card/UPI/Voucher)
- `/nfc/success` - Order confirmation

### 3. **Profile Building (Post-Purchase)**

#### Main Dashboard Navigation (from Figma)
Based on the Figma design, there are 4 main tabs:
1. **Dashboard** - Overview
2. **Profile** - Profile management
3. **Analytics** - Stats and metrics
4. **Creatives** - Media and content

#### Profile Builder Pages (As per Figma Design)

**A. Bio & Background** → `/profiles/builder?step=basic`
- Profile completeness progress (0-100%)
- Basic information
  - Individual/Complete
  - Media/Social/Complete
  - Professional/Complete
  - Preferences/Complete
  - Invitation/Complete

- Plan & Background section
  - Profile card with user image
  - Links & Action Buttons
  - Background Design
  - Homepage section with toggle switches

**B. Media Gallery** → `/profiles/media`
- Profile Curation Progress (0-100%)
  - Onboarding/Complete
  - Media Upload/Complete
  - Professional/Complete
  - More Links/Complete
  - Preferences/Complete
  - Publication/Deploy

- Media Gallery section
  - Photos upload and management
  - Video upload with thumbnail
  - Add Photo/Add Video buttons

**C. Profile Settings** → `/profiles/builder?step=settings`
- Profile Completion Progress (0-100%)
  - Onboarding/Complete
  - Media Upload/Complete
  - Professional/Complete
  - More Links/Complete
  - Preferences/Complete
  - Publication/Deploy

- Profile Settings section
  - Layout & Branding
    - Brand color picker (6 colors)
    - Logo styles (Logo + Title, Text Only, Symbol)

  - Privacy & Visibility Controls
    - Content Preferences toggle
    - Direct Actions toggle
    - Personal Profile visibility
    - Social & Digital IDs toggle
    - Media Gallery toggle
    - Content Ranking toggle

**D. Profile Card View** → `/p/[id]`
Example shown: Sarah Johnson card with:
- Profile photo
- Name and title
- Contact buttons (WhatsApp, LinkedIn, etc.)
- About section
- Professional details
- Bio data
- Contact information

### 4. **Existing Pages**

#### Profile Management
- `/profiles/dashboard` - Main profile dashboard
- `/profiles/builder` - Comprehensive profile builder with steps:
  - Basic Info
  - Professional
  - Social Links
  - Media
  - Settings
  - Preview
- `/profiles/media` - Media gallery management
- `/profiles/templates` - Profile templates
- `/profiles/[id]/analytics` - Profile analytics

#### Account Management
- `/account` - User account overview

#### Admin Pages
- `/admin` - Admin dashboard
- `/admin/analytics` - Analytics
- `/admin/communications` - Communications
- `/admin/content` - Content management
- `/admin/customers` - Customer management
- `/admin/dashboard` - Admin dashboard
- `/admin/ecommerce` - E-commerce
- `/admin/orders` - Order management
- `/admin/products` - Product management
- `/admin/settings` - Settings
- `/admin/users` - User management

## 🔗 **Updated User Flow (After Success Page)**

```
Success Page (/nfc/success)
    ↓
"Start building Profile" button clicked
    ↓
Profile Builder (/profiles/builder)
    ↓
Complete profile in steps:
1. Bio & Background
2. Professional Details
3. Social Links
4. Media Gallery
5. Settings
6. Preview
    ↓
Save Profile
    ↓
Profile Dashboard (/profiles/dashboard)
```

## 📱 **Profile Builder Features (from Figma)**

### Progress Tracking
Each section shows completion status:
- ✓ Onboarding - Complete
- ✓ Media Upload - Complete
- ✓ Professional - Complete
- ○ More Links - Incomplete
- ○ Preferences - Incomplete
- ○ Publication - Deploy

### Key Features
1. **Profile Card** - Live preview of how the profile looks
2. **Media Management** - Photos and videos upload
3. **Brand Customization** - Colors, logo, layout
4. **Privacy Controls** - Toggle visibility of different sections
5. **Social Integration** - Connect all social media accounts
6. **Professional Info** - Work history, education, skills
7. **Analytics** - Track profile views, clicks, engagement

## 🎨 **Design System (from Figma)**

### Colors
- Primary: Black (#000000)
- Accent: Red (#FF0000) for buttons and highlights
- Success: Green for completed items
- Background: Light gray (#F5F5F5)
- Cards: White (#FFFFFF)

### Navigation
- Top navigation with tabs: Dashboard, Profile, Creatives, Analytics
- Progress bars showing completion percentage
- Toggle switches for enable/disable options
- "Add new" buttons for adding content

## 📝 **Action Items**

1. ✅ Create profile builder page
2. ⚠️ Update success page button to redirect to `/profiles/builder`
3. ⚠️ Ensure profile builder matches Figma design
4. ⚠️ Implement progress tracking system
5. ⚠️ Connect profile builder to media gallery
6. ⚠️ Implement profile settings with privacy controls
7. ⚠️ Create profile card view page

## 🔄 **Current Status**

### Completed
- ✅ Landing page
- ✅ Registration flow
- ✅ Product selection
- ✅ Card configuration
- ✅ Checkout process
- ✅ Payment integration (Stripe/UPI/Voucher)
- ✅ Success page
- ✅ Profile builder exists at `/profiles/builder`
- ✅ Profile dashboard exists at `/profiles/dashboard`

### Needs Update
- ⚠️ Success page button should redirect to `/profiles/builder` (currently redirects to `/profile-builder`)
- ⚠️ Profile builder UI should match Figma design exactly
- ⚠️ Media gallery page needs Figma design implementation
- ⚠️ Profile settings page needs Figma design implementation

## 🚀 **Next Steps**

1. Update success page redirect from `/profile-builder` to `/profiles/builder`
2. Review existing `/profiles/builder` and update to match Figma design
3. Update `/profiles/media` to match Media Gallery design from Figma
4. Implement Profile Settings page to match Figma design
5. Create profile card view page (`/p/[id]`) matching Sarah Johnson example
6. Implement progress tracking across all profile sections