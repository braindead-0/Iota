/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,html}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#5e5e5e', // Surface tint from web-app
        surface: '#f9f9f9',
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#4c4546',
        outline: '#7e7576',
      },
      borderWidth: {
        DEFAULT: '0.5px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}

