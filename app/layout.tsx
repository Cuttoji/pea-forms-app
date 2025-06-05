// app/layout.tsx
"use client"; // << เพิ่มบรรทัดนี้

import './globals.css';
import { Inter, Kanit } from 'next/font/google';
import SiteNavbar from '@/components/ui/Navbar';
import SiteFooter from '@/components/ui/Footer';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth/');

  // useEffect สำหรับจัดการ document.title (จะทำงานเฉพาะใน Client Component)
  useEffect(() => {
    if (isAuthPage) {
      document.title = 'เข้าสู่ระบบ/สมัครสมาชิก | ระบบฟอร์ม PEA';
    } else {
      // คุณสามารถตั้งค่า title เริ่มต้นสำหรับหน้าอื่นๆ ที่นี่
      // หรือปล่อยให้ metadata ของแต่ละหน้า (page.tsx) จัดการ
      // document.title = 'ระบบฟอร์มตรวจสอบ PEA'; // อ้างอิงจาก metadata เดิม
    }
    // หากต้องการให้ favicon แสดงผลอย่างสม่ำเสมอเมื่อ layout เป็น client component
    // อาจจะต้องตรวจสอบว่า <link rel="icon"> ใน <head> ถูก render อย่างไร
    // หรือถ้า metadata object ใน server component (เช่น page.tsx) ยังคงจัดการได้ ก็อาจจะไม่ต้องทำอะไรเพิ่ม
  }, [pathname, isAuthPage]); // dependency array


  return (
    <html lang="th" className={`${kanit.variable} ${inter.variable}`}>
      <head>
        {/* Next.js จะแทรก default head elements และ metadata จาก page components ที่นี่ */}
        {/* การตั้งค่า favicon ผ่าน metadata object ใน page.tsx หรือ root page.tsx จะเหมาะสมกว่า */}
        {/* แต่ถ้าต้องการ fallback ก็สามารถใส่ <link rel="icon" href="/pea_logo.png" /> ที่นี่ได้ */}
         <link rel="icon" href="/pea_logo.png" />
      </head>
      <body className="font-kanit bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 text-gray-800 min-h-screen flex flex-col">
        
        {!isAuthPage && <SiteNavbar />}

        <main className={`container mx-auto p-4 sm:p-6 ${!isAuthPage ? 'mt-6' : ''} flex-grow`}>
          {children}
        </main>

        {!isAuthPage && <SiteFooter />}

      </body>
    </html>
  );
}