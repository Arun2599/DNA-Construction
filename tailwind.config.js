/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4cc9f0',
        'primary-dark': '#009fcc',
        accent: '#26c9ff',
        ink: '#0f1419',
        'ink-2': '#1a1a1a',
        mist: '#f8f9fa',
        'muted-2': '#666666',
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
