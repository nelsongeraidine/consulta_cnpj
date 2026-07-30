/** @type {import('tailwindcss').Config} */

// Permite usar bg-ink, text-lavender/70 etc. normalmente, mas resolvendo a
// cor a partir de uma variável CSS (--c-*-rgb) que muda com [data-theme].
function themedColor(varName) {
  return ({ opacityValue }) =>
    opacityValue === undefined
      ? `rgb(var(${varName}))`
      : `rgba(var(${varName}), ${opacityValue})`;
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        ink: themedColor("--c-bg-rgb"),
        surface: themedColor("--c-surface-rgb"),
        lavender: themedColor("--c-text-rgb"),
        support: themedColor("--c-support-rgb"),
        violet: {
          deep: themedColor("--c-accent1-rgb"),
          mid: themedColor("--c-accent2-rgb"),
          light: themedColor("--c-accent3-rgb"),
        },
      },
    },
  },
  plugins: [],
};
