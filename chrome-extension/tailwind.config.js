/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,html}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#FFFFFF', // Monochrome white
        subtle: '#666666',
        black: '#000000',
        white: '#ffffff',
      },
      borderWidth: {
        DEFAULT: '2px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '0px',
        DEFAULT: '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '0px',
      }
    },
  },
  plugins: [],
}
