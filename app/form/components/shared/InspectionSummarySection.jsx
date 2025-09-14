import React from "react";

export default function InspectionSummarySection({ value = {}, onChange = () => {} }) {
  return (
    <section className="border rounded-xl p-4 bg-white mb-6">
      <h2 className="font-bold text-lg mb-4">สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</h2>
      <div className="flex flex-wrap gap-6 mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="summaryType"
            value="ถาวร"
            checked={value.summaryType === "ถาวร"}
            onChange={() => onChange({...value, summaryType: "ถาวร"})}
          />
          <span className="ml-2">ติดตั้งมิเตอร์ถาวร</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="summaryType"
            value="ชั่วคราว"
            checked={value.summaryType === "ชั่วคราว"}
            onChange={() => onChange({...value, summaryType: "ชั่วคราว"})}
          />
          <span className="ml-2">ติดตั้งมิเตอร์ชั่วคราว</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="summaryType"
            value="ปรับปรุง"
            checked={value.summaryType === "ปรับปรุง"}
            onChange={() => onChange({...value, summaryType: "ปรับปรุง"})}
          />
          <span className="ml-2">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</span>
        </label>
      </div>
      <textarea
        className="w-full border p-2 min-h-[80px] text-sm"
        placeholder="หมายเหตุหรือรายละเอียดเพิ่มเติม (ถ้ามี)"
        value={value.note || ""}
        onChange={e => onChange({...value, note: e.target.value})}
      />
    </section>
  );
}