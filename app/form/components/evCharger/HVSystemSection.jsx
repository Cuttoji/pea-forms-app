import React from "react";

// Dynamic items based on prefix
const HV_ABOVE_ITEMS = (prefix) => [
  {
    key: `${prefix}_1`,
    label: `${prefix}.1 ชนิดสายตัวนำ`,
    hasText: true,
    detailPlaceholder: "ระบุรายละเอียด (ถ้ามี)..."
  },
  {
    key: `${prefix}_2`,
    label: `${prefix}.2 ขนาดสายตัวนำ`,
    hasText: true,
    detailPlaceholder: "ระบุขนาดสาย (ตร.มม.)"
  },
  { key: `${prefix}_3`, label: `${prefix}.3 สภาพเสาและระยะห่างระหว่างเสา` },
  { key: `${prefix}_4`, label: `${prefix}.4 การประกอบอุปกรณ์หัวเสา` },
  { key: `${prefix}_5`, label: `${prefix}.5 การประกอบชุดยึดโยง` },
  { key: `${prefix}_6`, label: `${prefix}.6 ลูกถ้วยและฉนวนของอุปกรณ์ไฟฟ้าเหมาะสมกับสภาพแวดล้อม` },
  { key: `${prefix}_7`, label: `${prefix}.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)` },
  { key: `${prefix}_8`, label: `${prefix}.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้` },
  { key: `${prefix}_9`, label: `${prefix}.9 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)` },
  { key: `${prefix}_10`, label: `${prefix}.10 สภาพของจุดต่อสาย` },
  { key: `${prefix}_11`, label: `${prefix}.11 การต่อลงดิน` }
];

const HV_UNDER_ITEMS = (prefix) => [
  {
    key: `${prefix}_1`,
    label: `${prefix}.1 ชนิดสายตัวนำ`,
    hasText: true,
    detailPlaceholder: "ระบุรายละเอียด (ถ้ามี)..."
  },
  {
    key: `${prefix}_2`,
    label: `${prefix}.2 ขนาดสายตัวนำ`,
    hasText: true,
    detailPlaceholder: "ระบุขนาดสาย (ตร.มม.)"
  },
  { key: `${prefix}_3`, label: `${prefix}.3 สภาพสายส่วนที่มองเห็นได้` },
  { key: `${prefix}_4`, label: `${prefix}.4 ความตึงของสายช่วงเข้า-ออก อาคารหรือสิ่งก่อสร้าง` },
  { key: `${prefix}_5`, label: `${prefix}.5 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)` },
  { key: `${prefix}_6`, label: `${prefix}.6 สภาพของจุดต่อสาย` },
  { key: `${prefix}_7`, label: `${prefix}.7 การต่อลงดิน` }
];

const DROPOUT_OPTIONS = [
  { value: "dropout", label: "ดรอพเอาท์ฟิวส์คัตเอาท์" },
  { value: "switch", label: "สวิตช์ตัดตอน" },
  { value: "rmu", label: "RMU (ไม่รวมถึงฟังก์ชั่นการทำงาน)" }
];

export default function HVSystemSection({
  sectionNumber = 2, // หรือ 3, ส่งมาจาก parent
  value = {},
  onChange = () => {}
}) {
  const currentMode = value.mode || "above";
  const prefix = `${sectionNumber}.${currentMode === "above" ? 1 : 2}`;
  const items = currentMode === "above" ? HV_ABOVE_ITEMS(prefix) : HV_UNDER_ITEMS(prefix);

  // Generic radio handler
  const handleRadio = (name, result) => {
    onChange({
      ...value,
      [name]: {
        ...value[name],
        result,
        detail: result === "ต้องแก้ไข" ? (value[name]?.detail || "") : ""
      }
    });
  };

  const handleDetail = (name, detail) => {
    onChange({
      ...value,
      [name]: {
        ...value[name],
        detail
      }
    });
  };

  const handleText = (name, text) => {
    onChange({
      ...value,
      [name]: {
        ...value[name],
        text
      }
    });
  };

  // Mode change handler
  const handleModeChange = (newMode) => {
    onChange({
      ...value,
      mode: newMode
    });
  };

  // 3.3 เครื่องปลดวงจรต้นทาง (แสดงเฉพาะเมื่อเป็น section 3)
  const hv33 = value.hv33 || {};
  const handleHv33Radio = val => {
    onChange({ ...value, hv33: { ...hv33, result: val } });
  };
  const handleHv33Detail = val => {
    onChange({ ...value, hv33: { ...hv33, detail: val } });
  };
  const handleHv33Type = val => {
    onChange({ ...value, hv33: { ...hv33, type: val } });
  };
  const handleHv33SwitchType = val => {
    onChange({ ...value, hv33: { ...hv33, switchType: val } });
  };

  // Other section handler
  const handleOther = val => {
    onChange({ ...value, other: val });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden mt-8">
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{sectionNumber}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800">ระบบจำหน่ายแรงสูง</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Mode Selection */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">เลือกประเภทระบบ</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="hvMode"
                value="above"
                checked={currentMode === "above"}
                onChange={() => handleModeChange("above")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">ระบบจำหน่ายเหนือดิน</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="hvMode"
                value="under"
                checked={currentMode === "under"}
                onChange={() => handleModeChange("under")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">ระบบจำหน่ายใต้ดิน</span>
            </label>
          </div>
        </div>

        {/* Dynamic Items based on mode */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {currentMode === "above" ? "ระบบจำหน่ายเหนือดิน" : "ระบบจำหน่ายใต้ดิน"}
          </h3>
          {items.map(item => (
            <div key={item.key} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="mb-3">
                <div className="text-gray-700 font-medium text-sm leading-relaxed">
                  {item.label}
                  {item.hasText && (
                    <input
                      type="text"
                      placeholder={item.detailPlaceholder}
                      className="ml-3 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 w-48"
                      value={value[item.key]?.text || ""}
                      onChange={e => handleText(item.key, e.target.value)}
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-green-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name={item.key}
                      value="ถูกต้อง"
                      checked={value[item.key]?.result === "ถูกต้อง"}
                      onChange={() => handleRadio(item.key, "ถูกต้อง")}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-green-700 font-medium">✓ ถูกต้อง</span>
                  </label>
                  
                  <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-red-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name={item.key}
                      value="ต้องแก้ไข"
                      checked={value[item.key]?.result === "ต้องแก้ไข"}
                      onChange={() => handleRadio(item.key, "ต้องแก้ไข")}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-red-700 font-medium">✗ ต้องแก้ไข</span>
                  </label>
                </div>
                
                {value[item.key]?.result === "ต้องแก้ไข" && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      รายละเอียดการแก้ไข
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-700 resize-none"
                      rows={2}
                      placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                      value={value[item.key]?.detail || ""}
                      onChange={e => handleDetail(item.key, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3.3 เครื่องปลดวงจรต้นทาง (แสดงเฉพาะเมื่อ sectionNumber = 3) */}
        {sectionNumber === 3 && (
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              3.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)
            </h4>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-green-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="hv33"
                    value="ถูกต้อง"
                    checked={hv33.result === "ถูกต้อง"}
                    onChange={() => handleHv33Radio("ถูกต้อง")}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-green-700 font-medium">✓ ถูกต้อง</span>
                </label>
                
                <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-red-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="hv33"
                    value="ต้องแก้ไข"
                    checked={hv33.result === "ต้องแก้ไข"}
                    onChange={() => handleHv33Radio("ต้องแก้ไข")}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-red-700 font-medium">✗ ต้องแก้ไข</span>
                </label>
              </div>

              {hv33.result === "ต้องแก้ไข" && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รายละเอียดการแก้ไข
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-700 resize-none"
                    rows={2}
                    placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                    value={hv33.detail || ""}
                    onChange={e => handleHv33Detail(e.target.value)}
                  />
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-gray-700 mb-3">ประเภทอุปกรณ์</h5>
                <div className="flex flex-wrap gap-4">
                  {DROPOUT_OPTIONS.map(opt => (
                    <label key={opt.value} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={Array.isArray(hv33.type) ? hv33.type.includes(opt.value) : false}
                        onChange={e => {
                          let next;
                          if (Array.isArray(hv33.type)) {
                            next = e.target.checked
                              ? [...hv33.type, opt.value]
                              : hv33.type.filter(v => v !== opt.value);
                          } else {
                            next = e.target.checked ? [opt.value] : [];
                          }
                          handleHv33Type(next);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                
                {(Array.isArray(hv33.type) ? hv33.type.includes("switch") : hv33.type === "switch") && (
                  <div className="mt-3">
                    <input
                      type="text"
                      className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                      placeholder="ระบุชนิดสวิตช์"
                      value={hv33.switchType || ""}
                      onChange={e => handleHv33SwitchType(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            {sectionNumber}.{sectionNumber === 3 ? 4 : 3} อื่นๆ
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <textarea
              className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500"
              rows={3}
              placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)..."
              value={value.other || ""}
              onChange={e => handleOther(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}