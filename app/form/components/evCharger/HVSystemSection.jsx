import React from "react";

// CorrectableRow component
function CorrectableRow({ label, value, onChange, detail = false, placeholder = "โปรดระบุรายละเอียด" }) {
  return (
    <div className="mt-3">
      <div className="flex-1 text-gray-700 font-medium">{label}</div>
      <div className="flex items-start gap-6">
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

// Dynamic items based on prefix
const HV_ABOVE_ITEMS = (prefix) => [
  {
    key: `${prefix}_1`,
    label: `${prefix}.1 ชนิดสายตัวนำ`,
    hasInput: true,
    inputPlaceholder: "ระบุชนิดสาย",
    labelSuffix: "เหมาะสมกับกำลังที่ใช้และสภาพแวดล้อม"
  },
  {
    key: `${prefix}_2`,
    label: `${prefix}.2 ขนาดสายตัวนำ`,
    hasInput: true,
    inputPlaceholder: "ระบุขนาด",
    labelSuffix: "ตร.มม."
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
    hasInput: true,
    inputPlaceholder: "ระบุชนิดสาย",
    labelSuffix: "เหมาะสมกับกำลังที่ใช้และสภาพแวดล้อม"
  },
  {
    key: `${prefix}_2`,
    label: `${prefix}.2 ขนาดสายตัวนำ`,
    hasInput: true,
    inputPlaceholder: "ระบุขนาด",
    labelSuffix: "ตร.มม."
  },
  { key: `${prefix}_3`, label: `${prefix}.3 สภาพสายส่วนที่มองเห็นได้` },
  { key: `${prefix}_4`, label: `${prefix}.4 ความตึงของสายช่วงเข้า-ออก อาคารหรือสิ่งก่อสร้าง` },
  { key: `${prefix}_5`, label: `${prefix}.5 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)` },
  { key: `${prefix}_6`, label: `${prefix}.6 สภาพของจุดต่อสาย` },
  { key: `${prefix}_7`, label: `${prefix}.7 การต่อลงดิน` }
];

export default function HVSystemSection({
  sectionNumber = 3, // หรือ 3, ส่งมาจาก parent
  value = {},
  onChange = () => {}
}) {
  const currentMode = value.mode || "above";
  const prefix = `${sectionNumber}.${currentMode === "above" ? 1 : 2}`;
  const items = currentMode === "above" ? HV_ABOVE_ITEMS(prefix) : HV_UNDER_ITEMS(prefix);

  // Handler for updating item values
  const handleItemChange = (key, newValue) => {
    onChange({
      ...value,
      [key]: newValue
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
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden mt-8 text-gray-700">
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
          {items.map(item => {
            const itemValue = value[item.key] || { result: null, text: "", detail: "" };
            
            // Create label with input field if needed
            const renderLabel = () => {
              if (item.hasInput) {
                return (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{item.label}</span>
                    <input
                      type="text"
                      placeholder={item.inputPlaceholder}
                      className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 min-w-[120px]"
                      value={itemValue.text || ""}
                      onChange={e => handleText(item.key, e.target.value)}
                    />
                    {item.labelSuffix && <span>{item.labelSuffix}</span>}
                  </div>
                );
              }
              return item.label;
            };

            return (
              <div key={item.key} className="border border-gray-200 rounded-lg p-4 bg-white">
                <CorrectableRow
                  label={renderLabel()}
                  value={itemValue}
                  onChange={(newValue) => handleItemChange(item.key, newValue)}
                  detail={true}
                  placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                />
              </div>
            );
          })}
        </div>

        {/* เครื่องปลดวงจรต้นทาง (แสดงเสมอ) */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            {sectionNumber}.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)
          </h4>
          
          <div className="space-y-4">
            {/* เลือกชนิดอุปกรณ์ก่อน */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3">เลือกชนิดอุปกรณ์ที่เกี่ยวข้อง</h5>
              <div className="flex flex-col gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Array.isArray(hv33.type) ? hv33.type.includes("dropout") : false}
                      onChange={e => {
                        let next;
                        if (Array.isArray(hv33.type)) {
                          next = e.target.checked ? [...hv33.type, "dropout"] : hv33.type.filter(v => v !== "dropout");
                        } else {
                          next = e.target.checked ? ["dropout"] : [];
                        }
                        handleHv33Type(next);
                      }}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-gray-700">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
                  </label>

                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Array.isArray(hv33.type) ? hv33.type.includes("switch") : false}
                      onChange={e => {
                        let next;
                        if (Array.isArray(hv33.type)) {
                          next = e.target.checked ? [...hv33.type, "switch"] : hv33.type.filter(v => v !== "switch");
                        } else {
                          next = e.target.checked ? ["switch"] : [];
                        }
                        handleHv33Type(next);
                      }}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-gray-700">สวิตช์ตัดตอน</span>

                    {Array.isArray(hv33.type) && hv33.type.includes("switch") && (
                      <input
                        type="text"
                        className="ml-3 px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 flex-1 max-w-xs"
                        placeholder="ระบุชนิดสวิตช์..."
                        value={hv33.switchType || ""}
                        onChange={e => handleHv33SwitchType(e.target.value)}
                      />
                    )}
                  </label>

                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Array.isArray(hv33.type) ? hv33.type.includes("rmu") : false}
                      onChange={e => {
                        let next;
                        if (Array.isArray(hv33.type)) {
                          next = e.target.checked ? [...hv33.type, "rmu"] : hv33.type.filter(v => v !== "rmu");
                        } else {
                          next = e.target.checked ? ["rmu"] : [];
                        }
                        handleHv33Type(next);
                      }}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                <span className="text-gray-700">RMU (ไม่รวมถึงฟังก์ชั่นการทำงาน)</span>
              </label>
            </div>
          </div>

          {/* แสดงการประเมินผล (ถูกต้อง/ต้องแก้ไข) หลังจากเลือกอุปกรณ์แล้ว */}
          {Array.isArray(hv33.type) && hv33.type.length > 0 && (
            <div className="mt-4">
              <CorrectableRow
                label=""
                value={hv33}
                onChange={(newValue) => onChange({ ...value, hv33: newValue })}
                detail={true}
                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
              />
            </div>
          )}
        </div>
      </div>        {/* Other Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            {sectionNumber}.4 อื่นๆ
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