import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'sans': ['var(--font-inter)', 'sans-serif'],
        'heading': ['var(--font-poppins)', 'sans-serif'],
        'body': ['var(--font-inter)', 'sans-serif'],
        'brand': ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;