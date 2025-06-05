// app/auth/login/page.jsx
"use client"; // This component uses client-side interactivity (useState, useEffect, event handlers)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirecting after login

// --- Supabase Configuration ---
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

  // Effect for loading Supabase client from CDN (แก้ไขแล้ว)
  useEffect(() => {
    let checkSupabaseInterval = null;
    let scriptElement = null; // ใช้ชื่อตัวแปรที่สื่อความหมายมากขึ้น

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
        if (checkSupabaseInterval) {
          clearInterval(checkSupabaseInterval);
          checkSupabaseInterval = null; // เคลียร์ค่า interval ด้วย
        }
      }
    };

    if (window.supabase) {
      console.log("Supabase already available on window (Login Page).");
      initializeSupabase();
      return; // ออกจาก useEffect หาก Supabase พร้อมใช้งานแล้ว
    }

    const scriptId = 'supabase-js-cdn'; // ID ของ script tag
    scriptElement = document.getElementById(scriptId);

    if (scriptElement) {
      console.log("Supabase script tag already exists (Login Page).");
      if (window.supabase) {
        // ถ้า window.supabase พร้อมใช้งานแล้ว (อาจจะโหลดเสร็จระหว่างการตรวจสอบ)
        initializeSupabase();
      } else if (!scriptElement.dataset.initializedLogin && typeof scriptElement.onload === 'function') {
        // ถ้า script tag มีอยู่แต่ window.supabase ยังไม่พร้อม และ onload ยังไม่ได้ถูกตั้งค่าโดยหน้านี้
        // (เช็คจาก dataset เพื่อป้องกันการตั้ง onload ซ้ำซ้อนถ้า script ถูกแชร์)
        // และ onload เป็น function (บางครั้งอาจเป็น null ถ้า script โหลดเสร็จแล้ว)
        console.log("Waiting for existing script to load (Login Page).");
        // Script กำลังโหลดอยู่ รอให้ onload ของมันทำงาน
        // หรือถ้า onload เป็น null และ window.supabase ยังไม่มา อาจจะต้องเริ่ม interval
        checkSupabaseInterval = setInterval(initializeSupabase, 100);

      } else if (!scriptElement.dataset.initializedLogin) {
        // กรณี script มีอยู่ แต่ onload อาจจะไม่ใช่ function หรือ dataset.initializedLogin ไม่ได้ถูกตั้ง
        // ให้ตั้ง onload ใหม่ถ้าจำเป็น หรือเริ่ม interval
        console.log("Setting onload for existing script or starting interval (Login Page).");
        scriptElement.onload = initializeSupabase;
        scriptElement.dataset.initializedLogin = "true"; // ทำเครื่องหมายว่าหน้านี้ได้พยายามตั้งค่าแล้ว
        if (!window.supabase) { // ถ้ายังไม่โหลด ให้เริ่ม interval
            checkSupabaseInterval = setInterval(initializeSupabase, 100);
        } else {
            initializeSupabase(); // ถ้าพร้อมแล้วก็ init เลย
        }
      } else {
        // Script มีอยู่ และ dataset.initializedLogin = true หมายความว่าหน้านี้เคยตั้งค่าไปแล้ว
        // หรืออาจจะถูกจัดการโดย instance อื่น หรือกำลังรอ initializeSupabase จาก interval
        if (!window.supabase) {
            console.log("Script already handled or waiting for interval (Login Page).");
            checkSupabaseInterval = setInterval(initializeSupabase, 100);
        } else {
            initializeSupabase();
        }
      }
    } else {
      // ถ้า script tag ยังไม่มี ให้สร้างขึ้นมาใหม่
      console.log("Creating new Supabase script tag (Login Page).");
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      scriptElement.async = true;
      scriptElement.dataset.initializedLogin = "true"; // ทำเครื่องหมายว่าถูกสร้างและจัดการโดยหน้านี้

      scriptElement.onload = () => {
        console.log("Newly created Supabase script loaded from CDN (Login Page).");
        initializeSupabase();
      };

      scriptElement.onerror = () => {
        console.error("Error loading Supabase script from CDN (Login Page).");
        setSupabaseLoaded(true);
        setMessage('เกิดข้อผิดพลาดในการโหลด Supabase จาก CDN');
      };

      document.head.appendChild(scriptElement);
    }

    return () => {
      // Cleanup function
      if (checkSupabaseInterval) {
        clearInterval(checkSupabaseInterval);
      }
      // ไม่ควรลบ script tag หรือ onload event handler ที่นี่
      // เพราะอาจจะมี component อื่นๆ ในหน้าเดียวกัน (หรือหน้ารวม) ที่ยังต้องการใช้ Supabase client
      // การจัดการ script ที่โหลดจาก CDN ให้ใช้ร่วมกันเป็นเรื่องที่ซับซ้อนเล็กน้อย
      // วิธีที่ดีที่สุดคือการโหลด script เพียงครั้งเดียวใน _app.js หรือ Layout หลักถ้าเป็นไปได้
      // หรือใช้ npm package '@supabase/supabase-js' โดยตรง
    };
  }, []); // Dependency array ว่างเปล่าเพื่อให้ useEffect ทำงานครั้งเดียวเมื่อ mount


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
          router.push('/'); // Redirect ไปหน้าหลัก
        }, 1500);
      } else {
        // กรณีนี้อาจเกิดขึ้นได้ยากสำหรับ signInWithPassword ถ้าสำเร็จควรมี user object
        // แต่ใส่ไว้เพื่อครอบคลุมกรณีที่ไม่คาดคิด
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
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
          <Link href="/auth/register" className="font-medium text-[#5b2d90] hover:text-[#3a1a5b] hover:underline">
            สมัครสมาชิกที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}