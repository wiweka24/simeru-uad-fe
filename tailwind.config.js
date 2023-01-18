/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grey': {
          light: '#F9FAFB',
          DEFAULT: '#6B7280',
          dark: '#111827',
        },
      },
    },
  },
  plugins: [],
}