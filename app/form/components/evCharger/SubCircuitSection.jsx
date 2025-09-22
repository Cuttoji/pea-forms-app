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
    methodConduitBuriedSize: "",
    methodWirewayW: "",
    methodWirewayH: "",
    methodCableTrayW: "",
    methodCableTrayH: "",
    methodOther: "",
    methodCheck: { result: null, detail: "" },
    conduitType: [],
    conduitTypeOther: "",
    conduitCheck: { result: null, detail: "" },
    breakerStandard: false,
    breakerMode3: false,
    breakerMode3AT: "",
    breakerMode2: false,
    breakerMode2AT: "",
    breakerCheck: { result: null, detail: "" },
    breakerSizeCheck: { result: null, detail: "" },
    rcdTypeB: false,
    rcdTypeBIn: "",
    rcdTypeAFPlusDD: false,
    rcdTypeBInCharger: false,
    rcdTypeBInChargerIn: "",
    rcdCheck: { result: null, detail: "" },
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
                
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-base">หมายเลขวงจร</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-2 w-32 bg-white focus:ring-1 focus:ring-blue-400 text-base" 
                      value={safeValue(item?.circuitNo)} 
                      onChange={e => handleSub(idx, "circuitNo", e.target.value)} 
                    />
                  </div>
                </div>

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
                    {["TIS 17", "IEC 60364", "BS 7671", "NEC"].map(std => (
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
                  <label className="mb-2 font-medium text-base block">ชนิดสาย</label>
                  <div className="flex flex-wrap gap-4">
                    {["THW", "THHN", "NYY", "VV", "XLPE"].map(type => (
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
                    <label className="mb-1 font-medium text-base block">ขนาดสายกราวด์ (mm²)</label>
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
                  label="สีสายเฟส" 
                  value={item?.phaseColor} 
                  onChange={v => handleSub(idx, "phaseColor", v)} 
                  detail 
                />
              </div>

              {/* การติดตั้งเดินสาย */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">การติดตั้งเดินสาย</h4>

                <CorrectableRow 
                  label="ความมั่นคงทางกลของรางเดินสาย" 
                  value={item?.wirewayMechanical} 
                  onChange={v => handleSub(idx, "wirewayMechanical", v)} 
                  detail 
                />

                <div className="mb-4">
                  <label className="mb-2 font-medium text-base block">วิธีการเดินสาย</label>
                  <div className="space-y-2">
                    {["ท่อร้อยสายบนผนัง", "ท่อร้อยสายฝังดิน", "ราง Wireway", "ถาด Cable Tray", "อื่นๆ"].map(method => (
                      <label key={method} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={safeArray(item?.method).includes(method)} 
                          onChange={() => handleCheckbox(idx, "method", method)} 
                          className="mr-2" 
                        />
                        <span className="text-sm">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm">ขนาดท่อบนผนัง (mm)</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-1 w-full text-sm" 
                      value={safeValue(item?.methodConduitWallSize)} 
                      onChange={e => handleSub(idx, "methodConduitWallSize", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-sm">ขนาดท่อฝังดิน (mm)</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-1 w-full text-sm" 
                      value={safeValue(item?.methodConduitBuriedSize)} 
                      onChange={e => handleSub(idx, "methodConduitBuriedSize", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-sm">ความกว้างราง (mm)</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-1 w-full text-sm" 
                      value={safeValue(item?.methodWirewayW)} 
                      onChange={e => handleSub(idx, "methodWirewayW", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-sm">ความสูงราง (mm)</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-1 w-full text-sm" 
                      value={safeValue(item?.methodWirewayH)} 
                      onChange={e => handleSub(idx, "methodWirewayH", e.target.value)} 
                    />
                  </div>
                </div>

                {safeArray(item?.method).includes("อื่นๆ") && (
                  <div className="mb-4">
                    <input 
                      type="text" 
                      placeholder="ระบุวิธีการเดินสายอื่นๆ" 
                      className="border border-gray-300 rounded px-2 py-2 w-full text-sm" 
                      value={safeValue(item?.methodOther)} 
                      onChange={e => handleSub(idx, "methodOther", e.target.value)} 
                    />
                  </div>
                )}

                <CorrectableRow 
                  label="ตรวจสอบวิธีการเดินสาย" 
                  value={item?.methodCheck} 
                  onChange={v => handleSub(idx, "methodCheck", v)} 
                  detail 
                />

                <div className="mb-4">
                  <label className="mb-2 font-medium text-base block">ชนิดท่อ</label>
                  <div className="flex flex-wrap gap-4">
                    {["PVC", "Steel EMT", "Steel IMC", "Flexible", "อื่นๆ"].map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={safeArray(item?.conduitType).includes(type)} 
                          onChange={() => handleCheckbox(idx, "conduitType", type)} 
                          className="mr-2" 
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                  {safeArray(item?.conduitType).includes("อื่นๆ") && (
                    <input 
                      type="text" 
                      placeholder="ระบุชนิดท่ออื่นๆ" 
                      className="mt-2 border border-gray-300 rounded px-2 py-2 w-full md:w-64 text-sm" 
                      value={safeValue(item?.conduitTypeOther)} 
                      onChange={e => handleSub(idx, "conduitTypeOther", e.target.value)} 
                    />
                  )}
                </div>

                <CorrectableRow 
                  label="ตรวจสอบชนิดท่อ" 
                  value={item?.conduitCheck} 
                  onChange={v => handleSub(idx, "conduitCheck", v)} 
                  detail 
                />
              </div>

              {/* อุปกรณ์ป้องกัน */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">อุปกรณ์ป้องกัน</h4>

                <div className="mb-4">
                  <h5 className="font-medium mb-2">เบรกเกอร์</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={item?.breakerStandard || false} 
                        onChange={e => handleSub(idx, "breakerStandard", e.target.checked)} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เบรกเกอร์มาตรฐาน</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.breakerMode3 || false} 
                        onChange={e => handleSub(idx, "breakerMode3", e.target.checked)} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เบรกเกอร์สำหรับโหมด 3</span>
                      {item?.breakerMode3 && (
                        <input 
                          type="text" 
                          placeholder="พิกัดกระแส (A)" 
                          className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                          value={safeValue(item?.breakerMode3AT)} 
                          onChange={e => handleSub(idx, "breakerMode3AT", e.target.value)} 
                        />
                      )}
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.breakerMode2 || false} 
                        onChange={e => handleSub(idx, "breakerMode2", e.target.checked)} 
                        className="mr-2" 
                      />
                      <span className="text-sm">เบรกเกอร์สำหรับโหมด 2</span>
                      {item?.breakerMode2 && (
                        <input 
                          type="text" 
                          placeholder="พิกัดกระแส (A)" 
                          className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                          value={safeValue(item?.breakerMode2AT)} 
                          onChange={e => handleSub(idx, "breakerMode2AT", e.target.value)} 
                        />
                      )}
                    </label>
                  </div>
                </div>

                <CorrectableRow 
                  label="ตรวจสอบเบรกเกอร์" 
                  value={item?.breakerCheck} 
                  onChange={v => handleSub(idx, "breakerCheck", v)} 
                  detail 
                />

                <CorrectableRow 
                  label="ตรวจสอบขนาดเบรกเกอร์" 
                  value={item?.breakerSizeCheck} 
                  onChange={v => handleSub(idx, "breakerSizeCheck", v)} 
                  detail 
                />

                <div className="mb-4">
                  <h5 className="font-medium mb-2">RCD (Residual Current Device)</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeB || false} 
                        onChange={e => handleSub(idx, "rcdTypeB", e.target.checked)} 
                        className="mr-2" 
                      />
                      <span className="text-sm">RCD Type B</span>
                      {item?.rcdTypeB && (
                        <input 
                          type="text" 
                          placeholder="พิกัดกระแส (mA)" 
                          className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                          value={safeValue(item?.rcdTypeBIn)} 
                          onChange={e => handleSub(idx, "rcdTypeBIn", e.target.value)} 
                        />
                      )}
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeAFPlusDD || false} 
                        onChange={e => handleSub(idx, "rcdTypeAFPlusDD", e.target.checked)} 
                        className="mr-2" 
                      />
                      <span className="text-sm">RCD Type AF+DD</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeBInCharger || false} 
                        onChange={e => handleSub(idx, "rcdTypeBInCharger", e.target.checked)} 
                        className="mr-2" 
                      />
                      <span className="text-sm">RCD Type B ในเครื่องอัดประจุ</span>
                      {item?.rcdTypeBInCharger && (
                        <input 
                          type="text" 
                          placeholder="พิกัดกระแส (mA)" 
                          className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                          value={safeValue(item?.rcdTypeBInChargerIn)} 
                          onChange={e => handleSub(idx, "rcdTypeBInChargerIn", e.target.value)} 
                        />
                      )}
                    </label>
                  </div>
                </div>

                <CorrectableRow 
                  label="ตรวจสอบ RCD" 
                  value={item?.rcdCheck} 
                  onChange={v => handleSub(idx, "rcdCheck", v)} 
                  detail 
                />

                <CorrectableRow 
                  label="RCD Type B ที่เมน" 
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