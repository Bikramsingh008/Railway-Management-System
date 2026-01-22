module.exports = {
  theme: {
    extend: {
      keyframes: {
        trainMove: {
          "0%": { transform: "translateX(-300px)" },
          "100%": { transform: "translateX(110vw)" },
        },
      },
      animation: {
        trainMove: "trainMove 12s linear infinite",
      },
    },
  },
  plugins: [],
};
