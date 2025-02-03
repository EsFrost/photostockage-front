import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      'usm': {'max': '400px'},
      'sm': {'max': '639px'},
      'smcustom': {'max': '450px'},
      'md': {'max': '767px'},
      'mdim': {'max': '795px'},
      'mdcustom': {'max': '830px'},
      'lgcustom': {'max': '930px'},
      'lg': {'max': '1023px'},
      'xl': {'max': '1279px'},
      '2xl': {'max': '1535px'},
    }
  },
  plugins: [],
};
export default config;
