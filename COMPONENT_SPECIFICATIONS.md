# Component Specifications - Linkist NFC Platform

**Based on Figma Design**: UX Pilot - Linkist NFC eCommerce
**Last Updated**: October 2, 2025
**Version**: 1.0

---

## Table of Contents

1. [Button Components](#1-button-components)
2. [Card Components](#2-card-components)
3. [Input Components](#3-input-components)
4. [Form Components](#4-form-components)
5. [Navigation Components](#5-navigation-components)
6. [Modal Components](#6-modal-components)
7. [Badge Components](#7-badge-components)
8. [NFC Card Components](#8-nfc-card-components)
9. [Landing Page Sections](#9-landing-page-sections)
10. [Animation Patterns](#10-animation-patterns)

---

## 1. Button Components

### 1.1 Primary Button (Red - From Figma)

**Visual Specs**:
- Background: `#ff0000` (Red 500)
- Text Color: `#ffffff` (White)
- Font Weight: `500` (Medium)
- Font Size: `16px` (1rem)
- Padding: `10px 24px` (0.625rem 1.5rem)
- Border Radius: `8px` (0.5rem)
- Height: `40px` minimum

**States**:
```css
/* Default */
background: #ff0000;
color: #ffffff;

/* Hover */
background: #dc2626;
transform: translateY(-1px);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* Focus */
ring: 2px solid #ff0000;
ring-offset: 2px;

/* Active/Pressed */
transform: translateY(0);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

**React/TSX Implementation**:
```tsx
<button className="
  bg-red-600
  text-white
  font-medium
  rounded-lg
  px-6 py-2.5
  transition-all
  duration-200
  hover:bg-red-700
  hover:-translate-y-0.5
  hover:shadow-md
  focus:outline-none
  focus:ring-2
  focus:ring-red-600
  focus:ring-offset-2
  disabled:opacity-50
  disabled:cursor-not-allowed
  active:translate-y-0
">
  Primary Button
</button>
```

**Using CSS Class**:
```tsx
<button className="btn-primary">
  Primary Button
</button>
```

### 1.2 Secondary Button

**Visual Specs**:
- Background: `#ffffff` (White)
- Border: `1px solid #e5e7eb` (Gray 200)
- Text Color: `#374151` (Gray 700)
- Font Weight: `500` (Medium)
- Font Size: `16px`
- Padding: `10px 24px`
- Border Radius: `8px`

**States**:
```css
/* Default */
background: #ffffff;
border: 1px solid #e5e7eb;
color: #374151;

/* Hover */
background: #f9fafb;
border-color: #d1d5db;

/* Focus */
ring: 2px solid #ff0000;
ring-offset: 2px;
```

**Implementation**:
```tsx
<button className="
  bg-white
  border border-gray-200
  text-gray-700
  font-medium
  rounded-lg
  px-6 py-2.5
  transition-all
  duration-200
  hover:bg-gray-50
  hover:border-gray-300
  focus:outline-none
  focus:ring-2
  focus:ring-red-600
  focus:ring-offset-2
">
  Secondary Button
</button>
```

### 1.3 Button Sizes

**Small Button** (32px height):
```tsx
<button className="btn-primary px-4 py-2 text-sm h-8">
  Small Button
</button>
```

**Medium Button** (40px height - Default):
```tsx
<button className="btn-primary px-6 py-2.5 text-base h-10">
  Medium Button
</button>
```

**Large Button** (48px height):
```tsx
<button className="btn-primary px-8 py-4 text-lg h-12">
  Large Button
</button>
```

### 1.4 Icon Buttons

**With Leading Icon**:
```tsx
import { ChevronRight } from 'lucide-react';

<button className="btn-primary inline-flex items-center gap-2">
  <ChevronRight className="h-5 w-5" />
  Continue
</button>
```

**With Trailing Icon**:
```tsx
<button className="btn-primary inline-flex items-center gap-2">
  Pre-Order Now
  <ChevronRight className="h-5 w-5" />
</button>
```

**Icon Only**:
```tsx
<button className="
  bg-red-600
  text-white
  rounded-lg
  p-2.5
  hover:bg-red-700
  focus:ring-2
  focus:ring-red-600
">
  <ChevronRight className="h-5 w-5" />
</button>
```

### 1.5 Gradient Button (Special CTA)

**Visual Specs**:
- Background: Gradient from Indigo to Purple
- Text: White
- Shadow: Large elevation
- Border Radius: `9999px` (Full/Pill)

**Implementation**:
```tsx
<button className="
  bg-gradient-to-r
  from-indigo-600
  to-purple-600
  text-white
  font-semibold
  rounded-full
  px-8 py-4
  text-lg
  shadow-lg
  hover:shadow-xl
  transform
  hover:scale-105
  transition-all
  duration-200
  inline-flex
  items-center
  gap-2
">
  Pre-Order Your Card
  <ChevronRight className="h-5 w-5" />
</button>
```

---

## 2. Card Components

### 2.1 Basic Card

**Visual Specs**:
- Background: `#ffffff` (White)
- Border: `1px solid #f3f4f6` (Gray 100)
- Border Radius: `12px` (0.75rem)
- Padding: `24px` (1.5rem)
- Shadow: Small elevation

**Implementation**:
```tsx
<div className="
  bg-white
  rounded-xl
  border border-gray-100
  shadow-sm
  p-6
  transition-shadow
  duration-200
  hover:shadow-md
">
  <h3 className="text-xl font-semibold text-gray-900">Card Title</h3>
  <p className="text-gray-600 mt-2">Card content goes here...</p>
</div>
```

**Using CSS Class**:
```tsx
<div className="card p-6">
  <h3 className="text-xl font-semibold">Card Title</h3>
  <p className="text-gray-600 mt-2">Card content</p>
</div>
```

### 2.2 Feature Card

**Visual Specs**:
- Background: White with gradient on hover
- Icon: Gradient background circle
- Border Radius: `16px`
- Padding: `32px`
- Shadow: Medium elevation

**Implementation**:
```tsx
import { Sparkles } from 'lucide-react';

<div className="
  bg-white
  rounded-2xl
  border border-gray-100
  shadow-md
  p-8
  transition-all
  duration-300
  hover:shadow-xl
  hover:scale-105
  group
">
  {/* Icon */}
  <div className="
    w-12 h-12
    rounded-full
    bg-gradient-to-r
    from-indigo-500
    to-purple-500
    flex
    items-center
    justify-center
    mb-4
  ">
    <Sparkles className="h-6 w-6 text-white" />
  </div>

  {/* Content */}
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    Feature Title
  </h3>
  <p className="text-gray-600">
    Feature description explaining the benefit...
  </p>
</div>
```

### 2.3 Pricing Card

**Visual Specs**:
- Border: `2px solid` (gradient for popular)
- Border Radius: `24px`
- Padding: `40px`
- Background: White
- Badge: "Popular" for recommended tier

**Implementation**:
```tsx
<div className="
  relative
  bg-white
  rounded-3xl
  border-2
  border-indigo-600
  shadow-xl
  p-10
">
  {/* Popular Badge */}
  <div className="
    absolute
    -top-4
    left-1/2
    -translate-x-1/2
    bg-gradient-to-r
    from-indigo-600
    to-purple-600
    text-white
    px-4 py-1
    rounded-full
    text-sm
    font-semibold
  ">
    Most Popular
  </div>

  {/* Tier Name */}
  <h3 className="text-2xl font-bold text-gray-900">
    Physical + Digital
  </h3>

  {/* Price */}
  <div className="mt-4">
    <span className="text-5xl font-bold text-gray-900">$49.99</span>
    <span className="text-gray-500 ml-2 line-through">$99</span>
  </div>

  {/* Description */}
  <p className="text-gray-600 mt-2">
    The complete professional package
  </p>

  {/* Features */}
  <ul className="mt-6 space-y-3">
    {features.map((feature) => (
      <li className="flex items-start gap-3">
        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
        <span className="text-gray-700">{feature}</span>
      </li>
    ))}
  </ul>

  {/* CTA */}
  <button className="btn-primary w-full mt-8">
    Pre-Order Now
  </button>
</div>
```

### 2.4 Dark Card

**For dark sections**:
```tsx
<div className="
  bg-gray-900
  rounded-xl
  border border-gray-800
  shadow-lg
  p-6
  text-white
">
  <h3 className="text-xl font-semibold">Dark Card Title</h3>
  <p className="text-gray-300 mt-2">Card content...</p>
</div>
```

---

## 3. Input Components

### 3.1 Text Input

**Visual Specs**:
- Background: `#ffffff` (White)
- Border: `1px solid #e5e7eb` (Gray 200)
- Border Radius: `8px`
- Padding: `12px 16px`
- Height: `40px`
- Font Size: `16px`

**States**:
```css
/* Default */
border: 1px solid #e5e7eb;

/* Focus */
ring: 2px solid #3b82f6;
border-color: transparent;

/* Error */
border: 1px solid #dc2626;
ring: 2px solid #dc2626;

/* Disabled */
background: #f9fafb;
cursor: not-allowed;
```

**Implementation**:
```tsx
<div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    placeholder="you@example.com"
    className="
      w-full
      px-4 py-3
      border border-gray-200
      rounded-lg
      bg-white
      text-gray-900
      placeholder-gray-400
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-transparent
      transition-colors
      duration-200
      disabled:bg-gray-50
      disabled:cursor-not-allowed
    "
  />
</div>
```

### 3.2 Input with Icon

**Leading Icon**:
```tsx
import { Mail } from 'lucide-react';

<div className="relative">
  <Mail className="
    absolute
    left-3
    top-1/2
    -translate-y-1/2
    h-5 w-5
    text-gray-400
  " />
  <input
    type="email"
    placeholder="Email"
    className="
      w-full
      pl-10 pr-4 py-3
      border border-gray-200
      rounded-lg
      focus:ring-2
      focus:ring-blue-500
    "
  />
</div>
```

### 3.3 Error State

```tsx
<div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    className="
      w-full
      px-4 py-3
      border-2 border-red-500
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-red-500
    "
  />
  <p className="mt-1 text-sm text-red-600">
    Please enter a valid email address
  </p>
</div>
```

### 3.4 Select/Dropdown

```tsx
<select className="
  w-full
  px-4 py-3
  border border-gray-200
  rounded-lg
  bg-white
  text-gray-900
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  appearance-none
  cursor-pointer
">
  <option>Select an option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### 3.5 Textarea

```tsx
<textarea
  rows={4}
  placeholder="Enter your message..."
  className="
    w-full
    px-4 py-3
    border border-gray-200
    rounded-lg
    bg-white
    text-gray-900
    placeholder-gray-400
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    resize-none
  "
/>
```

---

## 4. Form Components

### 4.1 Checkbox

```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5
      border-2 border-gray-300
      rounded
      text-red-600
      focus:ring-2
      focus:ring-red-500
      cursor-pointer
    "
  />
  <span className="text-sm text-gray-700">
    I agree to the terms and conditions
  </span>
</label>
```

### 4.2 Radio Button

```tsx
<div className="space-y-3">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="plan"
      value="digital"
      className="
        w-5 h-5
        border-2 border-gray-300
        text-red-600
        focus:ring-2
        focus:ring-red-500
        cursor-pointer
      "
    />
    <span className="text-sm text-gray-700">Digital Only</span>
  </label>

  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="plan"
      value="bundle"
      className="
        w-5 h-5
        border-2 border-gray-300
        text-red-600
        focus:ring-2
        focus:ring-red-500
        cursor-pointer
      "
    />
    <span className="text-sm text-gray-700">Physical + Digital</span>
  </label>
</div>
```

### 4.3 Toggle Switch

```tsx
<button
  onClick={() => setEnabled(!enabled)}
  className={`
    relative
    inline-flex
    h-6 w-11
    items-center
    rounded-full
    transition-colors
    ${enabled ? 'bg-red-600' : 'bg-gray-200'}
  `}
>
  <span className={`
    inline-block
    h-4 w-4
    transform
    rounded-full
    bg-white
    transition-transform
    ${enabled ? 'translate-x-6' : 'translate-x-1'}
  `} />
</button>
```

---

## 5. Navigation Components

### 5.1 Navbar

**Desktop Navbar**:
```tsx
<nav className="
  fixed
  top-0
  left-0
  right-0
  z-50
  bg-white/90
  backdrop-blur-md
  border-b border-gray-200
">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Linkist" className="h-8 w-8" />
        <span className="text-xl font-bold text-gray-900">Linkist</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-gray-600 hover:text-gray-900">
          Features
        </a>
        <a href="#pricing" className="text-gray-600 hover:text-gray-900">
          Pricing
        </a>
        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">
          How It Works
        </a>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900">
          Login
        </button>
        <button className="btn-primary">
          Pre-Order
        </button>
      </div>
    </div>
  </div>
</nav>
```

### 5.2 Mobile Menu

```tsx
<div className={`
  md:hidden
  fixed
  inset-0
  z-40
  bg-white
  transform
  transition-transform
  duration-300
  ${isOpen ? 'translate-x-0' : 'translate-x-full'}
`}>
  <div className="p-6">
    <button onClick={() => setIsOpen(false)} className="mb-8">
      <X className="h-6 w-6" />
    </button>

    <nav className="space-y-6">
      <a href="#features" className="block text-xl font-medium">
        Features
      </a>
      <a href="#pricing" className="block text-xl font-medium">
        Pricing
      </a>
      <a href="#how-it-works" className="block text-xl font-medium">
        How It Works
      </a>

      <button className="btn-primary w-full mt-8">
        Pre-Order
      </button>
    </nav>
  </div>
</div>
```

### 5.3 Breadcrumbs

```tsx
<nav className="flex items-center gap-2 text-sm">
  <a href="/" className="text-gray-600 hover:text-gray-900">
    Home
  </a>
  <ChevronRight className="h-4 w-4 text-gray-400" />
  <a href="/account" className="text-gray-600 hover:text-gray-900">
    Account
  </a>
  <ChevronRight className="h-4 w-4 text-gray-400" />
  <span className="text-gray-900 font-medium">
    Settings
  </span>
</nav>
```

---

## 6. Modal Components

### 6.1 Basic Modal

```tsx
import { X } from 'lucide-react';

<div className="
  fixed
  inset-0
  z-50
  flex
  items-center
  justify-center
  bg-black/50
  backdrop-blur-sm
">
  <div className="
    bg-white
    rounded-2xl
    shadow-2xl
    max-w-md
    w-full
    mx-4
    p-6
  ">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Modal Title
      </h2>
      <button
        onClick={onClose}
        className="
          text-gray-400
          hover:text-gray-600
          transition-colors
        "
      >
        <X className="h-6 w-6" />
      </button>
    </div>

    {/* Content */}
    <div className="text-gray-600 mb-6">
      <p>Modal content goes here...</p>
    </div>

    {/* Actions */}
    <div className="flex gap-3 justify-end">
      <button
        onClick={onClose}
        className="btn-secondary"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="btn-primary"
      >
        Confirm
      </button>
    </div>
  </div>
</div>
```

### 6.2 Animated Modal (with Framer Motion)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
      >
        {/* Modal content */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 7. Badge Components

### 7.1 Status Badge

```tsx
{/* Success */}
<span className="
  inline-flex
  items-center
  px-3 py-1
  rounded-full
  text-sm
  font-medium
  bg-green-100
  text-green-800
">
  Active
</span>

{/* Warning */}
<span className="
  inline-flex
  items-center
  px-3 py-1
  rounded-full
  text-sm
  font-medium
  bg-yellow-100
  text-yellow-800
">
  Pending
</span>

{/* Error */}
<span className="
  inline-flex
  items-center
  px-3 py-1
  rounded-full
  text-sm
  font-medium
  bg-red-100
  text-red-800
">
  Failed
</span>
```

### 7.2 Count Badge

```tsx
<span className="
  inline-flex
  items-center
  justify-center
  min-w-[20px]
  h-5
  px-1.5
  rounded-full
  text-xs
  font-semibold
  bg-red-600
  text-white
">
  3
</span>
```

### 7.3 Discount Badge

```tsx
<span className="
  inline-flex
  items-center
  gap-1
  px-3 py-1.5
  rounded-full
  text-sm
  font-semibold
  bg-gradient-to-r
  from-indigo-600
  to-purple-600
  text-white
">
  <Sparkles className="h-4 w-4" />
  50% OFF
</span>
```

---

## 8. NFC Card Components

### 8.1 Card Mockup (Hero)

```tsx
<div className="
  relative
  w-full
  max-w-md
  mx-auto
  aspect-[1.586/1]
">
  <div className="
    w-full
    h-full
    rounded-2xl
    bg-gradient-to-br
    from-gray-900
    via-indigo-900
    to-purple-900
    p-8
    shadow-2xl
    flex
    flex-col
    justify-between
    text-white
  ">
    {/* Top Section */}
    <div>
      <div className="text-2xl font-bold">Linkist</div>
      <div className="text-sm opacity-80 mt-1">Premium NFC Card</div>
    </div>

    {/* Bottom Section */}
    <div>
      {/* Chip */}
      <div className="
        h-12 w-12
        rounded
        bg-gradient-to-br
        from-yellow-400
        to-yellow-600
        opacity-90
        mb-4
      " />

      {/* Name */}
      <div className="text-lg font-semibold">Your Name</div>
      <div className="text-sm opacity-80">Tap to Connect</div>
    </div>

    {/* NFC Icon */}
    <div className="absolute bottom-4 right-4">
      <svg className="h-8 w-8 text-white/50" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    </div>
  </div>
</div>
```

### 8.2 Animated 3D Card (Premium)

**See**: `/Users/murali/Downloads/linkistnfc-main 5/components/PremiumCard.css`

Key features:
- 3D rotation animations
- Layered parallax effects
- Floating particles
- Hover interactions
- Auto-rotate loop

---

## 9. Landing Page Sections

### 9.1 Hero Section Structure

```tsx
<section className="
  relative
  overflow-hidden
  bg-gradient-to-b
  from-gray-50
  to-white
  pt-20 pb-16
  lg:pt-32 lg:pb-24
">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Announcement Badge */}
    <div className="text-center mb-8">
      <span className="
        inline-flex
        items-center
        gap-2
        px-4 py-2
        rounded-full
        bg-indigo-100
        text-indigo-800
        text-sm
        font-medium
      ">
        <Sparkles className="h-4 w-4" />
        Limited Time: 50% Founding Member Discount
      </span>
    </div>

    {/* Main Headline */}
    <h1 className="
      text-center
      text-4xl sm:text-5xl md:text-6xl lg:text-7xl
      font-bold
      tracking-tight
      text-gray-900
    ">
      Make your first
      <span className="
        block
        bg-gradient-to-r
        from-indigo-600
        to-purple-600
        bg-clip-text
        text-transparent
      ">
        impression count
      </span>
    </h1>

    {/* Subheadline */}
    <p className="
      max-w-2xl
      mx-auto
      mt-6
      text-center
      text-lg sm:text-xl
      text-gray-600
    ">
      Transform your networking with smart NFC business cards...
    </p>

    {/* CTAs */}
    <div className="
      flex
      flex-col sm:flex-row
      gap-4
      justify-center
      mt-10
    ">
      <button className="btn-primary">Pre-Order Your Card</button>
      <button className="btn-secondary">See How It Works</button>
    </div>
  </div>
</section>
```

### 9.2 Features Grid Layout

```tsx
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900">
        Everything you need
      </h2>
      <p className="text-xl text-gray-600 mt-4">
        Powerful features for modern professionals
      </p>
    </div>

    {/* Features Grid */}
    <div className="
      grid
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3
      gap-8
    ">
      {features.map((feature) => (
        <div key={feature.id} className="
          bg-white
          rounded-2xl
          border border-gray-100
          shadow-sm
          p-8
          hover:shadow-md
          transition-shadow
        ">
          {/* Icon */}
          <div className="
            w-12 h-12
            rounded-full
            bg-gradient-to-r
            from-indigo-500
            to-purple-500
            flex
            items-center
            justify-center
            mb-4
          ">
            <feature.icon className="h-6 w-6 text-white" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 9.3 Pricing Section Layout

**See**: `/Users/murali/Downloads/linkistnfc-main 5/components/landing/PricingSection.tsx`

Key elements:
- 3-column grid (responsive)
- Popular badge
- Price with strikethrough
- Feature comparison
- Check/X icons
- Trust badges
- Countdown timer

---

## 10. Animation Patterns

### 10.1 Fade In on Scroll

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

### 10.2 Stagger Children

```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      {/* Item */}
    </motion.div>
  ))}
</motion.div>
```

### 10.3 Hover Scale

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="btn-primary"
>
  Click Me
</motion.button>
```

### 10.4 3D Rotation

```tsx
<motion.div
  whileHover={{ rotateY: 15, rotateX: 10 }}
  transition={{ type: "spring", stiffness: 300 }}
  style={{ transformStyle: "preserve-3d" }}
>
  {/* Card content */}
</motion.div>
```

---

## Usage Guidelines

### When to Use Each Component

**Buttons**:
- Primary (Red) → Main CTAs, important actions
- Secondary → Alternative options, cancel actions
- Gradient → Hero CTAs, special promotions

**Cards**:
- Basic → Content containers, lists
- Feature → Showcasing features/benefits
- Pricing → Pricing tiers, product comparison

**Inputs**:
- Text → Email, name, search
- Select → Dropdown choices
- Textarea → Messages, descriptions
- Checkbox/Radio → Options, preferences

**Badges**:
- Status → Order status, user status
- Count → Notifications, items in cart
- Discount → Promotions, special offers

---

## Accessibility Requirements

### All Components Must Have:

1. **Keyboard Navigation**
   - Tab order follows visual flow
   - Focus states clearly visible
   - Enter/Space for activation

2. **ARIA Labels**
   - Descriptive labels for screen readers
   - Role attributes where needed
   - State announcements (expanded, selected, etc.)

3. **Color Contrast**
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text
   - Never rely on color alone

4. **Touch Targets**
   - Minimum 44x44px on mobile
   - Adequate spacing between clickable elements
   - Clear feedback on interaction

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
.component {
  /* Mobile (< 640px) - default */
  padding: 1rem;

  /* Tablet (>= 768px) */
  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  /* Desktop (>= 1024px) */
  @media (min-width: 1024px) {
    padding: 2rem;
  }

  /* Large Desktop (>= 1280px) */
  @media (min-width: 1280px) {
    padding: 3rem;
  }
}
```

---

**End of Component Specifications**

For more information:
- Design Tokens: `/design-tokens.js`
- Global Styles: `/app/globals.css`
- Figma Analysis: `/FIGMA_DESIGN_ANALYSIS.md`
