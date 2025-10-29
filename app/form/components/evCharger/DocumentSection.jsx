import React, { useState } from "react";

/**
 * DocumentSection - Government form style UI/UX
 * Props:
 * - value: object
 * - onChange: (newValue) => void
 */
const personalOptions = [
  {
    key: "spec",
    label:
      "สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ",
  },
  {
    key: "singleLine",
    label: "แผนผังระบบไฟฟ้า (Single Line Diagram) (ถ้ามี)",
  },
  {
    key: "loadSchedule",
    label: "ตารางโหลด (Load Schedule) (ถ้ามี)",
  },
];

const publicOptions = [
  {
    key: "singleLine",
    label:
      "แผนผังระบบไฟฟ้า (Single Line Diagram) ระบุพิกัดของอุปกรณ์ต่างๆ วิธีการเดินสาย รายละเอียดท่อร้อยสาย รวมถึงระบบต่อลงดิน อย่างครบถ้วน โดยมีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง",
  },
  {
    key: "asBuilt",
    label:
      "แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่มีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง",
  },
  {
    key: "loadSchedule",
    label:
      "ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า ที่มีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง",
  },
  {
    key: "licenceCopy",
    label: "สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรมไฟฟ้า",
  },
  {
    key: "spec",
    label:
      "สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ",
  },
  {
    key: "peaLicence",
    label:
      "หนังสือจดแจ้ง (พิกัดน้อยกว่า 1,000 kVA) หรือใบอนุญาต (พิกัดตั้งแต่ 1,000 kVA ขึ้นไป) เพื่อประกอบกิจการสถานีอัดประจุยานยนต์ไฟฟ้าจากสำนักงานกำกับกิจการพลังงาน (สกพ.)",
  },
];

export default function DocumentSection({
  value = {},
  onChange = () => {},
}) {
  const [areaType, setAreaType] = useState(value.areaType || "personal");

  // Handle area type change
  const handleAreaType = (type) => {
    setAreaType(type);
    // Reset document selections when changing area type, but keep areaType and completion status
    onChange({
      areaType: type,
      isComplete: value.isComplete,
      notCompleteDetail: value.notCompleteDetail
    });
  };

  // Handle field changes
  const handleField = (key, fieldValue) => {
    onChange({ ...value, areaType, [key]: fieldValue });
  };

  // Handle detail changes
  const handleDetail = (detail) => {
    onChange({ ...value, areaType, notCompleteDetail: detail });
  };

  const options = areaType === "public" ? publicOptions : personalOptions;

  return (
    <div className="space-y-8 mt-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า</h2>
        <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 mb-6"></div>
      </div>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">ประเภทพื้นที่</h3>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-6 mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="areaType"
                value="personal"
                checked={areaType === "personal"}
                onChange={() => handleAreaType("personal")}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 group-hover:border-blue-400"
              />
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                ใช้ส่วนบุคคล
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="areaType"
                value="public"
                checked={areaType === "public"}
                onChange={() => handleAreaType("public")}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 group-hover:border-blue-400"
              />
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                ใช้สาธารณะ
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            รายการเอกสาร{areaType === "public" ? " (สำหรับใช้สาธารณะ)" : " (สำหรับใช้ส่วนบุคคล)"}
          </h3>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            {options.map((opt, idx) => (
              <div key={`${areaType}-${opt.key}`} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={!!value[opt.key]}
                  onChange={(e) => handleField(opt.key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded mt-1 flex-shrink-0"
                />
                <span className="text-gray-700 leading-relaxed text-sm">
                  {opt.label}
                </span>
              </div>
            ))}
          </div>

          {/* Completion Status */}
          <div className="border-t border-gray-200 pt-6 text-gray-900">
            <h4 className="text-base font-medium text-gray-800 mb-4">สถานะความครบถ้วนของเอกสาร</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group p-3 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors">
                <input
                  type="radio"
                  name="isComplete"
                  value="ครบถ้วน"
                  checked={value.isComplete === "ครบถ้วน"}
                  onChange={() => handleField("isComplete", "ครบถ้วน")}
                  className="w-4 h-4 text-green-600 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 flex-shrink-0"
                />
                <span className="text-gray-800 font-medium group-hover:text-green-700">
                  ครบถ้วน
                </span>
              </label>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group p-3 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                  <input
                    type="radio"
                    name="isComplete"
                    value="ไม่ครบถ้วน"
                    checked={value.isComplete === "ไม่ครบถ้วน"}
                    onChange={() => handleField("isComplete", "ไม่ครบถ้วน")}
                    className="w-4 h-4 text-red-600 border-2 border-gray-300 focus:ring-2 focus:ring-red-500 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-800 font-medium group-hover:text-red-700">
                    ไม่ครบถ้วน ระบุ
                  </span>
                </label>
                
                {value.isComplete === "ไม่ครบถ้วน" && (
                  <div className="ml-8">
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      placeholder="โปรดระบุรายละเอียดเอกสารที่ยังไม่ครบถ้วน..."
                      rows="3"
                      value={value.notCompleteDetail || ""}
                      onChange={(e) => handleDetail(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <strong className="font-semibold">หมายเหตุ:</strong> โปรดตรวจสอบเอกสารให้ครบถ้วนตามรายการที่กำหนด
                เพื่อให้การตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าเป็นไปอย่างราบรื่น
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}