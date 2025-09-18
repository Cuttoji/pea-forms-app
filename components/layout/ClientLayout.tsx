"use client";

import { usePathname } from 'next/navigation';
import SiteNavbar from '@/components/ui/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth/');

  return (
    <>
      {!isAuthPage && <SiteNavbar />}
      <main className={`container mx-auto p-4 sm:p-6 ${!isAuthPage ? 'mt-6' : ''} flex-grow`}>
        {children}
      </main>
    </>
  );
}
