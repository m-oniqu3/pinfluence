/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: '#ffffff',
        primary: '#E60023',
        'neutral-100': 'rgba(51, 51, 51, 0.1)'
      }
    }
  },
  plugins: []
}
