/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#0756A5",
        deepNavy: "#082B59",
        primaryOrange: "#FF6900",
        secondaryOrange: "#FF8A00",
        lightBg: "#F5F8FC",
        darkBg: "#071426",
        
        // Backward-compatible semantic aliases
        primaryColor: "#0756A5",
        accentColor: "#FF6900",
        primaryTextColor: "#0F172A",
        secondaryTextColor: "#475569",
        primaryBtnColor: "#0756A5",
        primaryBtnHoverColor: "#082B59",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Nunito Sans", "sans-serif"],
        heading: ['"Plus Jakarta Sans"', "sans-serif"],
        display: ['"Familjen Grotesk"', "sans-serif"],
      },
      boxShadow: {
        premium: "0 20px 40px -15px rgba(7, 86, 165, 0.12)",
        glowBlue: "0 0 35px -5px rgba(7, 86, 165, 0.4)",
        glowOrange: "0 0 35px -5px rgba(255, 105, 0, 0.4)",
        card: "0 10px 30px -10px rgba(8, 43, 89, 0.08)",
        cardHover: "0 20px 40px -15px rgba(8, 43, 89, 0.16)",
      },
    },
  },
  plugins: [],
};
