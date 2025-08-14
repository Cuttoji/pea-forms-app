// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // ถ้ามีโฟลเดอร์ pages
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // ตั้งค่าฟอนต์ที่คุณใช้ใน layout.tsx (ถ้ายังไม่ได้ทำ)
        sans: ['var(--font-inter)', 'sans-serif'],
        kanit: ['var(--font-kanit)', 'sans-serif'],
      },
      colors: {
        'pea-primary': '#5b2d90',
        'pea-primary-dark': '#4a2575',
        'pea-secondary': '#a78bfa',
        'pea-secondary-dark': '#8b5cf6',
        'pea-50': '#f5f3ff',
        'pea-dark': '#3a1a5b',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // เพิ่ม Tailwind plugins อื่นๆ ที่คุณต้องการใช้ที่นี่
  ],
};
