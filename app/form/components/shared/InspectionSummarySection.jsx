import React from "react";

export default function InspectionSummarySection({ value = "", onChange = () => {} }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">3. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 text-gray-700">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800 mb-4">ผลการตรวจสอบ</h3>
          
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="summaryType"
                value="complete"
                checked={value === "complete"}
                onChange={() => onChange("complete")}
                className="text-green-600 focus:ring-green-500 h-4 w-4"
              />
              <div className="ml-3">
                <span className="text-green-700 font-medium">✓ ติดตั้งเรียบร้อย</span>
                <div className="text-sm text-gray-600 mt-1">
                  ระบบไฟฟ้าผ่านการตรวจสอบเรียบร้อยแล้ว สามารถติดตั้งมิเตอร์ได้
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="summaryType"
                value="incomplete_minor"
                checked={value === "incomplete_minor"}
                onChange={() => onChange("incomplete_minor")}
                className="text-yellow-600 focus:ring-yellow-500 h-4 w-4"
              />
              <div className="ml-3">
                <span className="text-yellow-700 font-medium">⚠ ติดตั้งไม่เรียบร้อย</span>
                <div className="text-sm text-gray-600 mt-1">
                  ระบบไฟฟ้ามีข้อบกพร่องเล็กน้อย ต้องแก้ไข
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="summaryType"
                value="incomplete_reject"
                checked={value === "incomplete_reject"}
                onChange={() => onChange("incomplete_reject")}
                className="text-red-600 focus:ring-red-500 h-4 w-4"
              />
              <div className="ml-3">
                <span className="text-red-700 font-medium">✗ ต้องปรับปรุงเพิ่มเติมตามข้อแนะนำ</span>
                <div className="text-sm text-gray-600 mt-1">
                  ระบบไฟฟ้ามีข้อบกพร่องที่ต้องแก้ไขก่อนติดตั้งมิเตอร์
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}