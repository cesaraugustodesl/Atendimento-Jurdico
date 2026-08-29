import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: "#0A0A0B",
        grafite: "#17171A",
        "grafite-2": "#1F1F23",
        cream: "#F5F3EE",
        paper: "#FBFAF7",
        ink: "#1B1B1D",
        mist: "#6E6E72",
        "mist-light": "#9A9A9E",
        bronze: "#9C7A3C",
        "bronze-light": "#C7A868",
        "bronze-dim": "#7C6230",
        hairline: "rgba(255,255,255,0.09)",
        "hairline-dark": "rgba(0,0,0,0.10)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        content: "1280px",
        prose: "68ch",
      },
      transitionTimingFunction: {
        signature: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
