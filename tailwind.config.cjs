/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['**/*.tsx'],
  theme: {
    extend: {
      fontFamily: { sans: ['Roboto'] },
      boxShadow: {
        modal: '0 0 4px 2px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        primary: '#0077ff',
        primaryLight: '#4da0ff',
        red: '#ef5350',
        controlStroke: '#e0e0e0',
      },
      animation: {
        aFadeIn: 'fadeIn 250ms ease-in-out',
        fadeInScale: 'fadeInScale 250ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInScale: {
          '0%': { opacity: '0', scale: '1' },
          '50%': { opacity: '0.5', scale: '1.1' },
          '100%': { opacity: '1', scale: '1' },
        },
      },
    },
  },
};
