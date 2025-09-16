import React from "react";
import EvChargerCheckSection from "./EvChargerCheckSection";

// Helper ถูกต้อง/ต้องแก้ไข
function CorrectableRow({ label, value, onChange, detail = false, placeholder = "ระบุรายละเอียดที่ต้องแก้ไข..." }) {
  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0 text-gray-700">
      <div className="text-sm text-gray-700 mb-2">{label}</div>
      <div className="flex items-start gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value?.result === "ถูกต้อง"}
            onChange={() => onChange({ ...value, result: "ถูกต้อง", detail: "" })}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-sm text-green-700">ถูกต้อง</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value?.result === "ต้องแก้ไข"}
            onChange={() => onChange({ ...value, result: "ต้องแก้ไข" })}
            className="w-4 h-4 text-red-600"
          />
          <span className="text-sm text-red-700">ต้องแก้ไข</span>
        </label>
        {value?.result === "ต้องแก้ไข" && detail && (
          <input
            type="text"
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
            value={value?.detail || ""}
            onChange={e => onChange({ ...value, detail: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}

/**
 * SubCircuitSection
 * @param {number} sectionNumber เลขหัวข้อหลัก เช่น 3 หรือ 5 (3.6, 5.6)
 * @param {array} value array วงจรย่อย (แต่ละอันเป็น obj)
 * @param {function} onChange (newArr) => void
 * 
 * รองรับ loop, ใส่ใน loop ของหม้อแปลงหรืออื่นๆ ได้
 */
export default function SubCircuitSection({ sectionNumber = 5, value = [], onChange = () => {} }) {
  // เพิ่มวงจรย่อย
  const addSub = () => {
    onChange([
      ...value,
      {
        circuitNo: "",
        evOnly: {},
        evOnePerCircuit: {},
        standard: [],
        wireType: [],
        wireTypeOther: "",
        phaseSize: "",
        phaseSizeCheck: {},
        neutralSize: "",
        neutralSizeCheck: {},
        groundSize: "",
        groundSizeCheck: {},
        phaseColor: {},
        wirewayMechanical: {},
        method: [],
        methodConduitWallSize: "",
        methodConduitBuriedSize: "",
        methodWirewayW: "",
        methodWirewayH: "",
        methodCableTrayW: "",
        methodCableTrayH: "",
        methodOther: "",
        methodCheck: {},
        conduitType: [],
        conduitTypeOther: "",
        conduitCheck: {},
        breakerStandard: false,
        breakerMode3: false,
        breakerMode3AT: "",
        breakerMode2: false,
        breakerMode2AT: "",
        breakerCheck: {},
        breakerSizeCheck: {},
        rcdTypeB: false,
        rcdTypeBIn: "",
        rcdTypeAFPlusDD: false,
        rcdTypeBInCharger: false,
        rcdTypeBInChargerIn: "",
        isolatingTransformer: false,
        rcdCheck: {},
        rcdTypeBMain: {},
        evChargers: [] // สำหรับ loop evcharger ในแต่ละวงจรย่อย
      }
    ]);
  };

  // ลบวงจรย่อย
  const removeSub = idx => {
    onChange(value.filter((_, i) => i !== idx));
  };

  // อัปเดตค่าแต่ละฟิลด์ในวงจรย่อย
  const handleSub = (idx, key, v) => {
    const newArr = value.map((item, i) => i === idx ? { ...item, [key]: v } : item);
    onChange(newArr);
  };

  // อัปเดตค่าในแต่ละ evCharger
  const handleChangeEv = (idx, evIdx, evObj) => {
    const evChargers = value[idx].evChargers ? [...value[idx].evChargers] : [];
    evChargers[evIdx] = evObj;
    handleSub(idx, "evChargers", evChargers);
  };

  // prefix
  const prefix = `${sectionNumber}.6`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
      <div className="bg-white border border-gray-300 rounded-xl shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-base font-bold">{sectionNumber}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{prefix} วงจรย่อย</h2>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-700 transition"
            onClick={addSub}
          >
            + เพิ่มวงจรย่อย
          </button>
        </div>
        <div className="px-6 py-8">
          {value.length === 0 && (
            <div className="text-gray-400 text-center py-8">ยังไม่มีข้อมูลวงจรย่อย</div>
          )}

          {value.map((item, idx) => (
            <div
              key={idx}
              className="mb-10 rounded-xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden relative"
            >
              <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">{idx + 1}</span>
                  <span className="font-semibold text-lg text-blue-900">วงจรย่อยที่ {idx + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSub(idx)}
                  className="text-red-600 hover:text-red-800 text-xs px-3 py-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 transition"
                >
                  ลบวงจรย่อย
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Section 1 */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                    {prefix}.1 วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้า
                  </h3>
                  <CorrectableRow
                    label="ก) วงจรย่อยจ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น"
                    value={item.evOnly}
                    onChange={v => handleSub(idx, "evOnly", v)}
                    detail
                  />
                  <CorrectableRow
                    label="ข) วงจรย่อยจ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้า 1 เครื่อง ต่อ 1 วงจรย่อย"
                    value={item.evOnePerCircuit}
                    onChange={v => handleSub(idx, "evOnePerCircuit", v)}
                    detail
                  />
                </div>

                {/* Section 2 */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                    {prefix}.2 สายไฟฟ้า
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-700">ก) สายตัวนำวงจรย่อยเป็นไปตามมาตรฐาน</div>
                    <div className="flex flex-wrap gap-4 ml-4">
                      {Object.entries({
                        "มอก11": "มอก. 11-2553",
                        "มอก293": "มอก. 293-2541",
                        "iec60502": "IEC 60502"
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`standard-${idx}`}
                            checked={item.standard === key}
                            onChange={() => handleSub(idx, "standard", key)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 ml-4">
                    <div>
                      <div className="mb-1">ข) ชนิดสายตัวนำ</div>
                      {["IEC01", "NYY", "CV"].map(type => (
                        <label key={type} className="mr-3">
                          <input
                            type="radio"
                            name={`wireType-${idx}`}
                            checked={item.wireType === type}
                            onChange={() => handleSub(idx, "wireType", type)}
                          />
                          <span className="ml-1">{type}</span>
                        </label>
                      ))}
                      <label className="mr-3">
                        <input
                          type="radio"
                          name={`wireType-${idx}`}
                          checked={item.wireType === "other"}
                          onChange={() => handleSub(idx, "wireType", "other")}
                        />
                        <span className="text-sm text-gray-700">อื่นๆ</span>
                        {item.wireType === "other" && (
                          <input
                            type="text"
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                            placeholder="ระบุ"
                            value={item.wireTypeOther || ""}
                            onChange={e => handleSub(idx, "wireTypeOther", e.target.value)}
                          />
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mr-3">ค) ขนาดสายเฟส</label>
                    <input
                      type="text"
                      className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                      placeholder="ตร.มม."
                      value={item.phaseSize || ""}
                      onChange={e => handleSub(idx, "phaseSize", e.target.value)}
                    />
                    <CorrectableRow label="ตรวจสอบสายเฟส" value={item.phaseSizeCheck} onChange={v => handleSub(idx, "phaseSizeCheck", v)} detail />
                  </div>
                  <div>
                    <label className="mr-3">ง) ขนาดสายนิวทรัล</label>
                    <input
                      type="text"
                      className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                      placeholder="ตร.มม."
                      value={item.neutralSize || ""}
                      onChange={e => handleSub(idx, "neutralSize", e.target.value)}
                    />
                    <CorrectableRow label="ตรวจสอบสายนิวทรัล" value={item.neutralSizeCheck} onChange={v => handleSub(idx, "neutralSizeCheck", v)} detail />
                  </div>
                  <div>
                    <label className="mr-3">จ) ขนาดสายดิน</label>
                    <input
                      type="text"
                      className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                      placeholder="ตร.มม."
                      value={item.groundSize || ""}
                      onChange={e => handleSub(idx, "groundSize", e.target.value)}
                    />
                    <CorrectableRow label="ตรวจสอบสายดิน" value={item.groundSizeCheck} onChange={v => handleSub(idx, "groundSizeCheck", v)} detail />
                  </div>
                  
                  <CorrectableRow label="ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ" value={item.phaseColor} onChange={v => handleSub(idx, "phaseColor", v)} detail />
                  <CorrectableRow label="ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ" value={item.wirewayMechanical} onChange={v => handleSub(idx, "wirewayMechanical", v)} detail />
                </div>

                {/* Section 3 */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                    {prefix}.3 วิธีการเดินสาย
                  </h3>
                  <div className="mb-2 flex flex-wrap gap-4">
                    <label>
                      <input type="checkbox" checked={item.method?.includes("conduitWall")} onChange={() => handleCheckbox(idx, "method", "conduitWall")} />
                      <span className="ml-1">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                      {item.method?.includes("conduitWall") && (
                        <input
                          type="text"
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          placeholder="นิ้ว"
                          value={item.methodConduitWallSize || ""}
                          onChange={e => handleSub(idx, "methodConduitWallSize", e.target.value)}
                        />
                      )}
                    </label>
                    <label>
                      <input type="checkbox" checked={item.method?.includes("conduitBuried")} onChange={() => handleCheckbox(idx, "method", "conduitBuried")} />
                      <span className="ml-1">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                      {item.method?.includes("conduitBuried") && (
                        <input
                          type="text"
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          placeholder="นิ้ว"
                          value={item.methodConduitBuriedSize || ""}
                          onChange={e => handleSub(idx, "methodConduitBuriedSize", e.target.value)}
                        />
                      )}
                    </label>
                    <label>
                      <input type="checkbox" checked={item.method?.includes("directBuried")} onChange={() => handleCheckbox(idx, "method", "directBuried")} />
                      <span className="ml-1">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                    </label>
                    <label>
                      <input type="checkbox" checked={item.method?.includes("wireway")} onChange={() => handleCheckbox(idx, "method", "wireway")} />
                      <span className="ml-1">เดินในรางเดินสาย (Wireway)</span>
                      {item.method?.includes("wireway") && (
                        <>
                          <input
                            type="text"
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                            placeholder="มม."
                            value={item.methodWirewayW || ""}
                            onChange={e => handleSub(idx, "methodWirewayW", e.target.value)}
                          />
                          <span className="mx-1">x</span>
                          <input
                            type="text"
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                            placeholder="มม."
                            value={item.methodWirewayH || ""}
                            onChange={e => handleSub(idx, "methodWirewayH", e.target.value)}
                          />
                        </>
                      )}
                    </label>
                    <label>
                      <input type="checkbox" checked={item.method?.includes("cableTray")} onChange={() => handleCheckbox(idx, "method", "cableTray")} />
                      <span className="ml-1">เดินบนรางเคเบิล (Cable Tray)</span>
                      {item.method?.includes("cableTray") && (
                        <>
                          <input
                            type="text"
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                            placeholder="มม."
                            value={item.methodCableTrayW || ""}
                            onChange={e => handleSub(idx, "methodCableTrayW", e.target.value)}
                          />
                          <span className="mx-1">x</span>
                          <input
                            type="text"
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                            placeholder="มม."
                            value={item.methodCableTrayH || ""}
                            onChange={e => handleSub(idx, "methodCableTrayH", e.target.value)}
                          />
                        </>
                      )}
                    </label>
                    <label>
                      <input type="checkbox" checked={item.method?.includes("other")} onChange={() => handleCheckbox(idx, "method", "other")} />
                      <span className="ml-1">อื่นๆ ระบุ</span>
                      {item.method?.includes("other") && (
                        <input
                          type="text"
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          placeholder="โปรดระบุ"
                          value={item.methodOther || ""}
                          onChange={e => handleSub(idx, "methodOther", e.target.value)}
                        />
                      )}
                    </label>
                  </div>
                  <CorrectableRow label="ตรวจสอบวิธีการเดินสาย" value={item.methodCheck} onChange={v => handleSub(idx, "methodCheck", v)} detail />
                </div>

                {/* Section 4 */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                    {prefix}.4 ประเภทท่อร้อยสาย
                  </h3>
                  <div className="mb-2 flex flex-wrap gap-4">
                    <div>
                      <div className="mb-1">ท่อโลหะ</div>
                      <label className="mr-3">
                        <input type="checkbox" checked={item.conduitType?.includes("RMC")} onChange={() => handleCheckbox(idx, "conduitType", "RMC")} />
                        <span className="ml-1">หนา (RMC)</span>
                      </label>
                      <label className="mr-3">
                        <input type="checkbox" checked={item.conduitType?.includes("IMC")} onChange={() => handleCheckbox(idx, "conduitType", "IMC")} />
                        <span className="ml-1">หนาปานกลาง (IMC)</span>
                      </label>
                      <label className="mr-3">
                        <input type="checkbox" checked={item.conduitType?.includes("EMT")} onChange={() => handleCheckbox(idx, "conduitType", "EMT")} />
                        <span className="ml-1">บาง (EMT)</span>
                      </label>
                    </div>
                    <div>
                      <div className="mb-1">ท่ออโลหะ</div>
                      <label className="mr-3">
                        <input type="checkbox" checked={item.conduitType?.includes("RNC")} onChange={() => handleCheckbox(idx, "conduitType", "RNC")} />
                        <span className="ml-1">แข็ง (RNC)</span>
                      </label>
                      <label className="mr-3">
                        <input type="checkbox" checked={item.conduitType?.includes("ENT")} onChange={() => handleCheckbox(idx, "conduitType", "ENT")} />
                        <span className="ml-1">อ่อน (ENT)</span>
                      </label>
                    </div>
                    <div>
                      <label className="mr-3">
                        <input type="checkbox" checked={item.conduitType?.includes("Flexible")} onChange={() => handleCheckbox(idx, "conduitType", "Flexible")} />
                        <span className="ml-1">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
                      </label>
                      <label className="mr-3">
                        <input type="checkbox" checked={item.conduitType?.includes("other")} onChange={() => handleCheckbox(idx, "conduitType", "other")} />
                        <span className="ml-1">อื่นๆ ระบุ</span>
                        {item.conduitType?.includes("other") && (
                          <input
                            type="text"
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                            placeholder="โปรดระบุ"
                            value={item.conduitTypeOther || ""}
                            onChange={e => handleSub(idx, "conduitTypeOther", e.target.value)}
                          />
                        )}
                      </label>
                    </div>
                  </div>
                  <CorrectableRow label="ตรวจสอบประเภทท่อร้อยสาย" value={item.conduitCheck} onChange={v => handleSub(idx, "conduitCheck", v)} detail />
                </div>

                {/* Section 5 */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                    {prefix}.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย
                  </h3>
                  <div className="mb-2 flex flex-wrap gap-4">
                    <label>
                      <input type="checkbox" checked={!!item.breakerStandard} onChange={e => handleSub(idx, "breakerStandard", e.target.checked)} />
                      <span className="ml-1">เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2</span>
                    </label>
                    <label>
                      <input type="checkbox" checked={!!item.breakerMode3} onChange={e => handleSub(idx, "breakerMode3", e.target.checked)} />
                      <span className="ml-1">
                        กรณีอัดประจุโหมด 3 หรือ 4 เซอร์กิตเบรกเกอร์ขนาด AT
                        <input
                          type="text"
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          placeholder="แอมแปร์ (A)"
                          value={item.breakerMode3AT || ""}
                          onChange={e => handleSub(idx, "breakerMode3AT", e.target.value)}
                          disabled={!item.breakerMode3}
                        />
                      </span>
                    </label>
                    <label>
                      <input type="checkbox" checked={!!item.breakerMode2} onChange={e => handleSub(idx, "breakerMode2", e.target.checked)} />
                      <span className="ml-1">
                        กรณีอัดประจุโหมด 2 เซอร์กิตเบรกเกอร์ขนาด AT
                        <input
                          type="text"
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          placeholder="แอมแปร์ (A)"
                          value={item.breakerMode2AT || ""}
                          onChange={e => handleSub(idx, "breakerMode2AT", e.target.value)}
                          disabled={!item.breakerMode2}
                        />
                      </span>
                    </label>
                  </div>
                  <CorrectableRow label="ตรวจสอบมาตรฐานเซอร์กิตเบรกเกอร์" value={item.breakerCheck} onChange={v => handleSub(idx, "breakerCheck", v)} detail />
                  <CorrectableRow label="ตรวจสอบขนาดเซอร์กิตเบรกเกอร์" value={item.breakerSizeCheck} onChange={v => handleSub(idx, "breakerSizeCheck", v)} detail />
                </div>

                {/* Section 6 */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                    {prefix}.6 ต้องติดตั้งระบบป้องกันอันตรายต่อบุคคล
                  </h3>
                  <div className="mb-2 flex flex-col gap-2">
                    <label>
                      <input type="checkbox" checked={!!item.rcdTypeB} onChange={e => handleSub(idx, "rcdTypeB", e.target.checked)} />
                      <span className="ml-1">
                        เครื่องตัดไฟรั่ว (RCD) Type B ตามมาตรฐาน มอก. 2955 หรือ IEC 62423  
                        พิกัดกระแสรั่ว I∆N ≤ 30 มิลลิแอมแปร์ (mA)  พิกัดกระแส (In)
                        <input
                          type="text"
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          placeholder="แอมแปร์ (A)"
                          value={item.rcdTypeBIn || ""}
                          onChange={e => handleSub(idx, "rcdTypeBIn", e.target.value)}
                          disabled={!item.rcdTypeB}
                        />
                      </span>
                    </label>
                    <label>
                      <input type="checkbox" checked={!!item.rcdTypeAFPlusDD} onChange={e => handleSub(idx, "rcdTypeAFPlusDD", e.target.checked)} />
                      <span className="ml-1">
                        เครื่องตัดไฟรั่ว (RCD) Type A หรือ F ร่วมกับอุปกรณ์ตัดไฟฟ้ารั่วกระแสตรง (RDC-DD) ขนาดพิกัด I∆N,DC ≥ 6 mA
                      </span>
                    </label>
                    <label>
                      <input type="checkbox" checked={!!item.rcdTypeBInCharger} onChange={e => handleSub(idx, "rcdTypeBInCharger", e.target.checked)} />
                      <span className="ml-1">
                        มีเครื่องตัดไฟรั่ว (RCD) Type B ตามมาตรฐาน มอก. 2955 หรือ IEC 62423  
                        พิกัดกระแสรั่ว I∆N ≤ 30 มิลลิแอมแปร์ (mA)  พิกัดกระแส (In)
                        <input
                          type="text"
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          placeholder="แอมแปร์ (A)"
                          value={item.rcdTypeBInChargerIn || ""}
                          onChange={e => handleSub(idx, "rcdTypeBInChargerIn", e.target.value)}
                          disabled={!item.rcdTypeBInCharger}
                        />
                      </span>
                    </label>
                    <label>
                      <input type="checkbox" checked={!!item.isolatingTransformer} onChange={e => handleSub(idx, "isolatingTransformer", e.target.checked)} />
                      <span className="ml-1">มีหม้อแปลงแยกขดลวด (Isolating Transformer) ติดตั้งมากับเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                    </label>
                  </div>
                  <CorrectableRow label="ตรวจสอบการติดตั้งระบบป้องกันอันตราย" value={item.rcdCheck} onChange={v => handleSub(idx, "rcdCheck", v)} detail />
                </div>

                {/* Section 7 */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                    {prefix}.7 กรณีติดตั้งเครื่องตัดไฟรั่ว (RCD) Type B
                  </h3>
                  <CorrectableRow
                    label="RCD Type B ต้องไม่ติดตั้งภายใต้วงจรที่มี RCD Type อื่นๆ อยู่ที่เมนของวงจรนั้นๆ"
                    value={item.rcdTypeBMain}
                    onChange={v => handleSub(idx, "rcdTypeBMain", v)}
                    detail
                  />
                </div>

                {/* ========== ส่วน LOOP เครื่องอัดประจุในวงจรย่อยนี้ ========== */}
                <div className="mb-8 border p-4 rounded">
                    <div className="font-bold mb-2">{transformer.name}</div>
                    <EvChargerCheckSection
                      prefix={`${sectionNumber}.8`}
                      sectionNumber={5}
                      value={transformer.subCircuits}
                      onChange={val => handleChangeEv(transformerIndex, "subCircuits", val)}
                    />
                    {/* ปุ่มเพิ่มวงจรย่อย */}
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={() => addCharger(transformerIndex)}
                      >
                        + เพิ่มวงจรย่อย
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}