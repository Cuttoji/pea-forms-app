// app/layout.tsx
// ไฟล์นี้เป็น Root Layout สำหรับทุกหน้าในแอปพลิเคชันของคุณ
import './globals.css'; // Import global styles
import { Inter, Kanit } from 'next/font/google'; // Import fonts
import Link from 'next/link'; // Import Link for navigation

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'ระบบฟอร์มตรวจสอบ PEA',
  description: 'เว็บแอปพลิเคชันสำหรับฟอร์มตรวจสอบของการไฟฟ้าส่วนภูมิภาค',
  icons: {
    icon: '/pea_logo.png', // ตรวจสอบว่าไฟล์นี้อยู่ในโฟลเดอร์ public
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${kanit.variable} ${inter.variable}`}>
      <head>
        {/* Next.js จะแทรก default head elements และ metadata ที่นี่ */}
      </head>
      <body className="font-kanit bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 text-gray-800 min-h-screen flex flex-col">
        <nav className="bg-gradient-to-r from-[#5b2d90] to-[#3a1a5b] text-white p-4 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-purple-300 transition-colors duration-300 ease-in-out flex items-center">
              <img src="/pea_logo.png" alt="PEA Logo" className="h-8 w-auto mr-3"/>
              ระบบฟอร์ม PEA
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-purple-300 transition-colors">หน้าหลัก</Link>
              <Link href="/auth/register" className="hover:text-purple-300 transition-colors">สมัครสมาชิก</Link>
              {/* สามารถเพิ่มลิงก์ Login/Logout หรือ Profile ที่นี่ */}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4 sm:p-6 mt-6 flex-grow">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center text-sm p-6 mt-10">
          <p>© {new Date().getFullYear()} การไฟฟ้าส่วนภูมิภาค (PEA)</p>
          <p>สงวนลิขสิทธิ์ | All Rights Reserved</p>
          <div className="mt-2">
            <Link href="/privacy-policy" className="hover:underline mx-2">นโยบายความเป็นส่วนตัว</Link>
            <Link href="/terms-of-service" className="hover:underline mx-2">ข้อกำหนดการใช้งาน</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
