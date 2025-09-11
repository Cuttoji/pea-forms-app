// ChargerSection.jsx
// ฟอร์มเครื่องอัดประจุยานยนต์ไฟฟ้า (Reusable ไม่ผูกเลขหัวข้อ)
// ใช้ initialChargerFields และสามารถตั้ง sectionTitle ได้ตามฟอร์ม

import React from "react";

/**
 * props:
 * - fields: Array ของ field schema
 * - values: Object ของค่าปัจจุบัน
 * - onChange: (name, value) => void
 * - sectionTitle: string
 * - disabled: boolean (optional)
 */
function ChargerSection({ fields, values, onChange, sectionTitle, disabled = false }) {
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
                    opt === "ถูกต้อง" || opt === "ติดตั้งแล้ว"
                      ? "text-green-600 focus:ring-green-500"
                      : opt === "ต้องแก้ไข" || opt === "ยังไม่ติดตั้ง"
                      ? "text-red-600 focus:ring-red-500"
                      : "text-blue-600 focus:ring-blue-500"
                  }
                />
                <span
                  className={
                    opt === "ถูกต้อง" || opt === "ติดตั้งแล้ว"
                      ? "text-green-700"
                      : opt === "ต้องแก้ไข" || opt === "ยังไม่ติดตั้ง"
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
    <div className="border border-gray-200 rounded-xl p-6 mb-4 bg-gradient-to-br from-white to-gray-50/50 shadow">
      <div className="mb-4 font-semibold text-orange-700 text-sm">{sectionTitle}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={field.name} className="mb-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChargerSection;