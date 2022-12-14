/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-black': '#001529',
        'main-gray': '#f0f2f5'
      }
    }
  },
  plugins: []
}
