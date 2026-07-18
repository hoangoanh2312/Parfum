/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
  extend: {
    fontFamily: {
      heading: ["Georgia", "Times New Roman", "serif"],
      body: ["Arial", "Helvetica", "sans-serif"],
    },
  },
},
  plugins: [],
};
