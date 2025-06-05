// app/auth/login/page.jsx
"use client"; // This component uses client-side interactivity (useState, useEffect, event handlers)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirecting after login

// --- Supabase Configuration ---
// IMPORTANT: Replace with your actual Supabase URL and Anon Key if not using environment variables
// It's highly recommended to use environment variables for these in a real application.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For success or error messages
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const router = useRouter();

  // Effect for loading Supabase client from CDN
  useEffect(() => {
    if (window.supabase) {
      console.log("Supabase already available on window (Login Page).");
      if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
        try {
          setSupabaseClient(window.supabase.createClient(supabaseUrl, supabaseKey));
          console.log("Supabase client initialized from existing window.supabase (Login Page).");
        } catch (e) {
          console.error("Error initializing Supabase client from existing window.supabase (Login Page):", e);
          setMessage('เกิดข้อผิดพลาดในการโหลด Supabase');
        }
      } else {
        console.warn("Supabase URL or Key is not configured (using existing window.supabase - Login Page).");
        setMessage('Supabase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบ URL และ Key');
      }
      setSupabaseLoaded(true);
      return;
    }

    const scriptId = 'supabase-js-cdn';
    if (document.getElementById(scriptId)) {
        console.log("Supabase script tag already exists (Login Page).");
        const checkSupabaseInterval = setInterval(() => {
            if (window.supabase) {
                clearInterval(checkSupabaseInterval);
                // Manually trigger onload logic if script was already there but window.supabase wasn't set yet
                if (script && typeof script.onload === 'function') {
                    script.onload();
                } else if (window.supabase) { // Fallback if script.onload is not accessible
                    console.log("Supabase script loaded from CDN (Login Page - detected via interval).");
                    if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
                        try {
                            setSupabaseClient(window.supabase.createClient(supabaseUrl, supabaseKey));
                            console.log("Supabase client initialized after CDN load (Login Page - interval).");
                        } catch (e) {
                            console.error("Error initializing Supabase client after CDN load (Login Page - interval):", e);
                            setMessage('เกิดข้อผิดพลาดในการโหลด Supabase');
                        }
                    } else {
                        console.warn("Supabase URL or Key is not configured after CDN load (Login Page - interval).");
                        setMessage('Supabase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบ URL และ Key');
                    }
                    setSupabaseLoaded(true);
                }
            }
        }, 100);
        // Cleanup interval on component unmount
        return () => clearInterval(checkSupabaseInterval);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; // CDN for Supabase v2
    script.async = true;

    script.onload = () => {
      console.log("Supabase script loaded from CDN (Login Page).");
      if (window.supabase) {
        if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
          try {
            setSupabaseClient(window.supabase.createClient(supabaseUrl, supabaseKey));
            console.log("Supabase client initialized after CDN load (Login Page).");
          } catch (e) {
             console.error("Error initializing Supabase client after CDN load (Login Page):", e);
             setMessage('เกิดข้อผิดพลาดในการโหลด Supabase');
          }
        } else {
          console.warn("Supabase URL or Key is not configured after CDN load (Login Page).");
          setMessage('Supabase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบ URL และ Key');
        }
      } else {
        console.error("Supabase object (window.supabase) not found after script load (Login Page).");
        setMessage('ไม่สามารถโหลด Supabase library ได้');
      }
      setSupabaseLoaded(true);
    };

    script.onerror = () => {
      console.error("Error loading Supabase script from CDN (Login Page).");
      setSupabaseLoaded(true);
      setMessage('เกิดข้อผิดพลาดในการโหลด Supabase จาก CDN');
    };

    document.head.appendChild(script);

    return () => {

    };
  }, []);


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
        console.error('Supabase login error:', error);
        setMessage(error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (data.user) {
        setMessage('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
        console.log('Logged in user:', data.user);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage('เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการเข้าสู่ระบบ');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
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