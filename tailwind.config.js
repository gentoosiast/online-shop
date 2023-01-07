/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  safelist: [],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-loading': 'linear-gradient(to left, rgba(251,251,251, .05), rgba(251,251,251, .3), rgba(251,251,251, .6), rgba(251,251,251, .3), rgba(251,251,251, .05))',
      },
      keyframes: {
        loading: {
          '0%': { left: '-50%' },
          '100%': { left: '100%' },
        }
      },
      animation: {
        loading: 'loading 1s infinite',
      }
    },
  },
  plugins: [],
};
