// app/(forms)/layout.jsx
// Layout นี้จะถูกใช้สำหรับทุกหน้าที่อยู่ใน Route Group (forms)

// "use client"; // uncomment if you need client-side interactivity in this layout (e.g., state, effects for a sub-menu)
import Link from 'next/link';
// import { usePathname } from 'next/navigation'; // Uncomment if you want to highlight active link

export default function FormsLayout({ children }) {
  // const pathname = usePathname(); // Get current path to highlight active link

  // ตัวอย่างรายการฟอร์มสำหรับ Sub-navigation
  const formLinks = [
    { href: "/ระบบจำหน่าย PEA", label: "ระบบจำหน่าย PEA" },
    { href: "/Home_check", label: "ฟอร์มที่อยู่อาศัย" },
    { href: "/condo_check", label: "ฟอร์มคอนโด" },
    { href: "/Other_check", label: "ฟอร์มอื่นๆ/เชิงพาณิชย์" },
    { href: "/HV_charger_check", label: "ฟอร์ม EV Charger (แรงต่ำ)" },
    { href: "/LV_charger_check", label: "ฟอร์ม EV Charger (แรงสูง)" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sub-navigation Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-lg sticky top-24">
          <h2 className="text-xl font-semibold text-[#3a1a5b] mb-4 border-b pb-2">
            เลือกประเภทฟอร์ม
          </h2>
          <nav className="space-y-2">
            {formLinks.map((link) => (
              <Link key={link.href} href={link.href} legacyBehavior>
                <a
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ease-in-out
                    hover:bg-purple-100 hover:text-[#5b2d90]
                    ${
                      typeof window !== 'undefined' && window.location.pathname === link.href // Basic active link check (client-side only)
                        ? "bg-[#5b2d90] text-white shadow-md"
                        : "text-gray-700"
                    }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Form Content Area */}
      <div className="flex-grow bg-white p-6 sm:p-8 rounded-xl shadow-xl min-h-[calc(100vh-10rem)]"> {/* Ensure content area takes up space */}
        {children} {/* เนื้อหาของแต่ละหน้าฟอร์มจะถูกแสดงที่นี่ (Content of each form page will be rendered here) */}
      </div>
    </div>
  );
}
