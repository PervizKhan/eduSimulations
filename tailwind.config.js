/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Physics engines ke andar agar koi custom DOM overlays hon toh unhe scan karne ke liye:
    "./physicsEngines/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      // Humne UI design mein 'border-3' use kiya hai, use yahan define kar rahe hain
      borderWidth: {
        '3': '3px',
      },
      // Bachon ki website ke liye kuch playful elements aur animations
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};