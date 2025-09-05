/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'dark-gold': {
          400: '#facc15',
          500: '#d4af37',
          600: '#ca8a04',
        },
      },
      fontFamily: {
        'serif': ['Cinzel', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ember': 'ember 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { 
            textShadow: '0 0 10px #d4af37',
          },
          '100%': { 
            textShadow: '0 0 20px #d4af37',
          },
        },
        ember: {
          '0%, 100%': { 
            transform: 'translateY(0px) scale(1)',
            opacity: '0.7',
          },
          '50%': { 
            transform: 'translateY(-20px) scale(1.1)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}
