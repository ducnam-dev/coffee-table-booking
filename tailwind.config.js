/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a37c6b',
          600: '#865f4e',
          700: '#694636',
          800: '#4a2d1e',
          900: '#271408',
        },
      }
    },
  },
  plugins: [],
}
