import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',
        'secondary': '#D81159', //E0479E, ED254E, 4DA1A9
        'header': '#FFFFFF'
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        kanit: ['Kanit', 'sans-serif']
      },
    },
  },
  plugins: [],
} satisfies Config;
