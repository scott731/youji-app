/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF9500',
        secondary: '#5AC8FA',
        bg: '#FAFAFA',
        card: '#FFFFFF',
        text: { DEFAULT: '#333333', secondary: '#666666', hint: '#999999' },
        success: '#4CD964',
        warning: '#FF9500',
        error: '#FF3B30',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
