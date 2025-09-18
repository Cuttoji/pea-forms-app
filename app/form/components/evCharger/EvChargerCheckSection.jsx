import React from "react";

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

// EV Charger Section (loop)
function EvChargerCheckSection({ value = [], onChange = () => {} }) {
  const isArray = Array.isArray(value);
  const chargers = isArray ? value : value ? [value] : [];

  const removeCharger = (evIdx) => {
    const next = chargers.filter((_, i) => i !== evIdx);
    onChange(isArray ? next : next[0]);
  };

  const handleCharger = (idx, key, v) => {
    const newArr = chargers.map((item, i) => i === idx ? { ...item, [key]: v } : item);
    onChange(isArray ? newArr : newArr[0]);
  };

  const handleCheckbox = (idx, key, v) => {
    const arr = chargers[idx]?.[key] || [];
    const next = arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v];
    handleCharger(idx, key, next);
  };

  const safeValue = v => (v !== undefined && v !== null ? String(v) : "");
  const safeArray = arr => Array.isArray(arr) ? arr : [];

  return (
    <div className="space-y-6 text-gray-700">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-100 px-3 py-3 md:px-6 md:py-3 border-b border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-blue-800 font-bold text-lg">เครื่องอัดประจุยานยนต์ไฟฟ้า</span>
          </div>
        </div>
        <div className="px-2 py-4 md:px-6 md:py-8">
          {chargers.length === 0 && (
            <div className="text-gray-400 text-center py-8">ยังไม่มีข้อมูลเครื่องอัดประจุ</div>
          )}
          {chargers.map((item, idx) => (
            <div
              key={idx}
              className="mb-10 relative"
            >
              <div className="flex items-center justify-between px-0 py-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">{idx + 1}</span>
                  <span className="font-semibold text-base text-blue-900">เครื่องอัดประจุที่ {idx + 1}</span>
                </div>
                <button
                type="button"
                onClick={() => removeCharger(idx)}
                className="absolute right-0 top-0 mt-1 mr-1 text-red-600 hover:text-white hover:bg-red-500 border border-red-300 text-xs px-3 py-1 rounded-lg bg-white transition z-10"
                style={{ minWidth: 0 }}
                >
                ลบเครื่องอัดประจุ
                </button>
              </div>

              <div className="p-0 md:p-0 space-y-8">
                {/* 5.7.1 ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 text-blue-900">5.7.1 ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า</h4>
                  
                  <div className="flex flex-col md:flex-row flex-wrap gap-y-2 md:gap-4 items-stretch md:items-end">
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">ผลิตภัณฑ์</label>
                      <input type="text" className="border border-gray-300 rounded px-2 py-2 w-full md:w-32 bg-white focus:ring-1 focus:ring-blue-400 text-base" value={safeValue(item?.product)} onChange={e => handleCharger(idx, "product", e.target.value)} />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">รุ่น</label>
                      <input type="text" className="border border-gray-300 rounded px-2 py-2 w-full md:w-24 bg-white focus:ring-1 focus:ring-blue-400 text-base" value={safeValue(item?.model)} onChange={e => handleCharger(idx, "model", e.target.value)} />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">Serial Number</label>
                      <input type="text" className="border border-gray-300 rounded px-2 py-2 w-full md:w-40 bg-white focus:ring-1 focus:ring-blue-400 text-base" value={safeValue(item?.sn)} onChange={e => handleCharger(idx, "sn", e.target.value)} />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">IP</label>
                      <input type="text" className="border border-gray-300 rounded px-2 py-2 w-full md:w-28 bg-white focus:ring-1 focus:ring-blue-400 text-base" value={safeValue(item?.ip)} onChange={e => handleCharger(idx, "ip", e.target.value)} />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row flex-wrap gap-y-2 md:gap-4 items-stretch md:items-end mt-4">
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">ระบบ</label>
                      <div className="flex flex-wrap gap-x-4">
                        <label className="mr-2">
                          <input type="checkbox" checked={safeArray(item?.chargeType).includes("1")} onChange={() => handleCheckbox(idx, "chargeType", "1")} />
                          <span className="ml-1">1 เฟส</span>
                        </label>
                        <label className="mr-2">
                          <input type="checkbox" checked={safeArray(item?.chargeType).includes("3")} onChange={() => handleCheckbox(idx, "chargeType", "3")} />
                          <span className="ml-1">3 เฟส</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">จำนวนหัวชาร์จ</label>
                      <input type="text" className="border border-gray-300 rounded px-2 py-2 w-full md:w-24 bg-white focus:ring-1 focus:ring-blue-400 text-base" value={safeValue(item?.chargingHeads)} onChange={e => handleCharger(idx, "chargingHeads", e.target.value)} />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">พิกัดกำลังไฟฟ้ารวม (kW)</label>
                      <input type="text" className="border border-gray-300 rounded px-2 py-2 w-full md:w-28 bg-white focus:ring-1 focus:ring-blue-400 text-base" value={safeValue(item?.totalPower)} onChange={e => handleCharger(idx, "totalPower", e.target.value)} />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                      <label className="mb-1 font-medium text-base">พิกัดกระแสรวม Input (A)</label>
                      <input type="text" className="border border-gray-300 rounded px-2 py-2 w-full md:w-28 bg-white focus:ring-1 focus:ring-blue-400 text-base" value={safeValue(item?.totalCurrent)} onChange={e => handleCharger(idx, "totalCurrent", e.target.value)} />
                    </div>
                  </div>

                  <div className="flex flex-col w-full mt-4">
                    <label className="mb-1 font-medium text-base">การอัดประจุไฟฟ้า</label>
                    <div className="flex flex-wrap gap-x-4">
                      <label className="mr-2">
                        <input type="checkbox" checked={safeArray(item?.mode).includes("2")} onChange={() => handleCheckbox(idx, "mode", "2")} />
                        <span className="ml-1">โหมด 2 (AC)</span>
                      </label>
                      <label className="mr-2">
                        <input type="checkbox" checked={safeArray(item?.mode).includes("3")} onChange={() => handleCheckbox(idx, "mode", "3")} />
                        <span className="ml-1">โหมด 3 (AC)</span>
                      </label>
                      <label className="mr-2">
                        <input type="checkbox" checked={safeArray(item?.mode).includes("4")} onChange={() => handleCheckbox(idx, "mode", "4")} />
                        <span className="ml-1">โหมด 4 (DC)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <CorrectableRow label="ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า" value={item?.infoCheck} onChange={v => handleCharger(idx, "infoCheck", v)} detail />
                  </div>
                </div>

                {/* 5.7.2 ลักษณะหัวชาร์จ / การชาร์จ */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 text-blue-900">5.7.2 ลักษณะหัวชาร์จ / การชาร์จ</h4>
                  
                  {/* AC Type 2 */}
                  <div className="mb-4 p-3 border border-gray-200 rounded">
                    <label className="flex items-center mb-2">
                      <input type="checkbox" checked={safeArray(item?.headTypes).includes("ACType2")} onChange={() => handleCheckbox(idx, "headTypes", "ACType2")} className="mr-2" />
                      <span className="font-medium">AC Type 2</span>
                    </label>
                    {safeArray(item?.headTypes).includes("ACType2") && (
                      <div className="flex flex-wrap gap-4 ml-6">
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดกระแส (AAC)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.acType2Current)} onChange={e => handleCharger(idx, "acType2Current", e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดแรงดัน (VAC)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.acType2Voltage)} onChange={e => handleCharger(idx, "acType2Voltage", e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดกำลัง (kW)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.acType2Power)} onChange={e => handleCharger(idx, "acType2Power", e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DC CHAdeMO */}
                  <div className="mb-4 p-3 border border-gray-200 rounded">
                    <label className="flex items-center mb-2">
                      <input type="checkbox" checked={safeArray(item?.headTypes).includes("DCCHAdeMO")} onChange={() => handleCheckbox(idx, "headTypes", "DCCHAdeMO")} className="mr-2" />
                      <span className="font-medium">DC CHAdeMO</span>
                    </label>
                    {safeArray(item?.headTypes).includes("DCCHAdeMO") && (
                      <div className="flex flex-wrap gap-4 ml-6">
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดกระแส (ADC)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.dcChadeMoCurrent)} onChange={e => handleCharger(idx, "dcChadeMoCurrent", e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดแรงดัน (VDC)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.dcChadeMoVoltage)} onChange={e => handleCharger(idx, "dcChadeMoVoltage", e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดกำลัง (kW)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.dcChadeMoPower)} onChange={e => handleCharger(idx, "dcChadeMoPower", e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DC CCS */}
                  <div className="mb-4 p-3 border border-gray-200 rounded">
                    <label className="flex items-center mb-2">
                      <input type="checkbox" checked={safeArray(item?.headTypes).includes("DCCCS")} onChange={() => handleCheckbox(idx, "headTypes", "DCCCS")} className="mr-2" />
                      <span className="font-medium">DC CCS</span>
                    </label>
                    {safeArray(item?.headTypes).includes("DCCCS") && (
                      <div className="flex flex-wrap gap-4 ml-6">
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดกระแส (ADC)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.dcCcsCurrent)} onChange={e => handleCharger(idx, "dcCcsCurrent", e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดแรงดัน (VDC)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.dcCcsVoltage)} onChange={e => handleCharger(idx, "dcCcsVoltage", e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm">พิกัดกำลัง (kW)</label>
                          <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.dcCcsPower)} onChange={e => handleCharger(idx, "dcCcsPower", e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* อื่นๆ */}
                  <div className="mb-4 p-3 border border-gray-200 rounded">
                    <label className="flex items-center mb-2">
                      <input type="checkbox" checked={safeArray(item?.headTypes).includes("Other")} onChange={() => handleCheckbox(idx, "headTypes", "Other")} className="mr-2" />
                      <span className="font-medium">อื่นๆ ระบุ</span>
                    </label>
                    {safeArray(item?.headTypes).includes("Other") && (
                      <div className="ml-6">
                        <div className="flex flex-wrap gap-4 mb-2">
                          <input type="text" placeholder="ระบุประเภท" className="border border-gray-300 rounded px-2 py-1 flex-1 text-sm" value={safeValue(item?.otherHeadType)} onChange={e => handleCharger(idx, "otherHeadType", e.target.value)} />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex flex-col">
                            <label className="text-sm">พิกัดกระแส (A)</label>
                            <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.otherCurrent)} onChange={e => handleCharger(idx, "otherCurrent", e.target.value)} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm">พิกัดแรงดัน (V)</label>
                            <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.otherVoltage)} onChange={e => handleCharger(idx, "otherVoltage", e.target.value)} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm">พิกัดกำลัง (kW)</label>
                            <input type="text" className="border border-gray-300 rounded px-2 py-1 w-20 text-sm" value={safeValue(item?.otherPower)} onChange={e => handleCharger(idx, "otherPower", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="font-medium text-sm mb-2 block">หัวชาร์จสามารถชาร์จได้พร้อมกัน</label>
                    <div className="flex items-center gap-4">
                      <input type="text" className="border border-gray-300 rounded px-2 py-1 w-16 text-sm" value={safeValue(item?.simultaneousCharge)} onChange={e => handleCharger(idx, "simultaneousCharge", e.target.value)} />
                      <span className="text-sm">หัว คือ</span>
                      <input type="text" className="border border-gray-300 rounded px-2 py-1 flex-1 text-sm" value={safeValue(item?.simultaneousChargeDetail)} onChange={e => handleCharger(idx, "simultaneousChargeDetail", e.target.value)} />
                    </div>
                  </div>

                  <CorrectableRow label="ลักษณะหัวชาร์จ / การชาร์จ" value={item?.headCheck} onChange={v => handleCharger(idx, "headCheck", v)} detail />
                </div>

                {/* 5.7.3 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 2 */}
                {safeArray(item?.mode).includes("2") && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4 text-blue-900">5.7.3 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 2</h4>
                    
                    <CorrectableRow 
                      label="ก) เต้ารับและเต้าเสียบต้องเป็นชนิดมีขั้วสายดินตามมาตรฐาน" 
                      value={item?.mode2OutletGrounding} 
                      onChange={v => handleCharger(idx, "mode2OutletGrounding", v)} 
                      detail 
                    />
                    
                    <CorrectableRow 
                      label="ข) เต้ารับต้องไม่ใช่ชนิดหยิบยกได้" 
                      value={item?.mode2OutletFixed} 
                      onChange={v => handleCharger(idx, "mode2OutletFixed", v)} 
                      detail 
                    />
                    
                    <CorrectableRow 
                      label="ค) ต้องมีป้ายข้อความเตือน \จุดเชื่อมต่อยานยนต์ไฟฟ้า\ บริเวณเต้ารับ" 
                      value={item?.mode2WarningSign} 
                      onChange={v => handleCharger(idx, "mode2WarningSign", v)} 
                      detail 
                    />
                  </div>
                )}

                {/* 5.7.4 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 3 และโหมด 4 */}
                {(safeArray(item?.mode).includes("3") || safeArray(item?.mode).includes("4")) && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4 text-blue-900">5.7.4 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 3 และโหมด 4</h4>
                    
                    <CorrectableRow 
                      label="ก) ต้องมีป้ายเตือน \ระวังอันตรายจากไฟฟ้าช็อก\ ที่เครื่องอัดประจุ (ยกเว้นบ้านอยู่อาศัย)" 
                      value={item.mode34DangerSign} 
                      onChange={v => handleCharger(idx, "mode34DangerSign", v)} 
                      detail 
                    />
                    
                    <CorrectableRow 
                      label="ข) กรณีพิกัดกระแส > 60A ต้องติดตั้งสวิตช์ควบคุมฉุกเฉิน (Emergency Switch) ภายในระยะ 15 เมตร" 
                      value={item?.mode34EmergencySwitch} 
                      onChange={v => handleCharger(idx, "mode34EmergencySwitch", v)} 
                      detail 
                    />
                    
                    <CorrectableRow 
                      label="ค) กรณีต้องการการระบายอากาศ ต้องมีการระบายอากาศและป้ายเตือน \ต้องการการระบายอากาศ\"
                      value={item?.mode34Ventilation} 
                      onChange={v => handleCharger(idx, "mode34Ventilation", v)} 
                      detail 
                    />
                    
                    <CorrectableRow 
                      label="ง) ความยาวสายชาร์จไม่ควรเกิน 7.50 เมตร (ข้อแนะนำ)" 
                      value={item?.mode34CableLength} 
                      onChange={v => handleCharger(idx, "mode34CableLength", v)} 
                      detail 
                    />
                  </div>
                )}

                {/* 5.7.5 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้าอยู่ในบริเวณสถานีบริการน้ำมัน, LPG และ CNG */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 text-blue-900">5.7.5 กรณีติดตั้งในบริเวณสถานีบริการน้ำมัน, LPG และ CNG</h4>
                  
                  <CorrectableRow 
                    label="ก) เครื่องอัดประจุต้องเป็นโหมด 3 หรือโหมด 4" 
                    value={item?.gasStationMode} 
                    onChange={v => handleCharger(idx, "gasStationMode", v)} 
                    detail 
                  />
                  
                  <CorrectableRow 
                    label="ข) ต้องเป็นแบบมีสายชาร์จยึดติดกับเครื่องเท่านั้น" 
                    value={item?.gasStationFixedCable} 
                    onChange={v => handleCharger(idx, "gasStationFixedCable", v)} 
                    detail 
                  />
                  
                  <CorrectableRow 
                    label="ค) ต้องติดตั้งสวิตช์ควบคุมฉุกเฉินสำหรับปลดวงจรเมนสวิตช์" 
                    value={item?.gasStationMainSwitch} 
                    onChange={v => handleCharger(idx, "gasStationMainSwitch", v)} 
                    detail 
                  />
                  
                  <CorrectableRow 
                    label="ง) สวิตช์ควบคุมฉุกเฉินต้องอยู่ห่างจากตู้จ่ายวัตถุอันตราย 6-30 เมตร" 
                    value={item?.gasStationSwitchDistance} 
                    onChange={v => handleCharger(idx, "gasStationSwitchDistance", v)} 
                    detail 
                  />
                  
                  <CorrectableRow 
                    label="จ) อุปกรณ์ไฟฟ้าต้องปฏิบัติตามมาตรฐานของกรมธุรกิจพลังงาน" 
                    value={item?.gasStationElectricalStandard} 
                    onChange={v => handleCharger(idx, "gasStationElectricalStandard", v)} 
                    detail 
                  />
                  
                  <CorrectableRow 
                    label="ฉ) ต้องใช้ข้อกำหนดระยะห่างของบริเวณอันตรายตามกฎหมายกรมธุรกิจพลังงาน" 
                    value={item?.gasStationSafetyDistance} 
                    onChange={v => handleCharger(idx, "gasStationSafetyDistance", v)} 
                    detail 
                  />
                </div>

                {/* 5.7.6 ข้อแนะนำในการป้องกันเครื่องอัดประจุยานยนต์ไฟฟ้า */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-4 text-blue-900">5.7.6 ข้อแนะนำในการป้องกันเครื่องอัดประจุยานยนต์ไฟฟ้า</h4>
                  
                  <div className="space-y-3">
                    <div className="py-3 border-b border-gray-200 last:border-b-0 text-gray-700">
                      <div className="text-sm text-gray-700 mb-2">ก) มีการป้องกันความเสียหายจากการชนของยานยนต์</div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={item?.collisionProtection === "ติดตั้งแล้ว"}
                            onChange={() => handleCharger(idx, "collisionProtection", "ติดตั้งแล้ว")}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm text-green-700">ติดตั้งแล้ว</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={item?.collisionProtection === "ยังไม่ติดตั้ง"}
                            onChange={() => handleCharger(idx, "collisionProtection", "ยังไม่ติดตั้ง")}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm text-red-700">ยังไม่ติดตั้ง</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="py-3 border-b border-gray-200 last:border-b-0 text-gray-700">
                      <div className="text-sm text-gray-700 mb-2">ข) มีการป้องกันและระงับอัคคีภัยโดยการติดตั้งถังดับเพลิง</div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={item?.fireProtection === "ติดตั้งแล้ว"}
                            onChange={() => handleCharger(idx, "fireProtection", "ติดตั้งแล้ว")}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm text-green-700">ติดตั้งแล้ว</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={item?.fireProtection === "ยังไม่ติดตั้ง"}
                            onChange={() => handleCharger(idx, "fireProtection", "ยังไม่ติดตั้ง")}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm text-red-700">ยังไม่ติดตั้ง</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="py-3 border-b border-gray-200 last:border-b-0 text-gray-700">
                      <div className="text-sm text-gray-700 mb-2">ค) กรณีติดตั้งอยู่ภายนอกอาคาร มีการติดตั้งระบบป้องกันฟ้าผ่า</div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={item?.lightningProtection === "ติดตั้งแล้ว"}
                            onChange={() => handleCharger(idx, "lightningProtection", "ติดตั้งแล้ว")}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm text-green-700">ติดตั้งแล้ว</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={item?.lightningProtection === "ยังไม่ติดตั้ง"}
                            onChange={() => handleCharger(idx, "lightningProtection", "ยังไม่ติดตั้ง")}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm text-red-700">ยังไม่ติดตั้ง</span>
                        </label>
                      </div>
                    </div>
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

export default EvChargerCheckSection;