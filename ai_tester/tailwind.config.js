// tailwind.config.js (in your project root)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { 
            opacity: 1,
            textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
          },
          '50%': { 
            opacity: 0.7,
            textShadow: '0 0 40px rgba(139, 92, 246, 0.8)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
        'neon': '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}