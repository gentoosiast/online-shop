/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  safelist: ["sliderTrack-1"],
  theme: {
    extend: {}
  },
  fontFamily: {
    sans: ['Bebas Neue', 'sans-serif'],
  },
  plugins: [],
});
