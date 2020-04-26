module.exports = {
  plugins: [
    "tailwindcss",
    ...(process.env.NODE_ENV === "production"
      ? [
          [
            "@fullhuman/postcss-purgecss",
            {
              content: ["./src/**/*.{js,jsx,ts,tsx,css}"],
              defaultExtractor: (content) =>
                content.match(/[\w-/:]+(?<!:)/g) || [],
            },
          ],
        ]
      : []),
    "postcss-preset-env",
  ],
};
