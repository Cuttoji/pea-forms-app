// app/(forms)/layout.jsx
// Layout นี้จะถูกใช้สำหรับทุกหน้าที่อยู่ใน Route Group (forms)
// This layout will be used for all pages within the (forms) Route Group.

// "use client"; // uncomment if you need client-side interactivity in this layout
import Link from 'next/link';
// import { usePathname } from 'next/navigation'; // Uncomment if client component

export default function FormsLayout({ children }) {
  // const pathname = usePathname(); // Get current path to highlight active link

  const formLinks = [
    { href: "/residential-inspection", label: "ฟอร์มที่อยู่อาศัย" },
    { href: "/commercial-inspection", label: "ฟอร์มอื่นๆ/เชิงพาณิชย์" },
    { href: "/condo-inspection", label: "ฟอร์มอาคารชุด" },
    { href: "/ev-charger-lv-inspection", label: "ฟอร์ม EV Charger (แรงต่ำ)" },
    { href: "/ev-charger-hv-inspection", label: "ฟอร์ม EV Charger (แรงสูง)" },
    { href: "/construction-inspection", label: "ฟอร์มตรวจสอบงานก่อสร้าง" },
  ];

  // Function to determine if a link is active (basic client-side check)
  // For server components, active state needs a different approach or can be omitted for simplicity
  const isActive = (href: string) => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === href;
    }
    return false;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-lg sticky top-24"> {/* Adjust top-X based on your main navbar height */}
          <h2 className="text-xl font-semibold text-[#3a1a5b] mb-4 border-b pb-2">
            เลือกประเภทฟอร์ม
          </h2>
          <nav className="space-y-2">
            {formLinks.map((link) => (
              // แก้ไข: ลบ legacyBehavior และแท็ก <a> ที่ซ้อนอยู่
              // Fix: Removed legacyBehavior and nested <a> tag
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ease-in-out
                  hover:bg-purple-100 hover:text-[#5b2d90]
                  ${
                    // This active check will only work reliably if this layout becomes a client component
                    // or if you pass the current pathname down from the page.
                    isActive(link.href)
                      ? "bg-[#5b2d90] text-white shadow-md"
                      : "text-gray-700"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-grow bg-white p-6 sm:p-8 rounded-xl shadow-xl min-h-[calc(100vh-10rem)]">
        {children}
      </div>
    </div>
  );
}
