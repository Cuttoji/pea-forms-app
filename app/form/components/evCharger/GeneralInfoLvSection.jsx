import React from "react";

/**
 * GeneralInfoLvSection สำหรับฟอร์ม EV Charger
 * Props:
 * - data: object (ข้อมูลฟอร์ม)
 * - onChange: (field, value) => void
 */
export default function GeneralInfoLvSection({ data = {}, onChange = () => {} }) {
  return (
    <section className="bg-white border border-black rounded-xl p-6 mb-6">
      {/* หัวข้อการไฟฟ้า */}
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <span className="text-base font-medium">การไฟฟ้า</span>
        <input
          type="text"
          className="border-b border-dotted border-black outline-none px-2 w-64 bg-transparent"
          value={data.powerAuthority || ""}
          onChange={e => onChange("powerAuthority", e.target.value)}
        />
        <span className="ml-4 text-base font-medium">การตรวจสอบครั้งที่</span>
        <input
          type="text"
          className="border-b border-dotted border-black outline-none px-2 w-14 bg-transparent"
          value={data.inspectionNo || ""}
          onChange={e => onChange("inspectionNo", e.target.value)}
        />
        <span className="ml-4">วันที่</span>
        <input
          type="date"
          className="border-b border-dotted border-black outline-none px-2 w-36 bg-transparent"
          value={data.inspectionDate || ""}
          onChange={e => onChange("inspectionDate", e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <span className="text-base font-medium">
          การตรวจสอบตามคำร้องขอใช้ไฟเลขที่
        </span>
        <input
          type="text"
          className="border-b border-dotted border-black outline-none px-2 w-40 bg-transparent"
          value={data.requestNo || ""}
          onChange={e => onChange("requestNo", e.target.value)}
        />
        <span className="ml-4">วันที่</span>
        <input
          type="date"
          className="border-b border-dotted border-black outline-none px-2 w-36 bg-transparent"
          value={data.requestDate || ""}
          onChange={e => onChange("requestDate", e.target.value)}
        />
      </div>

      <div className="font-bold text-base mt-4 mb-2">1. ข้อมูลทั่วไป</div>
      {/* เลือกประเภทผู้ขอ */}
      <div className="flex flex-col md:flex-row gap-6 mb-2">
        <div className="flex-1">
          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="userType"
              value="individual"
              checked={data.userType === "individual"}
              onChange={() => onChange("userType", "individual")}
            />
            <span className="font-medium">ชื่อ-นามสกุล ผู้ขอใช้ไฟฟ้า (นาย/นาง/นางสาว)</span>
          </label>
          <input
            type="text"
            placeholder="ชื่อ-นามสกุล"
            className="border-b border-dotted border-black outline-none px-2 w-full bg-transparent mb-1"
            value={data.customerName || ""}
            onChange={e => onChange("customerName", e.target.value)}
            disabled={data.userType !== "individual"}
          />
          <input
            type="text"
            placeholder="โทรศัพท์"
            className="border-b border-dotted border-black outline-none px-2 w-full bg-transparent"
            value={data.phone || ""}
            onChange={e => onChange("phone", e.target.value)}
            disabled={data.userType !== "individual"}
          />
        </div>
        <div className="flex-1">
          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="userType"
              value="corp"
              checked={data.userType === "corp"}
              onChange={() => onChange("userType", "corp")}
            />
            <span className="font-medium">ชื่อนิติบุคคล ที่ขอใช้ไฟฟ้า</span>
          </label>
          <input
            type="text"
            placeholder="ชื่อนิติบุคคล"
            className="border-b border-dotted border-black outline-none px-2 w-full bg-transparent mb-1"
            value={data.corpName || ""}
            onChange={e => onChange("corpName", e.target.value)}
            disabled={data.userType !== "corp"}
          />
          <input
            type="text"
            placeholder="โทรศัพท์"
            className="border-b border-dotted border-black outline-none px-2 w-full bg-transparent"
            value={data.corpPhone || ""}
            onChange={e => onChange("corpPhone", e.target.value)}
            disabled={data.userType !== "corp"}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-gray-800 text-sm mb-1">ที่อยู่</label>
        <input
          type="text"
          className="border-b border-dotted border-black outline-none px-2 w-full bg-transparent"
          value={data.address || ""}
          onChange={e => onChange("address", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 items-end mt-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-800 text-sm">ระบบไฟฟ้า</span>
          <label className="inline-flex items-center gap-1">
            <input
              type="radio"
              name="systemType"
              value="22kv"
              checked={data.systemType === "22kv"}
              onChange={() => onChange("systemType", "22kv")}
            />
            <span className="select-none"> 3 เฟส (400 / 230 โวลต์)</span>
          </label>
          <label className="inline-flex items-center gap-1 ml-4">
            <input
              type="radio"
              name="systemType"
              value="33kv"
              checked={data.systemType === "33kv"}
              onChange={() => onChange("systemType", "33kv")}
            />
            <span className="select-none"> 1 เฟส (230 โวลต์) </span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-800 text-sm">กระแสโหลด (ด้านแรงต่ำ) รวมโดยประมาณ</span>
          <input
            type="text"
            className="border-b border-dotted border-black outline-none px-2 w-20 bg-transparent"
            value={data.load || ""}
            onChange={e => onChange("load", e.target.value)}
          />
          <span className="text-gray-600">A</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 items-end mt-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-800 text-sm">ติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้ารวม</span>
          <input
            type="number"
            min={0}
            className="border-b border-dotted border-black outline-none px-2 w-16 bg-transparent"
            value={data.evChargerCount || ""}
            onChange={e => onChange("evChargerCount", e.target.value)}
          />
          <span className="text-gray-600">เครื่อง</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-800 text-sm">พิกัดกำลังไฟฟ้ารวมของเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
          <input
            type="text"
            className="border-b border-dotted border-black outline-none px-2 w-24 bg-transparent"
            value={data.evChargerPower || ""}
            onChange={e => onChange("evChargerPower", e.target.value)}
          />
          <span className="text-gray-600">กิโลวัตต์ (kW)</span>
        </div>
      </div>
    </section>
  );
}