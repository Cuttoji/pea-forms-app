import React from "react";

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

export default function LVSystemSectionPEA({ value = initialState, onChange = () => {} }) {
  const handleInputChange = (field, newValue) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const renderCorrectIncorrectField = (name, correctField, noteField, isTextarea = false, rows = 1) => (
    <div className="mt-3">
      <div className="flex items-start gap-6">
        <label className="flex items-center gap-2 min-w-20">
          <input
            type="radio"
            name={name}
            checked={value[correctField] === true}
            onChange={() => handleInputChange(correctField, true)}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-sm font-medium text-green-700">ถูกต้อง</span>
        </label>
        <label className="flex items-center gap-2 min-w-24">
          <input
            type="radio"
            name={name}
            checked={value[correctField] === false}
            onChange={() => handleInputChange(correctField, false)}
            className="w-4 h-4 text-red-600"
          />
          <span className="text-sm font-medium text-red-700">ต้องแก้ไข</span>
        </label>
        {value[correctField] === false && (
          <div className="flex-1">
            {isTextarea ? (
              <textarea
                value={value[noteField] || ""}
                onChange={(e) => handleInputChange(noteField, e.target.value)}
                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            ) : (
              <input
                type="text"
                value={value[noteField] || ""}
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
                    checked={value.standard === std}
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
                    checked={value.conductorType === type}
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
                  checked={value.conductorType === "other"}
                  onChange={() => handleInputChange("conductorType", "other")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">อื่นๆ</span>
                {value.conductorType === "other" && (
                  <input
                    type="text"
                    value={value.otherConductorType}
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
                value={value.phaseWireSize}
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
                value={value.neutralWireSize}
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
                  checked={value.wiringMethod === "overhead"}
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
                  checked={value.wiringMethod === "cable_tray"}
                  onChange={() => handleInputChange("wiringMethod", "cable_tray")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                <input
                  type="text"
                  value={value.cableTraySize.width}
                  onChange={(e) =>
                    handleInputChange("cableTraySize", { ...value.cableTraySize, width: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={value.wiringMethod !== "cable_tray"}
                />
                <span className="text-sm">มม. x</span>
                <input
                  type="text"
                  value={value.cableTraySize.height}
                  onChange={(e) =>
                    handleInputChange("cableTraySize", { ...value.cableTraySize, height: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={value.wiringMethod !== "cable_tray"}
                />
                <span className="text-sm">มม.</span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="direct_burial"
                  checked={value.wiringMethod === "direct_burial"}
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
                  checked={value.wiringMethod === "underground_conduit"}
                  onChange={() => handleInputChange("wiringMethod", "underground_conduit")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                <input
                  type="text"
                  value={value.conduitSize}
                  onChange={(e) => handleInputChange("conduitSize", e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={value.wiringMethod !== "underground_conduit"}
                />
                <span className="text-sm">นิ้ว</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="wall_conduit"
                  checked={value.wiringMethod === "wall_conduit"}
                  onChange={() => handleInputChange("wiringMethod", "wall_conduit")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                <input
                  type="text"
                  value={value.conduitSizeWall}
                  onChange={(e) => handleInputChange("conduitSizeWall", e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  disabled={value.wiringMethod !== "wall_conduit"}
                />
                <span className="text-sm">นิ้ว</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wiring_method"
                  value="other"
                  checked={value.wiringMethod === "other"}
                  onChange={() => handleInputChange("wiringMethod", "other")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">อื่นๆ ระบุ</span>
                <input
                  type="text"
                  value={value.otherWiringMethod}
                  onChange={(e) => handleInputChange("otherWiringMethod", e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                  disabled={value.wiringMethod !== "other"}
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
                        checked={value.conduitType === type.value}
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
                        checked={value.conduitType === type.value}
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
                  checked={value.conduitType === "other"}
                  onChange={() => handleInputChange("conduitType", "other")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">อื่นๆ ระบุ</span>
                <input
                  type="text"
                  value={value.otherConduitType}
                  onChange={(e) => handleInputChange("otherConduitType", e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                  disabled={value.conduitType !== "other"}
                  placeholder="ระบุรายละเอียด"
                />
              </div>
            </div>
            {renderCorrectIncorrectField("conduit_type_status", "conduitTypeCorrect", "conduitTypeNote", true, 2)}
          </div>
        </div>
      </section>

      {/* 3.2 เครื่องป้องกันกระแสเกินของแผงสายเมน */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">3.2 เครื่องป้องกันกระแสเกินของแผงสายเมน (หรือที่เทียบเท่าระบาน)</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* 3.2.1 มาตรฐาน */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.2.1 เบรกเกอร์ที่ตระบกอนจะใช้ไปได้ตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
            </label>
            {renderCorrectIncorrectField("main_breaker_standard_status", "mainBreakerStandardCorrect", "mainBreakerStandardNote")}
          </div>

          {/* 3.2.2 ขนาด */}
          <div className="form-group">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium text-gray-700">
                3.2.2 เบรกเกอร์ที่ตระบกอนจะริทนาด AT...แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายตัวนำประธาน
              </label>
            </div>
            <input
              type="text"
              value={value.mainBreakerSize}
              onChange={(e) => handleInputChange("mainBreakerSize", e.target.value)}
              placeholder="ระบุขนาด AT (แอมแปร์)"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40 mb-3"
            />
            {renderCorrectIncorrectField("main_breaker_size_status", "mainBreakerSizeCorrect", "mainBreakerSizeNote")}
          </div>

          {/* 3.2.3 กำลังตัดวงจร */}
          <div className="form-group">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium text-gray-700">
                3.2.3 พิกัดกำลังตัดวงจรสั้น (Icn)...กิโลแอมแปร์ (kA)
              </label>
            </div>
            <input
              type="text"
              value={value.shortCircuitRating}
              onChange={(e) => handleInputChange("shortCircuitRating", e.target.value)}
              placeholder="ระบุกำลังตัดวงจรสั้น (kA)"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40 mb-3"
            />
            {renderCorrectIncorrectField("short_circuit_rating_status", "shortCircuitRatingCorrect", "shortCircuitRatingNote")}
          </div>
        </div>
      </section>

      {/* 3.3 ระบบการต่อสายดินและสายนิวทรัล */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">3.3 ระบบการต่อสายดินและสายนิวทรัล</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* 3.3.1 ขนาดสายดิน */}
          <div className="form-group">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium text-gray-700">
                3.3.1 สายต่อพื้นดิน (ตัวนำของแบบ) ขนาด...ตร.มม. สอดคล้องกับขนาดสายตัวนำและตารางที่ 1 ในหมวดที่ 5
              </label>
            </div>
            <input
              type="text"
              value={value.groundWireSize}
              onChange={(e) => handleInputChange("groundWireSize", e.target.value)}
              placeholder="ระบุขนาดสายดิน (ตร.มม.)"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40 mb-3"
            />
            {renderCorrectIncorrectField("ground_wire_size_status", "groundWireSizeCorrect", "groundWireSizeNote")}
          </div>

          {/* 3.3.2 การต่อสายดินและนิวทรัล */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.3.2 การต่อสายดินและสายนิวทรัล
            </label>
            <div className="space-y-3 mb-3">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={value.groundingSystem?.includes("ground_bus_1")}
                  onChange={(e) => {
                    const current = value.groundingSystem || "";
                    handleInputChange(
                      "groundingSystem",
                      e.target.checked
                        ? current + (current ? "," : "") + "ground_bus_1"
                        : current.replace(/,?ground_bus_1,?/g, "").replace(/^,|,$/g, "")
                    );
                  }}
                  className="w-4 h-4 text-blue-600 mt-1"
                />
                <label className="text-sm text-gray-700">
                  กรณีระบบไฟฟ้า 1 เฟส และสายเมนเวทียดำยึดอุปกรณ์ระบบอุปถานของดิน (Ground Bus) และหัวต่อต่างชนิดระหว่าง (Main Conductor) เข้าสายตัวนำอลาดินย้อนเป็นท่อเป็นดินเบรกเกอร์ระบบ (Main Circuit Breaker) ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={value.groundingSystem?.includes("ground_bus_3")}
                  onChange={(e) => {
                    const current = value.groundingSystem || "";
                    handleInputChange(
                      "groundingSystem",
                      e.target.checked
                        ? current + (current ? "," : "") + "ground_bus_3"
                        : current.replace(/,?ground_bus_3,?/g, "").replace(/^,|,$/g, "")
                    );
                  }}
                  className="w-4 h-4 text-blue-600 mt-1"
                />
                <label className="text-sm text-gray-700">
                  กรณีระบบไฟฟ้า 3 เฟส และสายเมนเวทียดำเมนทำในหัวต่อดินระบุ (Ground Bus) และหัวต่อต่างชนิดระหว่าง (Neutral Bus) โดยที่ดินตัวนำของดินและการนิวทรัลบริเทิยเข้าธ้นไฟในสายเมนเวทียดำยืดที่การไฟฟ้าส่วนภูมิภาคกำหนด
                </label>
              </div>
            </div>
            {renderCorrectIncorrectField("grounding_system_status", "groundingSystemCorrect", "groundingSystemNote")}
          </div>
        </div>
      </section>

      {/* 3.4 รูปแบบการต่อสายดินและสายนิวทรัล */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">3.4 รูปแบบการต่อสายดินและสายนิวทรัล (เลือกหนึ่งรูปแบบ)</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* เลือกรูปแบบ */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-4">เลือกรูปแบบการต่อสายดิน</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="grounding_config"
                  value="TN-C-S"
                  checked={value.groundingConfig === "TN-C-S"}
                  onChange={() => handleInputChange("groundingConfig", "TN-C-S")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium">TN-C-S ทั่วระบบ</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="grounding_config"
                  value="TT"
                  checked={value.groundingConfig === "TT"}
                  onChange={() => handleInputChange("groundingConfig", "TT")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium">TT ทั่วระบบ</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="grounding_config"
                  value="TT_partial"
                  checked={value.groundingConfig === "TT_partial"}
                  onChange={() => handleInputChange("groundingConfig", "TT_partial")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium">TT บางส่วน (ต้นทางเป็น TN-C-S และ โหลดเป็น TT)</span>
              </label>
            </div>
          </div>

          {/* TN-C-S Section */}
          {value.groundingConfig === "TN-C-S" && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-gray-900">3.4.1 กรณีเป็ดสายดินแบบ TN-C-S ทั่วระบบ (ต้องมีมาตรการดังนี้เพื่อป้องกัน)</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={value.tncsLoadBalance}
                    onChange={(e) => handleInputChange("tncsLoadBalance", e.target.checked)}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <label className="text-sm text-gray-700">
                    ก) ตำแหน่งตัวทำเบาการต่อสายดิน...โดยมี (Ω)<br />
                    กรณีมีเซอร์ 15(45), 5(45) A ต้องดึงเด็จตะเบราดิฟทำเบาการต่อสายดินไม่เกิน 2.5 Ω<br />
                    กรณีมีเซอร์ 30(100), 5((100) A ต้องดึงเด็จตะเบราดิฟทำเบาการต่อสายดินไม่เกิน 1.25 Ω
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={value.tncsNeutralProtection}
                    onChange={(e) => handleInputChange("tncsNeutralProtection", e.target.checked)}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <label className="text-sm text-gray-700">
                    ที่ระบบป้องกันเมนท์และหัวทำไฟฟ้าคนละแรงทั้งไฟฟ้าเกิน ด้วยดังนั้นวากายอิม<br />
                    มีรายละเอียดต่อผลีกซึ่งเป็นระบูรบบอบควบเดียง Iิmมีต้าลลแว่ว
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={value.tncsTouchVoltageProtection}
                    onChange={(e) => handleInputChange("tncsTouchVoltageProtection", e.target.checked)}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <label className="text-sm text-gray-700">
                    ของดังสุดกระนี่วกรอื่นให้อบดำเบราดินระโตสเดินด (Touch Voltage) ที่เกิจบริเทิยถ้าพักบินตรับ 70 โวลต์ ซึ่งบูรกถมดำเก่จได้เอ้งฟัดัมทั่อธราบีระรอกของบุมะลู้งไฟฟ้า โอพมเสาย่อดึงคู้แระเนื่อมไม่ขึ้นทุกเล็บ รวมลัดสะเนื่ยภขงที่พิลและยาเมดิชอกหรือบกันทำปิมใบเดสำด 5 จัมทที่
                  </label>
                </div>
              </div>

              {renderCorrectIncorrectField("tncs_status", "tncsCorrect", "tncsNote", true, 3)}
            </div>
          )}

          {/* TT Section */}
          {value.groundingConfig === "TT" && (
            <div className="bg-green-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-gray-900">3.4.2 กรณีเป็ดสายดินแบบ TT ทั่วระบบ (ต้องตำเนาการดงับพื้น ก) และ ข))</h4>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-700">
                  ก) ต้องติดเริ่วต่อติดไว้ (RCD) ทุกวงจรไฟฟ้าที่ขีอไฟใน หรือทุกยอกหมือต้องไฟฟ้าไหน ไม่เว้นจะมีวระต่อต่อไฟฟ้าในการต้อปันจะบูรบบขดไฟใฟกำใฟฟ้าถือถอผิใกว่แล<br /><br />
                  ข) ต้องต้ระบบป้องกันเมนท์รีบต่นไฟฟ้าคนและแรงทั้งไฟฟ้าเกิน ส่าหนั่วของต้อตังในขนไว้ให้เท้าหรือจะช่จจระบูรบบขดไฟใฟใต้องไฟฟ้า หรือต้ระบบป้องกันเมนท์ต่นไฟฟ้าที่ให้รับดันแรงทั้งไฟฟ้าเงินต้องดินสายเจอัวต่อเอพระตัวไฟลต้องไฟฟ้าใหน แรงทั้งไฟฟ้าเงินต้องดินสดัมผิใงรับปิมใบเดสำดเขตของปันจะบูรบบขดไฟใฟใดพั้นแล่ว
                </div>
              </div>

              {renderCorrectIncorrectField("tt_status", "ttCorrect", "ttNote", true, 3)}
            </div>
          )}

          {/* TT Partial Section */}
          {value.groundingConfig === "TT_partial" && (
            <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-gray-900">3.4.3 กรณีเป็ดสายดินแบบ TT บางส่วน</h4>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-700 mb-3">
                  3.4.3.1 มาตรการที่ต้องดำเนินการให้ครบถึงถมยนตี (ก – ค)<br /><br />
                  ก) มีการระเย็มความเสื่อจต้อนจะอ ไม่มีอตาควาที่เทคครอะสมคัดีครง<br />
                  บริเท็บให้ใฟฟ้าเข็ฟต่อสายดินแบบ TN-C-S กับเทรอจรับแล้างลิงจะโดยบอนไฟใฟเว้น<br />
                  หรือใคระยานยดใฟทั้งไฟฟ้าที่ต้องต้องบูน TT ใดจดชั้นอก หรือชั้อบีระจ่วงโจมว่ระจัวบไว้<br />
                  การ 2.50 เมตร หรือต้องติดเต้มห่ราระอทบมะรั่ง หรือถัมนิวไผล<br /><br />
                  ข) ระอขาหำระบ้างหนดังกิเดิมเขียดระบบ TN-C-S กันระบบ TT ต้องตำเส้น<br />
                  อย่างน้อย 2.00 เมตร<br /><br />
                  ค) มีการต้องดินโปนและหัวต่าเมนบริเท็มนวิอยต้าครึ่งดีดครึ่งระบูรบบบต<br />
                  ไฟใฟ้า ความก่าการไฟฟ้าส่วนภูมิภาคกำหนด
                </div>
              </div>

              {renderCorrectIncorrectField("tt_partial_status", "ttPartialCorrect", "ttPartialNote", true, 3)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
