/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'lbb-red': '#8B0000',
        'lbb-gold': '#FFD700',
        'lbb-dark': '#0b0f17',
        lbb: {
          red: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#8B0000', // Brand Crimson
            900: '#6d0a0a',
            950: '#3a0505',
            DEFAULT: '#8B0000',
          },
          gold: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#FFD700', // Brand Gold
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207', // WCAG AA text pass on light bg
            800: '#854d0e',
            900: '#713f12',
            DEFAULT: '#FFD700',
          },
          dark: {
            DEFAULT: '#0b0f17',
            surface: '#0f172a',
            border: '#1e293b',
          },
        },
        category: {
          sd: '#dc2626',
          smp: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
