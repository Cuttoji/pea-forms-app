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
                2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล (เช่น บ้านอยู่อาศัย กิจการขนาดเล็ก หรืออาคารที่คล้ายคลึงกัน)
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
                2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ (สถานีอัดประจุยานยนต์ไฟฟ้า ร้านอาหาร ร้านค้า ร้านสะดวกซื้อ
 ถนนสาธารณะ หรืออาคารที่คล้ายคลึงกัน) ต้องมีเอกสารประกอบการตรวจสอบดังต่อไปนี้ 
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            รายการเอกสาร{areaType === "public" ? " (สำหรับพื้นที่สาธารณะ)" : " (สำหรับพื้นที่ส่วนบุคคล)"}
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
        </div>
      </section>
    </div>
  );
}