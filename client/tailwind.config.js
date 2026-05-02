/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff8ff',
          100: '#dbeffe',
          200: '#bfe3fd',
          300: '#93d0fc',
          400: '#5fb4f8',
          500: '#3b94f4',
          600: '#1e6fe8',
          700: '#1657d5',
          800: '#1847ac',
          900: '#1a3e88',
          950: '#142753',
        },
        teal: {
          50:  '#effefb',
          100: '#c7fef5',
          200: '#90fdec',
          300: '#50f5df',
          400: '#1be3cc',
          500: '#02c9b3',
          600: '#01a193',
          700: '#057d74',
          800: '#0a635d',
          900: '#0d524d',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle:  '#f8fafc',
          muted:   '#f1f5f9',
        },
      },
      fontFamily: {
        sans:    ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cabinet)', 'var(--font-plus-jakarta)', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        lg:  '0.75rem',
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:   '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 16px -2px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 16px 40px -4px rgb(0 0 0 / 0.12)',
        glow:   '0 0 0 3px rgb(59 148 244 / 0.2)',
        'glow-teal': '0 0 0 3px rgb(2 201 179 / 0.2)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-in':   'slideIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-12px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float:   { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(at 40% 20%, hsla(210,100%,97%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,96%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,97%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,97%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,97%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,97%,1) 0px, transparent 50%)',
        'brand-gradient': 'linear-gradient(135deg, #1e6fe8 0%, #02c9b3 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
      },
    },
  },
  plugins: [],
};
