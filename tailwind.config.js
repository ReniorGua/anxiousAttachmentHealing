/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#165DFF',
          50: '#E8F3FF',
          100: '#B4D8FF',
          200: '#8FC3FF',
          300: '#69ABFF',
          400: '#4A94FF',
          500: '#165DFF',
          600: '#0F45D9',
          700: '#0A35B3',
          800: '#062A8C',
          900: '#031A59',
        },
        secondary: {
          DEFAULT: '#36CFC9',
          50: '#E6F9F8',
          100: '#BCEFE9',
          200: '#94E5DC',
          300: '#6BDACF',
          400: '#4AD0C7',
          500: '#36CFC9',
          600: '#2DBFB8',
          700: '#21AFA8',
          800: '#179F98',
          900: '#0A7F7A',
        },
        warning: {
          DEFAULT: '#FF7D00',
          50: '#FFF3E6',
          100: '#FFE0B3',
          200: '#FFCF80',
          300: '#FFBD4D',
          400: '#FFAD26',
          500: '#FF7D00',
          600: '#E66A00',
          700: '#CC5500',
          800: '#B34400',
          900: '#992E00',
        },
        success: '#52C41A',
        error: '#FF4D4F',
        info: '#1677FF',
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      screens: {
        'xs': '360px',    // Mobile small (360px - common Android)
        'sm': '414px',    // Mobile large (iPhone Plus/Max)
        'md': '768px',    // Tablet
        'lg': '1024px',   // Desktop small
        'xl': '1280px',   // Desktop medium
        '2xl': '1536px',  // Desktop large
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        'DEFAULT': '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
        'lg': '0 8px 16px 0 rgba(0, 0, 0, 0.1), 0 12px 24px -6px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
