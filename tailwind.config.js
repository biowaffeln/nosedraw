module.exports = {
  purge: ["./src/pages/**/*.jsx", "./src/components/**/*.jsx"],
  darkMode: "media",
  theme: {
    extend: {
      spacing: {
        13: "3.25rem",
      },
      boxShadow: {
        brutalist: "3px 3px",
      },
    },
  },
  variants: {
    extend: {
      outline: ["focus-visible"],
    },
  },
  plugins: [],
};
