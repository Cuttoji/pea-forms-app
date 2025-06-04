module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // สแกนไฟล์ในโฟลเดอร์ app ทั้งหมด
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // ถ้ามีโฟลเดอร์ pages (สำหรับ App Router อาจจะไม่จำเป็น)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // สแกนไฟล์ในโฟลเดอร์ components
  ],
  theme: {
    extend: {
      fontFamily: {
        // ตั้งค่าฟอนต์ที่คุณใช้ใน layout.tsx (ถ้ายังไม่ได้ทำ)
        sans: ['var(--font-inter)', 'sans-serif'], // Inter เป็น default sans-serif
        kanit: ['var(--font-kanit)', 'sans-serif'], // Kanit สำหรับภาษาไทย
      },
      colors: {
        'pea-primary': '#5b2d90',
        'pea-secondary': '#a78bfa',
        'pea-dark': '#3a1a5b',
      },
      // สามารถเพิ่มการตั้งค่า theme อื่นๆ ที่นี่
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Plugin สำหรับปรับปรุงสไตล์ของฟอร์ม (จำเป็นต้องติดตั้ง)
  ],
};