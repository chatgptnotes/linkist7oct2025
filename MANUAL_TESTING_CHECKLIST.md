# Manual Color Compatibility Testing Checklist

## Overview
This checklist provides a systematic approach to manually verify color compatibility fixes across different browsers, operating systems, and devices.

---

## Pre-Testing Setup

### Required Browsers
- [ ] Google Chrome (Latest version)
- [ ] Mozilla Firefox (Latest version)
- [ ] Safari (macOS/iOS only)
- [ ] Microsoft Edge (Latest version)
- [ ] Opera (Optional)

### Required Operating Systems
- [ ] macOS (12.0 or later)
- [ ] Windows 10/11
- [ ] Linux (Ubuntu/Debian recommended)
- [ ] iOS (14.0 or later)
- [ ] Android (10.0 or later)

### Test Environment
- [ ] Development server running: `http://localhost:3001`
- [ ] Test user accounts created
- [ ] Clear browser cache before testing
- [ ] Disable browser extensions that might affect colors

---

## Section 1: Landing Page (`/landing`)

### Desktop Testing

#### Chrome/Chromium
- [ ] Navigate to `/landing`
- [ ] Verify hero section text is visible and dark
- [ ] Check all headings are readable (not white on white)
- [ ] Verify all paragraphs have good contrast
- [ ] Check CTA buttons have proper colors
- [ ] Verify link colors are visible
- [ ] Scroll through entire page checking all sections
- [ ] **Screenshot**: Take full-page screenshot

#### Firefox
- [ ] Repeat all Chrome checks
- [ ] Compare colors to Chrome version
- [ ] **Screenshot**: Take full-page screenshot

#### Safari (macOS only)
- [ ] Repeat all Chrome checks
- [ ] Test with macOS dark mode enabled
- [ ] Test with macOS dark mode disabled
- [ ] **Screenshot**: Take screenshots in both modes

#### Edge
- [ ] Repeat all Chrome checks
- [ ] **Screenshot**: Take full-page screenshot

### Mobile Testing

#### Mobile Safari (iOS)
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] Verify text is readable on all screen sizes
- [ ] **Screenshot**: Take screenshots

#### Mobile Chrome (Android)
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] **Screenshot**: Take screenshots

---

## Section 2: Registration Page (`/register`)

### Form Element Testing

#### Input Fields
- [ ] **Text Input** - "Clinic Name / Contact Person"
  - [ ] Background is white/light
  - [ ] Text is dark and visible
  - [ ] Placeholder text is gray and readable
  - [ ] Cursor is visible when focused
  - [ ] Border is visible

- [ ] **Email Input** - "Email Address"
  - [ ] Same checks as text input
  - [ ] Verify autofill doesn't break colors

- [ ] **Password Input** - "Password"
  - [ ] Password dots/characters visible
  - [ ] Eye icon (show/hide) visible

- [ ] **Confirm Password Input**
  - [ ] Same checks as password input

#### Select Dropdown
- [ ] **Account Type Dropdown**
  - [ ] Dropdown background is white
  - [ ] Selected text is dark
  - [ ] Dropdown arrow/icon visible
  - [ ] Open dropdown and verify options are readable
  - [ ] Option hover state has visible background change

#### Labels and Text
- [ ] All form labels are dark gray and readable
- [ ] Helper text (blue info text) is visible
- [ ] Error messages (if any) are visible and red
- [ ] Success messages (if any) are visible and green

#### Buttons
- [ ] Submit button background color is correct
- [ ] Submit button text is white (if dark button) or dark (if light button)
- [ ] Hover state changes are visible
- [ ] Disabled state is visually distinct

### Browser-Specific Testing

#### Chrome
- [ ] Fill out form completely
- [ ] Trigger autofill (if available)
- [ ] Verify autofilled fields have dark text
- [ ] Submit form and check validation errors
- [ ] **Screenshot**: Filled form

#### Firefox
- [ ] Repeat Chrome checks
- [ ] Compare rendering to Chrome
- [ ] **Screenshot**: Filled form

#### Safari
- [ ] Repeat Chrome checks
- [ ] Test with system dark mode ON
- [ ] Test with system dark mode OFF
- [ ] **Screenshot**: Both modes

#### Edge
- [ ] Repeat Chrome checks
- [ ] **Screenshot**: Filled form

---

## Section 3: Login Page (`/login`)

### Form Elements
- [ ] Email input visible (white bg, dark text)
- [ ] Password input visible
- [ ] Remember me checkbox visible
- [ ] Login button properly colored
- [ ] "Forgot password" link visible
- [ ] "Sign up" link visible

### Test Scenarios
- [ ] Fill out login form
- [ ] Test autofill functionality
- [ ] Check error state colors
- [ ] Verify all text remains visible

### All Browsers
- [ ] Chrome: ✅/❌
- [ ] Firefox: ✅/❌
- [ ] Safari: ✅/❌
- [ ] Edge: ✅/❌

---

## Section 4: Product Selection (`/product-selection`)

### Product Cards
- [ ] **Card 1: Physical NFC Card**
  - [ ] Card background visible
  - [ ] Title text readable
  - [ ] Description text readable
  - [ ] Price visible
  - [ ] Feature list checkmarks visible
  - [ ] Button properly colored

- [ ] **Card 2: Digital + App**
  - [ ] Same checks as Card 1

- [ ] **Card 3: Digital Only**
  - [ ] Same checks as Card 1

### Interactive States
- [ ] Hover state: Card shadow/border visible
- [ ] Selected state: Red border visible
- [ ] Selected state: Button changes to red with checkmark
- [ ] Disabled state: Opacity reduced, "Not available" overlay visible

### All Browsers
- [ ] Chrome: ✅/❌
- [ ] Firefox: ✅/❌
- [ ] Safari: ✅/❌
- [ ] Edge: ✅/❌

---

## Section 5: Payment Page (`/payment`)

### Form Fields
- [ ] Cardholder name input visible
- [ ] Card number input visible
- [ ] Expiry date input visible
- [ ] CVV input visible
- [ ] Billing address inputs visible
- [ ] All labels readable

### Payment Elements
- [ ] Card brand icons visible
- [ ] Security badges visible
- [ ] Total amount clearly displayed
- [ ] Submit payment button properly colored

### All Browsers
- [ ] Chrome: ✅/❌
- [ ] Firefox: ✅/❌
- [ ] Safari: ✅/❌
- [ ] Edge: ✅/❌

---

## Section 6: NFC Checkout (`/nfc/checkout`)

### Shipping Information
- [ ] Full name input visible
- [ ] Address line 1 input visible
- [ ] Address line 2 input visible
- [ ] City input visible
- [ ] State/Province select visible
- [ ] ZIP/Postal code input visible
- [ ] Country select visible
- [ ] Phone number input visible

### Contact Information
- [ ] Email input visible
- [ ] Phone input visible

### Order Summary
- [ ] Product details visible
- [ ] Pricing information readable
- [ ] Total amount clearly displayed

### All Browsers
- [ ] Chrome: ✅/❌
- [ ] Firefox: ✅/❌
- [ ] Safari: ✅/❌
- [ ] Edge: ✅/❌

---

## Section 7: NFC Configure (`/nfc/configure`)

### Configuration Form
- [ ] Card design preview visible
- [ ] Name input visible
- [ ] Title input visible
- [ ] Company input visible
- [ ] Bio textarea visible (multiple lines)
- [ ] Social media URL inputs visible
- [ ] Profile image upload button visible

### Textarea Specific
- [ ] Textarea background white
- [ ] Text visible while typing
- [ ] Placeholder visible when empty
- [ ] Multiple lines of text all visible
- [ ] Scrollbar visible if content overflows

### All Browsers
- [ ] Chrome: ✅/❌
- [ ] Firefox: ✅/❌
- [ ] Safari: ✅/❌
- [ ] Edge: ✅/❌

---

## Section 8: Profile Builder (`/profiles/builder`)

### Profile Information
- [ ] Name input visible
- [ ] Headline input visible
- [ ] Bio textarea visible
- [ ] Location input visible
- [ ] Website input visible

### Social Links
- [ ] LinkedIn URL input visible
- [ ] Twitter URL input visible
- [ ] Instagram URL input visible
- [ ] All social icon inputs visible

### Media Upload
- [ ] Profile photo upload area visible
- [ ] Cover photo upload area visible
- [ ] Upload buttons properly colored

### All Browsers
- [ ] Chrome: ✅/❌
- [ ] Firefox: ✅/❌
- [ ] Safari: ✅/❌
- [ ] Edge: ✅/❌

---

## Section 9: Dark Mode Override Testing

### System Dark Mode Testing (macOS/Windows)

#### macOS
1. [ ] Enable System Dark Mode: System Preferences → General → Appearance → Dark
2. [ ] Open browser and navigate to `/register`
3. [ ] **Verify**: Page remains in light mode (white background)
4. [ ] **Verify**: All text remains dark and visible
5. [ ] **Verify**: Input fields have white backgrounds
6. [ ] Repeat for other pages: `/login`, `/payment`, `/product-selection`
7. [ ] **Screenshot**: Each page in dark mode OS

#### Windows
1. [ ] Enable Dark Mode: Settings → Personalization → Colors → Dark
2. [ ] Repeat all macOS checks
3. [ ] Test High Contrast mode if available
4. [ ] **Screenshot**: Each page

#### Test Result
- [ ] Light mode maintained despite OS dark mode: ✅/❌
- [ ] No color inversion occurred: ✅/❌
- [ ] All elements remain visible: ✅/❌

---

## Section 10: Autofill Testing

### Chrome Autofill
1. [ ] Navigate to `/register`
2. [ ] Fill out form and save
3. [ ] Clear form
4. [ ] Start typing to trigger autofill
5. [ ] Select autofill suggestion
6. [ ] **Verify**: Autofilled text is dark (not white)
7. [ ] **Verify**: Background remains white
8. [ ] **Screenshot**: Autofilled form

### Firefox Autofill
1. [ ] Repeat Chrome steps
2. [ ] **Screenshot**: Autofilled form

### Safari Autofill
1. [ ] Repeat Chrome steps
2. [ ] Test with iCloud Keychain autofill
3. [ ] **Screenshot**: Autofilled form

### Test Result
- [ ] Autofilled text is visible: ✅/❌
- [ ] No yellow background override: ✅/❌
- [ ] Text color is dark: ✅/❌

---

## Section 11: Mobile Device Testing

### iOS Safari
1. [ ] Navigate to each key page
2. [ ] Test in portrait and landscape
3. [ ] Verify form inputs are visible
4. [ ] Test keyboard appearance (doesn't obscure inputs)
5. [ ] Verify buttons are tappable and properly colored
6. [ ] **Screenshots**: Portrait and landscape

### Android Chrome
1. [ ] Repeat iOS checks
2. [ ] **Screenshots**: Portrait and landscape

### Mobile-Specific Issues
- [ ] Zoom functionality works properly
- [ ] Text remains readable when zoomed
- [ ] Inputs expand properly when focused
- [ ] Virtual keyboard doesn't hide text

---

## Section 12: Accessibility Testing

### Color Contrast
- [ ] Run WAVE browser extension
- [ ] Check contrast ratios meet WCAG AA (4.5:1 for normal text)
- [ ] Check contrast ratios meet WCAG AAA (7:1 for normal text)
- [ ] Verify no contrast errors

### Screen Reader Testing

#### VoiceOver (macOS/iOS)
- [ ] Enable VoiceOver
- [ ] Navigate through form fields
- [ ] Verify labels are announced
- [ ] Verify placeholders are announced
- [ ] Verify button text is announced

#### NVDA (Windows)
- [ ] Enable NVDA
- [ ] Navigate through form fields
- [ ] Verify all elements are announced correctly

#### JAWS (Windows)
- [ ] Enable JAWS
- [ ] Navigate through form fields
- [ ] Verify accessibility

---

## Section 13: Edge Cases

### Very Light/Dark Monitors
- [ ] Test on very bright monitor (max brightness)
- [ ] Test on dim monitor (low brightness)
- [ ] Verify text still visible in both cases

### Color Blindness Simulation
- [ ] Use color blindness simulator (e.g., Chromelens extension)
- [ ] Test Protanopia (red-blind)
- [ ] Test Deuteranopia (green-blind)
- [ ] Test Tritanopia (blue-blind)
- [ ] Verify all critical text/elements visible

### Zoom Levels
- [ ] Test at 50% zoom
- [ ] Test at 100% zoom (default)
- [ ] Test at 150% zoom
- [ ] Test at 200% zoom
- [ ] Verify text remains visible at all zoom levels

---

## Section 14: Performance Testing

### Page Load
- [ ] Measure time to first contentful paint
- [ ] Verify CSS is loaded before content render
- [ ] No flash of unstyled content (FOUC)
- [ ] No flash of white text before CSS loads

### CSS Loading
- [ ] Open DevTools → Network tab
- [ ] Refresh page
- [ ] Verify `globals.css` loads successfully
- [ ] Verify no CSS 404 errors
- [ ] Check CSS file size is reasonable

---

## Section 15: Final Verification

### Issue Summary
**Issues Found:**
1. Issue: ________________
   - Page: ________________
   - Browser: ______________
   - OS: ___________________
   - Severity: High/Medium/Low
   - Screenshot: ____________

2. Issue: ________________
   - Page: ________________
   - Browser: ______________
   - OS: ___________________
   - Severity: High/Medium/Low
   - Screenshot: ____________

### Overall Assessment
- [ ] All critical pages tested
- [ ] All browsers tested
- [ ] Mobile devices tested
- [ ] Dark mode override working
- [ ] Autofill working correctly
- [ ] Accessibility verified
- [ ] No white-on-white text issues found
- [ ] All form elements visible

### Sign-off
- **Tester Name**: ____________________
- **Date**: __________________________
- **Status**: ✅ APPROVED / ⚠️ ISSUES FOUND / ❌ NOT APPROVED
- **Notes**: _________________________

---

## Appendix: Common Issues to Watch For

### 🚨 Critical Issues
- White text on white background
- Black text on black background
- Invisible form inputs
- Unreadable labels
- Invisible buttons

### ⚠️ Medium Issues
- Low contrast text (fails WCAG AA)
- Placeholder text too light
- Disabled elements look enabled
- Hover states not visible

### ℹ️ Minor Issues
- Inconsistent colors across browsers
- Slight color variations
- Border colors too subtle

---

## Test Completion

**Total Tests**: ___ of 250+
**Passed**: ___
**Failed**: ___
**Not Applicable**: ___

**Completion Date**: __________________
**Overall Status**: ✅ / ⚠️ / ❌

---

*End of Checklist*
