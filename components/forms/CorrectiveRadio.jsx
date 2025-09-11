"use client";

import React, { memo, useCallback } from 'react';

const wireTypes = ["IEC 01", "NYY", "CV", "อื่นๆ"];

const CorrectiveRadio = memo(({
  items = [],
  values = [],
  onChange,
  disabled = false,
}) => {
  // สถานะ (ถูกต้อง/ไม่ถูกต้อง)
  const handleStatusChange = useCallback((idx, result) => {
    const updated = values.map((item, i) =>
      i === idx ? { ...item, result } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // รายละเอียด
  const handleNoteChange = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, detail: value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // ขนาดสาย
  const handleValueChange = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // ชนิดสาย
  const handleWireTypeChange = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx
        ? { ...item, wire_type: value, wire_type_other: value !== "อื่นๆ" ? "" : item.wire_type_other }
        : item
    );
    onChange(updated);
  }, [values, onChange]);

  // กรณีเลือก "อื่นๆ"
  const handleWireTypeOtherChange = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, wire_type_other: value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // สำหรับ "ชนิดสายตัวนำ เหมาะสมกับพื้นที่และสภาพแวดล้อม"
  const handleConductorTypeChange = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, conductor_description: value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // ค่าความต้านทานดิน value1
  const handleValue1Change = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, value1: value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // ค่าความต้านทานดิน value2
  const handleValue2Change = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, value2: value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // สำหรับ type (ประเภทการติดตั้ง)
  const handleTypeChange = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, type: value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  return (
    <div className="space-y-5">
      {items.map((item, idx) => (
        <div key={item.section + (item.sub_item || '') + item.item_title} className="relative border border-gray-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-white to-gray-50/50 shadow group">
          <div className="mb-2 font-semibold text-gray-800 flex gap-2">
            <span className="text-purple-700">{item.section}{item.sub_item ? ` (${item.sub_item})` : ""}</span>
            <span>{item.item_title}</span>
          </div>

          {/* เฉพาะข้อ "ชนิดสายตัวนำ" */}
          {item.item_title.includes("ชนิดสายตัวนำ") && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เหมาะสมกับพื้นที่และสภาพแวดล้อม:
              </label>
              <textarea
                rows={2}
                className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                placeholder="ระบุชนิดสายตัวนำที่เหมาะสมกับพื้นที่และสภาพแวดล้อม เช่น สายเคเบิลใต้ดิน, สายอากาศ, สายป้องกันไฟไหม้ ฯลฯ"
                value={values[idx]?.conductor_description || ""}
                onChange={e => handleConductorTypeChange(idx, e)}
                disabled={disabled}
              />
            </div>
          )}

          {/* เฉพาะข้อ "ชนิดสาย" */}
          {item.section === "2.1" && item.item_title.includes("ชนิดสาย") && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-4 items-center text-gray-700">
                <span className="font-medium">ชนิดสาย:</span>
                {wireTypes.map(type => (
                  <label key={type} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name={`wire_type-${idx}`}
                      value={type}
                      checked={values[idx]?.wire_type === type}
                      onChange={e => handleWireTypeChange(idx, e)}
                      disabled={disabled}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
                {values[idx]?.wire_type === "อื่นๆ" && (
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-md ml-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ระบุชนิดสาย"
                    value={values[idx]?.wire_type_other || ""}
                    onChange={e => handleWireTypeOtherChange(idx, e)}
                    disabled={disabled}
                  />
                )}
              </div>
            </div>
          )}

          {/* ช่องกรอกขนาดสาย - ใช้ได้กับทุกข้อที่มีคำว่า "ขนาดสาย" */}
          {(item.item_title.includes("ขนาดสาย")) && (
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">ขนาดสาย:</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ขนาด"
                  value={values[idx]?.value || ""}
                  onChange={e => handleValueChange(idx, e)}
                  disabled={disabled}
                />
                <span className="text-gray-600">ตร.มม.</span>
              </div>
            </div>
          )}
           {/* ช่องกรอกขนาดสาย - ใช้ได้กับทุกข้อที่มีคำว่า "ค่าความต้านทาน" */}
          {(item.item_title.includes("ค่าความต้านทานดินรวม.")) && (
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">ค่าความต้านทานดินรวม.:</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={values[idx]?.value || ""}
                  onChange={e => handleValueChange(idx, e)}
                  disabled={disabled}
                />
                <span className="text-gray-600">โอห์ม</span>
              </div>
            </div>
          )}

          {/* เฉพาะข้อ section 1.17 การต่อลงดิน */}
          {item.section === "1.17"||item.section === "3.15" && item.item_title.includes("ค่าความต้านทานดินต่อจุด") && (
            <div className="mb-4 space-y-3">
              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">ค่าความต้านทานดินต่อจุด:</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค่า"
                  value={values[idx]?.value1 || ""}
                  onChange={e => handleValue1Change(idx, e)}
                  disabled={disabled}
                />
                <span className="text-gray-600">(โอห์ม)</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">ระบบ:</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค่า"
                  value={values[idx]?.value2 || ""}
                  onChange={e => handleValue2Change(idx, e)}
                  disabled={disabled}
                />
                <span className="text-gray-600">(โอห์ม)</span>
              </div>
            </div>
          )}

          {/* เฉพาะข้อ section 3 การติดตั้งหม้อแปลง */}
          {item.section === "3" && item.item_title === " การติดตั้งหม้อแปลง " && (
            <div className="mb-4 space-y-4">
              <div className="text-lg font-medium text-gray-800 mb-3">การติดตั้งหม้อแปลง</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">TR:</label>
                  <input
                    type="text"
                    className="text-gray-700 w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ø"
                    value={values[idx]?.value1 || ""}
                    onChange={e => handleValue1Change(idx, e)}
                    disabled={disabled}
                  />
                  <span className="text-gray-600">Ø</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="kVA"
                    value={values[idx]?.value2 || ""}
                    onChange={e => handleValue2Change(idx, e)}
                    disabled={disabled}
                  />
                  <span className="text-gray-600">kVA</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-gray-700">ประเภทการติดตั้ง:</div>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name={`installation_type-${idx}`}
                      value="แขวนเสา"
                      checked={values[idx]?.type === "แขวนเสา"}
                      onChange={e => handleTypeChange(idx, e)}
                      disabled={disabled}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>แขวนเสา</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name={`installation_type-${idx}`}
                      value="นั่งร้าน"
                      checked={values[idx]?.type === "นั่งร้าน"}
                      onChange={e => handleTypeChange(idx, e)}
                      disabled={disabled}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>นั่งร้าน</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Radio ถูกต้อง/ไม่ถูกต้อง */}
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="inline-flex items-center cursor-pointer p-2">
              <input
                type="radio"
                name={`result-${idx}`}
                value="ถูกต้อง"
                checked={values[idx]?.result === 'ถูกต้อง'}
                onChange={() => handleStatusChange(idx, 'ถูกต้อง')}
                disabled={disabled}
              />
              <span className="ml-2 text-green-700">ถูกต้อง</span>
            </label>
            <label className="inline-flex items-center cursor-pointer p-2">
              <input
                type="radio"
                name={`result-${idx}`}
                value="ต้องแก้ไข"
                checked={values[idx]?.result === 'ต้องแก้ไข'}
                onChange={() => handleStatusChange(idx, 'ต้องแก้ไข')}
                disabled={disabled}
              />
              <span className="ml-2 text-red-700">ต้องแก้ไข</span>
            </label>
          </div>

          {/* รายละเอียดถ้าต้องแก้ไข */}
          {(values[idx]?.result === 'ต้องแก้ไข') && (
            <div className="mb-2 text-gray-700 bg-gray-100">
              <textarea
                rows={2}
                className="w-full border p-2 text-sm"
                placeholder="รายละเอียดการแก้ไข"
                value={values[idx]?.detail || ''}
                onChange={e => handleNoteChange(idx, e)}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

CorrectiveRadio.displayName = 'CorrectiveRadio';
export default CorrectiveRadio;