/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oranje: {
          DEFAULT: '#ff6b00',
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#feccaa',
          300: '#fdac74',
          400: '#fb813c',
          500: '#ff6b00',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        stadion: {
          950: '#070b18',
          900: '#0b1224',
          850: '#0f1830',
          800: '#13203f',
          700: '#1b2c54',
          600: '#26406f',
        },
        veld: {
          DEFAULT: '#1b8a4b',
          dark: '#0f5e32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(255,107,0,0.5)',
        card: '0 8px 30px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-stadion':
          'radial-gradient(circle at 20% 0%, rgba(255,107,0,0.12), transparent 45%), radial-gradient(circle at 90% 10%, rgba(37,99,235,0.18), transparent 40%)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
