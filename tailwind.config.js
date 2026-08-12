/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#E76F51",
        "primary-dark": "#c85033",
        secondary: "#F4A261",
        "secondary-dark": "#d38736",
        accent: "#E9C46A",
        "accent-dark": "#b68a27",
        bg: "#FDF6EC",
        background: "#FDF6EC",
        surface: "#FFFFFF",
        text: "#2D2D2D",
        "text-primary": "#2D2D2D",
        textSecondary: "#6B6B6B",
        "text-secondary": "#6B6B6B",
        border: "#E9C46A",
        fieldBg: "#FCF3E8",
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
      },
      boxShadow: {
        theme: "0 2px 12px 0 rgba(231,111,81,0.08), 0 1.5px 5px 0 rgba(44,34,26,0.03)",
        card: "0 2px 8px 0 rgba(231,111,81,0.09)",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};
