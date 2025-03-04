import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#000000', //000000,
        'secondary': '#576CA8', //4DA1A9, FDDDFF, 17BEBB, F0EDEE, 5EB1BF, B4ADEA
        'header': '#FFFFFF',
        'text-primary': '#000000',
        'text-secondary': '#FFFFFF', //FFFFFF, 000000
        'grey': '#151515'

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
