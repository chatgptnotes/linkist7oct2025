# Linkist NFC User Flow Documentation

## Overview
This document describes the complete user journey from registration to order completion, matching the Figma design specifications.

## User Flow Sequence (New Users)

### 1. **Registration** (`/register`)
- User enters email, password, first name, last name
- Clicks "Create Account"
- System sends OTP to email
- **Next**: Redirects to `/verify-register`

### 2. **Email Verification** (`/verify-register`)
- User enters 6-digit OTP code
- Clicks "Verify & Create Account"
- Account is created upon successful verification
- **Next**: Redirects to `/welcome-to-linkist` ✅ (Fixed: was going to `/account`)

### 3. **Welcome Onboarding** (`/welcome-to-linkist`)
- User sees welcome message
- Enters profile information (country, mobile, name)
- Accepts terms and conditions
- Clicks "Continue"
- **Next**: Redirects to `/product-selection` ✅ (Fixed: was going to `/verify-mobile`)

### 4. **Product Selection** (`/product-selection`)
- User chooses between:
  - Physical NFC Card + Digital Profile
  - Digital Profile Only
- Selects card material (Black, White, Gold, Steel)
- Clicks "Select This Card"
- **Next**: Redirects to `/nfc/configure`

### 5. **Card Configuration** (`/nfc/configure`)
- User customizes their card:
  - Uploads profile photo
  - Enters name and title
  - Adds contact information
  - Selects social media links
  - Chooses card design/theme
- Live preview shown on the right
- Clicks "Proceed to Checkout"
- **Next**: Redirects to `/nfc/checkout`

### 6. **Checkout** (`/nfc/checkout`)
- Order summary displayed
- Shipping information (for physical cards)
- Price breakdown
- Apply promo code option
- Clicks "Proceed to Payment"
- **Next**: Redirects to payment processor

### 7. **Payment Processing**
- Handled by Stripe/Razorpay
- User enters payment details
- Processes payment
- **Next**: Returns to `/nfc/success`

### 8. **Order Confirmation** (`/nfc/success`)
- Shows success message
- Order number (LNK-XXXXXX format)
- Estimated delivery time
- Digital card activation info
- **Next**: User can go to dashboard or homepage

## Returning User Flow

### Login Flow (`/login`)
1. User enters email
2. Clicks "Send OTP"
3. Redirects to `/verify-login`
4. Enters OTP
5. Redirects to `/account` (dashboard)

### Dashboard Options (`/account`)
- View existing cards
- Create new card → `/product-selection`
- Edit profile
- View orders
- Manage digital profiles

## Alternative Paths

### Direct Product Purchase (From Landing Page)
1. Landing page (`/`)
2. Click "Get Started" or "Order Now"
3. If not logged in → `/login`
4. If logged in → `/product-selection`

### Admin Access
- Admin login: `/admin-login`
- Admin dashboard: `/admin/dashboard`

## Key Navigation Files & Routes

| Page | Route | Purpose | Next Step |
|------|-------|---------|-----------|
| Register | `/register` | Create new account | `/verify-register` |
| Verify Register | `/verify-register` | Verify email OTP | `/welcome-to-linkist` ✅ |
| Welcome | `/welcome-to-linkist` | Onboard new user | `/product-selection` ✅ |
| Product Selection | `/product-selection` | Choose card type | `/nfc/configure` |
| Configure Card | `/nfc/configure` | Customize card | `/nfc/checkout` |
| Checkout | `/nfc/checkout` | Review order | Payment gateway |
| Success | `/nfc/success` | Order confirmation | `/account` or `/` |
| Login | `/login` | Existing users | `/verify-login` |
| Verify Login | `/verify-login` | Verify OTP | `/account` |
| Account | `/account` | User dashboard | Various |

## Important Notes

### Session Management
- User session stored in cookies
- Authentication checked on protected routes
- Redirects to login if session expired

### Data Persistence
- Card configuration saved in localStorage during setup
- Cleared after successful order
- User profile saved to database

### Mobile Verification (Optional Flow)
- Currently bypassed for smoother onboarding
- Can be enabled: Welcome → `/verify-mobile` → `/account/set-pin`
- For enhanced security in production

### Payment Integration
- Stripe for international payments
- Razorpay for Indian payments
- Test mode enabled in development

## Recent Updates (October 2, 2025)

✅ **Fixed**: Registration flow now redirects to welcome page instead of account
✅ **Fixed**: Welcome page now leads to product selection instead of mobile verification
✅ **Verified**: All page routes exist and are properly connected
✅ **Confirmed**: Flow matches Figma design specifications

## Testing the Flow

### Development Mode
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000`
3. Click "Get Started" to begin flow
4. Use test email for registration
5. OTP shown in dev mode (yellow box)
6. Follow through complete flow

### Test Credentials
- Email: Any valid email format
- OTP: Shown in development mode
- Payment: Use Stripe test cards
  - Success: 4242 4242 4242 4242
  - Decline: 4000 0000 0000 0002

## Troubleshooting

### Common Issues
1. **OTP not received**: Check console for dev mode OTP
2. **Payment fails**: Ensure test mode is enabled
3. **Session expires**: Clear cookies and login again
4. **Page not found**: Check route exists in app/ directory

### Debug Mode
- Enable: Set `NODE_ENV=development`
- Shows OTP codes in UI
- Displays debug information
- Console logs for API calls

---

*Last Updated: October 2, 2025*
*Version: 1.0*