/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'swiss-white': '#FFFFFF',
        'swiss-black': '#000000',
        'swiss-muted': '#F2F2F2',
        'swiss-accent': '#FF3000',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}