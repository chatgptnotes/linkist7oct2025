// Design Tokens for Linkist NFC App
// This file contains all design specifications that can be easily updated
// based on Figma design requirements

export const designTokens = {
  // Color Palette - Extracted from Figma Design
  colors: {
    // Primary Button Colors (RED from Figma)
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ff0000', // Main brand red - PRIMARY BUTTON COLOR
      600: '#dc2626',
      700: '#ce394d',
      800: '#991b1b',
      900: '#7f1d1d'
    },
    // Dark Blue/Navy for backgrounds and UI elements
    secondary: {
      50: '#677aa6',
      100: '#4b5563',
      200: '#374151',
      300: '#2f416b',
      400: '#263252',
      500: '#1f2937', // Dark navy
      600: '#14172c',
      700: '#0e1116',
      800: '#0a0c12',
      900: '#000000'
    },
    // Accent colors for interactive elements
    accent: {
      50: '#dbeafe',
      100: '#bfdbfe',
      200: '#93c5fd',
      300: '#60a5fa',
      400: '#3b82f6',
      500: '#2563eb',
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#1a56db',
      900: '#1e3a8a'
    },
    // Status colors
    success: {
      50: '#dcfce7',
      100: '#bbf7d0',
      200: '#86efac',
      300: '#4ade80',
      400: '#22c55e',
      500: '#16a34a',
      600: '#15803d',
      700: '#166534',
      800: '#14532d',
      900: '#052e16'
    },
    warning: {
      50: '#fef3c7',
      100: '#fde68a',
      200: '#fcd34d',
      300: '#fbbf24',
      400: '#f59e0b',
      500: '#ca8d00', // Gold color from Figma
      600: '#9d7414',
      700: '#854d0e',
      800: '#713f12',
      900: '#422006'
    },
    error: {
      50: '#fee2e2',
      100: '#fecaca',
      200: '#fca5a5',
      300: '#f87171',
      400: '#ef4444',
      500: '#dc2626',
      600: '#991b1b',
      700: '#7f1d1d',
      800: '#450a0a',
      900: '#1c0000'
    },
    // Social media colors from Figma
    social: {
      linkedin: '#0a66c2',
      facebook: '#1877f2',
      whatsapp: '#25d366',
      twitter: '#0075ff'
    },
    // Card material colors
    cardColors: {
      black: '#000000',
      white: '#ffffff',
      gold: '#ca8d00', // Updated gold color (not brown)
      steel: '#8a8888',
      brushedSteel: '#6a6868'
    },
    white: '#ffffff',
    black: '#000000'
  },

  // Typography - Extracted from Figma Design
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'], // Primary font from Figma
      body: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'], // Body text from Figma
      display: ['Inter', 'system-ui', 'sans-serif'], // Headings
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }]
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },

  // Spacing - Update with exact Figma measurements
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
  },

  // Component Sizes
  components: {
    button: {
      sm: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        height: '2rem'
      },
      md: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        height: '2.5rem'
      },
      lg: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        height: '3rem'
      }
    },
    input: {
      sm: { height: '2rem', padding: '0.5rem 0.75rem' },
      md: { height: '2.5rem', padding: '0.75rem 1rem' },
      lg: { height: '3rem', padding: '1rem 1.25rem' }
    }
  },

  // Breakpoints
  screens: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export default designTokens;