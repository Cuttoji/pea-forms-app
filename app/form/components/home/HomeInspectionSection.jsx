import React from "react";

// เพิ่มการเก็บค่า wireType, wireOther, wireSize ใน data
const INSPECTION_ITEMS = [
  {
    label: "2.1 สายตัวนำประธานเข้าอาคาร",
    subItems: [
      {
        label: "ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502",
      },
      {
        label: "ข) ชนิดและขนาด",
        isWireType: true // ใช้สำหรับ render แบบพิเศษด้านล่าง
      },
      {
        label: "ค) วิธีการเดินสาย",
        wiringMethods: [
          {
            label: "เดินสายบนลูกถ้วยฉนวนในอากาศ",
            key: "overhead",
            checkItems: [
              { label: "1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตรถ้ามียานพาหนะลอดผ่าน" },
              { label: "2) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" },
            ],
          },
          {
            label: "เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)",
            key: "underground",
            checkItems: [
              { label: "1) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์(บริภัณฑ์ประธาน)",
    subItems: [
      { label: "ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" },
      { 
        label: "ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์ ขนาด AT......A", 
        isATInput: true // เพิ่ม flag สำหรับ render input ขนาด AT
      },
      { label: "ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)" },
    ],
  },
  {
    label: "2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์",
    subItems: [
      { label: "ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน ขนาดสายต่อหลักดิน......ตร.มม." ,
        isUnderInput: true
      },
      { label: "ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (หรือ 25 โอห์มในบางกรณี)" },
      { label: "ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน" },
      { label: "ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์" }
    ],
  }
];

const WIRE_TYPES = [
  { value: "iec01", label: "IEC 01" },
  { value: "nyy", label: "NYY" },
  { value: "cv", label: "CV" },
  { value: "other", label: "อื่นๆ" }
];

export default function HomeInspectionSection({ data = {}, onChange = () => {} }) {
  // flatCheckList ใช้สำหรับ index ของการตอบแต่ละข้อ (ไม่รวม wireType)
  const flatCheckList = [];
  INSPECTION_ITEMS.forEach(main => {
    if (main.subItems) {
      main.subItems.forEach(sub => {
        if (!sub.isWireType) {
          if (sub.wiringMethods) {
            sub.wiringMethods.forEach(method => {
              if (method.checkItems) {
                method.checkItems.forEach(item => flatCheckList.push(item.label));
              }
            });
          } else if (sub.subItems) {
            sub.subItems.forEach(subsub => {
              if (subsub.checkItems) {
                subsub.checkItems.forEach(item => flatCheckList.push(item.label));
              } else {
                flatCheckList.push(subsub.label);
              }
            });
          } else {
            flatCheckList.push(sub.label);
          }
        }
      });
    } else {
      flatCheckList.push(main.label);
    }
  });

  const items = data.items && data.items.length === flatCheckList.length
    ? data.items
    : flatCheckList.map(label => ({ label, result: "", detail: "" }));

  const handleRadio = (idx, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, result: value, detail: value === "ต้องแก้ไข" ? (item.detail || "") : "" } : item
    );
    onChange("items", updated);
  };

  const handleDetail = (idx, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, detail: value } : item
    );
    onChange("items", updated);
  };

  // ข้อมูลสำหรับชนิดสายไฟ/ขนาด
  const wireType = data.wireType || "";
  const wireOther = data.wireOther || "";
  const wireSize = data.wireSize || "";
  const wireResult = data.wireResult || "";
  const wireDetail = data.wireDetail || "";

  // เพิ่มข้อมูลสำหรับ AT และ Underground
  const atSize = data.atSize || "";
  const undergroundSize = data.undergroundSize || "";

  // เพิ่มข้อมูลสำหรับวิธีการเดินสาย
  const selectedWiringMethods = data.selectedWiringMethods || [];

  // RCD (2.4)
  const rcdResult = data.rcdResult || "";
  const rcdNote = data.rcdNote || "";

  // สำหรับ wireType/size แบบใหม่
  const handleWireChange = (key, value) => {
    onChange(key, value);
  };

  // Handle wiring method selection
  const handleWiringMethodToggle = (methodKey) => {
    const updated = selectedWiringMethods.includes(methodKey)
      ? selectedWiringMethods.filter(k => k !== methodKey)
      : [...selectedWiringMethods, methodKey];
    onChange("selectedWiringMethods", updated);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">2</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800">การตรวจสอบ</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8 text-gray-700">
        {/* รายการตรวจสอบ 2.1-2.3 */}
        {INSPECTION_ITEMS.map((section, sectionIdx) => (
          <div key={section.label} className="border border-gray-200 rounded-lg p-4">
            <div className="font-semibold text-gray-800 mb-4 text-base border-b border-gray-200 pb-2">
              {section.label}
            </div>
            {section.subItems ? section.subItems.map((sub, subIdx) => {
              // ข) ชนิดและขนาด (special layout)
              if (sub.isWireType) {
                return (
                  <div key={sub.label} className="mb-6">
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <div className="font-medium text-gray-700">{sub.label}</div>
                      <div className="flex flex-wrap gap-4 items-center mt-3">
                        {WIRE_TYPES.map(w => (
                          <label key={w.value} className="inline-flex items-center">
                            <input
                              type="radio"
                              name="wireType"
                              value={w.value}
                              checked={wireType === w.value}
                              onChange={e => {
                                handleWireChange("wireType", e.target.value);
                                if (e.target.value !== "other") handleWireChange("wireOther", "");
                              }}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">{w.label}</span>
                          </label>
                        ))}
                        {wireType === "other" && (
                          <input
                            type="text"
                            className="text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="ระบุอื่นๆ"
                            value={wireOther}
                            onChange={e => handleWireChange("wireOther", e.target.value)}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-gray-700">ขนาด</span>
                        <input
                          type="text"
                          className="text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-24"
                          placeholder="เช่น 16"
                          value={wireSize}
                          onChange={e => handleWireChange("wireSize", e.target.value)}
                        />
                        <span className="text-gray-700">ตร.มม.</span>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-3">
                          <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-green-50 cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="wireResult"
                              value="ถูกต้อง"
                              checked={wireResult === "ถูกต้อง"}
                              onChange={() => handleWireChange("wireResult", "ถูกต้อง")}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-green-700 font-medium">✓ ถูกต้อง</span>
                          </label>
                          <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-red-50 cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="wireResult"
                              value="ต้องแก้ไข"
                              checked={wireResult === "ต้องแก้ไข"}
                              onChange={() => handleWireChange("wireResult", "ต้องแก้ไข")}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-red-700 font-medium">✗ ต้องแก้ไข</span>
                          </label>
                        </div>
                        
                        {wireResult === "ต้องแก้ไข" && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              รายละเอียดการแก้ไข
                            </label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-700 resize-none"
                              rows={2}
                              placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                              value={wireDetail}
                              onChange={e => handleWireChange("wireDetail", e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              // ปกติ
              if (sub.wiringMethods) {
                return (
                  <div key={sub.label} className="ml-4 mb-4">
                    <div className="font-medium text-gray-700 mb-3 bg-gray-50 p-3 rounded-md">
                      {sub.label}
                    </div>
                    <div className="space-y-3">
                      {sub.wiringMethods.map((method, methodIdx) => {
                        const isSelected = selectedWiringMethods.includes(method.key);
                        return (
                          <div key={method.key} className="ml-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-md mb-3">
                              <div className="flex items-center gap-3">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleWiringMethodToggle(method.key)}
                                    className="text-blue-600 focus:ring-blue-500 rounded"
                                  />
                                  <span className="ml-2 font-medium text-gray-600">
                                    {method.label}
                                  </span>
                                </label>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="space-y-3">
                                {method.checkItems.map((item, itemIdx) => {
                                  const flatIdx = flatCheckList.findIndex(l => l === item.label);
                                  return (
                                    <CheckItemRow
                                      key={item.label}
                                      label={item.label}
                                      idx={flatIdx}
                                      value={items[flatIdx]}
                                      onRadio={handleRadio}
                                      onDetail={handleDetail}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
              if (sub.subItems) {
                return (
                  <div key={sub.label} className="ml-4 mb-4">
                    <div className="font-medium text-gray-700 mb-3 bg-gray-50 p-3 rounded-md">
                      {sub.label}
                    </div>
                    <div className="space-y-3">
                      {sub.subItems.map((subsub, subsubIdx) => {
                        if (subsub.checkItems) {
                          return (
                            <div key={subsub.label} className="ml-4 mb-4">
                              <div className="font-medium text-gray-600 mb-3 bg-blue-50 p-3 rounded-md">
                                {subsub.label}
                              </div>
                              <div className="space-y-3">
                                {subsub.checkItems.map((item, itemIdx) => {
                                  const flatIdx = flatCheckList.findIndex(l => l === item.label);
                                  return (
                                    <CheckItemRow
                                      key={item.label}
                                      label={item.label}
                                      idx={flatIdx}
                                      value={items[flatIdx]}
                                      onRadio={handleRadio}
                                      onDetail={handleDetail}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          );
                        } else {
                          const flatIdx = flatCheckList.findIndex(l => l === subsub.label);
                          return (
                            <CheckItemRow
                              key={subsub.label}
                              label={subsub.label}
                              idx={flatIdx}
                              value={items[flatIdx]}
                              onRadio={handleRadio}
                              onDetail={handleDetail}
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              }
              // ปกติ
              const flatIdx = flatCheckList.findIndex(l => l === sub.label);
              return (
                <div key={sub.label} className="mb-4">
                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                    <div className="flex items-baseline gap-2 text-gray-700">
                      <span className="font-medium">
                        {sub.isATInput ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์ ขนาด AT</span>
                            <input
                              type="text"
                              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-20 text-center"
                              
                              value={atSize}
                              onChange={e => handleWireChange("atSize", e.target.value)}
                            />
                            <span>A</span>
                          </div>
                        ) : sub.isUnderInput ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน ขนาดสายต่อหลักดิน</span>
                            <input
                              type="text"
                              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-20 text-center"
                              
                              value={undergroundSize}
                              onChange={e => handleWireChange("undergroundSize", e.target.value)}
                            />
                            <span>ตร.มม.</span>
                          </div>
                        ) : (
                          sub.label
                        )}
                      </span>
                    </div>
                  </div>
                  <CheckItemRow
                    label=""
                    idx={flatIdx}
                    value={items[flatIdx]}
                    onRadio={handleRadio}
                    onDetail={handleDetail}
                  />
                </div>
              );
            }) : (
              (() => {
                const flatIdx = flatCheckList.findIndex(l => l === section.label);
                return (
                  <CheckItemRow
                    label=""
                    idx={flatIdx}
                    value={items[flatIdx]}
                    onRadio={handleRadio}
                    onDetail={handleDetail}
                  />
                );
              })()
            )}
          </div>
        ))}

        {/* 2.4 RCD */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-semibold text-gray-800 mb-4 text-base border-b border-gray-200 pb-2">
            2.4 เครื่องตัดไฟรั่ว (RCD)
          </div>
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-gray-700 text-sm">
              ติดตั้งเครื่องตัดไฟรั่ว ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="rcdResult"
                  value="ถูกต้อง"
                  checked={rcdResult === "ถูกต้อง"}
                  onChange={() => onChange("rcdResult", "ถูกต้อง")}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-3 text-green-700 font-medium">✓ ถูกต้อง</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="rcdResult"
                  value="ไม่ติดตั้ง"
                  checked={rcdResult === "ไม่ติดตั้ง"}
                  onChange={() => onChange("rcdResult", "ไม่ติดตั้ง")}
                  className="text-yellow-600 focus:ring-yellow-500"
                />
                <span className="ml-3 text-yellow-800 font-medium">⚠ ไม่ประสงค์ติดตั้ง/แจ้งความเสี่ยงแล้ว</span>
              </label>
            </div>
            {rcdResult === "ไม่ติดตั้ง" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมายเหตุ / เหตุผลที่ไม่ติดตั้ง
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700 resize-none"
                  rows={3}
                  placeholder="ระบุเหตุผลที่ไม่ติดตั้ง RCD..."
                  value={rcdNote}
                  onChange={e => onChange("rcdNote", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ปกติ
function CheckItemRow({ label, idx, value = {}, onRadio, onDetail }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {label && (
        <div className="mb-3 text-gray-700 font-medium text-sm leading-relaxed">
          {label}
        </div>
      )}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-green-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name={`result-${idx}`}
              value="ถูกต้อง"
              checked={value.result === "ถูกต้อง"}
              onChange={() => onRadio(idx, "ถูกต้อง")}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-green-700 font-medium">✓ ถูกต้อง</span>
          </label>
          <label className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-red-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name={`result-${idx}`}
              value="ต้องแก้ไข"
              checked={value.result === "ต้องแก้ไข"}
              onChange={() => onRadio(idx, "ต้องแก้ไข")}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-red-700 font-medium">✗ ต้องแก้ไข</span>
          </label>
        </div>
        {value.result === "ต้องแก้ไข" && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดการแก้ไข
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-700 resize-none"
              rows={2}
              placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
              value={value.detail || ""}
              onChange={e => onDetail(idx, e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}