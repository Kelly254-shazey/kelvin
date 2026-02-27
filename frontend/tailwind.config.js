/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#040812',
        card: 'rgba(255,255,255,0.08)',
        accent: '#4ff0d1',
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, 0.45)',
        glow: '0 0 0 1px rgba(79, 240, 209, 0.35), 0 0 35px rgba(79, 240, 209, 0.25)',
      },
      borderRadius: {
        glass: '24px',
      },
      backdropBlur: {
        ultra: '64px',
      },
    },
  },
  plugins: [],
}
