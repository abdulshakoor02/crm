import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // If you eventually have a pages directory
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // In case src is used later or for other modules
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // You can extend colors, fonts, etc. here
      // colors: {
      //   primary: '#yourPrimaryColor',
      //   secondary: '#yourSecondaryColor',
      // }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // Example: if you want to use Tailwind Forms plugin
    // require('@tailwindcss/typography'), // Example: for prose styling
  ],
};
export default config;
