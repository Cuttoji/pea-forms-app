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

export default function PanelBoardSection({ sectionNumber = 5, value = {}, onChange = () => {} }) {
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

  // Handle the main checkbox for having panel board
  const handleHasPanelBoard = (checked) => {
    onChange({ ...value, hasPanelBoard: checked });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Main Checkbox */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value.hasPanelBoard || false}
            onChange={(e) => handleHasPanelBoard(e.target.checked)}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-base font-medium text-gray-900">
            มีวงจรสายป้อน/แผงวงจรย่อย (Panel board)
          </span>
        </label>
      </div>

      {/* Warning Message when not checked */}
      {!value.hasPanelBoard && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-medium text-yellow-800">หมายเหตุ: </span>
            <span className="text-sm text-yellow-700">
              หากไม่มีวงจรสายป้อน/แผงวงจรย่อย (Panel board) จึงไม่จำเป็นต้องตรวจสอบรายการในส่วนนี้
            </span>
          </div>
        </div>
      )}

      {/* Panel Board Content - only show when checkbox is checked */}
      {value.hasPanelBoard && (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-bold text-white">{sectionNumber}.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board)</h2>
          </div>
          
          <div className="border border-t-0 border-gray-200 rounded-b-lg p-6 space-y-8 text-gray-800">
            {/* 5.5.1 วงจรสายป้อน */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mr-3">{sectionNumber}.5.1</span>
                วงจรสายป้อน
              </h3>
              
              {/* สายป้อนเป็นไปตามมาตรฐาน */}
              <div className="mb-6 bg-white rounded-lg p-4">
                <div className="text-sm font-medium text-gray-800 mb-4">ก) สายป้อนเป็นไปตามมาตรฐาน</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {Object.entries({
                    "มอก11": "มอก. 11-2553",
                    "มอก293": "มอก. 293-2541", 
                    "iec60502": "IEC 60502"
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={value.standard?.includes(key)}
                        onChange={() => handleCheckbox("standard", key)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">
                    <input
                      type="radio"
                      checked={value.standardCheck?.result === "ถูกต้อง"}
                      onChange={() => handleField("standardCheck", { result: "ถูกต้อง", detail: "" })}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-green-700 font-medium">ถูกต้อง</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                    <input
                      type="radio"
                      checked={value.standardCheck?.result === "ต้องแก้ไข"}
                      onChange={() => handleField("standardCheck", { result: "ต้องแก้ไข" })}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-700 font-medium">ต้องแก้ไข</span>
                  </label>
                  {value.standardCheck?.result === "ต้องแก้ไข" && (
                    <input
                      type="text"
                      className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-3">{sectionNumber}.5.2</span>
                วิธีการเดินสาย
              </h3>
              
              <div className="bg-white rounded-lg p-4">
                <div className="space-y-4 mb-6">
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
            </div>

            {/* 5.5.3 ประเภทท่อร้อยสาย */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-6 flex items-center">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold mr-3">{sectionNumber}.5.3</span>
                ประเภทท่อร้อยสาย
              </h3>
              
              <div className="bg-white rounded-lg p-4">
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
            </div>

            {/* 5.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-6 flex items-center">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold mr-3">{sectionNumber}.5.4</span>
                เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน
              </h3>
              
              <div className="bg-white rounded-lg p-4">
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
            </div>

            {/* 5.5.5 การติดตั้งแผงวงจรย่อย */}
            <div className="bg-teal-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-teal-900 mb-6 flex items-center">
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold mr-3">{sectionNumber}.5.5</span>
                การติดตั้งแผงวงจรย่อย (Panel board)
              </h3>
              
              <div className="bg-white rounded-lg p-4 space-y-4">
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
          </div>
        </div>
      )}
    </div>
  );
}