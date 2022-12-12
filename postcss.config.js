// order of 'plugins' matters
const postCssConfig = {
  plugins: [
    "postcss-import",
    "tailwindcss/nesting",
    "tailwindcss",
    "autoprefixer",
  ],
};

module.exports = postCssConfig;
