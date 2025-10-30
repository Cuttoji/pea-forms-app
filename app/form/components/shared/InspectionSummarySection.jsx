import React from "react";

export default function InspectionSummarySection({ value = "", onChange = () => {} }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden mb-6">
      {/* Header Section */}
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">3. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</h2>
        </div>
      </div>

      {/* Content Area - ลบ grid ออกจาก div นี้ */}
      <div className="px-6 py-6 space-y-6 text-gray-700">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800 mb-4">ผลการตรวจสอบ</h3>

          {/* ปรับปรุง: ใช้ Grid Layout ที่นี่เพื่อให้ 3 ตัวเลือกมีขนาดเท่ากัน */}
          {/* grid-cols-1 สำหรับมือถือ และ sm:grid-cols-3 สำหรับหน้าจอใหญ่ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> 

            {/* ตัวเลือกที่ 1: ติดตั้งเรียบร้อย (Complete) */}
            <label className="flex items-center p-4 border border-gray-200 rounded-xl shadow-sm hover:bg-green-50 cursor-pointer transition-all duration-200">
              <input
                type="radio"
                name="summaryType"
                value="complete"
                checked={value === "complete"}
                onChange={() => onChange("complete")}
                className="text-green-600 focus:ring-green-500 h-5 w-5 border-gray-300"
              />
              <div className="ml-4">
                <span className="text-green-700 font-medium text-base">ติดตั้งมิเตอร์ถาวร</span>
              </div>
            </label>

            {/* ตัวเลือกที่ 2: ติดตั้งมิเตอร์ชั่วคราว (Minor Incomplete) */}
            <label className="flex items-center p-4 border border-gray-200 rounded-xl shadow-sm hover:bg-yellow-50 cursor-pointer transition-all duration-200">
              <input
                type="radio"
                name="summaryType"
                value="incomplete_minor"
                checked={value === "incomplete_minor"}
                onChange={() => onChange("incomplete_minor")}
                className="text-yellow-600 focus:ring-yellow-500 h-5 w-5 border-gray-300"
              />
              <div className="ml-4">
                <span className="text-yellow-700 font-medium text-base">ติดตั้งมิเตอร์ชั่วคราว</span>
              </div>
            </label>

            {/* ตัวเลือกที่ 3: ต้องปรับปรุงแก้ไข (Reject) */}
            <label className="flex items-center p-4 border border-gray-200 rounded-xl shadow-sm hover:bg-red-50 cursor-pointer transition-all duration-200">
              <input
                type="radio"
                name="summaryType"
                value="incomplete_reject"
                checked={value === "incomplete_reject"}
                onChange={() => onChange("incomplete_reject")}
                className="text-red-600 focus:ring-red-500 h-5 w-5 border-gray-300"
              />
              <div className="ml-4">
                <span className="text-red-700 font-medium text-base">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์ </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
