module.exports = {
  purge: ['./src/client/pages/**/*.tsx', './src/client/components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      cursor: ['disabled', 'checked'],
      backgroundColor: ['disabled', 'checked'],
      borderColor: ['disabled', 'checked'],
    },
  },
  plugins: [],
};
