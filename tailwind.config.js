/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './admin.html',
    './panel.html',
    './control.html',
    './servicio-tecnico.html',
    './js/**/*.js',
    './proyecto-wes/**/*.html',
    './proyecto-wes/js/**/*.js'
  ],
  theme: {
    extend: {
      screens: {
        'xs': '420px'
      },
      colors: {
        'wes-blue': '#0D2A5C',
        'wes-dark': '#071836',
        'wes-gold': '#F5B300',
        'wes-gold-light': '#FDD835',
        'wes-amber': '#D97706'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        brand: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: []
};
