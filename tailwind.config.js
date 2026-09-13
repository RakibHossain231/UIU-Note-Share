/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uiu: {
          orange: '#FF6600',
          'orange-light': '#FF8533',
          'orange-dark': '#E65C00',
          dark: '#121212',
          surface: '#1E1E1E',
          card: '#252525',
          border: '#333333',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
