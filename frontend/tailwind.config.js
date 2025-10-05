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
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#334155',
          hover: '#475569',
          border: '#475569',
        },
        game: {
          bg: '#1a0b2e',
          surface: '#2d1b4e',
          card: '#3d2963',
          hover: '#4d3973',
          border: '#7c3aed',
          primary: '#ff6b9d',
          secondary: '#ffd93d',
          accent: '#6bcf7f',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
