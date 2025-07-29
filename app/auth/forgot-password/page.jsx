'use client';

import React, { useState } from 'react';
import { createClient } from "@/lib/supabase/client"; // นำเข้า Supabase client
import { toast } from 'react-hot-toast'; // นำเข้า react-hot-toast สำหรับการแจ้งเตือน

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // เพิ่ม state สำหรับ loading
    const supabase = createClient(); // สร้าง Supabase client instance

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // เริ่ม loading
        setSubmitted(false); // รีเซ็ตสถานะ submitted ก่อนเรียก API

        try {
            // เรียก API ของ Supabase เพื่อส่งลิงก์รีเซ็ตรหัสผ่าน
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // หากต้องการ redirect หลังจากรีเซ็ต ให้ระบุ URL ที่นี่
                // redirectTo: 'http://localhost:3000/auth/update-password',
            });

            if (error) {
                console.error("Error sending reset password link:", error.message);
                toast.error("เกิดข้อผิดพลาด: " + error.message);
            } else {
                setSubmitted(true); // ตั้งค่า submitted เป็น true เมื่อส่งสำเร็จ
                toast.success("ตรวจสอบอีเมลของคุณสำหรับลิงก์รีเซ็ตรหัสผ่าน");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("เกิดข้อผิดพลาดที่ไม่คาดคิด");
        } finally {
            setIsLoading(false); // หยุด loading
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-800">
            <h2 className="text-3xl font-bold text-[#3a1a5b] mb-6 text-center">รีเซ็ตรหัสผ่าน</h2>

            {submitted ? (
                <div className="text-center p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                    <p className="text-lg">หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้คุณแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ</p>
                    <p className="text-sm mt-2 text-gray-600">ลิงก์จะหมดอายุภายในไม่กี่นาที</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            อีเมล
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            required
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#a78bfa] focus:border-[#a78bfa] transition-all duration-150 text-gray-900"
                            placeholder="ป้อนอีเมลของคุณ"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-base text-white bg-[#5b2d90] rounded-lg shadow-lg hover:bg-[#4a2575] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a78bfa] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                <span>กำลังส่ง...</span>
                            </>
                        ) : (
                            'ส่งลิงก์รีเซ็ตรหัสผ่าน'
                        )}
                    </button>
                    <p className="text-sm text-gray-600 text-center">
                        <span>กลับไปที่ </span>
                        <a href="/auth/login" className="text-[#5b2d90] hover:underline">
                            เข้าสู่ระบบ
                        </a>
                    </p>
                </form>
            )}
        </div>
    );
}