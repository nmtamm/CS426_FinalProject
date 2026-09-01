/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: ["PatrickHand_400Regular"],
      },
    },
  },

  plugins: [],
};
