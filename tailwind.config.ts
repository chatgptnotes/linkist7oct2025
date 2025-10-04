import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#fff0f0',  // Linkist Red - very light tint for backgrounds
          100: '#ffe0e0', // Linkist Red - light tint
          200: '#ffc0c0', // Linkist Red - medium light tint
          300: '#ff8080', // Linkist Red - light for focus rings
          400: '#ff4040', // Linkist Red - medium
          500: '#ff0000', // Linkist Red - primary brand color
          600: '#ff0000', // Linkist Red - primary (matching 500 for consistency)
          700: '#cc0000', // Linkist Red - darker for hover states
          800: '#990000', // Linkist Red - very dark
          900: '#660000', // Linkist Red - darkest
        },
      },
    },
  },
} satisfies Config
