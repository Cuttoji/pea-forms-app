import React, { useState } from "react";

const initialState = {
  // 3.1
  standard: "",
  standardCorrect: null,
  standardNote: "",
  conductorType: "",
  otherConductorType: "",
  phaseWireSize: "",
  phaseWireSizeCorrect: null,
  phaseWireSizeNote: "",
  neutralWireSize: "",
  neutralWireSizeCorrect: null,
  neutralWireSizeNote: "",
  phaseIdentificationCorrect: null,
  phaseIdentificationNote: "",
  cablePathwayCorrect: null,
  cablePathwayNote: "",
  wiringMethod: "",
  cableTraySize: { width: "", height: "" },
  conduitSize: "",
  conduitSizeWall: "",
  otherWiringMethod: "",
  wiringMethodCorrect: null,
  wiringMethodNote: "",
  conduitType: "",
  otherConduitType: "",
  conduitTypeCorrect: null,
  conduitTypeNote: "",
  // 3.2
  mainBreakerStandardCorrect: null,
  mainBreakerStandardNote: "",
  mainBreakerSize: "",
  mainBreakerSizeCorrect: null,
  mainBreakerSizeNote: "",
  shortCircuitRating: "",
  shortCircuitRatingCorrect: null,
  shortCircuitRatingNote: "",
  // 3.3
  groundWireSize: "",
  groundWireSizeCorrect: null,
  groundWireSizeNote: "",
  groundingSystem: "",
  groundingSystemCorrect: null,
  groundingSystemNote: "",
  // 3.4
  groundingConfig: "",
  tncsLoadBalance: false,
  tncsNeutralProtection: false,
  tncsTouchVoltageProtection: false,
  tncsCorrect: null,
  tncsNote: "",
  ttCorrect: null,
  ttNote: "",
  ttPartialCorrect: null,
  ttPartialNote: "",
};

export default function LVSystemSectionPEA() {
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderCorrectIncorrectField = (name, correctField, noteField, isTextarea = false, rows = 1) => (
    <div className="mt-3">
      <div className="flex items-start gap-6">
        <label className="flex items-center gap-2 min-w-20">
          <input
            type="radio"
            name={name}
            checked={formData[correctField] === true}
            onChange={() => handleInputChange(correctField, true)}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-sm font-medium text-green-700">ถูกต้อง</span>
        </label>
        <label className="flex items-center gap-2 min-w-24">
          <input
            type="radio"
            name={name}
            checked={formData[correctField] === false}
            onChange={() => handleInputChange(correctField, false)}
            className="w-4 h-4 text-red-600"
          />
          <span className="text-sm font-medium text-red-700">ต้องแก้ไข</span>
        </label>
        {formData[correctField] === false && (
          <div className="flex-1">
            {isTextarea ? (
              <textarea
                value={formData[noteField] || ""}
                onChange={(e) => handleInputChange(noteField, e.target.value)}
                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            ) : (
              <input
                type="text"
                value={formData[noteField] || ""}
                onChange={(e) => handleInputChange(noteField, e.target.value)}
                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 text-gray-700">
      {/* 3.1 วงจรประธานแรงต่ำ */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">3.1 วงจรประธานแรงต่ำ</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* 3.1.1 มาตรฐานสายเมน */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน
            </label>
            <div className="flex flex-wrap gap-4 mb-3">
              {["มอก. 11-2553", "มอก. 293-2541", "IEC 60502"].map((std) => (
                <label key={std} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="standard"
                    value={std}
                    checked={formData.standard === std}
                    onChange={() => handleInputChange("standard", std)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{std}</span>
                </label>
              ))}
            </div>
            {renderCorrectIncorrectField("standard_status", "standardCorrect", "standardNote")}
          </div>

          {/* 3.1.2 ชนิดสายตัวนำ */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">3.1.2 ชนิดสายตัวนำ</label>
            <div className="flex flex-wrap gap-4">
              {["IEC01", "NYY", "CV"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="conductor_type"
                    value={type}
                    checked={formData.conductorType === type}
                    onChange={() => handleInputChange("conductorType", type)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="conductor_type"
                  value="other"
                  checked={formData.conductorType === "other"}
                  onChange={() => handleInputChange("conductorType", "other")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">อื่นๆ</span>
                {formData.conductorType === "other" && (
                  <input
                    type="text"
                    value={formData.otherConductorType}
                    onChange={(e) => handleInputChange("otherConductorType", e.target.value)}
                    placeholder="ระบุ"
                    className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-sm w-32"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 3.1.3 ขนาดสายเฟส */}
          <div className="form-group">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium text-gray-700">3.1.3 ขนาดสายเฟส</label>
              <input
                type="text"
                value={formData.phaseWireSize}
                onChange={(e) => handleInputChange("phaseWireSize", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-20"
              />
              <span className="text-sm text-gray-600">ตร.มม.</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-md mb-3">
              <p className="text-sm text-gray-700">
                พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
              </p>
            </div>
            {renderCorrectIncorrectField("phase_wire_status", "phaseWireSizeCorrect", "phaseWireSizeNote")}
          </div>

          {/* 3.1.4 ขนาดสายนิวทรัล */}
          <div className="form-group">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium text-gray-700">3.1.4 ขนาดสายนิวทรัล</label>
              <input
                type="text"
                value={formData.neutralWireSize}
                onChange={(e) => handleInputChange("neutralWireSize", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-20"
              />
              <span className="text-sm text-gray-600">ตร.มม.</span>
            </div>
            {renderCorrectIncorrectField("neutral_wire_status", "neutralWireSizeCorrect", "neutralWireSizeNote")}
          </div>

          {/* 3.1.5 ระบุเฟสสายตัวนำ */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
            </label>
            {renderCorrectIncorrectField("phase_id_status", "phaseIdentificationCorrect", "phaseIdentificationNote")}
          </div>

          {/* 3.1.6 ช่องเดินสาย */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
            </label>
            {renderCorrectIncorrectField("cable_pathway_status", "cablePathwayCorrect", "cablePathwayNote")}
          </div>

          {/* 3.1.7 วิธีการเดินสาย */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">3.1.7 วิธีการเดินสาย</label>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="overhead"
                  checked={formData.wiringMethod === "overhead"}
                  onChange={() => handleInputChange("wiringMethod", "overhead")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="cable_tray"
                  checked={formData.wiringMethod === "cable_tray"}
                  onChange={() => handleInputChange("wiringMethod", "cable_tray")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                <input
                  type="text"
                  value={formData.cableTraySize.width}
                  onChange={(e) =>
                    handleInputChange("cableTraySize", { ...formData.cableTraySize, width: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={formData.wiringMethod !== "cable_tray"}
                />
                <span className="text-sm">มม. x</span>
                <input
                  type="text"
                  value={formData.cableTraySize.height}
                  onChange={(e) =>
                    handleInputChange("cableTraySize", { ...formData.cableTraySize, height: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={formData.wiringMethod !== "cable_tray"}
                />
                <span className="text-sm">มม.</span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="direct_burial"
                  checked={formData.wiringMethod === "direct_burial"}
                  onChange={() => handleInputChange("wiringMethod", "direct_burial")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="underground_conduit"
                  checked={formData.wiringMethod === "underground_conduit"}
                  onChange={() => handleInputChange("wiringMethod", "underground_conduit")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                <input
                  type="text"
                  value={formData.conduitSize}
                  onChange={(e) => handleInputChange("conduitSize", e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={formData.wiringMethod !== "underground_conduit"}
                />
                <span className="text-sm">นิ้ว</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="wall_conduit"
                  checked={formData.wiringMethod === "wall_conduit"}
                  onChange={() => handleInputChange("wiringMethod", "wall_conduit")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                <input
                  type="text"
                  value={formData.conduitSizeWall}
                  onChange={(e) => handleInputChange("conduitSizeWall", e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={formData.wiringMethod !== "wall_conduit"}
                />
                <span className="text-sm">นิ้ว</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="other"
                  checked={formData.wiringMethod === "other"}
                  onChange={() => handleInputChange("wiringMethod", "other")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">อื่นๆ ระบุ</span>
                <input
                  type="text"
                  value={formData.otherWiringMethod}
                  onChange={(e) => handleInputChange("otherWiringMethod", e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                  disabled={formData.wiringMethod !== "other"}
                  placeholder="ระบุรายละเอียด"
                />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>หมายเหตุ:</strong> การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร ส่วนสายตัวนำอะลูมิเนียมอนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร
              </p>
            </div>
            {renderCorrectIncorrectField("wiring_method_status", "wiringMethodCorrect", "wiringMethodNote", true, 5)}
          </div>

          {/* 3.1.8 ประเภทท่อร้อยสาย */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">3.1.8 ประเภทท่อร้อยสาย</label>
            <div className="space-y-4 mb-4">
              <div>
                <div className="font-medium text-gray-700 mb-2">ท่อโลหะ</div>
                <div className="ml-4 flex flex-wrap gap-4">
                  {[
                    { value: "RMC", label: "หนา (RMC)" },
                    { value: "IMC", label: "หนาปานกลาง (IMC)" },
                    { value: "EMT", label: "บาง (EMT)" },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="conduit_type"
                        value={type.value}
                        checked={formData.conduitType === type.value}
                        onChange={() => handleInputChange("conduitType", type.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-2">ท่ออโลหะ</div>
                <div className="ml-4 flex flex-wrap gap-4">
                  {[
                    { value: "RNC", label: "แข็ง (RNC)" },
                    { value: "ENT", label: "อ่อน (ENT)" },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="conduit_type"
                        value={type.value}
                        checked={formData.conduitType === type.value}
                        onChange={() => handleInputChange("conduitType", type.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="conduit_type"
                  value="other"
                  checked={formData.conduitType === "other"}
                  onChange={() => handleInputChange("conduitType", "other")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">อื่นๆ ระบุ</span>
                <input
                  type="text"
                  value={formData.otherConduitType}
                  onChange={(e) => handleInputChange("otherConduitType", e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                  disabled={formData.conduitType !== "other"}
                  placeholder="ระบุรายละเอียด"
                />
              </div>
            </div>
            {renderCorrectIncorrectField("conduit_type_status", "conduitTypeCorrect", "conduitTypeNote", true, 2)}
          </div>
        </div>
      </section>
      {/* เพิ่ม section 3.2, 3.3, 3.4 ต่อได้ตามตัวอย่างข้างบน */}
    </div>
  );
}