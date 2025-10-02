# Design Quick Reference - Linkist NFC Platform

**Quick access to commonly used design values and code snippets**

---

## Color Palette (Quick Copy)

### Primary Colors (Red Theme)
```css
Primary Red:       #ff0000  /* Main brand color */
Hover Red:         #dc2626  /* Button hover */
Coral Red:         #ce394d  /* Alternative accent */
```

### Secondary Colors (Dark Navy/Blue)
```css
Dark Navy:         #1f2937  /* Backgrounds */
Deep Blue:         #2f416b  /* Card backgrounds */
Midnight:          #263252  /* Dark sections */
```

### Neutral Colors
```css
White:             #ffffff
Black:             #000000
Gray 50:           #f9fafb  /* Lightest gray */
Gray 100:          #f3f4f6
Gray 200:          #e5e7eb  /* Borders */
Gray 300:          #d1d5db
Gray 400:          #9ca3af
Gray 500:          #6b7280  /* Muted text */
Gray 600:          #4b5563
Gray 700:          #374151  /* Body text */
Gray 800:          #1f2937
Gray 900:          #111827  /* Headings */
```

### Status Colors
```css
Success Green:     #16a34a
Warning Gold:      #ca8d00
Error Red:         #dc2626
Info Blue:         #3b82f6
```

### Social Media Colors
```css
LinkedIn:          #0a66c2
Facebook:          #1877f2
WhatsApp:          #25d366
Twitter:           #0075ff
```

---

## Typography (Quick Copy)

### Font Families
```css
Primary:   'Inter', sans-serif
Body:      'DM Sans', 'Inter', sans-serif
Mono:      'JetBrains Mono', monospace
```

### Font Sizes
```css
xs:    12px   (0.75rem)
sm:    14px   (0.875rem)
base:  16px   (1rem)
lg:    18px   (1.125rem)
xl:    20px   (1.25rem)
2xl:   24px   (1.5rem)
3xl:   30px   (1.875rem)
4xl:   36px   (2.25rem)
5xl:   48px   (3rem)
6xl:   60px   (3.75rem)
7xl:   72px   (4.5rem)
```

### Font Weights
```css
Light:      300
Normal:     400
Medium:     500
Semibold:   600
Bold:       700
Extrabold:  800
```

---

## Spacing Scale (4px Grid)

```css
0:    0px
1:    4px    (0.25rem)
2:    8px    (0.5rem)
3:    12px   (0.75rem)
4:    16px   (1rem)
5:    20px   (1.25rem)
6:    24px   (1.5rem)
8:    32px   (2rem)
10:   40px   (2.5rem)
12:   48px   (3rem)
16:   64px   (4rem)
20:   80px   (5rem)
24:   96px   (6rem)
32:   128px  (8rem)
```

---

## Border Radius

```css
None:   0px
sm:     2px    (0.125rem)
base:   4px    (0.25rem)
md:     6px    (0.375rem)
lg:     8px    (0.5rem)
xl:     12px   (0.75rem)
2xl:    16px   (1rem)
3xl:    24px   (1.5rem)
full:   9999px (fully rounded)
```

---

## Common Components (Copy-Paste Ready)

### Primary Button
```tsx
<button className="bg-red-600 text-white font-medium rounded-lg px-6 py-2.5 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all duration-200">
  Button Text
</button>
```

### Secondary Button
```tsx
<button className="bg-white border border-gray-200 text-gray-700 font-medium rounded-lg px-6 py-2.5 hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-red-600 transition-all duration-200">
  Button Text
</button>
```

### Card
```tsx
<div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
  {/* Content */}
</div>
```

### Text Input
```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
```

### Badge
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  Status
</span>
```

### Feature Card
```tsx
<div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
    {/* Icon */}
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-2">Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

---

## Common Gradients

### Primary Red Gradient
```css
background: linear-gradient(135deg, #ff0000 0%, #ce394d 100%);
```

### Indigo-Purple Gradient (CTA)
```css
background: linear-gradient(to right, #4f46e5, #7c3aed);
```

### Hero Gradient
```css
background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3730a3 100%);
```

### Subtle Gray Gradient
```css
background: linear-gradient(to bottom, #f9fafb, #ffffff);
```

---

## Common Shadows

```css
/* Small */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Medium */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* Large */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* Extra Large */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* 2XL */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## Framer Motion Snippets

### Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

### Slide Up
```tsx
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 100 }}
>
  {/* Content */}
</motion.div>
```

### Stagger Children
```tsx
<motion.div
  variants={{
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
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

### Hover Scale
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* Content */}
</motion.div>
```

---

## Responsive Breakpoints

```tsx
{/* Mobile */}
<div className="px-4 py-6">

{/* Tablet */}
<div className="md:px-6 md:py-8">

{/* Desktop */}
<div className="lg:px-8 lg:py-12">

{/* Large Desktop */}
<div className="xl:px-12 xl:py-16">
```

### Common Responsive Patterns
```tsx
{/* Text Size */}
<h1 className="text-4xl md:text-5xl lg:text-6xl">Heading</h1>

{/* Grid Columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Flex Direction */}
<div className="flex flex-col md:flex-row gap-4">

{/* Padding */}
<div className="p-4 md:p-6 lg:p-8">

{/* Hide on Mobile */}
<div className="hidden md:block">Desktop Only</div>

{/* Show on Mobile */}
<div className="block md:hidden">Mobile Only</div>
```

---

## Common Icons (Lucide React)

```tsx
import {
  ChevronRight,    // Navigation arrows
  Sparkles,        // Premium features
  CreditCard,      // Payment
  Smartphone,      // Mobile
  Globe,           // Global/shipping
  Award,           // Premium badges
  Check,           // Success/checkmarks
  X,               // Close/remove
  TrendingUp,      // Analytics
  Building2,       // Enterprise
  Mail,            // Email
  Lock,            // Security
  User,            // Profile
  Settings,        // Settings
  Search,          // Search
  Menu,            // Mobile menu
  Heart,           // Favorites
  ShoppingCart     // Cart
} from 'lucide-react';
```

---

## Layout Containers

### Max Width Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Full Width Section
```tsx
<section className="w-full py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

### Centered Content
```tsx
<div className="flex items-center justify-center min-h-screen">
  {/* Centered content */}
</div>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Grid items */}
</div>
```

---

## Common Utilities

### Truncate Text
```tsx
<p className="truncate">Long text that will be cut off...</p>
<p className="line-clamp-2">Text that will show only 2 lines...</p>
```

### Center Absolute Element
```tsx
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  {/* Centered */}
</div>
```

### Aspect Ratio
```tsx
<div className="aspect-square">1:1</div>
<div className="aspect-video">16:9</div>
<div className="aspect-[1.586/1]">Credit card ratio</div>
```

### Backdrop Blur
```tsx
<div className="bg-white/90 backdrop-blur-md">
  {/* Frosted glass effect */}
</div>
```

### Gradient Text
```tsx
<h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
  Gradient Heading
</h1>
```

---

## Accessibility Quick Checks

### Focus Styles
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2">
  Accessible Button
</button>
```

### Screen Reader Only Text
```tsx
<span className="sr-only">Text for screen readers only</span>
```

### ARIA Labels
```tsx
<button aria-label="Close modal">
  <X className="h-6 w-6" />
</button>
```

### Keyboard Navigation
```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Keyboard accessible div
</div>
```

---

## Common CSS Variables

```css
/* Colors */
var(--primary)           /* #ff0000 */
var(--primary-fg)        /* #ffffff */
var(--bg)               /* Background */
var(--fg)               /* Foreground/text */
var(--card)             /* Card background */
var(--border)           /* Border color */
var(--muted)            /* Muted text */

/* Spacing */
var(--spacing-md)       /* 16px */
var(--spacing-lg)       /* 24px */
var(--spacing-xl)       /* 32px */

/* Radius */
var(--radius)           /* 8px */
var(--radius-lg)        /* 12px */

/* Shadows */
var(--shadow-md)
var(--shadow-lg)
```

---

## File Paths Reference

```
Design System Files:
/Users/murali/Downloads/linkistnfc-main 5/design-tokens.js
/Users/murali/Downloads/linkistnfc-main 5/app/globals.css

Component Files:
/Users/murali/Downloads/linkistnfc-main 5/components/landing/HeroSection.tsx
/Users/murali/Downloads/linkistnfc-main 5/components/landing/PricingSection.tsx
/Users/murali/Downloads/linkistnfc-main 5/components/landing/FeaturesGrid.tsx

Documentation:
/Users/murali/Downloads/linkistnfc-main 5/FIGMA_DESIGN_ANALYSIS.md
/Users/murali/Downloads/linkistnfc-main 5/COMPONENT_SPECIFICATIONS.md
/Users/murali/Downloads/linkistnfc-main 5/DESIGN_QUICK_REFERENCE.md (this file)
```

---

## Need More Details?

- **Full Design System**: See `FIGMA_DESIGN_ANALYSIS.md`
- **Component Library**: See `COMPONENT_SPECIFICATIONS.md`
- **Design Tokens**: See `design-tokens.js`
- **Global Styles**: See `app/globals.css`

---

**Last Updated**: October 2, 2025
