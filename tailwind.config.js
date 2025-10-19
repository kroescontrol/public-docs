const { tailwindConfig } = require('./src/brand/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './theme.config.tsx',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/nextra/dist/**/*.{js,jsx}', // Nextra components
    './node_modules/nextra-theme-docs/dist/**/*.{js,jsx}', // Nextra theme
  ],
  darkMode: 'class',
  ...tailwindConfig,
  plugins: [],
}
