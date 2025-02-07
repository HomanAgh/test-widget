/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: "rgba(246, 249, 252, 1)",
        customGrayDark: "rgba(113, 113, 113, 1)",
        customGrayMedium: "rgba(163, 163, 163, 1)",
        customLightBlue: "rgba(246,249,252)",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
