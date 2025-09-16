import React from "react";

// Helper ถูกต้อง/ต้องแก้ไข, ติดตั้งแล้ว/ยังไม่ติดตั้ง
function CorrectableRow({
  label,
  value,
  onChange,
  detail = false,
  placeholder = "โปรดระบุรายละเอียด",
  yesLabel = "ถูกต้อง",
  noLabel = "ต้องแก้ไข"
}) {
  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0 text-gray-700">
      <div className="text-sm text-gray-700 mb-2">{label}</div>
      <div className="flex items-start gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value?.result === yesLabel}
            onChange={() => onChange({ ...value, result: yesLabel, detail: "" })}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-sm text-green-700">{yesLabel}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value?.result === noLabel}
            onChange={() => onChange({ ...value, result: noLabel })}
            className="w-4 h-4 text-red-600"
          />
          <span className="text-sm text-red-700">{noLabel}</span>
        </label>
        {value?.result === noLabel && detail && (
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

// EV Charger Section (loop)
function EvChargerCheckSection({ value = [], onChange = () => {} }) {
  // เพิ่มเครื่องอัดประจุ
  const addCharger = () => {
    onChange([
      ...value,
      {
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
      }
    ]);
  };

  // ลบเครื่องอัดประจุ
  const removeCharger = idx => {
    onChange(value.filter((_, i) => i !== idx));
  };

  // แก้ไขค่าในแต่ละ ev charger
  const handleCharger = (idx, key, v) => {
    const newArr = value.map((item, i) => i === idx ? { ...item, [key]: v } : item);
    onChange(newArr);
  };

  // สำหรับ checkbox array
  const handleCheckbox = (idx, key, v) => {
    const arr = value[idx][key] || [];
    const next = arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v];
    handleCharger(idx, key, next);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">5.7</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">5.7 การตรวจสอบเครื่องอัดประจุยานยนต์ไฟฟ้า</h2>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={addCharger}
          >
            + เพิ่มเครื่องอัดประจุ
          </button>
        </div>
        <div className="px-6 py-6">
          {value.length === 0 && (
            <div className="text-gray-500 text-center py-8">ยังไม่มีข้อมูลเครื่องอัดประจุ</div>
          )}
          {value.map((item, idx) => (
            <div key={idx} className="space-y-6 mb-10 border-b last:border-b-0 border-gray-200 pb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  เครื่องอัดประจุที่ {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCharger(idx)}
                  className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  ลบเครื่องอัดประจุ
                </button>
              </div>
              {/* --- รายละเอียดฟิลด์แต่ละเครื่อง --- */}
              <div className="mb-2 flex flex-wrap gap-4 items-end">
                <div>
                  <label className="mr-2">ผลิตภัณฑ์</label>
                  <input type="text" className="border-b border-dotted border-black outline-none px-2 w-32"
                    value={item.product || ""} onChange={e => handleCharger(idx, "product", e.target.value)} />
                </div>
                <div>
                  <label className="mr-2">รุ่น</label>
                  <input type="text" className="border-b border-dotted border-black outline-none px-2 w-24"
                    value={item.model || ""} onChange={e => handleCharger(idx, "model", e.target.value)} />
                </div>
                <div>
                  <label className="mr-2">Serial Number</label>
                  <input type="text" className="border-b border-dotted border-black outline-none px-2 w-32"
                    value={item.serial || ""} onChange={e => handleCharger(idx, "serial", e.target.value)} />
                </div>
                <div>
                  <label className="mr-2">IP</label>
                  <input type="text" className="border-b border-dotted border-black outline-none px-2 w-16"
                    value={item.ip || ""} onChange={e => handleCharger(idx, "ip", e.target.value)} />
                </div>
              </div>
              <div className="mb-2 flex flex-wrap gap-4 items-center">
                <div>
                  <label className="mr-2">ระบบ</label>
                  <label className="mr-2">
                    <input type="checkbox" checked={item.phase === "1"} onChange={e => handleCharger(idx, "phase", "1")} />
                    <span className="ml-1">1 เฟส</span>
                  </label>
                  <label>
                    <input type="checkbox" checked={item.phase === "3"} onChange={e => handleCharger(idx, "phase", "3")} />
                    <span className="ml-1">3 เฟส</span>
                  </label>
                </div>
                <div>
                  <label>จำนวนหัวชาร์จ </label>
                  <input type="number" className="border-b border-dotted border-black outline-none px-2 w-16"
                    value={item.portCount || ""} onChange={e => handleCharger(idx, "portCount", e.target.value)} />
                </div>
                <div>
                  <label>พิกัดกำลังไฟฟ้ารวม </label>
                  <input type="number" className="border-b border-dotted border-black outline-none px-2 w-16"
                    value={item.totalKW || ""} onChange={e => handleCharger(idx, "totalKW", e.target.value)} />
                  <span className="ml-1">kW</span>
                </div>
                <div>
                  <label>พิกัดกระแสรวม (Input) </label>
                  <input type="number" className="border-b border-dotted border-black outline-none px-2 w-16"
                    value={item.inputA || ""} onChange={e => handleCharger(idx, "inputA", e.target.value)} />
                  <span className="ml-1">A</span>
                </div>
              </div>
              <div className="mb-2 flex flex-wrap gap-4 items-center">
                <label>การอัดประจุไฟฟ้า</label>
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
                <span className="ml-2 text-xs text-gray-400">* AC คือ ไฟฟ้ากระแสสลับ DC คือ ไฟฟ้ากระแสตรง</span>
              </div>
              <CorrectableRow label="" value={item.infoCheck} onChange={v => handleCharger(idx, "infoCheck", v)} detail />

              {/* --- ส่วนอื่นๆ สามารถใส่ได้ตามฟิลด์ข้างบน --- */}
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={addCharger}
            >
              + เพิ่มเครื่องอัดประจุ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvChargerCheckSection;