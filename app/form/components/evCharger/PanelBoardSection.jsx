import React from "react";

// Helper สำหรับ render radio ถูกต้อง/ต้องแก้ไข
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

export default function PanelBoardSection({ value = {}, onChange = () => {} }) {
  // สำหรับ checkbox array
  const handleCheckbox = (key, v) => {
    const arr = value[key] || [];
    onChange({
      ...value,
      [key]: arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v]
    });
  };

  // สำหรับค่าอื่นๆ
  const handleField = (key, v) => onChange({ ...value, [key]: v });

  return (
    <div className="bg-gray-100 p-6 rounded-lg text-gray-700">
      <h2 className="text-lg font-bold text-gray-900 mb-6">5.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (ถ้ามี)</h2>
      
      {/* 5.5.1 วงจรสายป้อน */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">5.5.1 วงจรสายป้อน</h3>
        
        {/* สายป้อนเป็นไปตามมาตรฐาน */}
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-3">ก) สายป้อนเป็นไปตามมาตรฐาน</div>
          <div className="flex flex-wrap gap-6 mb-4">
            {Object.entries({
              "มอก11": "มอก. 11-2553",
              "มอก293": "มอก. 293-2541", 
              "iec60502": "IEC 60502"
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.standard?.includes(key)}
                  onChange={() => handleCheckbox("standard", key)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={value.standardCheck?.result === "ถูกต้อง"}
                onChange={() => handleField("standardCheck", { result: "ถูกต้อง", detail: "" })}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-green-700">ถูกต้อง</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={value.standardCheck?.result === "ต้องแก้ไข"}
                onChange={() => handleField("standardCheck", { result: "ต้องแก้ไข" })}
                className="w-4 h-4 text-red-600"
              />
              <span className="text-red-700">ต้องแก้ไข</span>
            </label>
            {value.standardCheck?.result === "ต้องแก้ไข" && (
              <input
                type="text"
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                value={value.standardCheck?.detail || ""}
                onChange={e => handleField("standardCheck", { ...value.standardCheck, detail: e.target.value })}
              />
            )}
          </div>
        </div>

        {/* ชนิดสายตัวนำ */}
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-3">ข) ชนิดสายตัวนำ</div>
          <div className="flex flex-wrap gap-6 mb-4">
            {["IEC01", "NYY", "CV"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.wireType?.includes(type)}
                  onChange={() => handleCheckbox("wireType", type)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value.wireType?.includes("other")}
                onChange={() => handleCheckbox("wireType", "other")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">อื่นๆ</span>
              {value.wireType?.includes("other") && (
                <input
                  type="text"
                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                  placeholder="ระบุ"
                  value={value.wireTypeOther || ""}
                  onChange={e => handleField("wireTypeOther", e.target.value)}
                />
              )}
            </div>
          </div>

          <CorrectableRow 
            label="ตรวจสอบชนิดสายตัวนำ" 
            value={value.wireTypeCheck} 
            onChange={v => handleField("wireTypeCheck", v)} 
            detail 
          />
        </div>

        {/* ขนาดสายเฟส */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-700">ค) ขนาดสายเฟส</span>
            <input
              type="text"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-24"
              placeholder="ขนาด"
              value={value.phaseSize || ""}
              onChange={e => handleField("phaseSize", e.target.value)}
            />
            <span className="text-sm text-gray-600">ตร.มม.</span>
          </div>
          
          <div className="bg-blue-50 p-3 rounded text-xs text-gray-700 mb-3">
            (พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.)
          </div>

          <CorrectableRow 
            label="ตรวจสอบขนาดสายเฟส" 
            value={value.phaseSizeCheck} 
            onChange={v => handleField("phaseSizeCheck", v)} 
            detail 
          />
        </div>

        {/* ขนาดสายนิวทรัล */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-700">ง) ขนาดสายนิวทรัล</span>
            <input
              type="text"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-24"
              placeholder="ขนาด"
              value={value.neutralSize || ""}
              onChange={e => handleField("neutralSize", e.target.value)}
            />
            <span className="text-sm text-gray-600">ตร.มม.</span>
          </div>

          <CorrectableRow 
            label="ตรวจสอบขนาดสายนิวทรัล" 
            value={value.neutralSizeCheck} 
            onChange={v => handleField("neutralSizeCheck", v)} 
            detail 
          />
        </div>

        {/* ขนาดสายดิน */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-700">จ) ขนาดสายดิน</span>
            <input
              type="text"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-24"
              placeholder="ขนาด"
              value={value.groundSize || ""}
              onChange={e => handleField("groundSize", e.target.value)}
            />
            <span className="text-sm text-gray-600">ตร.มม.</span>
          </div>
          <CorrectableRow 
            label="ตรวจสอบขนาดสายดิน" 
            value={value.groundSizeCheck} 
            onChange={v => handleField("groundSizeCheck", v)} 
            detail 
          />
        </div>
        <CorrectableRow 
          label="ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ" 
          value={value.phaseColor} 
          onChange={v => handleField("phaseColor", v)} 
          detail 
        />
        
        <CorrectableRow 
          label="ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ" 
          value={value.wirewayMechanical} 
          onChange={v => handleField("wirewayMechanical", v)} 
          detail 
        />
        
      </div>

      {/* 5.5.2 วิธีการเดินสาย */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">5.5.2 วิธีการเดินสาย</h3>
        
        <div className="space-y-3 mb-4">
          {/* Wireway */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.method?.includes("wireway")}
              onChange={() => handleCheckbox("method", "wireway")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">เดินในรางเดินสาย (Wireway) ขนาด</span>
            {value.method?.includes("wireway") && (
              <>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  placeholder="มม."
                  value={value.methodWirewayW || ""}
                  onChange={e => handleField("methodWirewayW", e.target.value)}
                />
                <span className="text-sm">x</span>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  placeholder="มม."
                  value={value.methodWirewayH || ""}
                  onChange={e => handleField("methodWirewayH", e.target.value)}
                />
                <span className="text-sm text-gray-600">มม.</span>
              </>
            )}
          </div>

          {/* Cable Tray */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.method?.includes("cableTray")}
              onChange={() => handleCheckbox("method", "cableTray")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
            {value.method?.includes("cableTray") && (
              <>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  placeholder="มม."
                  value={value.methodCableTrayW || ""}
                  onChange={e => handleField("methodCableTrayW", e.target.value)}
                />
                <span className="text-sm">x</span>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  placeholder="มม."
                  value={value.methodCableTrayH || ""}
                  onChange={e => handleField("methodCableTrayH", e.target.value)}
                />
                <span className="text-sm text-gray-600">มม.</span>
              </>
            )}
          </div>

          {/* Busway */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.method?.includes("busway")}
              onChange={() => handleCheckbox("method", "busway")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">บัสเวย์ (Busway) หรือบัสดัก (Bus duct) ขนาด</span>
            {value.method?.includes("busway") && (
              <>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  placeholder="มม."
                  value={value.methodBuswayW || ""}
                  onChange={e => handleField("methodBuswayW", e.target.value)}
                />
                <span className="text-sm">x</span>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  placeholder="มม."
                  value={value.methodBuswayH || ""}
                  onChange={e => handleField("methodBuswayH", e.target.value)}
                />
                <span className="text-sm text-gray-600">มม.</span>
              </>
            )}
          </div>

          {/* Conduit Wall */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.method?.includes("conduitWall")}
              onChange={() => handleCheckbox("method", "conduitWall")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
            {value.method?.includes("conduitWall") && (
              <>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16 ml-2"
                  placeholder="นิ้ว"
                  value={value.methodConduitWallSize || ""}
                  onChange={e => handleField("methodConduitWallSize", e.target.value)}
                />
                <span className="text-sm text-gray-600">นิ้ว</span>
              </>
            )}
          </div>

          {/* Direct Buried */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.method?.includes("directBuried")}
              onChange={() => handleCheckbox("method", "directBuried")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
          </div>

          {/* Conduit Buried */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.method?.includes("conduitBuried")}
              onChange={() => handleCheckbox("method", "conduitBuried")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
            {value.method?.includes("conduitBuried") && (
              <>
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16 ml-2"
                  placeholder="นิ้ว"
                  value={value.methodConduitBuriedSize || ""}
                  onChange={e => handleField("methodConduitBuriedSize", e.target.value)}
                />
                <span className="text-sm text-gray-600">นิ้ว</span>
              </>
            )}
          </div>

          {/* Other */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.method?.includes("other")}
              onChange={() => handleCheckbox("method", "other")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">อื่นๆ ระบุ</span>
            {value.method?.includes("other") && (
              <input
                type="text"
                className="px-3 py-1 border border-gray-300 rounded text-sm w-48 ml-2"
                placeholder="โปรดระบุ"
                value={value.methodOther || ""}
                onChange={e => handleField("methodOther", e.target.value)}
              />
            )}
          </div>
        </div>

        <CorrectableRow 
          label="ตรวจสอบวิธีการเดินสาย" 
          value={value.methodCheck} 
          onChange={v => handleField("methodCheck", v)} 
          detail 
        />
      </div>

      {/* 5.5.3 ประเภทท่อร้อยสาย */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">5.5.3 ประเภทท่อร้อยสาย</h3>
        
        <div className="space-y-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">ท่อโลหะ</div>
            <div className="flex flex-wrap gap-4 ml-4">
              {Object.entries({
                "RMC": "หนา (RMC)",
                "IMC": "หนาปานกลาง (IMC)",
                "EMT": "บาง (EMT)"
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.conduitType?.includes(key)}
                    onChange={() => handleCheckbox("conduitType", key)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">ท่ออโลหะ</div>
            <div className="flex flex-wrap gap-4 ml-4">
              {Object.entries({
                "RNC": "แข็ง (RNC)",
                "ENT": "อ่อน (ENT)"
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.conduitType?.includes(key)}
                    onChange={() => handleCheckbox("conduitType", key)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.conduitType?.includes("Flexible")}
              onChange={() => handleCheckbox("conduitType", "Flexible")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.conduitType?.includes("other")}
              onChange={() => handleCheckbox("conduitType", "other")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">อื่นๆ ระบุ</span>
            {value.conduitType?.includes("other") && (
              <input
                type="text"
                className="px-3 py-1 border border-gray-300 rounded text-sm w-48 ml-2"
                placeholder="โปรดระบุ"
                value={value.conduitTypeOther || ""}
                onChange={e => handleField("conduitTypeOther", e.target.value)}
              />
            )}
          </div>
        </div>

        <CorrectableRow 
          label="ตรวจสอบประเภทท่อร้อยสาย" 
          value={value.conduitCheck} 
          onChange={v => handleField("conduitCheck", v)} 
          detail 
        />
      </div>

      {/* 5.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">5.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน</h3>
        
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2</div>
          
          <CorrectableRow 
            label="ตรวจสอบมาตรฐานเซอร์กิตเบรกเกอร์" 
            value={value.breakerStandard} 
            onChange={v => handleField("breakerStandard", v)} 
            detail 
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-700">ข) เซอร์กิตเบรกเกอร์ขนาด AT</span>
            <input
              type="text"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-24"
              placeholder="แอมแปร์"
              value={value.breakerSize || ""}
              onChange={e => handleField("breakerSize", e.target.value)}
            />
            <span className="text-sm text-gray-600">แอมแปร์ (A)</span>
          </div>
          
          <div className="bg-blue-50 p-3 rounded text-xs text-gray-700 mb-3">
            ไม่เกินพิกัดกระแสสายป้อน และไม่ต่ำกว่าโหลดสูงสุดของสายป้อน
          </div>

          <CorrectableRow 
            label="ตรวจสอบขนาดเซอร์กิตเบรกเกอร์" 
            value={value.breakerCheck} 
            onChange={v => handleField("breakerCheck", v)} 
            detail 
          />
        </div>
      </div>

      {/* 5.5.5 การติดตั้งแผงวงจรย่อย */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">5.5.5 การติดตั้งแผงวงจรย่อย (Panel board)</h3>
        
        <CorrectableRow 
          label="ก) ต้องมีพิกัดไม่ต่ำกว่าขนาดสายป้อน" 
          value={value.panelCapacity} 
          onChange={v => handleField("panelCapacity", v)} 
          detail 
        />
        
        <CorrectableRow 
          label="ข) ไม่มีการต่อฝาก เชื่อมระหว่างขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ที่แผงวงจรย่อย" 
          value={value.panelNeutralGround} 
          onChange={v => handleField("panelNeutralGround", v)} 
          detail 
        />
      </div>
    </div>
  );
}