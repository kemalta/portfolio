import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#06080a",
        base: "#080b0e",
        panel: "#0b1014",
        raised: "#0e1419",
        ink: "#e9edf0",
        dim: "#9aa4ae",
        faint: "#78838f",
        line: "rgba(233,237,240,0.11)",
        cyan: "#5fe3ff",
        lime: "#c6f26e",
        amber: "#f2b36a",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        shell: "1500px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-expo": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 500ms cubic-bezier(0.23, 1, 0.32, 1) both",
        "scale-in": "scale-in 220ms cubic-bezier(0.23, 1, 0.32, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
