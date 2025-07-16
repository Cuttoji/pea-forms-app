import React, { useState } from 'react';

'use client';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: call API to send reset link
        setSubmitted(true);
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>รีเซ็ตรหัสผ่าน</h2>
            {submitted ? (
                <p>หากอีเมลนี้มีอยู่ในระบบ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้คุณ</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">อีเมล</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: 8, margin: '8px 0 16px 0', borderRadius: 4, border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 4, background: '#0070f3', color: '#fff', border: 'none' }}>
                        ส่งลิงก์รีเซ็ตรหัสผ่าน
                    </button>
                </form>
            )}
        </div>
    );
}