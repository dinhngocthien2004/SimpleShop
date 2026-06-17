/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0f172a', light: '#1e293b' },
        accent: { DEFAULT: '#f97316', hover: '#ea580c' },
      },
    },
  },
  plugins: [],
};
