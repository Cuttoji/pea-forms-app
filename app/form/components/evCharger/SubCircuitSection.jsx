import React, { useEffect } from "react";
import EvChargerCheckSection from "./EvChargerCheckSection";

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

export default function SubCircuitSection({ sectionNumber = 5, value = [], onChange = () => {}, onAddCharger = () => {} }) {
  // สร้างโครงสร้างข้อมูลเริ่มต้นสำหรับวงจรย่อย
  const createDefaultSubCircuit = () => ({
    circuitNo: "",
    evOnly: { result: null, detail: "" },
    evOnePerCircuit: { result: null, detail: "" },
    standard: [],
    wireType: [],
    wireTypeOther: "",
    phaseSize: "",
    phaseSizeCheck: { result: null, detail: "" },
    neutralSize: "",
    neutralSizeCheck: { result: null, detail: "" },
    groundSize: "",
    groundSizeCheck: { result: null, detail: "" },
    phaseColor: { result: null, detail: "" },
    wirewayMechanical: { result: null, detail: "" },
    method: [],
    methodConduitWallSize: "",
    methodConduitWallCheck: { result: null, detail: "" },
    methodConduitBuriedSize: "",
    methodConduitBuriedCheck: { result: null, detail: "" },
    methodDirectBuriedCheck: { result: null, detail: "" },
    methodWirewayW: "",
    methodWirewayH: "",
    methodWirewayCheck: { result: null, detail: "" },
    methodCableTrayW: "",
    methodCableTrayH: "",
    methodCableTrayCheck: { result: null, detail: "" },
    methodOther: "",
    methodOtherCheck: { result: null, detail: "" },
    conduitType: [],
    conduitTypeOther: "",
    conduitCheck: { result: null, detail: "" },
    breakerStandard: false,
    breakerMode3: false,
    breakerMode3AT: "",
    breakerMode2: false,
    breakerMode2AT: "",
    breakerCheck: { result: null, detail: "" },
    rcdTypeB: false,
    rcdTypeBIn: "",
    rcdTypeBInCharger: false,
    rcdTypeBInChargerIn: "",
    rcdTypeBMain: { result: null, detail: "" },
    evChargers: []
  });

  // ตรวจสอบและสร้างวงจรย่อยเริ่มต้นถ้ายังไม่มี
  useEffect(() => {
    if (value.length === 0) {
      onChange([createDefaultSubCircuit()]);
    }
  }, []);

  const addSub = () => {
    onChange([...value, createDefaultSubCircuit()]);
  };
  
  const handleSub = (idx, key, v) => {
    const newArr = value.map((item, i) => i === idx ? { ...item, [key]: v } : item);
    onChange(newArr);
  };
  
  const removeSub = (idx) => {
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== idx));
    }
  };

  const handleCheckbox = (idx, key, v) => {
    const arr = value[idx][key] || [];
    const next = arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v];
    handleSub(idx, key, next);
  };

  const safeValue = v => (v !== undefined && v !== null ? String(v) : "");
  const safeArray = arr => Array.isArray(arr) ? arr : [];

  return (
    <div className="space-y-6">
      <div className="p-4 space-y-6">
        {value.map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-900">วงจรย่อยที่ {idx + 1}</h3>
              {value.length > 1 && (
                <button onClick={() => removeSub(idx)} className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded-md hover:bg-red-50 transition-colors">
                  ลบวงจรย่อย
                </button>
              )}
            </div>

            <div className="space-y-6 text-gray-700">
              {/* ข้อมูลพื้นฐานของวงจร */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">ข้อมูลพื้นฐานของวงจร</h4>

                <CorrectableRow 
                  label="วงจรนี้ใช้สำหรับเครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น" 
                  value={item?.evOnly} 
                  onChange={v => handleSub(idx, "evOnly", v)} 
                  detail 
                />

                <CorrectableRow 
                  label="วงจรนี้ใช้สำหรับเครื่องอัดประจุยานยนต์ไฟฟ้า 1 เครื่องต่อ 1 วงจร" 
                  value={item?.evOnePerCircuit} 
                  onChange={v => handleSub(idx, "evOnePerCircuit", v)} 
                  detail 
                />
              </div>

              {/* สายไฟฟ้า */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">สายไฟฟ้า</h4>
                
                <div className="mb-4">
                  <label className="mb-2 font-medium text-base block">มาตรฐาน</label>
                  <div className="flex flex-wrap gap-4">
                    {["มอก. 11-2553", "มอก. 293-2541", "IEC 60502 "].map(std => (
                      <label key={std} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={safeArray(item?.standard).includes(std)} 
                          onChange={() => handleCheckbox(idx, "standard", std)} 
                          className="mr-2" 
                        />
                        <span className="text-sm">{std}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2 font-medium text-base block">ชนิดสายตัวนำ</label>
                  <div className="flex flex-wrap gap-4">
                    {["IEC01", "NYY", "CV"].map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={safeArray(item?.wireType).includes(type)} 
                          onChange={() => handleCheckbox(idx, "wireType", type)} 
                          className="mr-2" 
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.wireType).includes("อื่นๆ")} 
                        onChange={() => handleCheckbox(idx, "wireType", "อื่นๆ")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">อื่นๆ</span>
                    </label>
                  </div>
                  {safeArray(item?.wireType).includes("อื่นๆ") && (
                    <input 
                      type="text" 
                      placeholder="ระบุชนิดสาย" 
                      className="mt-2 border border-gray-300 rounded px-2 py-2 w-full md:w-64 text-sm" 
                      value={safeValue(item?.wireTypeOther)} 
                      onChange={e => handleSub(idx, "wireTypeOther", e.target.value)} 
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="mb-1 font-medium text-base block">ขนาดสายเฟส (mm²)</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-2 w-full text-base" 
                      value={safeValue(item?.phaseSize)} 
                      onChange={e => handleSub(idx, "phaseSize", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="mb-1 font-medium text-base block">ขนาดสายนิวทรัล (mm²)</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-2 w-full text-base" 
                      value={safeValue(item?.neutralSize)} 
                      onChange={e => handleSub(idx, "neutralSize", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="mb-1 font-medium text-base block">ขนาดสายดิน (mm²)</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-2 w-full text-base" 
                      value={safeValue(item?.groundSize)} 
                      onChange={e => handleSub(idx, "groundSize", e.target.value)} 
                    />
                  </div>
                </div>

                <CorrectableRow 
                  label="ตรวจสอบขนาดสายเฟส" 
                  value={item?.phaseSizeCheck} 
                  onChange={v => handleSub(idx, "phaseSizeCheck", v)} 
                  detail 
                />

                <CorrectableRow 
                  label="ตรวจสอบขนาดสายนิวทรัล" 
                  value={item?.neutralSizeCheck} 
                  onChange={v => handleSub(idx, "neutralSizeCheck", v)} 
                  detail 
                />

                <CorrectableRow 
                  label="ตรวจสอบขนาดสายกราวด์" 
                  value={item?.groundSizeCheck} 
                  onChange={v => handleSub(idx, "groundSizeCheck", v)} 
                  detail 
                />

                <CorrectableRow 
                  label="ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ " 
                  value={item?.phaseColor} 
                  onChange={v => handleSub(idx, "phaseColor", v)} 
                  detail 
                />
                 <CorrectableRow 
                  label="ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ" 
                  value={item?.wirewayMechanical} 
                  onChange={v => handleSub(idx, "wirewayMechanical", v)} 
                  detail 
                />
              </div>

              {/* การติดตั้งเดินสาย */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.3 วิธีการเดินสาย</h4>
                
                {/* เดินร้อยท่อเกาะผนัง */}
                <div className="mb-4 pb-4 border-b border-gray-300">
                  <div className="flex items-start gap-4 mb-2">
                    <label className="flex items-center min-w-fit">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินร้อยท่อเกาะผนัง")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินร้อยท่อเกาะผนัง")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="มม."
                      className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                      value={safeValue(item?.methodConduitWallSize)} 
                      onChange={e => handleSub(idx, "methodConduitWallSize", e.target.value)} 
                      disabled={!safeArray(item?.method).includes("เดินร้อยท่อเกาะผนัง")}
                    />
                    <span className="text-sm">มม.</span>
                  </div>
                  <div className="ml-6 flex items-start gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodConduitWall_${idx}`}
                        checked={item?.methodConduitWallCheck?.result === "ถูกต้อง"}
                        onChange={() => handleSub(idx, "methodConduitWallCheck", { result: "ถูกต้อง", detail: "" })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodConduitWall_${idx}`}
                        checked={item?.methodConduitWallCheck?.result === "ต้องแก้ไข"}
                        onChange={() => handleSub(idx, "methodConduitWallCheck", { result: "ต้องแก้ไข", detail: item?.methodConduitWallCheck?.detail || "" })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-red-700">ต้องแก้ไข</span>
                    </label>
                    {item?.methodConduitWallCheck?.result === "ต้องแก้ไข" && (
                      <input
                        type="text"
                        placeholder="ระบุรายละเอียด..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        value={item?.methodConduitWallCheck?.detail || ""}
                        onChange={e => handleSub(idx, "methodConduitWallCheck", { ...item?.methodConduitWallCheck, detail: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                {/* เดินสายร้อยท่อฝังดิน */}
                <div className="mb-4 pb-4 border-b border-gray-300">
                  <div className="flex items-start gap-4 mb-2">
                    <label className="flex items-center min-w-fit">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินสายร้อยท่อฝังดิน")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินสายร้อยท่อฝังดิน")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="มม."
                      className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                      value={safeValue(item?.methodConduitBuriedSize)} 
                      onChange={e => handleSub(idx, "methodConduitBuriedSize", e.target.value)} 
                      disabled={!safeArray(item?.method).includes("เดินสายร้อยท่อฝังดิน")}
                    />
                    <span className="text-sm">มม.</span>
                  </div>
                  <div className="ml-6 flex items-start gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodConduitBuried_${idx}`}
                        checked={item?.methodConduitBuriedCheck?.result === "ถูกต้อง"}
                        onChange={() => handleSub(idx, "methodConduitBuriedCheck", { result: "ถูกต้อง", detail: "" })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodConduitBuried_${idx}`}
                        checked={item?.methodConduitBuriedCheck?.result === "ต้องแก้ไข"}
                        onChange={() => handleSub(idx, "methodConduitBuriedCheck", { result: "ต้องแก้ไข", detail: item?.methodConduitBuriedCheck?.detail || "" })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-red-700">ต้องแก้ไข</span>
                    </label>
                    {item?.methodConduitBuriedCheck?.result === "ต้องแก้ไข" && (
                      <input
                        type="text"
                        placeholder="ระบุรายละเอียด..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        value={item?.methodConduitBuriedCheck?.detail || ""}
                        onChange={e => handleSub(idx, "methodConduitBuriedCheck", { ...item?.methodConduitBuriedCheck, detail: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                {/* เดินสายฝังดินโดยตรง */}
                <div className="mb-4 pb-4 border-b border-gray-300">
                  <div className="mb-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินสายฝังดินโดยตรง")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินสายฝังดินโดยตรง")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                    </label>
                  </div>
                  <div className="ml-6 flex items-start gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodDirectBuried_${idx}`}
                        checked={item?.methodDirectBuriedCheck?.result === "ถูกต้อง"}
                        onChange={() => handleSub(idx, "methodDirectBuriedCheck", { result: "ถูกต้อง", detail: "" })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodDirectBuried_${idx}`}
                        checked={item?.methodDirectBuriedCheck?.result === "ต้องแก้ไข"}
                        onChange={() => handleSub(idx, "methodDirectBuriedCheck", { result: "ต้องแก้ไข", detail: item?.methodDirectBuriedCheck?.detail || "" })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-red-700">ต้องแก้ไข</span>
                    </label>
                    {item?.methodDirectBuriedCheck?.result === "ต้องแก้ไข" && (
                      <input
                        type="text"
                        placeholder="ระบุรายละเอียด..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        value={item?.methodDirectBuriedCheck?.detail || ""}
                        onChange={e => handleSub(idx, "methodDirectBuriedCheck", { ...item?.methodDirectBuriedCheck, detail: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                {/* เดินในรางเดินสาย Wireway */}
                <div className="mb-4 pb-4 border-b border-gray-300">
                  <div className="flex items-start gap-4 mb-2">
                    <label className="flex items-center min-w-fit">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินในรางเดินสาย")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินในรางเดินสาย")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เดินในรางเดินสาย (Wireway) ขนาด</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="กว้าง"
                      className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" 
                      value={safeValue(item?.methodWirewayW)} 
                      onChange={e => handleSub(idx, "methodWirewayW", e.target.value)} 
                      disabled={!safeArray(item?.method).includes("เดินในรางเดินสาย")}
                    />
                    <span className="text-sm">มม. x</span>
                    <input 
                      type="text" 
                      placeholder="สูง"
                      className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" 
                      value={safeValue(item?.methodWirewayH)} 
                      onChange={e => handleSub(idx, "methodWirewayH", e.target.value)} 
                      disabled={!safeArray(item?.method).includes("เดินในรางเดินสาย")}
                    />
                    <span className="text-sm">มม.</span>
                  </div>
                  <div className="ml-6 flex items-start gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodWireway_${idx}`}
                        checked={item?.methodWirewayCheck?.result === "ถูกต้อง"}
                        onChange={() => handleSub(idx, "methodWirewayCheck", { result: "ถูกต้อง", detail: "" })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodWireway_${idx}`}
                        checked={item?.methodWirewayCheck?.result === "ต้องแก้ไข"}
                        onChange={() => handleSub(idx, "methodWirewayCheck", { result: "ต้องแก้ไข", detail: item?.methodWirewayCheck?.detail || "" })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-red-700">ต้องแก้ไข</span>
                    </label>
                    {item?.methodWirewayCheck?.result === "ต้องแก้ไข" && (
                      <input
                        type="text"
                        placeholder="ระบุรายละเอียด..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        value={item?.methodWirewayCheck?.detail || ""}
                        onChange={e => handleSub(idx, "methodWirewayCheck", { ...item?.methodWirewayCheck, detail: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                {/* เดินบนรางเคเบิล Cable Tray */}
                <div className="mb-4 pb-4 border-b border-gray-300">
                  <div className="flex items-start gap-4 mb-2">
                    <label className="flex items-center min-w-fit">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินบนรางเคเบิล")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินบนรางเคเบิล")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="กว้าง"
                      className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" 
                      value={safeValue(item?.methodCableTrayW)} 
                      onChange={e => handleSub(idx, "methodCableTrayW", e.target.value)} 
                      disabled={!safeArray(item?.method).includes("เดินบนรางเคเบิล")}
                    />
                    <span className="text-sm">มม. x</span>
                    <input 
                      type="text" 
                      placeholder="สูง"
                      className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" 
                      value={safeValue(item?.methodCableTrayH)} 
                      onChange={e => handleSub(idx, "methodCableTrayH", e.target.value)} 
                      disabled={!safeArray(item?.method).includes("เดินบนรางเคเบิล")}
                    />
                    <span className="text-sm">มม.</span>
                  </div>
                  <div className="ml-6 flex items-start gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodCableTray_${idx}`}
                        checked={item?.methodCableTrayCheck?.result === "ถูกต้อง"}
                        onChange={() => handleSub(idx, "methodCableTrayCheck", { result: "ถูกต้อง", detail: "" })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodCableTray_${idx}`}
                        checked={item?.methodCableTrayCheck?.result === "ต้องแก้ไข"}
                        onChange={() => handleSub(idx, "methodCableTrayCheck", { result: "ต้องแก้ไข", detail: item?.methodCableTrayCheck?.detail || "" })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-red-700">ต้องแก้ไข</span>
                    </label>
                    {item?.methodCableTrayCheck?.result === "ต้องแก้ไข" && (
                      <input
                        type="text"
                        placeholder="ระบุรายละเอียด..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        value={item?.methodCableTrayCheck?.detail || ""}
                        onChange={e => handleSub(idx, "methodCableTrayCheck", { ...item?.methodCableTrayCheck, detail: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                {/* อื่นๆ */}
                <div className="mb-4">
                  <div className="flex items-start gap-4 mb-2">
                    <label className="flex items-center min-w-fit">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("อื่นๆ")} 
                        onChange={() => handleCheckbox(idx, "method", "อื่นๆ")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">อื่นๆ ระบุ</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="ระบุวิธีการเดินสายอื่นๆ" 
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" 
                      value={safeValue(item?.methodOther)} 
                      onChange={e => handleSub(idx, "methodOther", e.target.value)} 
                      disabled={!safeArray(item?.method).includes("อื่นๆ")}
                    />
                  </div>
                  <div className="ml-6 flex items-start gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodOther_${idx}`}
                        checked={item?.methodOtherCheck?.result === "ถูกต้อง"}
                        onChange={() => handleSub(idx, "methodOtherCheck", { result: "ถูกต้อง", detail: "" })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`methodOther_${idx}`}
                        checked={item?.methodOtherCheck?.result === "ต้องแก้ไข"}
                        onChange={() => handleSub(idx, "methodOtherCheck", { result: "ต้องแก้ไข", detail: item?.methodOtherCheck?.detail || "" })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-red-700">ต้องแก้ไข</span>
                    </label>
                    {item?.methodOtherCheck?.result === "ต้องแก้ไข" && (
                      <input
                        type="text"
                        placeholder="ระบุรายละเอียด..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        value={item?.methodOtherCheck?.detail || ""}
                        onChange={e => handleSub(idx, "methodOtherCheck", { ...item?.methodOtherCheck, detail: e.target.value })}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 5.6.4 ประเภทท่อร้อยสาย */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.4 ประเภทท่อร้อยสาย</h4>

                <div className="mb-4">
                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-sm block mb-2">ท่อโลหะ:</label>
                      <div className="ml-4 flex flex-wrap gap-4">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("ท่อ (RMC)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "ท่อ (RMC)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">ท่อ (RMC)</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("ท่อปานกลาง (IMC)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "ท่อปานกลาง (IMC)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">ท่อปานกลาง (IMC)</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("บาง (EMT)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "บาง (EMT)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">บาง (EMT)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="font-medium text-sm block mb-2">ท่ออโลหะ:</label>
                      <div className="ml-4 flex flex-wrap gap-4">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("แข็ง (RNC)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "แข็ง (RNC)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">แข็ง (RNC)</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("อ่อน (ENT)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "อ่อน (ENT)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">อ่อน (ENT)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={safeArray(item?.conduitType).includes("ท่อโลหะอ่อน")} 
                          onChange={() => handleCheckbox(idx, "conduitType", "ท่อโลหะอ่อน")} 
                          className="mr-2" 
                        />
                        <span className="text-sm">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.conduitType).includes("อื่นๆ")} 
                        onChange={() => handleCheckbox(idx, "conduitType", "อื่นๆ")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">อื่นๆ ระบุ</span>
                      {safeArray(item?.conduitType).includes("อื่นๆ") && (
                        <input 
                          type="text" 
                          placeholder="ระบุชนิดท่ออื่นๆ" 
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" 
                          value={safeValue(item?.conduitTypeOther)} 
                          onChange={e => handleSub(idx, "conduitTypeOther", e.target.value)} 
                        />
                      )}
                    </div>
                  </div>
                </div>

                <CorrectableRow 
                  label="ตรวจสอบชนิดท่อ" 
                  value={item?.conduitCheck} 
                  onChange={v => handleSub(idx, "conduitCheck", v)} 
                  detail 
                />
              </div>

              {/* 5.6.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย</h4>

                <div className="mb-4 space-y-3">
                  <label className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      checked={item?.breakerStandard || false} 
                      onChange={e => handleSub(idx, "breakerStandard", e.target.checked)} 
                      className="mt-1" 
                    />
                    <span className="text-sm">เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2</span>
                  </label>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      checked={item?.breakerMode3 || false} 
                      onChange={e => handleSub(idx, "breakerMode3", e.target.checked)} 
                      className="mt-1" 
                    />
                    <span className="text-sm">กรณีเป็นเบรกเกอร์สำหรับ 3 หรือ 4 เซอร์กิตเบรกเกอร์ประธาน </span>
                    {item?.breakerMode3 && (
                      <input 
                        type="text" 
                        placeholder="แอมแปร์" 
                        className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                        value={safeValue(item?.breakerMode3AT)} 
                        onChange={e => handleSub(idx, "breakerMode3AT", e.target.value)} 
                      />
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      checked={item?.breakerMode2 || false} 
                      onChange={e => handleSub(idx, "breakerMode2", e.target.checked)} 
                      className="mt-1" 
                    />
                    <span className="text-sm">กรณีเป็นเบรกเกอร์สำหรับ 2 เซอร์กิตเบรกเกอร์ประธาน</span>
                    {item?.breakerMode2 && (
                      <input 
                        type="text" 
                        placeholder="แอมแปร์" 
                        className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                        value={safeValue(item?.breakerMode2AT)} 
                        onChange={e => handleSub(idx, "breakerMode2AT", e.target.value)} 
                      />
                    )}
                  </div>
                </div>

                <CorrectableRow 
                  label="ตรวจสอบเซอร์กิตเบรกเกอร์" 
                  value={item?.breakerCheck} 
                  onChange={v => handleSub(idx, "breakerCheck", v)} 
                  detail 
                />
              </div>

              {/* 5.6.6 ข้อกำหนดเครื่องตัดไฟรั่ว (RCD) */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.6 ข้อกำหนดเครื่องตัดไฟรั่ว (RCD)</h4>

                <div className="mb-4 space-y-4">
                  <div className="p-3 bg-white rounded border border-indigo-200">
                    <label className="flex items-start gap-2 mb-2">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeB || false} 
                        onChange={e => handleSub(idx, "rcdTypeB", e.target.checked)} 
                        className="mt-1" 
                      />
                      <span className="text-sm">
                        <strong>เครื่องตัดไฟรั่ว (RCD) Type B</strong> ตามมาตรฐาน มอก. 2955 หรือ IEC 62423 
                        พิกัดกระแสรั่ว IΔn ≤ 30 มิลลิแอมแปร์ (mA) พิกัดกระแส (In)................แอมแปร์ (A) 
                        เป็น RCD ซึ่งติดตั้งระหว่างเครื่องอัดประจุกับวงจรย่อยของบริเภณฑ์ ของขอบเขตงานของเครื่องจักรกล 
                        พิกัดความล่าช้าสูงสุดในการเปิดวงจรหรือตัดกระแสวงจร Type S <strong>โดยสามารถปรับระดับ</strong>
                      </span>
                    </label>
                    {item?.rcdTypeB && (
                      <div className="ml-6 mt-2">
                        <input 
                          type="text" 
                          placeholder="แอมแปร์ (A)" 
                          className="border border-gray-300 rounded px-3 py-2 w-full md:w-64 text-sm" 
                          value={safeValue(item?.rcdTypeBIn)} 
                          onChange={e => handleSub(idx, "rcdTypeBIn", e.target.value)} 
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-700 italic pl-6">
                    * คำแนะนำ RDC-DD ตั้งได้ตาม IEC 62955
                  </div>

                  <div className="p-3 bg-white rounded border border-indigo-200">
                    <label className="flex items-start gap-2 mb-2">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeBInCharger || false} 
                        onChange={e => handleSub(idx, "rcdTypeBInCharger", e.target.checked)} 
                        className="mt-1" 
                      />
                      <span className="text-sm">
                        <strong>มีเครื่องตัดไฟรั่ว (RCD) Type B</strong> ตามมาตรฐาน มอก. 2955 หรือ IEC 62423 
                        พิกัดกระแสรั่ว IΔn ≤ 30 มิลลิแอมแปร์ (mA) พิกัดกระแส (In)................แอมแปร์ (A) 
                        เป็น RCD ซึ่งติดตั้งภายในเครื่องอัดประจุยานยนต์ไฟฟ้า และเป็นส่วนหนึ่งของเครื่องอัดประจุ 
                        พิกัดความล่าช้าสูงสุดในการเปิดวงจรหรือตัดกระแสวงจร Type AC อื่นๆ<strong>ไม่ซ้ำซ้อนกับ RCD ในเครื่องอัดประจุ</strong>
                      </span>
                    </label>
                    {item?.rcdTypeBInCharger && (
                      <div className="ml-6 mt-2">
                        <input 
                          type="text" 
                          placeholder="แอมแปร์ (A)" 
                          className="border border-gray-300 rounded px-3 py-2 w-full md:w-64 text-sm" 
                          value={safeValue(item?.rcdTypeBInChargerIn)} 
                          onChange={e => handleSub(idx, "rcdTypeBInChargerIn", e.target.value)} 
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-700 pl-6 space-y-1">
                    <p>* กรณีการต่อกระแสไฟล่วง 2 ให้พิจารณาติดตั้งในเครื่องโดยให้ถูกต้องตรงเวลาและกองบังคับ 
                    หรือเป็นความสงสัย การติดตั้ง RCD Type B หรือต้องติดตั้งแยกที่สวนหน้า IC-CPD (In-Cable Control and Protection Device)</p>
                  </div>
                </div>

                <CorrectableRow 
                  label="5.6.7 กรณีติดตั้งเครื่องตัดไฟรั่ว (RCD) Type B ที่วงจรย่อยติดตั้งไกลกับ RCD Type B อื่นๆสำหรับบ้าน RCD Type B อีก อยู่ส่วนหนึ่งของ ของบ้านหรือ" 
                  value={item?.rcdTypeBMain} 
                  onChange={v => handleSub(idx, "rcdTypeBMain", v)} 
                  detail 
                />
              </div>

              {/* ส่วนเครื่องอัดประจุ */}
              <div className="mb-8 border p-4 rounded">
                <EvChargerCheckSection
                  prefix={`${sectionNumber}.8`}
                  value={item.evChargers}
                  onChange={val => handleSub(idx, "evChargers", val)}
                />
                {/* ปุ่มเพิ่มเครื่องอัดประจุ */}
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => onAddCharger(idx)}
                  >
                    + เพิ่มเครื่องอัดประจุ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="mb-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          onClick={addSub}
        >
          + เพิ่มวงจรย่อย
        </button>
      </div>
    </div>
  );
}