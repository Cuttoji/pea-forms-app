// app/auth/register/page.tsx
"use client"; // This component uses client-side interactivity

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirecting after registration

// --- Supabase Configuration ---
// IMPORTANT: Replace with your actual Supabase URL and Anon Key if not using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Define a type for the Supabase client if you have it, otherwise use 'any'
type SupabaseClientType = any; // Replace 'any' with actual SupabaseClient type if available

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClientType>(null);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const router = useRouter();

  // Effect for loading Supabase client from CDN
  useEffect(() => {
    let checkSupabaseInterval: NodeJS.Timeout | null = null;
    let scriptRef: HTMLScriptElement | null = null; // Keep a reference to the script

    const initializeSupabase = () => {
      if (window.supabase) {
        if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
          try {
            const client = window.supabase.createClient(supabaseUrl, supabaseKey);
            setSupabaseClient(client);
            console.log("Supabase client initialized (Register Page).");
          } catch (e) {
            console.error("Error initializing Supabase client (Register Page):", e);
            setMessage('เกิดข้อผิดพลาดในการโหลด Supabase');
          }
        } else {
          console.warn("Supabase URL or Key is not configured (Register Page).");
          setMessage('Supabase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบ URL และ Key');
        }
        setSupabaseLoaded(true);
        if (checkSupabaseInterval) clearInterval(checkSupabaseInterval);
      }
    };

    if (window.supabase) {
      console.log("Supabase already available on window (Register Page).");
      initializeSupabase();
      return;
    }

    const scriptId = 'supabase-js-cdn';
    scriptRef = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (scriptRef) {
        console.log("Supabase script tag already exists (Register Page).");
        if (window.supabase) {
            initializeSupabase();
        } else {
            // Script exists but window.supabase not yet available, set up interval check
            // Use the existing scriptRef's onload if possible, or directly initialize
            if (scriptRef.onload === null && !scriptRef.dataset.initialized) { // Check if onload can be set
                scriptRef.onload = initializeSupabase;
                scriptRef.dataset.initialized = "true"; // Mark as initialized to avoid re-setting onload
            } else {
                 checkSupabaseInterval = setInterval(initializeSupabase, 100);
            }
        }
        return () => {
            if (checkSupabaseInterval) clearInterval(checkSupabaseInterval);
        };
    }

    scriptRef = document.createElement('script');
    scriptRef.id = scriptId;
    scriptRef.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    scriptRef.async = true;
    scriptRef.dataset.initialized = "true"; // Mark as initialized

    scriptRef.onload = initializeSupabase;

    scriptRef.onerror = () => {
      console.error("Error loading Supabase script from CDN (Register Page).");
      setSupabaseLoaded(true);
      setMessage('เกิดข้อผิดพลาดในการโหลด Supabase จาก CDN');
    };

    document.head.appendChild(scriptRef);

    return () => {
      if (checkSupabaseInterval) clearInterval(checkSupabaseInterval);
    };
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!supabaseLoaded) {
        setMessage("Supabase library กำลังโหลด กรุณารอสักครู่แล้วลองอีกครั้ง");
        setIsLoading(false);
        return;
    }

    if (!supabaseClient) {
      setMessage('Supabase client ยังไม่พร้อมใช้งาน กรุณาตรวจสอบการตั้งค่า');
      setIsLoading(false);
      return;
    }

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
      const { data, error } = await supabaseClient.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        console.error('Supabase sign up error:', error);
        setMessage(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      } else if (data.user) {
        let profileMessage = '';
        if (form.username && data.user.id) {
          const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert({ id: data.user.id, username: form.username, email: form.email });

          if (profileError) {
            console.error('Error saving profile:', profileError);
            profileMessage = ' แต่เกิดปัญหาในการบันทึกชื่อผู้ใช้: ' + profileError.message;
          }
        }
        
        if (data.session) {
            setMessage(`สมัครสมาชิกสำเร็จ!${profileMessage} กำลังนำคุณไปยังหน้าหลัก...`);
            console.log('Registered and logged in user:', data.user);
            setTimeout(() => {
              router.push('/');
            }, 2500);
        } else if (data.user && !data.session) {
            setMessage(`สมัครสมาชิกสำเร็จ!${profileMessage} กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี`);
        }
      } else {
        setMessage('เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการสมัครสมาชิก');
      }
    } catch (err: any) {
      console.error('Unexpected registration error:', err);
      setMessage(err.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
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
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm"
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
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm"
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
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm"
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
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm"
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
              disabled={isLoading || !supabaseLoaded || !supabaseClient}
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
