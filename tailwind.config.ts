import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#000000', //000000,
        'secondary': '#123456', //E0479E, ED254E, 4DA1A9, D81159, 123456, 335F8A, FDDDFF
        'header': '#FFFFFF',
        'correct': '#00FF00',
        'wrong': '#FF0000'
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
