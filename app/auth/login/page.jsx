"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast'; // นำเข้า react-hot-toast

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // ✅ เพิ่ม state สำหรับข้อความผิดพลาดในฟอร์ม
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // ✅ เคลียร์ข้อความผิดพลาดเดิมเมื่อพยายามเข้าสู่ระบบใหม่
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      
      toast.success('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนเส้นทาง...');
      router.refresh();

    } catch (error) {
      console.error('Supabase login error:', error);
      // ✅ ตรวจสอบและตั้งค่าข้อความผิดพลาดที่เฉพาะเจาะจง
      if (error.message === 'Invalid login credentials') {
        setErrorMessage('รหัสไม่ถูกต้อง กรุณาใส่อีกครั้ง');
      } else {
        // สำหรับข้อผิดพลาดอื่นๆ ที่ไม่ใช่ credential
        setErrorMessage(''); // ตรวจสอบให้แน่ใจว่าไม่มีข้อความเก่าค้างอยู่
        toast.error(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
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
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="text-gray-900 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b2d90]" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="text-gray-900 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b2d90]" 
              placeholder="••••••••" 
            />
          </div>

          {/* ✅ แสดงข้อความผิดพลาดเฉพาะในฟอร์ม (ถ้ามี) */}
          {errorMessage && (
            <p className="text-sm text-center font-medium text-red-600">
              {errorMessage}
            </p>
          )}

          <div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#5b2d90] to-[#3a1a5b] hover:from-[#3a1a5b] hover:to-[#5b2d90] disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                  <>
                      <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <span>กำลังเข้าสู่ระบบ...</span>
                  </>
              ) : (
                  'เข้าสู่ระบบ'
              )}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ลืมรหัสผ่าน?{' '}
          <Link href="/auth/forgot-password" className="font-medium text-[#5b2d90] hover:text-[#3a1a5b] hover:underline">
            กู้คืนที่นี่
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{' '}
          <Link href="/auth/register" className="font-medium text-[#5b2d90] hover:text-[#3a1a5b] hover:underline">
            สมัครสมาชิกที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}