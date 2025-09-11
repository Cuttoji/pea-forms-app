// SubCircuitSection.jsx
// ฟอร์มวงจรย่อย (Reusable ไม่ผูกเลขหัวข้อ)
// ใช้ initialSubCircuitFields และสามารถตั้ง sectionTitle ได้ตามฟอร์ม

import React from "react";

/**
 * props:
 * - fields: Array ของ field schema
 * - values: Object ของค่าปัจจุบัน
 * - onChange: (name, value) => void
 * - sectionTitle: string
 * - disabled: boolean (optional)
 */
function SubCircuitSection({ values, onChange, sectionTitle, disabled = false, onRemove, canRemove = true }) {
  // render field ตาม type
  function renderField(field) {
    switch (field.type) {
      case "radio":
        return (
          <div className="flex gap-4">
            {field.options.map(opt => (
              <label key={opt} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name={field.name}
                  value={opt}
                  checked={values[field.name] === opt}
                  onChange={e => onChange(field.name, e.target.value)}
                  disabled={disabled}
                  className={
                    opt === "ถูกต้อง"
                      ? "text-green-600 focus:ring-green-500"
                      : opt === "ต้องแก้ไข"
                      ? "text-red-600 focus:ring-red-500"
                      : "text-blue-600 focus:ring-blue-500"
                  }
                />
                <span
                  className={
                    opt === "ถูกต้อง"
                      ? "text-green-700"
                      : opt === "ต้องแก้ไข"
                      ? "text-red-700"
                      : "text-gray-700"
                  }
                >
                  {opt}
                </span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={!!values[field.name]}
            onChange={e => onChange(field.name, e.target.checked)}
            disabled={disabled}
            className="text-blue-600 focus:ring-blue-500"
          />
        );
      case "checkboxGroup":
        return (
          <div className="flex gap-4 flex-wrap">
            {field.options.map(opt => (
              <label key={opt.value} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values[field.name]?.includes(opt.value) || false}
                  onChange={e => {
                    const arr = values[field.name] || [];
                    if (e.target.checked) {
                      onChange(field.name, [...arr, opt.value]);
                    } else {
                      onChange(field.name, arr.filter(v => v !== opt.value));
                    }
                  }}
                  disabled={disabled}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "checkboxWithNumber":
        return (
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={!!values[field.name + "_checked"]}
              onChange={e => onChange(field.name + "_checked", e.target.checked)}
              disabled={disabled}
              className="text-blue-600 focus:ring-blue-500"
            />
            <input
              type="number"
              min={0}
              value={values[field.name] || ""}
              onChange={e => onChange(field.name, e.target.value)}
              disabled={disabled || !values[field.name + "_checked"]}
              placeholder={field.label}
              className="border p-1 rounded w-24 text-xs"
            />
          </div>
        );
      case "checkboxWithText":
        return (
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={!!values[field.name + "_checked"]}
              onChange={e => onChange(field.name + "_checked", e.target.checked)}
              disabled={disabled}
              className="text-blue-600 focus:ring-blue-500"
            />
            <input
              type="text"
              value={values[field.name] || ""}
              onChange={e => onChange(field.name, e.target.value)}
              disabled={disabled || !values[field.name + "_checked"]}
              placeholder={field.label}
              className="border p-1 rounded w-32 text-xs"
            />
          </div>
        );
      case "number":
        return (
          <input
            type="number"
            min={0}
            value={values[field.name] || ""}
            onChange={e => onChange(field.name, e.target.value)}
            disabled={disabled}
            placeholder={field.label}
            className="border p-1 rounded w-24 text-xs"
          />
        );
      case "textarea":
        return (
          <textarea
            rows={2}
            value={values[field.name] || ""}
            onChange={e => onChange(field.name, e.target.value)}
            disabled={disabled}
            placeholder={field.label}
            className="border p-2 rounded w-full text-xs"
          />
        );
      case "text":
      default:
        return (
          <input
            type="text"
            value={values[field.name] || ""}
            onChange={e => onChange(field.name, e.target.value)}
            disabled={disabled}
            placeholder={field.label}
            className="border p-1 rounded w-full text-xs"
          />
        );
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h6 className="text-sm text-gray-700 font-semibold">{sectionTitle}</h6>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-xs"
          >
            ✕ ลบวงจร
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ชื่อวงจร:</label>
          <input
            type="text"
            value={values.circuit_name || ""}
            onChange={(e) => onChange('circuit_name', e.target.value)}
            className="text-gray-700 w-full p-1 border border-gray-300 rounded text-xs"
            placeholder="เช่น EV Charger 1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ประเภทวงจร:</label>
          <select
            value={values.circuit_type || ""}
            onChange={(e) => onChange('circuit_type', e.target.value)}
            className="text-gray-700 w-full p-1 border border-gray-300 rounded text-xs"
          >
            <option value="">เลือก</option>
            <option value="เครื่องอัดประจุ">เครื่องอัดประจุ</option>
            <option value="ไฟแสงสว่าง">ไฟแสงสว่าง</option>
            <option value="ปลั๊กไฟ">ปลั๊กไฟ</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">เบรกเกอร์ (A):</label>
          <input
            type="number"
            value={values.circuit_breaker_at || ""}
            onChange={(e) => onChange('circuit_breaker_at', e.target.value)}
            className="text-gray-700 w-full p-1 border border-gray-300 rounded text-xs"
            min={0}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-2">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={`circuit_result_${sectionTitle}`}
            value="ถูกต้อง"
            checked={values.result === "ถูกต้อง"}
            onChange={(e) => onChange('result', e.target.value)}
            className="text-green-600 focus:ring-green-500"
          />
          <span className="ml-1 text-green-700 text-xs">ถูกต้อง</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={`circuit_result_${sectionTitle}`}
            value="ต้องแก้ไข"
            checked={values.result === "ต้องแก้ไข"}
            onChange={(e) => onChange('result', e.target.value)}
            className="text-red-600 focus:ring-red-500"
          />
          <span className="ml-1 text-red-700 text-xs">ต้องแก้ไข</span>
        </label>
      </div>

      {values.result === "ต้องแก้ไข" && (
        <textarea
          value={values.detail || ""}
          onChange={(e) => onChange('detail', e.target.value)}
          rows={1}
          className="w-full p-1 border border-gray-300 rounded text-xs resize-none mt-2"
          placeholder="รายละเอียดการแก้ไข"
        />
      )}
    </div>
  );
}

export default SubCircuitSection;