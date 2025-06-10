// app/auth/register/page.tsx
"use client"; // This component uses client-side interactivity

import React, { useState } from 'react'; // ไม่จำเป็นต้องใช้ useEffect ที่นี่แล้ว
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ยังคงเก็บไว้เผื่อต้องการ redirect ในอนาคต

// ไม่จำเป็นต้องมีการตั้งค่า Supabase URL/Key หรือ SupabaseClientType ที่นี่
// หากการทำงานทั้งหมดสำหรับการสมัครสมาชิกผ่าน API route

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      setMessage('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      setIsLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          username: form.username,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // result.error มาจาก NextResponse.json({ error: ... }) ใน API route
        setMessage(result.error || `เกิดข้อผิดพลาด: ${response.statusText}`);
      } else {
        // result.message และ result.user มาจาก NextResponse.json({ message: ..., user: ... })
        setMessage(result.message || 'สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี');
        console.log('Registration API success:', result.user);
      }
    } catch (err: any) {
      console.error('API call error:', err);
      setMessage(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3a1a5b]">สร้างบัญชีใหม่</h1>
          <p className="text-gray-600 mt-2">เข้าร่วมระบบฟอร์ม PEA วันนี้</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm text-gray-900"
              placeholder="เลือกชื่อผู้ใช้งานของคุณ"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              อีเมล
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm text-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              รหัสผ่าน
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm text-gray-900"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              ยืนยันรหัสผ่าน
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm text-gray-900"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
            />
          </div>

          {message && (
            <p className={`text-sm text-center ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading} // ปรับเงื่อนไข disabled ที่นี่
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'สมัครสมาชิก'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/auth/login" className="font-medium text-[#5b2d90] hover:text-[#3a1a5b] hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}