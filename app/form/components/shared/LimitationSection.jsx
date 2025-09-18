import React from "react";

export default function LimitationSection({ value = "", onChange = () => {} }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden ">
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">ขอบเขตและข้อจำกัด</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 text-gray-700">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800">รายละเอียดขอบเขตและข้อจำกัด</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <textarea
              className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500"
              rows={4}
              placeholder="ระบุขอบเขตหรือข้อจำกัดของการตรวจสอบ เช่น พื้นที่ที่ไม่สามารถเข้าตรวจสอบได้ หรือข้อจำกัดทางเทคนิค (ถ้ามี)..."
              value={value}
              onChange={e => onChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}