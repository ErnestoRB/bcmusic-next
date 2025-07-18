/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/styles.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#2ebd59",
        },
        bc: {
          purple: {
            1: "#e31cff",
            2: "#b517cb",
            3: "#871197",
          },
          pink: {
            1: "#ff1cdd",
            2: "#ff1cfc",
            3: "#cc16c9",
          },
          red: {
            1: "#f51a36",
            2: "#E7223B",
            3: "#D22739",
          },
        },
      },
      fontFamily: {
        blade: ["var(--font-blade)"],
        inconsolata: ["'Inconsolata', monospace"],
        raleway: ["'Raleway', sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-react-aria-components")],
};
