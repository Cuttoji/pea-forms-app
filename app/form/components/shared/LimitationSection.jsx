import React from "react";

export default function LimitationSection({ value = "", onChange = () => {} }) {
  return (
    <section className="border rounded-xl p-4 bg-white mb-6">
      <h2 className="font-bold text-lg mb-4">ขอบเขตและข้อจำกัด</h2>
      <textarea
        className="w-full border p-2 min-h-[80px] text-sm"
        placeholder="กรอกขอบเขตหรือข้อจำกัดของการตรวจสอบ (ถ้ามี)..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </section>
  );
}