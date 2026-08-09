/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f5f5f5',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#808080',
          500: '#666666',
          600: '#4d4d4d',
          700: '#333333',
          DEFAULT: '#333333',
          800: '#262626',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        teal: {
          50: '#e6f2f2',
          100: '#cce5e5',
          200: '#99cbcb',
          300: '#66b0b0',
          400: '#339696',
          500: '#006666',
          DEFAULT: '#006666',
          600: '#005252',
          700: '#003d3d',
          800: '#002929',
          900: '#001414',
        },
        brand: {
          50: '#e6f2f2',
          100: '#cce5e5',
          200: '#99cbcb',
          300: '#66b0b0',
          400: '#339696',
          500: '#006666',
          DEFAULT: '#006666',
          600: '#005252',
          700: '#003d3d',
          800: '#002929',
          900: '#001414',
          950: '#000f0f',
        },
        coral: {
          50: '#fff2ed',
          100: '#ffe5db',
          200: '#ffccb8',
          300: '#ffb294',
          400: '#ff9970',
          500: '#FF7F50',
          DEFAULT: '#FF7F50',
          600: '#e66336',
          700: '#bf471d',
          800: '#99300a',
          900: '#731c00',
        },
        surface: {
          page: '#f8fafc',
          card: '#ffffff',
          muted: '#f1f5f9',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

