/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)'],
        display: ['var(--font-sora)'],
        mono: ['var(--font-mono)']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite'
      },
      blur: {
        '4xl': '96px'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
