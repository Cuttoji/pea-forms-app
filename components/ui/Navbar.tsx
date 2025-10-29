"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Fragment, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { ChevronDown, Globe, Menu as MenuIcon, X, FileText, Building, Zap, LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

// รายการฟอร์มสำหรับเมนู
const formLinks = [
  { href: "/form/home-inspection", label: "แบบฟอร์มที่อยู่อาศัย", icon: <FileText size={16} /> },
  { href: "/form/other-inspection", label: "แบบฟอร์มอื่นๆ (นอกเหนือที่อยู่อาศัย)", icon: <FileText size={16} /> },
  { href: "/form/condo-inspection", label: "แบบฟอร์มอาคารรชุด (คอนโดมิเนียม)", icon: <Building size={16} /> },
  { href: "/form/ev-charger-lv-inspection", label: "แบบฟอร์ม EV CHARGER รับไฟฟ้าแรงต่ำจาก PEA", icon: <Zap size={16} /> },
  { href: "/form/ev-charger-hv-inspection", label: "แบบฟอร์ม EV CHARGER รับไฟฟ้าแรงสูงจาก PEA", icon: <Zap size={16} /> },
  { href: "/form/construction-inspection", label: "แบบฟอร์มระบบจำหน่ายของPEA", icon: <Building size={16} /> },
];

export default function SiteNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleAuthStateChange = useCallback((event: string, session: unknown) => {
    setUser((session as { user: User | null })?.user ?? null);
    if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => authListener?.subscription.unsubscribe();
  }, [supabase, handleAuthStateChange]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (href: string) => pathname === href;

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
                    isActive(link.href) ? 'bg-purple-100 text-[#5b2d90]' : 'text-gray-700 hover:bg-gray-100'
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
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                  <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-full hover:bg-gray-100 md:hidden" aria-label="Open menu">
                      <MenuIcon className="h-6 w-6 text-gray-600" />
                  </button>
                  <Link href="/" className="flex items-center gap-3">
                      <Image src="/pea_logo.png" alt="PEA Logo" width={48} height={48} />
                      <span className="text-lg font-semibold text-[#5b2d90]">PEA</span>
                  </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 ">
                  {user && (
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center gap-2 p-2 rounded-full hover:bg-yellow-700 hover:text-gray-800 text-gray-600 hover:text-white">
                        <UserIcon size={18} />
                        <span className="hidden sm:inline">{user.email}</span>
                        <ChevronDown size={16} />
                      </Menu.Button>
                       <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="p-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button onClick={() => router.push('/dashboard')} className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}>
                                    <Globe className="mr-2 h-5 w-5" aria-hidden="true" />
                                    Dashboard
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button onClick={handleLogout} className={`${active ? 'bg-red-50' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-700`}>
                                    <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                    ออกจากระบบ
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
              </div>
          </div>
        </div>
        <div className="bg-pea-primary text-white bg-[#5b2d90]">
          <div className="container mx-auto px-4 hidden md:flex items-center justify-center h-12 relative">
            <div className="flex items-center space-x-1">
                <Link href="/" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors">หน้าหลัก</Link>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors">Dashboard</Link>
                <Menu as="div" className="relative">
                    <Menu.Button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-pea-dark/50 transition-colors flex items-center">
                        <span>แบบฟอร์มตรวจสอบระบบไฟฟ้า</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                    </Menu.Button>
                     <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute left-0 mt-2 w-64 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black/5 text-gray-800 focus:outline-none">
                            <div className="p-1">
                                {formLinks.map(link => (
                                    <Menu.Item key={link.href}>
                                        {({ active }) => ( <Link href={link.href} className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm`}>{link.icon} {link.label}</Link> )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
          </div>
        </div>
      </header>
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