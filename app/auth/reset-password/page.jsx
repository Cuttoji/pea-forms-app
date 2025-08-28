'use client';

import React, { useState } from 'react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // สมมติว่ามี token และ email ใน query string เช่น /reset-password?token=xxxx&email=someone@pea.co.th
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const token = searchParams ? searchParams.get('token') : '';
    const email = searchParams ? searchParams.get('email') : '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!email) {
            setMessage('ไม่พบอีเมลสำหรับรีเซ็ตรหัสผ่าน');
            return;
        }
        if (!password || !confirmPassword) {
            setMessage('กรุณากรอกรหัสผ่านให้ครบถ้วน');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('รหัสผ่านไม่ตรงกัน');
            return;
        }
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password, email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('รีเซ็ตรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบใหม่');
            } else {
                setMessage(data.message || 'เกิดข้อผิดพลาด');
            }
        } catch {
            setMessage('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    {email && (
                        <div className="mb-4">
                            <span className="text-base font-semibold text-[#5b2d90]">
                                อีเมลที่ต้องการรีเซ็ตรหัสผ่าน:
                            </span>
                            <div className="mt-1 text-lg font-bold text-[#3a1a5b] break-all">{email}</div>
                        </div>
                    )}
                    <h2 className="text-3xl font-bold text-[#3a1a5b] mb-2">
                        รีเซ็ตรหัสผ่าน
                    </h2>
                    <p className="text-gray-600">
                        กรอกรหัสผ่านใหม่ของคุณ
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            รหัสผ่านใหม่
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm text-gray-900 bg-gray-50"
                            placeholder="กรอกรหัสผ่านใหม่"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ยืนยันรหัสผ่านใหม่
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b2d90] focus:border-[#5b2d90] sm:text-sm text-gray-900 bg-gray-50"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            required
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
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'รีเซ็ตรหัสผ่าน'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}