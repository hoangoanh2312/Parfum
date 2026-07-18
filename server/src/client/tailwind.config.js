/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
  extend: {
    fontFamily: {
      heading: ["Cormorant Garamond", "serif"],
      body: ["Montserrat", "sans-serif"],
    },
  },
},
  plugins: [],
};
