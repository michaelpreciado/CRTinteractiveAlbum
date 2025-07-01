/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Dodger Blue Theme
        'dodger': {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1E90FF', // Primary Dodger Blue
          600: '#1a7ce8',
          700: '#1565c0',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        'crt-blue': '#001428',
        'crt-glow': '#1E90FF',
        'crt-bright': '#60a5fa',
        'dark-ambient': '#0a0f1a',
        'deep-blue': '#001122',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px rgba(159, 199, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(159, 199, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
} 