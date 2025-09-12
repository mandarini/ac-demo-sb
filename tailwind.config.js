/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'fall-slow': 'fall 8s linear infinite',
        'fall-medium': 'fall 6s linear infinite',
        'fall-fast': 'fall 4s linear infinite',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-100px)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}