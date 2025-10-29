import React from "react";
import FloorSection from "./floor";

/**
 * LVSystemSectionCondo - Low Voltage System Section for Condo Inspection
 * Covers sections 2.14 - 2.22
 */
export default function LVSystemSectionCondo({ value = {}, onChange }) {
  // Helper to update nested fields
  const updateField = (path, newValue) => {
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(value)); // Deep clone
    
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = newValue;
    
    onChange(updated);
  };

  const getField = (path, defaultValue = "") => {
    const keys = path.split('.');
    let current = value;
    for (const key of keys) {
      if (!current || current[key] === undefined) return defaultValue;
      current = current[key];
    }
    return current;
  };

  // Radio component
  const RadioOption = ({ name, selectedValue, options, onSelect }) => (
    <div className="flex gap-4">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selectedValue === opt.value}
            onChange={() => onSelect(opt.value)}
            className="w-4 h-4 text-green-600 focus:ring-green-500"
          />
          <span className={`text-sm ${selectedValue === opt.value ? 'font-semibold' : ''} ${
            opt.value === 'correct' ? 'text-green-700' : opt.value === 'incorrect' ? 'text-red-700' : 'text-gray-700'
          }`}>
            {opt.value === 'correct' ? '✓' : opt.value === 'incorrect' ? '✗' : ''} {opt.label}
          </span>
        </label>
      ))}
    </div>
  );

  // Reusable radio-only section (for 2.17.1, 2.17.3, 2.20.1, 2.20.3, 2.21)
  const RadioOnlyCheck = ({ label, fieldPrefix }) => {
    const resultPath = `${fieldPrefix}.result`;
    const remarkPath = `${fieldPrefix}.remark`;
    return (
      <div>
        {label && <p className="text-sm text-gray-700 font-medium mb-2">{label}</p>}
        <RadioOption
          name={`${fieldPrefix}-result`}
          selectedValue={getField(resultPath)}
          options={[
            { label: 'ถูกต้อง', value: 'correct' },
            { label: 'ต้องแก้ไข', value: 'incorrect' }
          ]}
          onSelect={(val) => updateField(resultPath, val)}
        />
        {getField(resultPath) === 'incorrect' && (
          <textarea
            className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
            rows={2}
            value={getField(remarkPath)}
            onChange={(e) => updateField(remarkPath, e.target.value)}
            placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
          />
        )}
      </div>
    );
  };

  // Reusable input + radio section (for 2.17.2, 2.18, 2.20.2)
  const InputCheckSection = ({ label, fieldPrefix, inputs }) => {
    const resultPath = `${fieldPrefix}.result`;
    const remarkPath = `${fieldPrefix}.remark`;
    return (
      <div>
        {label && <p className="text-sm text-gray-700 font-medium mb-2">{label}</p>}
        <div className="flex flex-wrap gap-6 mb-2">
          {inputs.map(({ key, unit, label: inputLabel }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-sm text-gray-600 min-w-[40px]">{inputLabel || key.toUpperCase()}:</label>
              <input
                type="text"
                className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                value={getField(`${fieldPrefix}.${key}`)}
                onChange={(e) => updateField(`${fieldPrefix}.${key}`, e.target.value)}
                placeholder={key.toUpperCase()}
              />
              <span className="text-sm text-gray-600">{unit}</span>
            </div>
          ))}
        </div>
        <RadioOption
          name={`${fieldPrefix}-result`}
          selectedValue={getField(resultPath)}
          options={[
            { label: 'ถูกต้อง', value: 'correct' },
            { label: 'ต้องแก้ไข', value: 'incorrect' }
          ]}
          onSelect={(val) => updateField(resultPath, val)}
        />
        {getField(resultPath) === 'incorrect' && (
          <textarea
            className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
            rows={2}
            value={getField(remarkPath)}
            onChange={(e) => updateField(remarkPath, e.target.value)}
            placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h3 className="text-xl font-bold">ระบบไฟฟ้าแรงต่ำ</h3>
            <p className="text-sm text-purple-100">Low Voltage System</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-6 py-6 bg-white rounded-b-xl shadow-lg text-gray-700">
        
        {/* 2.14 สายตัวนำประธานแรงต่ำ */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.14 สายตัวนำประธานแรงต่ำ
          </h4>

          {/* 2.14.1 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="mb-3">
              <p className="text-gray-700 font-medium">2.14.1 สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ มอก. 293-2541 หรือ IEC 60502</p>
            </div>
            <RadioOption
              name="2.14.1-result"
              selectedValue={getField('conductorStandard.2.14.1.result')}
              options={[
                { label: 'ถูกต้อง', value: 'correct' },
                { label: 'ต้องแก้ไข', value: 'incorrect' }
              ]}
              onSelect={(val) => updateField('conductorStandard.2.14.1.result', val)}
            />
            {getField('conductorStandard.2.14.1.result') === 'incorrect' && (
              <div className="mt-3">
                <label className="block text-sm text-gray-600 mb-1">รายละเอียด:</label>
                <textarea
                  className="w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('conductorStandard.2.14.1.detail')}
                  onChange={(e) => updateField('conductorStandard.2.14.1.detail', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              </div>
            )}
          </div>

          {/* 2.14.2 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="mb-3">
              <p className="text-gray-700 font-medium">2.14.2 ชนิดและขนาดของสายไฟฟ้า</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-2">ชนิดสายไฟฟ้า:</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'IEC 01', value: 'iec01' },
                    { label: 'NYY', value: 'nyy' },
                    { label: 'CV', value: 'cv' },
                    { label: 'อื่นๆ', value: 'other' }
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(getField('conductorStandard.2.14.2.types', []) || []).includes(opt.value)}
                        onChange={(e) => {
                          const current = getField('conductorStandard.2.14.2.types', []) || [];
                          const updated = e.target.checked 
                            ? [...current, opt.value]
                            : current.filter(v => v !== opt.value);
                          updateField('conductorStandard.2.14.2.types', updated);
                        }}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {(getField('conductorStandard.2.14.2.types', []) || []).includes('other') && (
                  <input
                    type="text"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('conductorStandard.2.14.2.other')}
                    onChange={(e) => updateField('conductorStandard.2.14.2.other', e.target.value)}
                    placeholder="ระบุชนิดอื่นๆ"
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[60px]">ขนาด:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('conductorStandard.2.14.2.size')}
                  onChange={(e) => updateField('conductorStandard.2.14.2.size', e.target.value)}
                  placeholder="ขนาด"
                />
                <span className="text-sm text-gray-600">ตร.มม.</span>
              </div>

              <RadioOption
                name="2.14.2-result"
                selectedValue={getField('conductorStandard.2.14.2.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('conductorStandard.2.14.2.result', val)}
              />
              {getField('conductorStandard.2.14.2.result') === 'incorrect' && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">รายละเอียด:</label>
                  <textarea
                    className="w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                    rows={2}
                    value={getField('conductorStandard.2.14.2.detail')}
                    onChange={(e) => updateField('conductorStandard.2.14.2.detail', e.target.value)}
                    placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                  />
                </div>
              )}
            </div>
          </div>

        {/* 2.14.3 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mb-3">
                      <p className="text-gray-700 font-medium">2.14.3 วิธีการเดินสาย</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { label: 'บนลูกถ้วยฉนวนในอากาศ', value: 'air' },
                        { label: 'ท่อร้อยสาย (Conduit)', value: 'conduit' },
                        { label: 'รางเดินสาย (Wire Way)', value: 'wireway' },
                        { label: 'รางเคเบิล (Cable Tray)', value: 'cabletray' },
                        { label: 'บัสเวย์ (Bus Way)', value: 'busway' },
                        { label: 'เดินฝังใต้ดิน', value: 'underground' },
                        { label: 'อื่นๆ', value: 'other' }
                      ].map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(getField('conductorStandard.2.14.3.methods', []) || []).includes(opt.value)}
                            onChange={(e) => {
                              const current = getField('conductorStandard.2.14.3.methods', []) || [];
                              const updated = e.target.checked 
                                ? [...current, opt.value]
                                : current.filter(v => v !== opt.value);
                              updateField('conductorStandard.2.14.3.methods', updated);
                            }}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {(getField('conductorStandard.2.14.3.methods', []) || []).includes('other') && (
                      <input
                        type="text"
                        className="mt-3 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                        value={getField('conductorStandard.2.14.3.other')}
                        onChange={(e) => updateField('conductorStandard.2.14.3.other', e.target.value)}
                        placeholder="ระบุวิธีการอื่นๆ"
                      />
                    )}
                    <div className="mt-4 text-gray-600 font-medium text-sm">* การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับ  
การเดินสายภายในและภายนอกอาคาร สำหรับสายตัวนำอะลูมิเนียม
 อนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวน
 ภายนอกอาคาร </div>

                    {/* ผลการตรวจ */}
                    <div className="mt-4">
                      <RadioOption
                        name="2.14.3-result"
                        selectedValue={getField('conductorStandard.2.14.3.result')}
                        options={[
                          { label: 'ถูกต้อง', value: 'correct' },
                          { label: 'ต้องแก้ไข', value: 'incorrect' }
                        ]}
                        onSelect={(val) => updateField('conductorStandard.2.14.3.result', val)}
                      />
                      {getField('conductorStandard.2.14.3.result') === 'incorrect' && (
                        <div className="mt-3">
                          <label className="block text-sm text-gray-600 mb-1">รายละเอียด:</label>
                          <textarea
                            className="w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                            rows={2}
                            value={getField('conductorStandard.2.14.3.detail')}
                            onChange={(e) => updateField('conductorStandard.2.14.3.detail', e.target.value)}
                            placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={getField('mainSwitch.cb_iec60947_2', false)}
                  onChange={(e) => updateField('mainSwitch.cb_iec60947_2', e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={getField('mainSwitch.switch_fuse', false)}
                  onChange={(e) => updateField('mainSwitch.switch_fuse', e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">สวิตช์พร้อมฟิวส์</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={getField('mainSwitch.has_other_standard', false)}
                  onChange={(e) => updateField('mainSwitch.has_other_standard', e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">มาตรฐานอื่นๆ</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getField('mainSwitch.has_other_standard', false) && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ระบุมาตรฐานอื่นๆ:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('mainSwitch.other_standard')}
                    onChange={(e) => updateField('mainSwitch.other_standard', e.target.value)}
                    placeholder="ระบุมาตรฐาน"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">ผลิตภัณฑ์:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.product')}
                  onChange={(e) => updateField('mainSwitch.product', e.target.value)}
                  placeholder="ชื่อผลิตภัณฑ์"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ชนิด (Type):</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.type')}
                  onChange={(e) => updateField('mainSwitch.type', e.target.value)}
                  placeholder="ชนิด"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Voltage (V):</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.voltage')}
                  onChange={(e) => updateField('mainSwitch.voltage', e.target.value)}
                  placeholder="แรงดัน"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[40px]">In:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.in')}
                  onChange={(e) => updateField('mainSwitch.in', e.target.value)}
                  placeholder="In"
                />
                <span className="text-sm text-gray-600">A</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[40px]">Ic:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.ic')}
                  onChange={(e) => updateField('mainSwitch.ic', e.target.value)}
                  placeholder="Ic"
                />
                <span className="text-sm text-gray-600">kA</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[40px]">AT:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.at')}
                  onChange={(e) => updateField('mainSwitch.at', e.target.value)}
                  placeholder="AT"
                />
                <span className="text-sm text-gray-600">A</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[40px]">AF:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.af')}
                  onChange={(e) => updateField('mainSwitch.af', e.target.value)}
                  placeholder="AF"
                />
                <span className="text-sm text-gray-600">A</span>
              </div>
            </div>
            <div className="mt-4 text-gray-600 font-medium text-sm">
              บริภัณฑ์ประธานแรงต่ำที่มีขนาดตั้งแต่ 1,000 A ขึ้นไป ต้องติดตั้ง 
Ground Fault Protection (GFP)
              </div>

            <RadioOption
              name="mainSwitch-result"
              selectedValue={getField('mainSwitch.result')}
              options={[
                { label: 'ถูกต้อง', value: 'correct' },
                { label: 'ต้องแก้ไข', value: 'incorrect' }
              ]}
              onSelect={(val) => updateField('mainSwitch.result', val)}
            />
            {getField('mainSwitch.result') === 'incorrect' && (
              <div className="mt-2">
                <label className="block text-sm text-gray-600 mb-1">หมายเหตุ:</label>
                <textarea
                  className="w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('mainSwitch.remark')}
                  onChange={(e) => updateField('mainSwitch.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              </div>
            )}
          </div>
        </div>

        {/* 2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            {/* ขนาดสายต่อหลักดิน */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.16.1 ขนาดสายต่อหลักดิน</p>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('grounding.ground_wire_size')}
                  onChange={(e) => updateField('grounding.ground_wire_size', e.target.value)}
                  placeholder="ขนาด"
                />
                <span className="text-sm text-gray-600">ตร.มม.</span>
              </div>
              <RadioOption
                name="ground-wire-size-result"
                selectedValue={getField('grounding.ground_wire_size_result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('grounding.ground_wire_size_result', val)}
              />
              {getField('grounding.ground_wire_size_result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('grounding.ground_wire_size_remark')}
                  onChange={(e) => updateField('grounding.ground_wire_size_remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>

            {/* ค่าความต้านทานการต่อลงดิน */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.16.2 ค่าความต้านทานการต่อลงดิน</p>
              <RadioOption
                name="resistance-result"
                selectedValue={getField('grounding.resistance.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('grounding.resistance.result', val)}
              />
              {getField('grounding.resistance.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('grounding.resistance.remark')}
                  onChange={(e) => updateField('grounding.resistance.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>

            {/* จุดทดสอบ */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.16.3 จุดทดสอบ</p>
              <RadioOption
                name="test-point-result"
                selectedValue={getField('grounding.test_point.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('grounding.test_point.result', val)}
              />
              {getField('grounding.test_point.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('grounding.test_point.remark')}
                  onChange={(e) => updateField('grounding.test_point.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>

            {/* ขั้วต่อสายดิน/นิวทรัล */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.16.4 ขั้วต่อสายดิน/นิวทรัล (Busbar)</p>
              <RadioOption
                name="busbar-result"
                selectedValue={getField('grounding.busbar.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('grounding.busbar.result', val)}
              />
              {getField('grounding.busbar.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('grounding.busbar.remark')}
                  onChange={(e) => updateField('grounding.busbar.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>
          </div>
        </div>

        {/* ใช้ FloorSection สำหรับ 2.17-2.21 */}
        <FloorSection
          value={value}
          onChange={onChange}
          getField={getField}
          updateField={updateField}
          RadioOption={RadioOption}
        />
      </div>
    </div>
  );
}
