/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e40af",
          light: "#3b82f6",
        },
        background: {
          DEFAULT: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
};
