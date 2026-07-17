/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4cc9f0',
        'primary-dark': '#009fcc',
        accent: '#26c9ff',
        ink: '#111111',
        'ink-2': '#1a1a1a',
        night: '#0f1419',
        mist: '#f6f7f8',
        'muted-2': '#666666',
        // poster card palette (from the studio's house style)
        coral: '#F4845F',
        leaf: '#6BBF7A',
        sun: '#F5B841',
        sky: '#6EB5FF',
        rose: '#E882B4',
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Anton', 'Impact', 'sans-serif'],
        accent: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
