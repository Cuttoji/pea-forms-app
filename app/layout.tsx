// app/layout.tsx
"use client"; // << เพิ่มบรรทัดนี้

import './globals.css'; // Import global styles
import { Inter, Kanit } from 'next/font/google'; // Import fonts
import Link from 'next/link'; // Import Link for navigation
import { usePathname } from 'next/navigation'; // << เพิ่ม Hook นี้

// คอมโพเนนต์ Navbar (จะย้ายไป ui/Navbar.tsx)
// ผมจะแสดงโค้ดสำหรับ Navbar แยกต่างหากด้านล่าง
// ในที่นี้ สมมติว่าเรา import เข้ามา
// import Navbar from '@/ui/Navbar'; // << สมมติว่า path เป็นแบบนี้
// import Footer from '@/ui/Footer'; // << สมมติว่า path เป็นแบบนี้

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// หมายเหตุ: metadata object โดยทั่วไปจะถูก export จาก Server Component
// การแปลง RootLayout เป็น Client Component อาจจะต้องพิจารณาวิธีการจัดการ metadata
// ที่ app/page.tsx หรือผ่าน generateMetadata หากต้องการ metadata แบบไดนามิกสำหรับ layout นี้
// สำหรับ static metadata ที่ root, Next.js อาจยังคงจัดการได้จาก page.tsx หลัก

// คอมโพเนนต์ Footer แบบง่าย (สามารถย้ายไป ui/Footer.tsx ได้เช่นกัน)
const SiteFooter = () => {
  return (
    <footer className="bg-gray-800 text-white text-center text-sm p-6 mt-10">
      <p>© {new Date().getFullYear()} การไฟฟ้าส่วนภูมิภาค (PEA)</p> {/* */}
      <p>สงวนลิขสิทธิ์ | All Rights Reserved</p> {/* */}
      <div className="mt-2">
        <Link href="/privacy-policy" className="hover:underline mx-2">นโยบายความเป็นส่วนตัว</Link> {/* */}
        <Link href="/terms-of-service" className="hover:underline mx-2">ข้อกำหนดการใช้งาน</Link> {/* */}
      </div>
    </footer>
  );
};

// คอมโพเนนต์ Navbar แบบง่าย (สามารถย้ายไป ui/Navbar.tsx ได้เช่นกัน)
const SiteNavbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[#5b2d90] to-[#3a1a5b] text-white p-4 shadow-lg sticky top-0 z-50"> {/* */}
      <div className="container mx-auto flex justify-between items-center"> {/* */}
        <Link href="/" className="text-2xl font-bold hover:text-purple-300 transition-colors duration-300 ease-in-out flex items-center"> {/* */}
          <img src="/pea_logo.png" alt="PEA Logo" className="h-8 w-auto mr-3"/> {/* */}
          ระบบฟอร์ม PEA {/* */}
        </Link>
        <div className="space-x-4"> {/* */}
          <Link href="/" className="hover:text-purple-300 transition-colors">หน้าหลัก</Link> {/* */}
          <Link href="/auth/register" className="hover:text-purple-300 transition-colors">สมัครสมาชิก</Link> {/* */}
          {/* สามารถเพิ่มลิงก์ Login/Logout หรือ Profile ที่นี่ */}
        </div>
      </div>
    </nav>
  );
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // ดึงค่า path ปัจจุบัน
  const isAuthPage = pathname.startsWith('/auth/'); // ตรวจสอบว่าเป็นหน้าในกลุ่ม /auth/ หรือไม่

  // ถ้าต้องการให้ metadata เปลี่ยนแปลงตามหน้า ควรจัดการในแต่ละ page.tsx
  // หรือใช้ generateMetadata ใน layout ที่เป็น Server Component
  // ที่นี่จะแสดงตัวอย่างการตั้งค่า title แบบง่ายๆ ถ้าต้องการ (แต่ปกติ metadata object จะดีกว่า)
  useEffect(() => {
    if (isAuthPage) {
      document.title = 'เข้าสู่ระบบ/สมัครสมาชิก | ระบบฟอร์ม PEA';
    } else {
      // สามารถตั้ง title เริ่มต้น หรือปล่อยให้ page-specific metadata จัดการ
      // document.title = 'ระบบฟอร์มตรวจสอบ PEA'; // จาก metadata เดิม
    }
  }, [pathname, isAuthPage]);


  return (
    <html lang="th" className={`${kanit.variable} ${inter.variable}`}>
      <head>
        {/* Next.js จะแทรก default head elements และ metadata ที่นี่
          คุณสามารถเพิ่ม <link rel="icon" href="/pea_logo.png" /> ที่นี่ได้
          ถ้า metadata object ไม่ทำงานใน client component layout
        */}
        <link rel="icon" href="/pea_logo.png" /> {/* */}
      </head>
      <body className="font-kanit bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 text-gray-800 min-h-screen flex flex-col"> {/* */}
        
        {/* แสดง Navbar เฉพาะเมื่อไม่ใช่หน้าในกลุ่ม /auth/ */}
        {!isAuthPage && <SiteNavbar />}

        <main className={`container mx-auto p-4 sm:p-6 ${!isAuthPage ? 'mt-6' : ''} flex-grow`}> {/* */}
          {children}
        </main>

        {/* แสดง Footer เฉพาะเมื่อไม่ใช่หน้าในกลุ่ม /auth/ */}
        {!isAuthPage && <SiteFooter />}

      </body>
    </html>
  );
}