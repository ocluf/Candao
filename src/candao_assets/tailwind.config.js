module.exports = {
  purge: [],
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        principal: "32rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
