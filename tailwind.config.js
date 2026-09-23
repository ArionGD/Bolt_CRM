/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Festival ladi: bulbs brighten in sequence via staggered delays.
        'bulb-pulse': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'bulb-pulse': 'bulb-pulse 1.8s ease-in-out infinite',
      },
      fontFamily: {
        // Public website only; the CRM keeps the global Plus Jakarta Sans.
        display: ['Archivo', 'system-ui', 'sans-serif'],
        body: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        ev: {
          electric: '#00F0FF',
          lime: '#10E773',
          dark: '#0B132B',
          surface: '#1C2541',
        },
        // Public website palette (not used by the CRM, which stays on `brand`).
        paper: {
          50: '#FBFAF7',
          100: '#F6F5F1',
          200: '#EFEDE6',
          300: '#E3E1DA',
          400: '#D2CFC5',
        },
        ink: {
          400: '#8E8E93',
          500: '#6B6B70',
          600: '#48484D',
          700: '#2E2E33',
          800: '#161619',
          900: '#0A0A0B',
          950: '#000000',
        },
        // Chhath Puja festival banner: dusk sky over water.
        navy: {
          600: '#1E3A6E',
          700: '#152A52',
          800: '#0E1D3A',
          900: '#091428',
        },
      }
    },
  },
  plugins: [],
}
