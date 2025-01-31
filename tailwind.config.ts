import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#000000', //000000,
        'secondary': '#034078', //E0479E, ED254E, 4DA1A9, D81159, 123456, 335F8A, FDDDFF, 7D53DE, 23F0C7, 153B50, 9CFFFA, E85F5C, 17BEBB, F0EDEE, 5EB1BF, B4ADEA
        'header': '#FFFFFF',
        'text': '#FFFFFF' //FFFFFF, 000000

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
