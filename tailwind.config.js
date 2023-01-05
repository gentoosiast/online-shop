/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  safelist: ["sliderTrack-1"],
  theme: {
    screens: {
      'mobile-1': '320px',
      'mobile-2': '360px',
      'mobile-3': '414px',
      'mobile-4': '480px',
      'tablet': '600px',
      'tablet-big': '768px',
      'laptop': '1024px',
      'desktop': '1280px',
    },
    extend: {
      fontFamily: {
        'ubuntu': 'Ubuntu'
      },
    }
  },
  plugins: [],
});
