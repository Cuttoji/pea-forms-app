// app/(forms)/layout.jsx
"use client"; // ยังคงเป็น Client Component เพื่อใช้ usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ใช้งาน pathname

export default function FormsLayout({ children }) {
  const pathname = usePathname(); // ดึงค่า pathname ปัจจุบัน

  const formLinks = [
    { href: "/form/residential-inspection", label: "ฟอร์มที่อยู่อาศัย" },
    { href: "/form/commercial-inspection", label: "ฟอร์มอื่นๆ/เชิงพาณิชย์" },
    { href: "/form/condo-inspection", label: "ฟอร์มอาคารชุด" },
    { href: "/form/ev-charger-lv-inspection", label: "ฟอร์ม EV Charger (แรงต่ำ)" },
    { href: "/form/ev-charger-hv-inspection", label: "ฟอร์ม EV Charger (แรงสูง)" },
    { href: "/form/construction-inspection", label: "ฟอร์มตรวจสอบงานก่อสร้าง" },
  ];

  // ฟังก์ชันตรวจสอบ active link โดยใช้ pathname จาก usePathname
  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6"> {/* Mobile: column, Desktop: row */}
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-lg md:sticky md:top-24"> {/* Sticky เฉพาะบน Desktop */}
          <h2 className="text-xl font-semibold text-[#3a1a5b] mb-4 border-b pb-2">
            เลือกประเภทฟอร์ม
          </h2>
          <nav className="space-y-2">
            {formLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ease-in-out
                  hover:bg-purple-100 hover:text-[#5b2d90]
                  ${
                    isActive(link.href)
                      ? "bg-[#5b2d90] text-white shadow-md" // สไตล์สำหรับ active link
                      : "text-gray-700" // สไตล์สำหรับ link ปกติ
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-grow bg-white p-6 sm:p-8 rounded-xl shadow-xl min-h-[calc(100vh-10rem)]">
        {children}
      </main>
    </div>
  );
}