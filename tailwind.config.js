/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cobalt: {
          50: '#eef6ff',
          100: '#d8eaff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          950: '#0a1744',
        },
        skyglass: '#e0f2fe',
      },
      boxShadow: {
        glow: '0 18px 55px rgba(37, 99, 235, 0.22)',
      },
    },
  },
  plugins: [],
};
