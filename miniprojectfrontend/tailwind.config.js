/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This ensures Tailwind scans all JSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
