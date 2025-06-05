// app/auth/login/page.jsx
"use client"; // This component uses client-side interactivity (useState, useEffect, event handlers)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirecting after login

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For success or error messages
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('YOUR_SUPABASE_URL');
  const [supabaseKey, setSupabaseKey] = useState('YOUR_SUPABASE_ANON_KEY');
  const router = useRouter();

  useEffect(() => {
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL');
    setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY');
  }, []);

  // Effect for loading Supabase client from CDN
  useEffect(() => {
    let checkSupabaseInterval = null;
    let scriptElement = null;

    const initializeSupabase = () => {
      if (window.supabase) {
        if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
          try {
            const client = window.supabase.createClient(supabaseUrl, supabaseKey);
            setSupabaseClient(client);
            console.log("Supabase client initialized (Login Page).");
          } catch (e) {
            console.error("Error initializing Supabase client (Login Page):", e);
            setMessage('เกิดข้อผิดพลาดในการโหลด Supabase');
          }
        } else {
          console.warn("Supabase URL or Key is not configured (Login Page).");
          setMessage('Supabase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบ URL และ Key');
        }
        setSupabaseLoaded(true);
        if (checkSupabaseInterval) clearInterval(checkSupabaseInterval);
      }
    };

    if (window.supabase) {
      initializeSupabase();
      return;
    }

    const scriptId = 'supabase-js-cdn';
    scriptElement = document.getElementById(scriptId);

    if (scriptElement) {
      if (window.supabase) {
        initializeSupabase();
      } else if (scriptElement.onload === null && !scriptElement.dataset.initializedLogin) {
        scriptElement.onload = initializeSupabase;
        scriptElement.dataset.initializedLogin = "true";
      } else if (!scriptElement.dataset.initializedLogin) {
        checkSupabaseInterval = setInterval(initializeSupabase, 100);
      }
    } else {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; // CDN for Supabase v2
      scriptElement.async = true;
      scriptElement.dataset.initializedLogin = "true";
      scriptElement.onload = () => {
        initializeSupabase();
      };
      scriptElement.onerror = () => {
        setSupabaseLoaded(true);
        setMessage('เกิดข้อผิดพลาดในการโหลด Supabase จาก CDN');
      };
      document.head.appendChild(scriptElement);
    }

    return () => {
      if (checkSupabaseInterval) {
        clearInterval(checkSupabaseInterval);
      }
    };
  }, [supabaseUrl, supabaseKey]);


  const handleLogin = async (e) => {
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

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setMessage(error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (data.user) {
        setMessage('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage('เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการเข้าสู่ระบบ หรืออาจต้องการการยืนยันเพิ่มเติม');
      }
    } catch (err) {
      setMessage('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3a1a5b]">เข้าสู่ระบบ</h1>
          <p className="text-gray-600 mt-2">ยินดีต้อนรับกลับเข้าสู่ระบบฟอร์ม PEA</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              {/* แก้ไข: ลบ legacyBehavior และแท็ก <a> ที่ซ้อนอยู่ */}
              {/* Fix: Removed legacyBehavior and nested <a> tag */}
              <Link href="/auth/forgot-password" className="font-medium text-[#5b2d90] hover:text-[#3a1a5b] hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </div>
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#5b2d90] to-[#3a1a5b] hover:from-[#3a1a5b] hover:to-[#5b2d90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a78bfa] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{' '}
          {/* แก้ไข: ลบ legacyBehavior และแท็ก <a> ที่ซ้อนอยู่ */}
          {/* Fix: Removed legacyBehavior and nested <a> tag */}
          <Link href="/auth/register" className="font-medium text-[#5b2d90] hover:text-[#3a1a5b] hover:underline">
            สมัครสมาชิกที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}