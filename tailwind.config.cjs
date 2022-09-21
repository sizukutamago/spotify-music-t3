/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        noto: ['Noto Sans JP']
      },
      backgroundImage: {
        'hero': "url('/hero.jpg')",
      }
    },
  },
  plugins: [],
};
