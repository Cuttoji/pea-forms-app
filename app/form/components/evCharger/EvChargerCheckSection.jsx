import React from "react";

// Helper ถูกต้อง/ต้องแก้ไข
function CorrectableRow({ label, value, onChange, detail = false, placeholder = "ระบุรายละเอียดที่ต้องแก้ไข..." }) {
  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0 text-gray-700">
      <div className="text-sm text-gray-700 mb-2">{label}</div>
      <div className="flex items-start gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value?.result === "ถูกต้อง"}
            onChange={() => onChange({ ...value, result: "ถูกต้อง", detail: "" })}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-sm text-green-700">ถูกต้อง</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value?.result === "ต้องแก้ไข"}
            onChange={() => onChange({ ...value, result: "ต้องแก้ไข" })}
            className="w-4 h-4 text-red-600"
          />
          <span className="text-sm text-red-700">ต้องแก้ไข</span>
        </label>
        {value?.result === "ต้องแก้ไข" && detail && (
          <input
            type="text"
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
            value={value?.detail || ""}
            onChange={e => onChange({ ...value, detail: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}

/**
 * SubCircuitSection
 * @param {number} sectionNumber เลขหัวข้อหลัก เช่น 3 หรือ 5 (3.6, 5.6)
 * @param {array} value array วงจรย่อย (แต่ละอันเป็น obj)
 * @param {function} onChange (newArr) => void
 * 
 * รองรับ loop, ใส่ใน loop ของหม้อแปลงหรืออื่นๆ ได้
 */
// EV Charger Section (loop)
function EvChargerCheckSection({ value = [], onChange = () => {} }) {
  // รองรับ value เป็น object หรือ array
  const isArray = Array.isArray(value);
  const chargers = isArray ? value : value ? [value] : [];

  // เพิ่มเครื่องอัดประจุ
  const addCharger = () => {
    const newCharger = {
      product: "",
      model: "",
      serial: "",
      ip: "",
      phase: "",
      portCount: "",
      totalKW: "",
      inputA: "",
      mode: [],
      infoCheck: {},
      acType2: false,
      acType2A: "",
      acType2V: "",
      acType2KW: "",
      dcCHAdeMO: false,
      dcCHAdeMOA: "",
      dcCHAdeMOV: "",
      dcCHAdeMOKW: "",
      dcCCS: false,
      dcCCSA: "",
      dcCCSV: "",
      dcCCSKW: "",
      otherType: false,
      otherTypeLabel: "",
      otherTypeA: "",
      otherTypeV: "",
      otherTypeKW: "",
      parallel: false,
      parallelPort: "",
      parallelDesc: "",
      chargeTypeCheck: {},
      mode2SocketGround: {},
      mode2SocketFixed: {},
      mode2SocketSign: {},
      mode34WarnSign: {},
      mode34EmergencySwitch: {},
      mode34VentSign: {},
      mode34CableLen: {},
      stationMode3or4: {},
      stationHasFixedCable: {},
      stationEmergencySwitch: {},
      stationEmergencyDist: {},
      stationEquipmentLaw: {},
      stationEVSpacingLaw: {},
      protectCrash: {},
      protectFire: {},
      protectLightning: {}
    };
    const next = [...chargers, newCharger];
    onChange(isArray ? next : newCharger);
  };

  // ลบเครื่องอัดประจุ
  const removeCharger = (idx, evIdx) => {
    const evChargers = value[idx].evChargers || [];
    const newEvChargers = evChargers.filter((_, i) => i !== evIdx);
    handleSub(idx, "evChargers", newEvChargers);
  };

  // แก้ไขค่าในแต่ละ ev charger
  const handleCharger = (idx, key, v) => {
    const newArr = chargers.map((item, i) => i === idx ? { ...item, [key]: v } : item);
    onChange(isArray ? newArr : newArr[0]);
  };

  // สำหรับ checkbox array
  const handleCheckbox = (idx, key, v) => {
    const arr = chargers[idx][key] || [];
    const next = arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v];
    handleCharger(idx, key, next);
  };

  // Helper to always provide a string for input value (never undefined or null)
  const safeValue = v => (v !== undefined && v !== null ? v : "");

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-700">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
        {/* ปุ่ม + เพิ่มเครื่องอัดประจุ เฉพาะด้านบน */}
        <div className="bg-blue-100 px-3 py-3 md:px-6 md:py-3 border-b border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-blue-800 font-bold text-lg">เครื่องอัดประจุยานยนต์ไฟฟ้า</span>
          </div>
        </div>
        <div className="px-2 py-4 md:px-6 md:py-8">
          {chargers.length === 0 && (
            <div className="text-gray-400 text-center py-8">ยังไม่มีข้อมูลเครื่องอัดประจุ</div>
          )}
          {chargers.map((item, idx) => (
            <div
              key={idx}
              className="mb-10 relative"
            >
              {/* Header: label + ปุ่มลบ */}
              <div className="flex items-center justify-between px-0 py-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">{idx + 1}</span>
                  <span className="font-semibold text-base text-blue-900">เครื่องอัดประจุที่ {idx + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCharger(idx)}
                  className="absolute right-0 top-0 mt-1 mr-1 text-red-600 hover:text-white hover:bg-red-500 border border-red-300 text-xs px-3 py-1 rounded-lg bg-white transition z-10"
                  style={{ minWidth: 0 }}
                >
                  ลบเครื่องอัดประจุ
                </button>
              </div>
              {/* Content: no extra card/box */}
              <div className="p-0 md:p-0 space-y-6">
                <div className="flex flex-col md:flex-row flex-wrap gap-y-2 md:gap-4 items-stretch md:items-end">
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">ผลิตภัณฑ์</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-2 w-full md:w-32 bg-white focus:ring-1 focus:ring-blue-400 text-base"
                      value={safeValue(item.product)}
                      onChange={e => handleCharger(idx, "product", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">รุ่น</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-2 w-full md:w-24 bg-white focus:ring-1 focus:ring-blue-400 text-base"
                      value={safeValue(item.model)}
                      onChange={e => handleCharger(idx, "model", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">Serial Number</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-2 w-full md:w-32 bg-white focus:ring-1 focus:ring-blue-400 text-base"
                      value={safeValue(item.serial)}
                      onChange={e => handleCharger(idx, "serial", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">IP</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-2 w-full md:w-16 bg-white focus:ring-1 focus:ring-blue-400 text-base"
                      value={safeValue(item.ip)}
                      onChange={e => handleCharger(idx, "ip", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row flex-wrap gap-y-2 md:gap-4 items-stretch md:items-center">
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">ระบบ</label>
                    <div>
                      <label className="mr-2">
                        <input
                          type="checkbox"
                          checked={safeValue(item.phase) === "1"}
                          onChange={e => handleCharger(idx, "phase", "1")}
                        />
                        <span className="ml-1">1 เฟส</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={safeValue(item.phase) === "3"}
                          onChange={e => handleCharger(idx, "phase", "3")}
                        />
                        <span className="ml-1">3 เฟส</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">จำนวนหัวชาร์จ </label>
                    <input
                      type="number"
                      className="border border-gray-300 rounded px-2 py-2 w-full md:w-16 bg-white focus:ring-1 focus:ring-blue-400 text-base"
                      value={safeValue(item.portCount)}
                      onChange={e => handleCharger(idx, "portCount", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">พิกัดกำลังไฟฟ้ารวม </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-2 w-full md:w-16 bg-white focus:ring-1 focus:ring-blue-400 text-base"
                        value={safeValue(item.totalKW)}
                        onChange={e => handleCharger(idx, "totalKW", e.target.value)}
                      />
                      <span className="ml-1">kW</span>
                    </div>
                  </div>
                  <div className="flex flex-col w-full md:w-auto">
                    <label className="mb-1 font-medium text-base">พิกัดกระแสรวม (Input) </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-2 w-full md:w-16 bg-white focus:ring-1 focus:ring-blue-400 text-base"
                        value={safeValue(item.inputA)}
                        onChange={e => handleCharger(idx, "inputA", e.target.value)}
                      />
                      <span className="ml-1">A</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row flex-wrap gap-y-2 md:gap-4 items-stretch md:items-center">
                  <label className="font-medium mb-1 md:mb-0 text-base">การอัดประจุไฟฟ้า</label>
                  <div>
                    <label className="mr-2">
                      <input type="checkbox" checked={item.mode?.includes("2")} onChange={() => handleCheckbox(idx, "mode", "2")} />
                      <span className="ml-1">โหมด 2 (AC)</span>
                    </label>
                    <label className="mr-2">
                      <input type="checkbox" checked={item.mode?.includes("3")} onChange={() => handleCheckbox(idx, "mode", "3")} />
                      <span className="ml-1">โหมด 3 (AC)</span>
                    </label>
                    <label className="mr-2">
                      <input type="checkbox" checked={item.mode?.includes("4")} onChange={() => handleCheckbox(idx, "mode", "4")} />
                      <span className="ml-1">โหมด 4 (DC)</span>
                    </label>
                  </div>
                  <span className="ml-2 text-xs text-gray-400 block md:inline">* AC คือ ไฟฟ้ากระแสสลับ DC คือ ไฟฟ้ากระแสตรง</span>
                </div>
                <CorrectableRow label="" value={item.infoCheck} onChange={v => handleCharger(idx, "infoCheck", v)} detail />

                <button
                type="button"
                className="w-full md:w-auto px-4 py-2 bg-green-600 text-white text-base font-semibold rounded shadow hover:bg-green-700 transition"
                onClick={addCharger}
            >
                + เพิ่มเครื่องอัดประจุ
            </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EvChargerCheckSection;