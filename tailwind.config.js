/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8D00B0",
        primaryHover: "#a100c9",
        background: "#1A1A1A",
        card: "#282828",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
