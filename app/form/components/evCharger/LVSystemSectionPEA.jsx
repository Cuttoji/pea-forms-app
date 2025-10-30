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
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
          </div>

          {/* 3.1.2 ชนิดสายตัวนำ */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
          </div>

          {/* 3.1.3 ขนาดสายเฟส */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="form-group">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium text-gray-700">3.1.3 ขนาดสายเฟส</label>
              <input
                type="text"
                value={value.phaseWireSize}
                onChange={(e) => handleInputChange("phaseWireSize", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-20"
              />
              <span className="text-sm text-gray-600">ตร.มม พิกัดกระแสสายตัวนำประธานต้อง 
ไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ 
ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด</span>
            </div>
            {renderCorrectIncorrectField("phase_wire_status", "phaseWireSizeCorrect", "phaseWireSizeNote")}
          </div>
          </div>

          {/* 3.1.4 ขนาดสายนิวทรัล */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
          </div>

          {/* 3.1.5 ระบุเฟสสายตัวนำ */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
            </label>
            {renderCorrectIncorrectField("phase_id_status", "phaseIdentificationCorrect", "phaseIdentificationNote")}
          </div>
          </div>

          {/* 3.1.6 ช่องเดินสาย */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
            </label>
            {renderCorrectIncorrectField("cable_pathway_status", "cablePathwayCorrect", "cablePathwayNote")}
          </div>
          </div>

          {/* 3.1.7 วิธีการเดินสาย */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
          </div>

                {/* 3.1.8 ประเภทท่อร้อยสาย */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-3">3.1.8 ประเภทท่อร้อยสาย</label>
                <div className="space-y-4 mb-4">
                  <div>
                  <div className="font-medium text-gray-700 mb-2">ท่อโลหะ</div>
                  <div className="ml-4 flex flex-wrap gap-4 items-center">
                    {[
                    { value: "RMC", label: "หนา (RMC)" },
                    { value: "IMC", label: "หนาปานกลาง (IMC)" },
                    { value: "EMT", label: "บาง (EMT)" },
                    ].map((type) => {
                    const checked = Array.isArray(value.conduitType)
                      ? value.conduitType.includes(type.value)
                      : value.conduitType === type.value;
                    return (
                      <label key={type.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="conduit_type_metal"
                        value={type.value}
                        checked={checked}
                        onChange={() => {
                        const current = value.conduitType;
                        let next;
                        if (Array.isArray(current)) {
                          next = current.includes(type.value) ? current.filter((v) => v !== type.value) : [...current, type.value];
                        } else {
                          // convert single to array or toggle
                          next = current === type.value ? [] : [...(current ? [current] : []), type.value];
                        }
                        handleInputChange("conduitType", next);
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{type.label}</span>
                      </label>
                    );
                    })}
                  </div>
                  </div>
                  <div>
                  <div className="font-medium text-gray-700 mb-2">ท่ออโลหะ</div>
                  <div className="ml-4 flex flex-wrap gap-4 items-center">
                    {[
                    { value: "RNC", label: "แข็ง (RNC)" },
                    { value: "ENT", label: "อ่อน (ENT)" },
                    ].map((type) => {
                    const checked = Array.isArray(value.conduitType)
                      ? value.conduitType.includes(type.value)
                      : value.conduitType === type.value;
                    return (
                      <label key={type.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="conduit_type_nonmetal"
                        value={type.value}
                        checked={checked}
                        onChange={() => {
                        const current = value.conduitType;
                        let next;
                        if (Array.isArray(current)) {
                          next = current.includes(type.value) ? current.filter((v) => v !== type.value) : [...current, type.value];
                        } else {
                          next = current === type.value ? [] : [...(current ? [current] : []), type.value];
                        }
                        handleInputChange("conduitType", next);
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{type.label}</span>
                      </label>
                    );
                    })}
                  </div>
                  </div>
                  <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="conduit_type_other"
                    value="other"
                    checked={Array.isArray(value.conduitType) ? value.conduitType.includes("other") : value.conduitType === "other"}
                    onChange={() => {
                    const current = value.conduitType;
                    let next;
                    if (Array.isArray(current)) {
                      next = current.includes("other") ? current.filter((v) => v !== "other") : [...current, "other"];
                    } else {
                      next = current === "other" ? [] : [...(current ? [current] : []), "other"];
                    }
                    handleInputChange("conduitType", next);
                    }}
                    className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">อื่นๆ ระบุ</span>
                    <input
                    type="text"
                    value={value.otherConduitType}
                    onChange={(e) => handleInputChange("otherConduitType", e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                    disabled={!(Array.isArray(value.conduitType) ? value.conduitType.includes("other") : value.conduitType === "other")}
                    placeholder="ระบุรายละเอียด"
                    />
                    </div>
                  </div>

                  {/* Arrange conduit groups horizontally */}
                  <div className="flex flex-wrap gap-8 mb-4">
                    <div className="min-w-[220px]">
                    <div className="font-medium text-gray-700 mb-2">ท่อโลหะ</div>
                    <div className="flex flex-wrap gap-4 items-center">
                      {[
                      { value: "RMC", label: "หนา (RMC)" },
                      { value: "IMC", label: "หนาปานกลาง (IMC)" },
                      { value: "EMT", label: "บาง (EMT)" },
                      ].map((type) => {
                      const checked = Array.isArray(value.conduitType)
                        ? value.conduitType.includes(type.value)
                        : value.conduitType === type.value;
                      return (
                        <div key={type.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="conduit_type_metal"
                          value={type.value}
                          checked={checked}
                          onChange={() => {
                          const current = value.conduitType;
                          let next;
                          if (Array.isArray(current)) {
                            next = current.includes(type.value) ? current.filter((v) => v !== type.value) : [...current, type.value];
                          } else {
                            next = current === type.value ? [] : [...(current ? [current] : []), type.value];
                          }
                          handleInputChange("conduitType", next);
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{type.label}</span>
                        </div>
                      );
                      })}
                    </div>
                    </div>

                    <div className="min-w-[220px]">
                    <div className="font-medium text-gray-700 mb-2">ท่ออโลหะ</div>
                    <div className="flex flex-wrap gap-4 items-center">
                      {[
                      { value: "RNC", label: "แข็ง (RNC)" },
                      { value: "ENT", label: "อ่อน (ENT)" },
                      ].map((type) => {
                      const checked = Array.isArray(value.conduitType)
                        ? value.conduitType.includes(type.value)
                        : value.conduitType === type.value;
                      return (
                        <label key={type.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="conduit_type_nonmetal"
                          value={type.value}
                          checked={checked}
                          onChange={() => {
                          const current = value.conduitType;
                          let next;
                          if (Array.isArray(current)) {
                            next = current.includes(type.value) ? current.filter((v) => v !== type.value) : [...current, type.value];
                          } else {
                            next = current === type.value ? [] : [...(current ? [current] : []), type.value];
                          }
                          handleInputChange("conduitType", next);
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{type.label}</span>
                        </label>
                      );
                      })}
                    </div>
                    </div>

                    <div className="min-w-[240px] flex-shrink">
                    <div className="font-medium text-gray-700 mb-2">อื่นๆ</div>
                    <div className="flex items-center gap-2">
                      <input
                      type="checkbox"
                      name="conduit_type_other"
                      value="other"
                      checked={Array.isArray(value.conduitType) ? value.conduitType.includes("other") : value.conduitType === "other"}
                      onChange={() => {
                        const current = value.conduitType;
                        let next;
                        if (Array.isArray(current)) {
                        next = current.includes("other") ? current.filter((v) => v !== "other") : [...current, "other"];
                        } else {
                        next = current === "other" ? [] : [...(current ? [current] : []), "other"];
                        }
                        handleInputChange("conduitType", next);
                      }}
                      className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">ระบุ</span>
                      <input
                      type="text"
                      value={value.otherConduitType}
                      onChange={(e) => handleInputChange("otherConduitType", e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                      disabled={!(Array.isArray(value.conduitType) ? value.conduitType.includes("other") : value.conduitType === "other")}
                      placeholder="ระบุรายละเอียด"
                      />
                    </div>
                    </div>
                  </div>

                  {renderCorrectIncorrectField("conduit_type_status", "conduitTypeCorrect", "conduitTypeNote", true, 2)}
                  </div>
                  </div>
                  </div>
                  </section>
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">3.2 เครื่องป้องกันกระแสเกินของแผงสายเมนสวิตช์ (บริภัณฑ์ประธาน)</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* 3.2.1 มาตรฐาน */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    3.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
                  </label>
                  {renderCorrectIncorrectField("main_breaker_standard_status", "mainBreakerStandardCorrect", "mainBreakerStandardNote")}
                </div></div>

                {/* 3.2.2 ขนาด */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="form-group">
                    {/* คอลัมน์ซ้าย */}
                    <div className="flex items-center">
                      <span className="text-sm">3.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด AT</span>
                      <input
                        type="text"
                        value={value.mainBreakerSize}
                        onChange={(e) => handleInputChange("mainBreakerSize", e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-400"
                      />
                      <span className="text-sm"> แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายตัวนำประธาน</span>
                    </div>
                    {renderCorrectIncorrectField("main_breaker_size_status", "mainBreakerSizeCorrect", "mainBreakerSizeNote")}
                </div>
                </div>

                {/* 3.2.3 กำลังตัดวงจร */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="form-group">
                    {/* คอลัมน์ซ้าย */}
                    <div className="flex items-center">
                      <span className="text-sm">3.2.3 พิกัดทนกระแสลัดวงจร (Ic)</span>
                      <input
                        type="text"
                        value={value.shortCircuitRating}
                        onChange={(e) => handleInputChange("shortCircuitRating", e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-400"
                      />
                      <span className="text-sm">กิโลแอมแปร์ (kA)</span>
                    </div>
                    {renderCorrectIncorrectField("short_circuit_rating_status", "shortCircuitRatingCorrect", "shortCircuitRatingNote")}
                </div>
                </div>
              </div>
              </section>
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">3.3 ระบบการต่อสายดินและสายนิวทรัล</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* 3.3.1 ขนาดสายดิน */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="form-group">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium text-gray-700">
                3.3.1 สายต่อดิน (ตัวนำทองแดง) ขนาด
              </label>
            <input
              type="text"
              value={value.groundWireSize}
              onChange={(e) => handleInputChange("groundWireSize", e.target.value)}
              placeholder="ระบุขนาดสายดิน (ตร.มม.)"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40 mb-3"
            />ตร.มม. สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 5</div>
            {renderCorrectIncorrectField("ground_wire_size_status", "groundWireSizeCorrect", "groundWireSizeNote")}
          </div>
          </div>

          {/* 3.3.2 การต่อสายดินและนิวทรัล */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3.3.2 การต่อลงดินที่แผงเมนสวิตช์
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
กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground 
Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) 
เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่       
การไฟฟ้าส่วนภูมิภาค กำหนด</label>
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
กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด</label>
              </div>
            </div>
            {renderCorrectIncorrectField("grounding_system_status", "groundingSystemCorrect", "groundingSystemNote")}
          </div>
          </div>
        </div>
      </section>

      {/* 3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-orange-800">
            3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* เลือกรูปแบบพร้อมรูปภาพ */}
          <div className="form-group">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <label className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md hover:border-orange-400 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="grounding_config"
                    value="TN-C-S"
                    checked={value.groundingConfig === "TN-C-S"}
                    onChange={() => handleInputChange("groundingConfig", "TN-C-S")}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm font-medium">TN-C-S ทั้งระบบ</span>
                </div>
                <img src="/ex_system/TN-C.png" alt="TN-C-S" className="w-full h-auto rounded-md border mt-2" />
              </label>
              
              <label className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md hover:border-orange-400 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="grounding_config"
                    value="TT"
                    checked={value.groundingConfig === "TT"}
                    onChange={() => handleInputChange("groundingConfig", "TT")}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm font-medium">TT ทั้งระบบ</span>
                </div>
                <img src="/ex_system/TT-all.png" alt="TT" className="w-full h-auto rounded-md border mt-2" />
              </label>
              
              <label className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md hover:border-orange-400 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="grounding_config"
                    value="TT_partial"
                    checked={value.groundingConfig === "TT_partial"}
                    onChange={() => handleInputChange("groundingConfig", "TT_partial")}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm font-medium">TT บางส่วน</span>
                </div>
                <img src="/ex_system/TT.png" alt="TT Partial" className="w-full h-auto rounded-md border mt-2" />
              </label>
            </div>
          </div>

          {/* TN-C-S Section */}
          {value.groundingConfig === "TN-C-S" && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-4">
              <h4 className="font-semibold text-gray-900">
                3.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)
              </h4>
              
              <div className="space-y-3">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={value.tncsLoadBalance}
                    onChange={(e) => handleInputChange("tncsLoadBalance", e.target.checked)}
                    className="w-4 h-4 text-orange-600 mt-1"
                  />
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-1">ค่าความต้านทานการต่อลงดิน................................โอห์ม (Ω)</div>
                    <div className="ml-4">
                      กรณีมีเซอร์ 15(45), 5(45) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 2.5 Ω<br />
                      กรณีมีเซอร์ 30(100), 5(100) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 1.25 Ω
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={value.tncsNeutralProtection}
                    onChange={(e) => handleInputChange("tncsNeutralProtection", e.target.checked)}
                    className="w-4 h-4 text-orange-600 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินเพิ่มเติม
                    ในคาแหน่งก่อนเข้าเครื่องอัดประจุยานยนต์ไฟฟ้า
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={value.tncsTouchVoltageProtection}
                    onChange={(e) => handleInputChange("tncsTouchVoltageProtection", e.target.checked)}
                    className="w-4 h-4 text-orange-600 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    มีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน ติดตั้งมากยายใน
                    เครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={value.tncsTouchVoltageProtection}
                    onChange={(e) => handleInputChange("tncsTouchVoltageProtection", e.target.checked)}
                    className="w-4 h-4 text-orange-600 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครง
                    บริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัด
                    ประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน
                    ออกพร้อมกันภายในเวลา 5 วินาที
                  </span>
                </label>
              </div>

              {renderCorrectIncorrectField("tncs_system", "tncsCorrect", "tncsNote", true, 4)}
            </div>
          )}

          {/* TT Section */}
          {value.groundingConfig === "TT" && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-4">
              <h4 className="font-semibold text-gray-900">
                3.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ ( ต้องดำเนินการครบทั้ง ก) และ ข) )
              </h4>
              
              <div className="text-sm text-gray-700 space-y-2">
                <div>
                  ก) ติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า ไม่ว่า
                  จะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม
                </div>
                <div>
                  ข) ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน สำหรับจ่ายไฟใน
                  ให้เครื่องอัดประจุยานยนต์ไฟฟ้า หรือติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและ
                  แรงดันไฟฟ้าเกินติดตั้งมากยายในเครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว
                </div>
              </div>

              {renderCorrectIncorrectField("tt_system", "ttCorrect", "ttNote")}
            </div>
          )}

          {/* TT Partial Section */}
          {value.groundingConfig === "TT_partial" && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-4">
              <h4 className="font-semibold text-gray-900">
                3.4.3 กรณีต่อลงดินแบบ TT บางส่วน
              </h4>
              
              <div className="text-sm text-gray-700 space-y-3">
                <div>
                  <div className="font-medium mb-2">3.4.3.1 มาตรการที่ต้องดำเนินการให้ครบทุกข้อ ( ก – ค )</div>
                  <div className="ml-4 space-y-2">
                    <div>
                      ก) มีการระบุเขตความเสี่ยงก่อน ไม่มีโอกาสที่บุคคลจะสัมผัสได้โดง
                      บริภัณฑ์ไฟฟ้าที่มีต่อลงดินแบบ TN-C-S กับเครื่องใช้ไฟฟ้าส่วนยายนต์ไฟฟ้า
                      หรือใช้ยานยนต์ไฟฟ้าที่ต้องอัดประจุ TT ในเวลาเดียวกัน หรือต้องจัดให้ห่างกัน
                      กว่า 2.50 เมตร สามารถใช้การจัดผนัง หรือเชือกกั้น
                    </div>
                    <div>
                      ข) ระยะห่างระหว่างหลักดินของระบบ TN-C-S กับระบบ TT ต้องมากกว่า
                      อย่างน้อย 2.00 เมตร
                    </div>
                    <div>
                      ค) มีการต่อลงดินเฉพาะเครื่องอัดประจุยานยนต์ไฟฟ้าและอัดมบริภัณฑ์ไฟฟ้า
                      ตาม มาตรฐานการไฟฟ้าส่วนภูมิภาคกำหนด
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-medium mb-2">3.4.3.2 มาตรการที่ต้องเลือกอย่างใดอย่างหนึ่ง</div>
                  <div className="ml-4 space-y-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={value.tncsLoadBalance}
                        onChange={(e) => handleInputChange("tncsLoadBalance", e.target.checked)}
                        className="w-4 h-4 text-orange-600 mt-1"
                      />
                      <div>
                        <div className="font-medium">ค่าความต้านทานการต่อลงดิน................................โอห์ม (Ω)</div>
                        <div className="ml-4 mt-1">
                          กรณีมีเซอร์ 15(45), 5(45) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 2.5 Ω<br />
                          กรณีมีเซอร์ 30(100), 5(100) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 1.25 Ω
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={value.tncsNeutralProtection}
                        onChange={(e) => handleInputChange("tncsNeutralProtection", e.target.checked)}
                        className="w-4 h-4 text-orange-600 mt-1"
                      />
                      <span>
                        ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินเพิ่มเติม
                        ในคาแหน่งก่อนเข้าเครื่องอัดประจุยานยนต์ไฟฟ้า
                      </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={value.tncsTouchVoltageProtection}
                        onChange={(e) => handleInputChange("tncsTouchVoltageProtection", e.target.checked)}
                        className="w-4 h-4 text-orange-600 mt-1"
                      />
                      <span>
                        มีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน ติดตั้งมากยายใน
                        เครื่องอัดระจุยานยนต์ไฟฟ้าแล้ว
                      </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={value.tncsTouchVoltageProtection}
                        onChange={(e) => handleInputChange("tncsTouchVoltageProtection", e.target.checked)}
                        className="w-4 h-4 text-orange-600 mt-1"
                      />
                      <span>
                        ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครง
                        บริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัด
                        ประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน
                        ออกพร้อมกันภายในเวลา 5 วินาที
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {renderCorrectIncorrectField("tt_partial_system", "ttPartialCorrect", "ttPartialNote", true, 5)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
