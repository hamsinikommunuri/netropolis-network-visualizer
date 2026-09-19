/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        pastel: {
          lavender: '#E8E4F3',
          'lavender-dark': '#7F77A8',
          blue: '#DCEBFA',
          'blue-dark': '#4A7FB8',
          pink: '#FDE4EA',
          'pink-dark': '#C65D7B',
          cream: '#FFFDF9',
          mint: '#D8F3E5',
          'mint-dark': '#3D8B68',
          peach: '#FFE7D9',
          'peach-dark': '#C46A42',
          yellow: '#FEF3C7',
          'yellow-dark': '#B4831B',
          gray: '#ECEEF2',
          'gray-dark': '#6B7280',
          border: '#E2E6EE',
          card: '#FFFFFF',
          text: '#2D3142',
          subtext: '#5C6479',
        },
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(120, 130, 160, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(120, 130, 160, 0.12)',
        'pastel-glow': '0 0 15px rgba(220, 235, 250, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
