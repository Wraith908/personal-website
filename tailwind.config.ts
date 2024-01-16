import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/*.{html,tsx}",
    "./src/components/*.{html,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

