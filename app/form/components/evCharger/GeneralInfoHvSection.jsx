import React from "react";

/**
 * GeneralInfoHvSection สำหรับฟอร์ม EV Charger - Government form style UI/UX
 * Props:
 * - data: object (ข้อมูลฟอร์ม)
 * - onChange: (field, value) => void
 */
export default function GeneralInfoHvSection({ data = {}, onChange = () => {} }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
      {/* Header Section */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#5b2d90] text-white px-6 py-4">
          <h1 className="text-xl font-bold text-center">
            แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
            <span className="block text-lg font-medium mt-1">สำหรับผู้ใช้ไฟฟ้าแรงสูง</span>
          </h1>
        </div>
        
        {/* Form Header Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">การไฟฟ้า</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.powerAuthority || ""}
                onChange={e => onChange("powerAuthority", e.target.value)}
                placeholder="การไฟฟ้า"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">การตรวจสอบครั้งที่</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.inspectionNo || ""}
                onChange={e => onChange("inspectionNo", e.target.value)}
                placeholder="ครั้งที่"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">วันที่ตรวจสอบ</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.inspectionDate || ""}
                onChange={e => onChange("inspectionDate", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
            <div>
              <label className="block text-gray-600 mb-1">การตรวจสอบตามคำร้องขอใช้ไฟเลขที่</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.requestNo || ""}
                onChange={e => onChange("requestNo", e.target.value)}
                placeholder="เลขที่"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">วันที่คำร้อง</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.requestDate || ""}
                onChange={e => onChange("requestDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: ข้อมูลทั่วไป */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">ข้อมูลทั่วไป</h2>
          </div>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          {/* ประเภทผู้ขอใช้ไฟฟ้า */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800 mb-3">ประเภทผู้ขอใช้ไฟฟ้า</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* บุคคลธรรมดา */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="individual"
                    checked={data.userType === "individual"}
                    onChange={() => onChange("userType", "individual")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">บุคคลธรรมดา</span>
                </label>
                <div className="ml-6 space-y-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">ชื่อ-นามสกุล</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ${
                        data.userType !== "individual" ? "bg-gray-100" : ""
                      }`}
                      value={data.customerName || ""}
                      onChange={e => onChange("customerName", e.target.value)}
                      placeholder="กรอกชื่อ-นามสกุล"
                      disabled={data.userType !== "individual"}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">โทรศัพท์</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ${
                        data.userType !== "individual" ? "bg-gray-100" : ""
                      }`}
                      value={data.phone || ""}
                      onChange={e => onChange("phone", e.target.value)}
                      placeholder="กรอกเบอร์โทรศัพท์"
                      disabled={data.userType !== "individual"}
                    />
                  </div>
                </div>
              </div>
              
              {/* นิติบุคคล */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="corp"
                    checked={data.userType === "corp"}
                    onChange={() => onChange("userType", "corp")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">นิติบุคคล</span>
                </label>
                <div className="ml-6 space-y-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">ชื่อนิติบุคคล</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ${
                        data.userType !== "corp" ? "bg-gray-100" : ""
                      }`}
                      value={data.corpName || ""}
                      onChange={e => onChange("corpName", e.target.value)}
                      placeholder="กรอกชื่อนิติบุคคล"
                      disabled={data.userType !== "corp"}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">โทรศัพท์</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ${
                        data.userType !== "corp" ? "bg-gray-100" : ""
                      }`}
                      value={data.corpPhone || ""}
                      onChange={e => onChange("corpPhone", e.target.value)}
                      placeholder="กรอกเบอร์โทรศัพท์"
                      disabled={data.userType !== "corp"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ที่อยู่ */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">ที่อยู่</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 resize-none"
              rows={3}
              value={data.address || ""}
              onChange={e => onChange("address", e.target.value)}
              placeholder="กรอกที่อยู่"
            />
          </div>

          {/* ระบบไฟฟ้าและกระแสโหลด */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-3">ระบบไฟฟ้า</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="systemType"
                    value="22kv"
                    checked={data.systemType === "22kv"}
                    onChange={() => onChange("systemType", "22kv")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">22 kV</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="systemType"
                    value="33kv"
                    checked={data.systemType === "33kv"}
                    onChange={() => onChange("systemType", "33kv")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">33 kV</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">กระแสโหลด (ด้านแรงต่ำ) รวมโดยประมาณ (A)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.load || ""}
                onChange={e => onChange("load", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* ข้อมูลเครื่องอัดประจุ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">จำนวนเครื่องอัดประจุยานยนต์ไฟฟ้า (เครื่อง)</label>
              <input
                type="number"
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.evChargerCount || ""}
                onChange={e => onChange("evChargerCount", e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">พิกัดกำลังไฟฟ้ารวม (kW)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.evChargerPower || ""}
                onChange={e => onChange("evChargerPower", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 mt-1">ℹ️</div>
              <div className="text-sm text-blue-800">
                <strong>หมายเหตุ:</strong> กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง 
                เพื่อให้การตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าเป็นไปอย่างราบรื่น 
                สำหรับผู้ใช้ไฟฟ้าแรงสูงจะต้องมีวิศวกรที่ได้รับใบอนุญาตลงนามรับรองเอกสาร
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}