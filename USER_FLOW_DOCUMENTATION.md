# Linkist NFC User Flow Documentation

## Overview
This document describes the complete user journey from registration to order completion, including the comprehensive onboarding flow with mobile verification and PIN setup.

## Complete User Flow Sequence (New Users)

### 1. **Registration** (`/register`)
- User enters email, password, first name, last name
- Clicks "Create Account"
- System sends OTP to email
- **Next**: Redirects to `/verify-register`

### 2. **Email Verification** (`/verify-register`)
- User enters 6-digit OTP code
- Clicks "Verify & Create Account"
- Account is created upon successful verification
- **Next**: Redirects to `/account` (dashboard)

### 3. **Account Dashboard** (`/account`)
- First-time users see option to create first card
- Click "Get Started" or "Create Your First Card"
- **Next**: Redirects to `/welcome-to-linkist`

### 4. **Welcome Onboarding** (`/welcome-to-linkist`)
- User sees welcome message
- Enters profile information:
  - Country selection
  - Mobile number with country code
  - First and last name
- Accepts terms and conditions
- Clicks "Continue"
- **Next**: Redirects to `/verify-mobile`

### 5. **Mobile Verification** (`/verify-mobile`)
- System sends SMS OTP to provided mobile number
- User enters 6-digit OTP code
- Clicks "Verify Mobile Number"
- Mobile number is verified and saved
- **Next**: Redirects to `/account/set-pin`

### 6. **PIN Setup** (`/account/set-pin`)
- User creates 6-digit security PIN
- Confirms PIN by entering it again
- PIN is encrypted and saved for account security
- **Next**: Based on product selection:
  - If physical+digital → `/nfc/configure`
  - If digital-only → `/nfc/digital-profile`
  - If no selection → `/product-selection`

### 7. **Product Selection** (`/product-selection`)
- User chooses between:
  - Physical NFC Card + Digital Profile ($49.99)
  - Digital Profile Only ($24.99)
- Selects card material for physical cards:
  - Black
  - White
  - Gold
  - Steel (Brushed Steel)
- Clicks "Select This Card"
- **Next**: Redirects to `/nfc/configure`

### 8. **Card Configuration** (`/nfc/configure`)
- User customizes their card:
  - Uploads profile photo
  - Enters name and title
  - Adds company name
  - Adds contact information (email, phone)
  - Selects social media links
  - Chooses card design/theme
  - Selects card color
- Live preview shown on the right side
- Pricing displayed with founding member discount
- Clicks "Proceed to Checkout"
- **Next**: Redirects to `/nfc/checkout`

### 9. **Checkout** (`/nfc/checkout`)
- Order summary displayed
- Shipping information form (for physical cards)
- Price breakdown:
  - Product price
  - Shipping cost
  - Tax calculation
  - Total amount
- Apply promo code option
- Payment method selection
- Clicks "Proceed to Payment"
- **Next**: Redirects to payment processor

### 10. **Payment Processing**
- Handled by Stripe (International) or Razorpay (India)
- User enters payment details
- 3D Secure verification if required
- Processes payment
- **Next**: Returns to `/nfc/success`

### 11. **Order Confirmation** (`/nfc/success`)
- Shows success message with confetti animation
- Order number (LNK-XXXXXX format)
- Order details summary
- Estimated delivery time (7-10 business days)
- Digital card activation instructions
- Email confirmation sent
- **Next**: User can go to dashboard (`/account`) or homepage (`/`)

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

## Complete Flow Diagram

```
Registration Flow (New Users):
/register → /verify-register → /account → /welcome-to-linkist →
/verify-mobile → /account/set-pin → /product-selection →
/nfc/configure → /nfc/checkout → Payment → /nfc/success
```

## Key Navigation Files & Routes

| Page | Route | Purpose | Next Step |
|------|-------|---------|-----------|
| Register | `/register` | Create new account | `/verify-register` |
| Verify Register | `/verify-register` | Verify email OTP | `/account` |
| Account | `/account` | User dashboard | `/welcome-to-linkist` (first time) |
| Welcome | `/welcome-to-linkist` | Collect profile info | `/verify-mobile` |
| Verify Mobile | `/verify-mobile` | Verify phone OTP | `/account/set-pin` |
| Set PIN | `/account/set-pin` | Create security PIN | Based on selection |
| Product Selection | `/product-selection` | Choose card type | `/nfc/configure` |
| Configure Card | `/nfc/configure` | Customize card | `/nfc/checkout` |
| Checkout | `/nfc/checkout` | Review order | Payment gateway |
| Success | `/nfc/success` | Order confirmation | `/account` or `/` |
| Login | `/login` | Existing users | `/verify-login` |
| Verify Login | `/verify-login` | Verify OTP | `/account` |

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

✅ **Retained**: Complete secure onboarding flow with mobile verification and PIN setup
✅ **Verified**: All 11 steps of the user journey are properly connected
✅ **Confirmed**: Enhanced security with email OTP, mobile OTP, and PIN authentication
✅ **Documented**: Complete flow from registration to order confirmation

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