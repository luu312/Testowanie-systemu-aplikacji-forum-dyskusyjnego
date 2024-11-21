import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "black",
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(80, 200, 120)",
          secondary: "rgb(24, 24, 24)",
        },
      },
    ],
  },
};
