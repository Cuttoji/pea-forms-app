import React from "react";

// Helper ถูกต้อง/ต้องแก้ไข
function CorrectableRow({ label, value, onChange, detail = false, placeholder = "โปรดระบุรายละเอียด" }) {
  return (
    <div className="mt-3">
      <div className="flex items-start ">
        <label className="flex items-center gap-2 min-w-20">
          <input
            type="radio"
            checked={value?.result === "ถูกต้อง"}
            onChange={() => onChange({ ...value, result: "ถูกต้อง", detail: "" })}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium text-green-700">ถูกต้อง</span>
        </label>
        <label className="flex items-center gap-2 min-w-24">
          <input
            type="radio"
            checked={value?.result === "ต้องแก้ไข"}
            onChange={() => onChange({ ...value, result: "ต้องแก้ไข" })}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium text-red-700">ต้องแก้ไข</span>
        </label>
        {value?.result === "ต้องแก้ไข" && detail && (
          <div className="flex-1">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder={placeholder}
              value={value?.detail || ""}
              onChange={e => onChange({ ...value, detail: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// สำหรับรองรับ loop วงจรหม้อแปลงหลายตัว
export default function TransformerSection({ value = {}, onChange = () => {} }) {
  // Convert to array format if needed for internal handling
  const transformers = Array.isArray(value) ? value : [value];
  
  // Handle changes - convert back to single object if originally single
  const handleChange = (newTransformers) => {
    if (Array.isArray(value)) {
      onChange(newTransformers);
    } else {
      // If original was single object, return single object
      onChange(newTransformers[0] || {});
    }
  };

  // เพิ่มหม้อแปลงใหม่ (only for array mode)
  const addTransformer = () => {
    if (Array.isArray(value)) {
      handleChange([
        ...transformers,
        {
          type: [],
          typeOther: "",
          correct: {},
          overcurrent: {},
          overcurrentType: [],
          overcurrentTypeOther: "",
          overcurrentAmp: "",
          overcurrentIc: "",
          surge: {},
          surgeKV: "",
          surgeKA: "",
          ground: {},
          groundOhm: "",
          ext: {
            silica: {},
            bushing: {},
            oilLevel: {},
            leak: {},
          },
          sign: {},
          other: "",
          lv: {},
        },
      ]);
    }
  };

  // ลบหม้อแปลง (only for array mode)
  const removeTransformer = (idx) => {
    if (Array.isArray(value)) {
      handleChange(transformers.filter((_, i) => i !== idx));
    }
  };

  // เปลี่ยนค่าของหม้อแปลงแต่ละตัว
  const handleTransformer = (idx, key, v) => {
    const newArr = transformers.map((t, i) => i === idx ? { ...t, [key]: v } : t);
    handleChange(newArr);
  };

  // Checkbox array
  const handleCheckbox = (idx, key, v) => {
    const arr = transformers[idx][key] || [];
    const next = arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v];
    handleTransformer(idx, key, next);
  };

  return (
    <div className="space-y-6 text-gray-700">
      {/* Section 4: หม้อแปลง */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">4</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">หม้อแปลง</h2>
          </div>
        </div>

        <div className="px-6 py-6">
          {transformers.length === 0 && (
            <div className="text-gray-500 text-center py-8">ยังไม่มีข้อมูลหม้อแปลง</div>
          )}
          
          {transformers.map((item, idx) => (
            <div key={idx} className="space-y-6">
              {/* Transformer Header */}
                <div className="flex items-center justify-between">
                  {Array.isArray(value) && transformers.length > 1 && (
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={() => removeTransformer(idx)}
                    >
                      ลบ
                    </button>
                  )}
              </div>

              {/* 4.1 คุณสมบัติทั่วไปของหม้อแปลง */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.1 คุณสมบัติทั่วไปของหม้อแปลง</h4>
                
                {/* Transformer Specifications in one line */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">หม้อแปลงเครื่องที่</span>
                  <input
                    type="text"
                    className="w-20 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    placeholder="..."
                  />
                  <span className="text-gray-700">ขนาด</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.general?.capacity || ""}
                    onChange={e => handleTransformer(idx, "general", { ...item.general, capacity: e.target.value })}
                  />
                  <span className="text-gray-700">kVA</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">พิกัดแรงดันด้านแรงสูง</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.general?.hvVoltage || ""}
                    onChange={e => handleTransformer(idx, "general", { ...item.general, hvVoltage: e.target.value })}
                  />
                  <span className="text-gray-700">kV</span>
                  <span className="text-gray-700 ml-4">พิกัดแรงดันด้านแรงต่ำ</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.general?.lvVoltage || ""}
                    onChange={e => handleTransformer(idx, "general", { ...item.general, lvVoltage: e.target.value })}
                  />
                  <span className="text-gray-700">V</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">% Impedance</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.general?.impedance || ""}
                    onChange={e => handleTransformer(idx, "general", { ...item.general, impedance: e.target.value })}
                  />
                </div>

                {/* Transformer Type */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">ชนิด</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.general?.transformerType === "Oil"}
                      onChange={() => handleTransformer(idx, "general", { ...item.general, transformerType: "Oil" })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-700">Oil</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.general?.transformerType === "Dry"}
                      onChange={() => handleTransformer(idx, "general", { ...item.general, transformerType: "Dry" })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-700">Dry</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.general?.transformerType === "อื่นๆ"}
                      onChange={() => handleTransformer(idx, "general", { ...item.general, transformerType: "อื่นๆ" })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-700">อื่นๆ</span>
                  </label>
                  {item.general?.transformerType === "อื่นๆ" && (
                    <input
                      type="text"
                      className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 text-sm"
                      placeholder="ระบุ"
                      value={item.general?.transformerTypeOther || ""}
                      onChange={e => handleTransformer(idx, "general", { ...item.general, transformerTypeOther: e.target.value })}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">Vector Group</span>
                  <input
                    type="text"
                    className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.general?.vectorGroup || ""}
                    onChange={e => handleTransformer(idx, "general", { ...item.general, vectorGroup: e.target.value })}
                  />
                  <span className="text-gray-700 ml-4">พิกัดการทนกระแสลัดวงจรสูงสุด</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.general?.shortCircuitCurrent || ""}
                    onChange={e => handleTransformer(idx, "general", { ...item.general, shortCircuitCurrent: e.target.value })}
                  />
                  <span className="text-gray-700">kA</span>
                </div>

                {/* Correctness Assessment */}
                <CorrectableRow
                  label=""
                  value={item.general?.correct}
                  onChange={v => handleTransformer(idx, "general", { ...item.general, correct: v })}
                  detail
                />
              </div>
              </div>

              {/* 4.2 ลักษณะการติดตั้ง */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.2 ลักษณะการติดตั้ง</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["แขวน", "นั่งร้าน", "ตั้งพื้น", "ตั้งบนดาดฟ้า", "ห้องหม้อแปลง"].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.type?.includes(opt)}
                        onChange={() => handleCheckbox(idx, "type", opt)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.type?.includes("อื่นๆ")}
                        onChange={() => handleCheckbox(idx, "type", "อื่นๆ")}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                      />
                      <span className="text-gray-700">อื่นๆ</span>
                    </label>
                    {item.type?.includes("อื่นๆ") && (
                      <input
                        type="text"
                        className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 text-sm"
                        placeholder="โปรดระบุ"
                        value={item.typeOther || ""}
                        onChange={e => handleTransformer(idx, "typeOther", e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <CorrectableRow
                  label=""
                  value={item.correct}
                  onChange={v => handleTransformer(idx, "correct", v)}
                  detail
                />
              </div>
              </div>

              {/* 4.3 เครื่องป้องกันกระแสเกิน */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.3 เครื่องป้องกันกระแสเกินด้านไฟเข้า</h4>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.overcurrentType?.includes("ดรอพเอาท์ฟิวส์คัตเอาท์")}
                      onChange={() => handleCheckbox(idx, "overcurrentType", "ดรอพเอาท์ฟิวส์คัตเอาท์")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-700">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.overcurrentType?.includes("เซอร์กิตเบรกเกอร์")}
                      onChange={() => handleCheckbox(idx, "overcurrentType", "เซอร์กิตเบรกเกอร์")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-700">เซอร์กิตเบรกเกอร์</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.overcurrentType?.includes("อื่นๆ")}
                      onChange={() => handleCheckbox(idx, "overcurrentType", "อื่นๆ")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-700">อื่นๆ</span>
                  </label>
                  {item.overcurrentType?.includes("อื่นๆ") && (
                    <input
                      type="text"
                      className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 text-sm"
                      placeholder="ระบุ"
                      value={item.overcurrentTypeOther || ""}
                      onChange={e => handleTransformer(idx, "overcurrentTypeOther", e.target.value)}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">พิกัดกระแสต่อเนื่อง</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.overcurrentAmp || ""}
                    onChange={e => handleTransformer(idx, "overcurrentAmp", e.target.value)}
                  />
                  <span className="text-gray-700">A</span>
                  <span className="text-gray-700 ml-4">พิกัดตัดกระแสลัดวงจรสูงสุด (Interrupting Capacity , IC)</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.overcurrentIc || ""}
                    onChange={e => handleTransformer(idx, "overcurrentIc", e.target.value)}
                  />
                  <span className="text-gray-700">kA</span>
                </div>

                <CorrectableRow
                  label=""
                  value={item.overcurrent}
                  onChange={v => handleTransformer(idx, "overcurrent", v)}
                  detail
                />
              </div>
              </div>

              {/* 4.4 การติดตั้งกับดักเสิร์จแรงสูง */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.4 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</h4>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">พิกัดแรงดัน</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.surgeKV || ""}
                    onChange={e => handleTransformer(idx, "surgeKV", e.target.value)}
                  />
                  <span className="text-gray-700">kV</span>
                  <span className="text-gray-700 ml-4">พิกัดกระแส</span>
                  <input
                    type="text"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                    value={item.surgeKA || ""}
                    onChange={e => handleTransformer(idx, "surgeKA", e.target.value)}
                  />
                  <span className="text-gray-700">kA</span>
                </div>

                <CorrectableRow
                  label=""
                  value={item.surge}
                  onChange={v => handleTransformer(idx, "surge", v)}
                  detail
                />
              </div>
              </div>

              {/* 4.5 การประกอบสายดิน */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.5 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง</h4>
                <CorrectableRow
                  label=""
                  value={item.ground}
                  onChange={v => handleTransformer(idx, "ground", v)}
                  detail
                />
              </div>
              </div>

              {/* 4.6 ค่าความต้านทานดิน */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <label className="text-base font-medium text-gray-800">4.6 ค่าความต้านทานดินของระบบแรงสูง
                
                  <input
                    type="text"
                    className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2"
                    value={item.groundOhm || ""}
                    onChange={e => handleTransformer(idx, "groundOhm", e.target.value)}
                  />
                  โอห์ม</label>
                <div className="text-sm text-gray-600 ml-4">
                  * ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน
                  ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม
                  หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม
                </div>
              </div>
              </div>

              {/* 4.7 สภาพภายนอกหม้อแปลง */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)</h4>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 ml-2">
                    4.7.1 สารดูดความชื้น
                  </div>
                  <CorrectableRow
                    value={item.ext?.silica}
                    onChange={v => handleTransformer(idx, "ext", { ...item.ext, silica: v })}
                    detail
                  />
                  <div className="text-sm text-gray-600 ml-2">
                    4.7.2 สภาพบุชชิ่ง
                  </div>
                  <CorrectableRow
                    value={item.ext?.bushing}
                    onChange={v => handleTransformer(idx, "ext", { ...item.ext, bushing: v })}
                    detail
                  />
                  <div className="text-sm text-gray-600 ml-2"> 
                    4.7.3 ระดับน้ำมัน
                  </div>
                  <CorrectableRow
                    value={item.ext?.oilLevel}
                    onChange={v => handleTransformer(idx, "ext", { ...item.ext, oilLevel: v })}
                    detail
                  />
                  <div className="text-sm text-gray-600 ml-2">
                    4.7.4 การรั่วซึมของน้ำมันหม้อแปลง
                  </div>
                  <CorrectableRow
                    value={item.ext?.leak}
                    onChange={v => handleTransformer(idx, "ext", { ...item.ext, leak: v })}
                    detail
                  />
                </div>
              </div>
              </div>

              {/* 4.8 ป้ายเตือน */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.8 ป้ายเตือน</h4>
                <div className="text-sm text-gray-600 ml-4">
                  “อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น"
                </div>
                <CorrectableRow
                  label='"อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น"'
                  value={item.sign}
                  onChange={v => handleTransformer(idx, "sign", v)}
                  detail
                />
              </div>
              </div>

              {/* 4.9 อื่นๆ */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-800">4.9 อื่นๆ</h4>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 resize-none"
                  rows={3}
                  value={item.other || ""}
                  onChange={e => handleTransformer(idx, "other", e.target.value)}
                  placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)"
                />
              </div>
              </div>

              
              {idx < transformers.length - 1 && <hr className="my-8 border-gray-200" />}
            </div>
          ))}

          {/* Add Transformer Button */}
          {Array.isArray(value) && (
            <div className="text-center mt-6">
              <button
                type="button"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-colors duration-200"
                onClick={addTransformer}
              >
                + เพิ่มหม้อแปลง
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}