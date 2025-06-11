"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Fragment } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { ChevronDown, Globe, Search, Menu as MenuIcon, X, FileText, Building, Zap } from 'lucide-react';

{/*const serviceLinks = [
  { href: "/news", label: "ข่าวประชาสัมพันธ์" },
  { href: "/procurement", label: "ประกาศจัดซื้อจัดจ้าง" },
  { href: "/ita", label: "การเปิดเผยข้อมูลสาธารณะ (ITA)" },
  // เพิ่มลิงก์อื่นๆ ตามต้องการ
];*/}

// รายการฟอร์มสำหรับเมนู
const formLinks = [
  { href: "/form/residential-inspection", label: "ฟอร์มที่อยู่อาศัย", icon: <FileText size={16} /> },
  { href: "/form/condo-inspection", label: "ฟอร์มอาคารชุด", icon: <Building size={16} /> },
  { href: "/form/ev-charger-lv-inspection", label: "ฟอร์ม EV Charger", icon: <Zap size={16} /> },
];


export default function SiteNavbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ✅ 1. เพิ่ม State สำหรับจัดการการแสดงผล Navbar
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (href) => pathname === href;

  // คอมโพเนนต์เมนูลิงก์สำหรับ Mobile Sidebar
  const MobileFormLinksMenu = () => (
    <nav className="flex flex-col space-y-1 mt-4">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:bg-gray-100 p-3 rounded-md">หน้าหลัก</Link>
        <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-[#5b2d90] uppercase tracking-wider">แบบฟอร์ม</h3>
        {formLinks.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(link.href) ? 'bg-pea-primary text-gray-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                {link.icon}
                <span>{link.label}</span>
            </Link>
        ))}
    </nav>
  );

  return (
    <>
      <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-40">
        {/* Top Bar */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
              {/* Left Section: Mobile Menu & Logo */}
              <div className="flex items-center gap-2">
                  <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-full hover:bg-gray-100 md:hidden" aria-label="Open menu">
                      <MenuIcon className="h-6 w-6 text-gray-600" />
                  </button>
                  <Link href="/" className="flex items-center gap-3">
                      <Image src="/pea_logo.png" alt="PEA Logo" width={48} height={48} />
                      <span className="text-lg font-semibold text-[#5b2d90]">PEA Forms</span>
                  </Link>
              </div>
              {/* Top Right Menu */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <Link href="#" className="hover:text-pea-primary p-2 rounded-full hover:bg-gray-100"><Globe size={18} /></Link>
                  <Link href="#" className="hover:text-pea-primary p-2 rounded-full hover:bg-gray-100">TH</Link>
                  <Link href="#" className="hover:text-pea-primary p-2 rounded-full hover:bg-gray-100"><Search size={18} /></Link>
                  <button onClick={handleLogout} className="hover:text-pea-primary p-2 rounded-full hover:bg-red-400">Logout</button>
              </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-pea-primary text-white bg-[#5b2d90]">
          <div className="container mx-auto px-4 hidden md:flex items-center justify-center h-12 relative">
            <div className="flex items-center space-x-1">
                <Link href="/" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors">หน้าหลัก</Link>

                {/* ตัวอย่างเมนู Dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors flex items-center">
                        <span>ฟอร์ม</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                    </Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute left-0 mt-2 w-64 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black/5 text-gray-800 focus:outline-none">
                            <div className="p-1">
                                {formLinks.map(link => (
                                    <Menu.Item key={link.href}>
                                        {({ active }) => ( <Link href={link.href} className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm`}>{link.label}</Link> )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
                
                {/* ลิงก์เมนูอื่นๆ 
                <Link href="/forms" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors">สำหรับลูกค้า</Link>
                <Link href="/about" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors">เกี่ยวกับเรา</Link>
                <Link href="/contact" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors">ติดต่อเรา</Link>
            */}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar (Slide-out menu) */}
      <Transition show={isMobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setIsMobileMenuOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 bg-white">
                 <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button type="button" className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                <div className="flex-1 p-4">
                  <MobileFormLinksMenu />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}