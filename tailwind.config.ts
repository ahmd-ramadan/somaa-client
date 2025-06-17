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
      colors: {
        primary: "#00224D",
        // primary: "#16a34a",
        // primary: "#4f46e5",
        secondary: "#C80036", 
        adminPrimary: "#00224D",
        // adminPrimary: "#10a37f",
        // adminPrimary: "#16a34a",
        adminSecondary: "#C80036",
      },
      scrollbar: {
        DEFAULT: {
          width: '8px',
          height: '8px',
          track: '',
          thumb: '#888',
          borderRadius: '10px',
        },
      },
      variants: {
        scrollbar: ['rounded'],
      },
      plugins: [
        require('tailwind-scrollbar'),
      ],
    },
  },
  plugins: [],
};
export default config;
