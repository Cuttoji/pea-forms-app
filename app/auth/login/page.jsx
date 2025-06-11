"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // ใช้ helper ที่สร้างไว้

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      // ✅ ไม่ต้องใช้ router.push('/') ที่นี่แล้ว
      // เมื่อ sign in สำเร็จ onAuthStateChange ใน Navbar จะทำงาน
      // และ Middleware จะจัดการ redirect ในการโหลดหน้าครั้งต่อไป
      // เราสามารถใช้ router.refresh() เพื่อกระตุ้นการทำงานของ middleware ทันที
      router.refresh();

    } catch (error) {
      console.error('Supabase login error:', error);
      setMessage(error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3a1a5b]">เข้าสู่ระบบ</h1>
          <p className="text-gray-600 mt-2">ยินดีต้อนรับกลับเข้าสู่ระบบฟอร์ม PEA</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="text-gray-900 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b2d90]" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-900 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b2d90]" placeholder="••••••••" />
          </div>

          {message && (
            <p className={`text-sm text-center font-medium ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#5b2d90] to-[#3a1a5b] hover:from-[#3a1a5b] hover:to-[#5b2d90] disabled:opacity-50 transition-all">
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{' '}
          <Link href="/auth/register" className="font-medium text-[#5b2d90] hover:text-[#3a1a5b] hover:underline">
            สมัครสมาชิกที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}