/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2AAEDF',
          50:  '#EBF8FD',
          100: '#D2F0FB',
          200: '#A5E2F7',
          300: '#78D3F3',
          400: '#4BC5EF',
          500: '#2AAEDF',
          600: '#2AAEDF',
          700: '#2093BE',
          800: '#16799E',
        },
        dark: {
          DEFAULT: '#05051F',
          800: '#0D0D3A',
          700: '#14145A',
        },
        surface: '#F7F9FC',
        body: '#4A5568',
        muted: '#718096',
      },
      fontFamily: { sans: ['"Be Vietnam Pro"', 'sans-serif'] },
    },
  },
  plugins: [],
};
