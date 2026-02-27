export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rosa: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9b8',
          400: '#ec7992',
          500: '#e04d6f',
          600: '#cc2d56',
          700: '#ab2047',
          800: '#8f1d3f',
          900: '#7a1c3a',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#faf0e0',
          300: '#f5e3c8',
        },
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#3d3d3d',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
