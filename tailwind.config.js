/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        runway: {
          100: '#f8d9d2',
          500: '#c96f5d',
          600: '#b85a47',
          700: '#8f4335',
        },
        blush: {
          100: '#fde8e3',
          500: '#e8a39a',
          700: '#b96f66',
        },
        sand: {
          100: '#f7efe8',
          200: '#ead9cb',
        },
        ink: {
          500: '#6f6670',
          600: '#514a53',
          700: '#37313a',
          900: '#181827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
