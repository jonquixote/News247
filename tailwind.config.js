/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust according to your project structure
    "./public/index.html",
  ],
  theme: {
    extend: {
      // Add any custom themes or extensions here
    },
  },
  plugins: [
    // Remove the aspect-ratio plugin
    // require('@tailwindcss/aspect-ratio'),
    // Add other plugins if necessary
  ],
}