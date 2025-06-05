// app/ui/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-[#5b2d90] to-[#3a1a5b] text-white p-4 shadow-lg sticky top-0 z-50"> {/* */}
      <div className="container mx-auto flex justify-between items-center"> {/* */}
        <Link href="/" className="text-2xl font-bold hover:text-purple-300 transition-colors duration-300 ease-in-out flex items-center"> {/* */}
          <img src="/pea_logo.png" alt="PEA Logo" className="h-8 w-auto mr-3"/> {/* */}
          ระบบฟอร์ม PEA {/* */}
        </Link>
        <div className="space-x-4"> {/* */}
          <Link href="/" className="hover:text-purple-300 transition-colors">หน้าหลัก</Link> {/* */}
          <Link href="/auth/login" className="hover:text-purple-300 transition-colors">Logout</Link>
          {/* คุณสามารถเพิ่มลิงก์ Login/Logout หรือ Profile ที่นี่ได้ โดยอาจจะต้องรับ props เพิ่มเติม */}
        </div>
      </div>
    </nav>
  );
}