// app/ui/Navbar.tsx
"use client"; // ทำให้เป็น Client Component

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SiteNavbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login'); // ไปยังหน้า login หลังจาก logout
  };

  return (
    <nav className="bg-gradient-to-r from-[#5b2d90] to-[#3a1a5b] text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-purple-300 transition-colors duration-300 ease-in-out flex items-center">
          <Image 
            src="/pea_logo.png" 
            alt="PEA Logo" 
            width={32} 
            height={32} 
            className="h-8 w-auto mr-3"
          />
          ระบบฟอร์ม PEA
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-purple-300 transition-colors text-sm sm:text-base">หน้าหลัก</Link>
          
          {loading ? (
            <div className="h-5 w-24 bg-gray-500/30 rounded-md animate-pulse"></div>
          ) : user ? (
            <>
              <span className="text-sm text-purple-200 hidden sm:block">{user.email}</span>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 px-3 py-1.5 text-sm rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-purple-300 transition-colors text-sm sm:text-base">เข้าสู่ระบบ</Link>
              <Link 
                href="/auth/register" 
                className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-sm rounded-md transition-colors"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}