/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Be Vietnam Pro', 'Inter', 'sans-serif'],
        serif: ['Noto Serif Display', 'Noto Serif', 'serif'],
        title: ['Noto Serif Display', 'Noto Serif', 'serif'],
        numeric: ['Space Grotesk', 'Be Vietnam Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
