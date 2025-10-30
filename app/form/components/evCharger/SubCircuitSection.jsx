import React, { useEffect } from "react";
import EvChargerCheckSection from "./EvChargerCheckSection";

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

export default function SubCircuitSection({ sectionNumber = 5, value = [], onChange = () => {}, onAddCharger = () => {} }) {
  // สร้างโครงสร้างข้อมูลเริ่มต้นสำหรับวงจรย่อย
  const createDefaultSubCircuit = () => ({
    circuitNo: "",
    evOnly: { result: null, detail: "" },
    evOnePerCircuit: { result: null, detail: "" },
    standard: [],
    wireType: [],
    wireTypeOther: "",
    phaseSize: "",
    phaseSizeCheck: { result: null, detail: "" },
    neutralSize: "",
    neutralSizeCheck: { result: null, detail: "" },
    groundSize: "",
    groundSizeCheck: { result: null, detail: "" },
    phaseColor: { result: null, detail: "" },
    wirewayMechanical: { result: null, detail: "" },
    method: [],
    methodConduitWallSize: "",
    methodConduitWallCheck: { result: null, detail: "" },
    methodConduitBuriedSize: "",
    methodConduitBuriedCheck: { result: null, detail: "" },
    methodDirectBuriedCheck: { result: null, detail: "" },
    methodWirewayW: "",
    methodWirewayH: "",
    methodWirewayCheck: { result: null, detail: "" },
    methodCableTrayW: "",
    methodCableTrayH: "",
    methodCableTrayCheck: { result: null, detail: "" },
    methodOther: "",
    methodOtherCheck: { result: null, detail: "" },
    conduitType: [],
    conduitTypeOther: "",
    conduitCheck: { result: null, detail: "" },
    breakerStandard: false,
    breakerMode3: false,
    breakerMode3AT: "",
    breakerMode2: false,
    breakerMode2AT: "",
    breakerCheck: { result: null, detail: "" },
    rcdTypeB: false,
    rcdTypeBIn: "",
    rcdTypeBInCharger: false,
    rcdTypeBInChargerIn: "",
    rcdTypeBMain: { result: null, detail: "" },
    evChargers: []
  });

  // ตรวจสอบและสร้างวงจรย่อยเริ่มต้นถ้ายังไม่มี
  useEffect(() => {
    if (value.length === 0) {
      onChange([createDefaultSubCircuit()]);
    }
  }, []);

  const addSub = () => {
    onChange([...value, createDefaultSubCircuit()]);
  };
  
  const handleSub = (idx, key, v) => {
    const newArr = value.map((item, i) => i === idx ? { ...item, [key]: v } : item);
    onChange(newArr);
  };
  
  const removeSub = (idx) => {
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== idx));
    }
  };

  const handleCheckbox = (idx, key, v) => {
    const arr = value[idx][key] || [];
    const next = arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v];
    handleSub(idx, key, next);
  };
      const handleInputChange = (field, newValue) => {
        console.log(`LVSystemSection updating field: ${field} with value:`, newValue);
        
        if (onChange && typeof onChange === 'function') {
            const updatedData = {
                ...formData,
                [field]: newValue
            };
            console.log('LVSystemSection sending updated data:', updatedData);
            onChange(updatedData);
        } else {
            console.error('onChange is not a function:', onChange);
        }
    };

  const safeValue = v => (v !== undefined && v !== null ? String(v) : "");
  const safeArray = arr => Array.isArray(arr) ? arr : [];

  return (
    <div className="space-y-6">
      <div className="p-4 space-y-6">
        {value.map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-900">วงจรย่อยที่ {idx + 1}</h3>
              {value.length > 1 && (
                <button onClick={() => removeSub(idx)} className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded-md hover:bg-red-50 transition-colors">
                  ลบวงจรย่อย
                </button>
              )}
            </div>

            <div className="space-y-6 text-gray-700">
              {/* ข้อมูลพื้นฐานของวงจร */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.1 วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้า</h4>

                <CorrectableRow 
                  label="ก) วงจรนี้ใช้สำหรับเครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น (ไม่รวมโหลดอื่น)" 
                  value={item?.evOnly} 
                  onChange={v => handleSub(idx, "evOnly", v)} 
                  detail 
                />

                <CorrectableRow 
                  label="ข) วงจรนี้ใช้สำหรับเครื่องอัดประจุยานยนต์ไฟฟ้า 1 เครื่องต่อ 1 วงจรย่อย" 
                  value={item?.evOnePerCircuit} 
                  onChange={v => handleSub(idx, "evOnePerCircuit", v)} 
                  detail 
                />
              </div>

              {/* สายไฟฟ้า */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.2 วงจรย่อย</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* คอลัมน์ซ้าย */}
                            <div className="space-y-3">
                            {/* ก) สายตัวนำวงจรย่อยเป็นไปตามมาตรฐาน */}
                            <div className="py-3 border-b border-gray-200">
                              <div className="text-sm mb-2">ก) สายตัวนำวงจรย่อยเป็นไปตามมาตรฐาน</div>
                              <div className="flex flex-wrap items-center gap-4 ml-4">
                              <label className="flex items-center gap-2">
                                <input 
                                type="radio" 
                                name={`standard_${idx}`}
                                checked={Array.isArray(item?.standard) ? item?.standard.includes("มอก. 11-2553") : item?.standard === "มอก. 11-2553"}
                                onChange={() => handleSub(idx, "standard", "มอก. 11-2553")}
                                className="w-4 h-4" 
                                />
                                <span className="text-sm">มอก. 11-2553</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input 
                                type="radio" 
                                name={`standard_${idx}`}
                                checked={Array.isArray(item?.standard) ? item?.standard.includes("มอก. 293-2541") : item?.standard === "มอก. 293-2541"}
                                onChange={() => handleSub(idx, "standard", "มอก. 293-2541")}
                                className="w-4 h-4" 
                                />
                                <span className="text-sm">มอก. 293-2541</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input 
                                type="radio" 
                                name={`standard_${idx}`}
                                checked={Array.isArray(item?.standard) ? item?.standard.includes("IEC 60502") : item?.standard === "IEC 60502"}
                                onChange={() => handleSub(idx, "standard", "IEC 60502")}
                                className="w-4 h-4" 
                                />
                                <span className="text-sm">IEC 60502</span>
                              </label>
                              </div>
                            </div>

                            {/* ข) ชนิดสายตัวนำ */}
                            <div className="py-3 border-b border-gray-200">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="text-sm">ข) ชนิดสายตัวนำ</span>
                              <label className="flex items-center gap-2">
                                <input 
                                type="radio" 
                                name={`wireType_${idx}`}
                                checked={item?.wireType === "IEC01"} 
                                onChange={() => handleSub(idx, "wireType", "IEC01")} 
                                className="w-4 h-4" 
                                />
                                <span className="text-sm">IEC01</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input 
                                type="radio" 
                                name={`wireType_${idx}`}
                                checked={item?.wireType === "NYY"} 
                                onChange={() => handleSub(idx, "wireType", "NYY")} 
                                className="w-4 h-4" 
                                />
                                <span className="text-sm">NYY</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input 
                                type="radio" 
                                name={`wireType_${idx}`}
                                checked={item?.wireType === "CV"} 
                                onChange={() => handleSub(idx, "wireType", "CV")} 
                                className="w-4 h-4" 
                                />
                                <span className="text-sm">CV</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input 
                                type="radio" 
                                name={`wireType_${idx}`}
                                checked={item?.wireType === "อื่นๆ"} 
                                onChange={() => handleSub(idx, "wireType", "อื่นๆ")} 
                                className="w-4 h-4" 
                                />
                                <span className="text-sm">อื่นๆ</span>
                                {item?.wireType === "อื่นๆ" && (
                                  <input 
                                  type="text" 
                                  placeholder="ระบุ..." 
                                  className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2" 
                                  value={safeValue(item?.wireTypeOther)} 
                                  onChange={e => handleSub(idx, "wireTypeOther", e.target.value)} 
                                  />
                                )}
                              </label>
                              </div>
                            </div>

                            {/* ค) ขนาดสายเฟส */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">ค) ขนาดสายเฟส
                        <input 
                          type="text" 
                          className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                          value={safeValue(item?.phaseSize)} 
                          onChange={e => handleSub(idx, "phaseSize", e.target.value)} 
                        />
                        ตร.มม. (พิกัดกระแสสายตัวนำวงจรย่อยต้องไม่น้อยกว่า 1.25 เท่าของพิกัดกระแสตั่งต้นในเข้าของเครื่องอัดประจุยานยนต์ไฟฟ้า และไม่ต่ำกว่าพิกัดกระแสตั้งของเครื่องป้องกันกระแสเกินของวงจรย่อยต้องไม่เล็กกว่า 2.5 ตร.มม.)
                      </span>
                      </div>
                    </div>

                    {/* ง) ขนาดสายนิวทรัล */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">ง) ขนาดสายนิวทรัล</span>
                        <input 
                          type="text" 
                          
                          className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                          value={safeValue(item?.neutralSize)} 
                          onChange={e => handleSub(idx, "neutralSize", e.target.value)} 
                        />
                        <span className="text-sm">ตร.มม.</span>
                      </div>
                    </div>

                    {/* จ) ขนาดสายดิน */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">จ) ขนาดสายดิน</span>
                        <input 
                          type="text" 
                          className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                          value={safeValue(item?.groundSize)} 
                          onChange={e => handleSub(idx, "groundSize", e.target.value)} 
                        />
                        <span className="text-sm">ตร.มม. สอดคล้องกับขนาดสายตัวนำประธานตามตารางที่ 1 ในหน้าที่ 7</span>
                      </div>
                    </div>

                    {/* ฉ) ระบุเฟสสายตัวนำ */}
                    <div className="text-sm">
                      ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
                    </div>

                    {/* ช) ช่องเดินสายมีความต่อเนื่อง */}
                    <div className="text-sm">
                      ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
                    </div>
                  </div>

                  {/* คอลัมน์ขวา - ถูกต้อง/ต้องแก้ไข */}
                  <div className="space-y-3">
                    {/* ก) Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`standard_${idx}`}
                          checked={item?.standardCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "standardCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`standard_${idx}`}
                          checked={item?.standardCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "standardCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.standardCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.standardCheck?.detail || ""}
                            onChange={e => handleSub(idx, "standardCheck", { ...item?.standardCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* ข) Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`wireType_${idx}`}
                          checked={item?.wireTypeCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "wireTypeCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`wireType_${idx}`}
                          checked={item?.wireTypeCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "wireTypeCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.wireTypeCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.wireTypeCheck?.detail || ""}
                            onChange={e => handleSub(idx, "wireTypeCheck", { ...item?.wireTypeCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* ค) Check */}
                    <div className="flex items-center gap-4 min-h-[64px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`phaseSize_${idx}`}
                          checked={item?.phaseSizeCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "phaseSizeCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`phaseSize_${idx}`}
                          checked={item?.phaseSizeCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "phaseSizeCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.phaseSizeCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.phaseSizeCheck?.detail || ""}
                            onChange={e => handleSub(idx, "phaseSizeCheck", { ...item?.phaseSizeCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* ง) Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`neutralSize_${idx}`}
                          checked={item?.neutralSizeCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "neutralSizeCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`neutralSize_${idx}`}
                          checked={item?.neutralSizeCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "neutralSizeCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.neutralSizeCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.neutralSizeCheck?.detail || ""}
                            onChange={e => handleSub(idx, "neutralSizeCheck", { ...item?.neutralSizeCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* จ) Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`groundSize_${idx}`}
                          checked={item?.groundSizeCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "groundSizeCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`groundSize_${idx}`}
                          checked={item?.groundSizeCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "groundSizeCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.groundSizeCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.groundSizeCheck?.detail || ""}
                            onChange={e => handleSub(idx, "groundSizeCheck", { ...item?.groundSizeCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* ฉ) Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`phaseColor_${idx}`}
                          checked={item?.phaseColor?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "phaseColor", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`phaseColor_${idx}`}
                          checked={item?.phaseColor?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "phaseColor", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.phaseColor?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.phaseColor?.detail || ""}
                            onChange={e => handleSub(idx, "phaseColor", { ...item?.phaseColor, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* ช) Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`wirewayMechanical_${idx}`}
                          checked={item?.wirewayMechanical?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "wirewayMechanical", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`wirewayMechanical_${idx}`}
                          checked={item?.wirewayMechanical?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "wirewayMechanical", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.wirewayMechanical?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.wirewayMechanical?.detail || ""}
                            onChange={e => handleSub(idx, "wirewayMechanical", { ...item?.wirewayMechanical, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* การติดตั้งเดินสาย */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.3 วิธีการเดินสาย</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* คอลัมน์ซ้าย */}
                  <div className="space-y-4">
                    {/* เดินร้อยท่อเกาะผนัง */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินร้อยท่อเกาะผนัง")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินร้อยท่อเกาะผนัง")} 
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                          <input 
                            type="text" 
                            
                            className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                            value={safeValue(item?.methodConduitWallSize)} 
                            onChange={e => handleSub(idx, "methodConduitWallSize", e.target.value)} 
                            disabled={!safeArray(item?.method).includes("เดินร้อยท่อเกาะผนัง")}
                          />
                          <span className="text-sm">นิ้ว</span>
                        </div>
                      </div>
                    </div>

                    {/* เดินสายร้อยท่อฝังดิน */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินสายร้อยท่อฝังดิน")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินสายร้อยท่อฝังดิน")} 
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className="text-sm">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                          <input 
                            type="text" 
                          
                            className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                            value={safeValue(item?.methodConduitBuriedSize)} 
                            onChange={e => handleSub(idx, "methodConduitBuriedSize", e.target.value)} 
                            disabled={!safeArray(item?.method).includes("เดินสายร้อยท่อฝังดิน")}
                          />
                          <span className="text-sm">นิ้ว</span>
                        </div>
                      </div>
                    </div>

                    {/* เดินสายฝังดินโดยตรง */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินสายฝังดินโดยตรง")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินสายฝังดินโดยตรง")} 
                        className="mt-1" 
                      />
                      <span className="text-sm">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                    </div>

                    {/* เดินสายในรางเดินสาย */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินในรางเดินสาย")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินในรางเดินสาย")} 
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm">เดินในรางเดินสาย (Wireway) ขนาด</span>
                          <input 
                            type="text" 
                            
                            className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                            value={safeValue(item?.methodWirewayW)} 
                            onChange={e => handleSub(idx, "methodWirewayW", e.target.value)} 
                            disabled={!safeArray(item?.method).includes("เดินในรางเดินสาย")}
                          />
                          <span className="text-sm">มม. x</span>
                          <input 
                            type="text" 
                            
                            className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                            value={safeValue(item?.methodWirewayH)} 
                            onChange={e => handleSub(idx, "methodWirewayH", e.target.value)} 
                            disabled={!safeArray(item?.method).includes("เดินในรางเดินสาย")}
                          />
                          <span className="text-sm">มม.</span>
                        </div>
                      </div>
                    </div>

                    {/* เดินบนรางเคเบิล */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("เดินบนรางเคเบิล")} 
                        onChange={() => handleCheckbox(idx, "method", "เดินบนรางเคเบิล")} 
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                          <input 
                            type="text" 
                            className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                            value={safeValue(item?.methodCableTrayW)} 
                            onChange={e => handleSub(idx, "methodCableTrayW", e.target.value)} 
                            disabled={!safeArray(item?.method).includes("เดินบนรางเคเบิล")}
                          />
                          <span className="text-sm">มม. x</span>
                          <input 
                            type="text" 
                            className="w-32 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 ml-2 mr-2" 
                            value={safeValue(item?.methodCableTrayH)} 
                            onChange={e => handleSub(idx, "methodCableTrayH", e.target.value)} 
                            disabled={!safeArray(item?.method).includes("เดินบนรางเคเบิล")}
                          />
                          <span className="text-sm">มม.</span>
                        </div>
                      </div>
                    </div>

                    {/* อื่นๆ */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.method).includes("อื่นๆ")} 
                        onChange={() => handleCheckbox(idx, "method", "อื่นๆ")} 
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">อื่นๆ ระบุ (</span>
                          <input 
                            type="text" 
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500" 
                            value={safeValue(item?.methodOther)} 
                            onChange={e => handleSub(idx, "methodOther", e.target.value)} 
                            disabled={!safeArray(item?.method).includes("อื่นๆ")}
                          />
                          <span className="text-sm">)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* คอลัมน์ขวา - ถูกต้อง/ต้องแก้ไข */}
                  <div className="space-y-4">
                    {/* เดินร้อยท่อเกาะผนัง - Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodConduitWall_${idx}`}
                          checked={item?.methodConduitWallCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "methodConduitWallCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodConduitWall_${idx}`}
                          checked={item?.methodConduitWallCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "methodConduitWallCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.methodConduitWallCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.methodConduitWallCheck?.detail || ""}
                            onChange={e => handleSub(idx, "methodConduitWallCheck", { ...item?.methodConduitWallCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* เดินสายร้อยท่อฝังดิน - Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodConduitBuried_${idx}`}
                          checked={item?.methodConduitBuriedCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "methodConduitBuriedCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodConduitBuried_${idx}`}
                          checked={item?.methodConduitBuriedCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "methodConduitBuriedCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.methodConduitBuriedCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.methodConduitBuriedCheck?.detail || ""}
                            onChange={e => handleSub(idx, "methodConduitBuriedCheck", { ...item?.methodConduitBuriedCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* เดินสายฝังดินโดยตรง - Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodDirectBuried_${idx}`}
                          checked={item?.methodDirectBuriedCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "methodDirectBuriedCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodDirectBuried_${idx}`}
                          checked={item?.methodDirectBuriedCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "methodDirectBuriedCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.methodDirectBuriedCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.methodDirectBuriedCheck?.detail || ""}
                            onChange={e => handleSub(idx, "methodDirectBuriedCheck", { ...item?.methodDirectBuriedCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* เดินในรางเดินสาย - Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodWireway_${idx}`}
                          checked={item?.methodWirewayCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "methodWirewayCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodWireway_${idx}`}
                          checked={item?.methodWirewayCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "methodWirewayCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.methodWirewayCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.methodWirewayCheck?.detail || ""}
                            onChange={e => handleSub(idx, "methodWirewayCheck", { ...item?.methodWirewayCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* เดินบนรางเคเบิล - Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodCableTray_${idx}`}
                          checked={item?.methodCableTrayCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "methodCableTrayCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodCableTray_${idx}`}
                          checked={item?.methodCableTrayCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "methodCableTrayCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.methodCableTrayCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.methodCableTrayCheck?.detail || ""}
                            onChange={e => handleSub(idx, "methodCableTrayCheck", { ...item?.methodCableTrayCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>

                    {/* อื่นๆ - Check */}
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodOther_${idx}`}
                          checked={item?.methodOtherCheck?.result === "ถูกต้อง"}
                          onChange={() => handleSub(idx, "methodOtherCheck", { result: "ถูกต้อง", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-green-700">ถูกต้อง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`methodOther_${idx}`}
                          checked={item?.methodOtherCheck?.result === "ต้องแก้ไข"}
                          onChange={() => handleSub(idx, "methodOtherCheck", { result: "ต้องแก้ไข", detail: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-red-700">ต้องแก้ไข</span>
                        {item?.methodOtherCheck?.result === "ต้องแก้ไข" && (
                          <input
                            type="text"
                            
                            className="flex-1 border-b border-gray-400 bg-transparent px-1 py-0 text-sm focus:outline-none focus:border-blue-500"
                            value={item?.methodOtherCheck?.detail || ""}
                            onChange={e => handleSub(idx, "methodOtherCheck", { ...item?.methodOtherCheck, detail: e.target.value })}
                          />
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* หมายเหตุ */}
                <div className="mt-4 p-3 bg-yellow-50 rounded-md text-sm text-gray-700">
                  <p>* วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้าที่ใช้หากต้องติดตั้งกับภายนอกอาคารต้องเดินสายในลักษณะไม่กระทบงาน</p>
                  <p>หรือรื้อร้อยท่อภายใน หรือรื้อร้อยท่อฝังดินเท่านั้น</p>
                </div>
              </div>

              {/* 5.6.4 ประเภทท่อร้อยสาย */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.4 ประเภทท่อร้อยสาย</h4>

                <div className="mb-4">
                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-sm block mb-2">ท่อโลหะ:</label>
                      <div className="ml-4 flex flex-wrap gap-4">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("ท่อ (RMC)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "ท่อ (RMC)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">ท่อ (RMC)</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("ท่อปานกลาง (IMC)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "ท่อปานกลาง (IMC)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">ท่อปานกลาง (IMC)</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("บาง (EMT)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "บาง (EMT)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">บาง (EMT)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="font-medium text-sm block mb-2">ท่ออโลหะ:</label>
                      <div className="ml-4 flex flex-wrap gap-4">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("แข็ง (RNC)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "แข็ง (RNC)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">แข็ง (RNC)</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={safeArray(item?.conduitType).includes("อ่อน (ENT)")} 
                            onChange={() => handleCheckbox(idx, "conduitType", "อ่อน (ENT)")} 
                            className="mr-2" 
                          />
                          <span className="text-sm">อ่อน (ENT)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={safeArray(item?.conduitType).includes("ท่อโลหะอ่อน")} 
                          onChange={() => handleCheckbox(idx, "conduitType", "ท่อโลหะอ่อน")} 
                          className="mr-2" 
                        />
                        <span className="text-sm">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={safeArray(item?.conduitType).includes("อื่นๆ")} 
                        onChange={() => handleCheckbox(idx, "conduitType", "อื่นๆ")} 
                        className="mr-2" 
                      />
                      <span className="text-sm">อื่นๆ ระบุ</span>
                      {safeArray(item?.conduitType).includes("อื่นๆ") && (
                        <input 
                          type="text" 
                          placeholder="ระบุชนิดท่ออื่นๆ" 
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" 
                          value={safeValue(item?.conduitTypeOther)} 
                          onChange={e => handleSub(idx, "conduitTypeOther", e.target.value)} 
                        />
                      )}
                    </div>
                  </div>
                </div>

                <CorrectableRow 
                  label="ตรวจสอบชนิดท่อ" 
                  value={item?.conduitCheck} 
                  onChange={v => handleSub(idx, "conduitCheck", v)} 
                  detail 
                />
              </div>

              {/* 5.6.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย</h4>

                <div className="mb-4 space-y-3">
                  <label className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      checked={item?.breakerStandard || false} 
                      onChange={e => handleSub(idx, "breakerStandard", e.target.checked)} 
                      className="mt-1" 
                    />
                    <span className="text-sm">เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2</span>
                  </label>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      checked={item?.breakerMode3 || false} 
                      onChange={e => handleSub(idx, "breakerMode3", e.target.checked)} 
                      className="mt-1" 
                    />
                    <span className="text-sm">กรณีเป็นเบรกเกอร์สำหรับ 3 หรือ 4 เซอร์กิตเบรกเกอร์ประธาน 
                      <input 
                        type="text" 
                        placeholder="แอมแปร์" 
                        className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                        value={safeValue(item?.breakerMode3AT)} 
                        onChange={e => handleSub(idx, "breakerMode3AT", e.target.value)} 
                      /> แอมแปร์ (A) ไม่เกินพิกัดกระแสสายตัวนำวงจรย่อย และไม่ต่ำกว่าโหลดสูงสุดของวงจรย่อย </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      checked={item?.breakerMode2 || false} 
                      onChange={e => handleSub(idx, "breakerMode2", e.target.checked)} 
                      className="mt-1" 
                    />
                    <span className="text-sm">กรณีเป็นเบรกเกอร์สำหรับ 2 เซอร์กิตเบรกเกอร์ประธาน</span>
                      <input 
                        type="text" 
                        placeholder="แอมแปร์" 
                        className="border border-gray-300 rounded px-2 py-1 w-24 text-sm" 
                        value={safeValue(item?.breakerMode2AT)} 
                        onChange={e => handleSub(idx, "breakerMode2AT", e.target.value)} 
                      />แอมแปร์ (A) ไม่เกินพิกัดกระแสของเต้ารับ
                  </div>
                </div>

                <CorrectableRow 
                  label="ตรวจสอบเซอร์กิตเบรกเกอร์" 
                  value={item?.breakerCheck} 
                  onChange={v => handleSub(idx, "breakerCheck", v)} 
                  detail 
                />
              </div>

              {/* 5.6.6 ข้อกำหนดเครื่องตัดไฟรั่ว (RCD) */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.6 ข้อกำหนดเครื่องตัดไฟรั่ว (เลือกอย่างใดอย่างหนึ่งหรือทั้งสอง)</h4>

                <div className="grid grid-cols-1 gap-4">
                  {/* คอลัมน์ซ้าย */}
                  <div className="space-y-4">
                    {/* RCD Type B แบบแรก */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeB || false} 
                        onChange={e => handleSub(idx, "rcdTypeB", e.target.checked)} 
                        className="mt-1 w-4 h-4" 
                      />
                      <div className="flex-1 text-sm">
                        <div className="mb-2">
                          <strong>เครื่องตัดไฟรั่ว (RCD) Type B</strong> ตามมาตรฐาน มอก. 2955 หรือ IEC 62423
                        </div>
                        <div className="mb-2">
                          พิกัดกระแสรั่ว I<sub>ΔN</sub> ≤ 30 มิลลิแอมแปร์ (mA) พิกัดกระแส (I<sub>n</sub>)
                          <input 
                            type="text" 
                            className="border border-gray-300 rounded px-2 py-1 w-24 text-sm mr-2 ml-2" 
                            value={safeValue(item?.rcdTypeBIn)} 
                            onChange={e => handleSub(idx, "rcdTypeBIn", e.target.value)} 
                            disabled={!item?.rcdTypeB}
                          />
                          แอมแปร์ (A)
                        </div>
                        <div className="mb-2">
                          เป็น RCD ชนิดตัดกระแสไฟฟ้าทุกเส้นรวมถึงนิวทรัลออกพร้อมกัน และมีขนาด
                          พิกัดกระแสไม่น้อยกว่าพิกัดกระแสของเครื่องป้องกันกระแสเกิน
                        </div>
                      </div>
                    </div>

                    {/* RCD Type A หรือ F */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeAF || false} 
                        onChange={e => handleSub(idx, "rcdTypeAF", e.target.checked)} 
                        className="mt-1 w-4 h-4" 
                      />
                      <div className="flex-1 text-sm">
                        <div className="mb-2">
                          <strong>เครื่องตัดไฟรั่ว (RCD) Type A หรือ F</strong> ร่วมกับอุปกรณ์ตัดตัดไฟฟ้ากระแสตรง (RDC-DD) ขนาดพิกัด I<sub>Δn,DC</sub> ≥ 6 mA
                        </div>
                        <div className="pl-4 text-xs italic">
                          * อุปกรณ์ RDC-DD อ้างอิงตาม IEC 62955
                        </div>
                      </div>
                    </div>

                    {/* RCD Type B แบบที่สอง */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.rcdTypeBInCharger || false} 
                        onChange={e => handleSub(idx, "rcdTypeBInCharger", e.target.checked)} 
                        className="mt-1 w-4 h-4" 
                      />
                      <div className="flex-1 text-sm">
                        <div className="mb-2">
                          <strong>มีเครื่องตัดไฟรั่ว (RCD) Type B</strong> ตามมาตรฐาน มอก. 2955 หรือ IEC 62423
                        
                        <div className="mb-1">
                          พิกัดกระแสรั่ว I<sub>ΔN</sub> ≤ 30 มิลลิแอมแปร์ (mA) พิกัดกระแส (I<sub>n</sub>)
                          <input 
                            type="text" 
                            className="border border-gray-300 rounded px-2 py-1 w-24 text-sm mr-2 ml-2" 
                            value={safeValue(item?.rcdTypeBInChargerIn)} 
                            onChange={e => handleSub(idx, "rcdTypeBInChargerIn", e.target.value)} 
                            disabled={!item?.rcdTypeBInCharger}
                          />
                          แอมแปร์ (A) 
                          เป็น RCD ชนิดตัดกระแสไฟฟ้าทุกเส้นรวมถึงนิวทรัลออกพร้อมกัน และมีขนาพิกัด
                          กระแสไม่น้อยกว่าพิกัดกระแสของเครื่องป้องกันกระแสเกิน ติดตั้งมาภายใน     
                          เครื่องอัดประจุยานยนต์ไฟฟ้า </div>
                        </div>
                      </div>
                    </div>

                    {/* Isolating Transformer */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={item?.isolatingTransformer || false} 
                        onChange={e => handleSub(idx, "isolatingTransformer", e.target.checked)} 
                        className="mt-1 w-4 h-4" 
                      />
                      <div className="flex-1 text-sm">
                        มีหม้อแปลงแยกทางกลศาสตร์ (Isolating Transformer) ติดตั้งมากับเครื่องอัดประจุยานยนต์ไฟฟ้า
                      </div>
                    </div>

                    {/* หมายเหตุ */}
                    <div className="text-xs text-gray-600 pl-6">
                      *กรณีการอัดประจุโหมด 2 ให้ติดตั้งเครื่องตัดไฟรั่วบริเวณแผงวงจร หรือก่อนเข้า
 เต้ารับ หากไม่มั่นใจว่ามี RCD Type B หรือเทียบเท่าติดตั้งมากับ I 
C-CPD       
(In-Cable Control and Protection Device)
                    </div>
                  </div>
                </div>
                <CorrectableRow
                  label="ตรวจสอบข้อกำหนดเครื่องตัดไฟรั่ว (RCD)"
                  value={item?.rcdCheck}
                  onChange={v => handleSub(idx, "rcdCheck", v)}
                  detail
                />
              </div>
              

              {/* 5.6.7 กรณีมีข้อตัดไฟรั่ว */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">5.6.7  กรณีติดตั้งเครื่องตัดไฟรั่ว (RCD) Type B สำหรับเครื่องอัดประจุยานยนต์
 ไฟฟ้า โดย RCD Type B ต้องไม่ติดตั้งภายใต้วงจรที่มี RCD Type อื่นๆ อยู่ที่เมน
 ของวงจรนั้นๆ </h4>
                <CorrectableRow 
                    value={item?.rcdTypeBCheck}
                    onChange={v => handleSub(idx, "rcdTypeBCheck", v)}
                    detail 
                  />
              </div>
            
              {/* ส่วนเครื่องอัดประจุ */}
              <div className="mb-8 border p-4 rounded">
                <EvChargerCheckSection
                  prefix={`${sectionNumber}.8`}
                  value={item.evChargers}
                  onChange={val => handleSub(idx, "evChargers", val)}
                />
                {/* ปุ่มเพิ่มเครื่องอัดประจุ */}
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => onAddCharger(idx)}
                  >
                    + เพิ่มเครื่องอัดประจุ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="mb-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          onClick={addSub}
        >
          + เพิ่มวงจรย่อย
        </button>
      </div>
    </div>
  );
}