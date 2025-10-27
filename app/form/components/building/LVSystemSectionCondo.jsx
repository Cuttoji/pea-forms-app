import React from "react";

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

      <div className="space-y-8 px-6 py-6 bg-white rounded-b-xl shadow-lg">
        
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">มาตรฐานอื่นๆ:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('mainSwitch.other_standard')}
                  onChange={(e) => updateField('mainSwitch.other_standard', e.target.value)}
                  placeholder="ระบุมาตรฐาน"
                />
              </div>
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

        {/* 2.17 แผงจ่ายไฟประจำชั้น */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.17 แผงจ่ายไฟประจำชั้น
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            {/* เซอร์กิตเบรกเกอร์ตามมาตรฐาน */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.17.1 เซอร์กิตเบรกเกอร์ตามมาตรฐาน</p>
              <RadioOption
                name="floor-cb-standard-result"
                selectedValue={getField('floorPanel.cb_standard.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('floorPanel.cb_standard.result', val)}
              />
              {getField('floorPanel.cb_standard.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('floorPanel.cb_standard.remark')}
                  onChange={(e) => updateField('floorPanel.cb_standard.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>

            {/* Feeder */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.17.2 Feeder</p>
              <div className="flex flex-wrap gap-6 mb-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 min-w-[40px]">AT:</label>
                  <input
                    type="text"
                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('floorPanel.feeder.at')}
                    onChange={(e) => updateField('floorPanel.feeder.at', e.target.value)}
                    placeholder="AT"
                  />
                  <span className="text-sm text-gray-600">A</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 min-w-[40px]">AF:</label>
                  <input
                    type="text"
                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('floorPanel.feeder.af')}
                    onChange={(e) => updateField('floorPanel.feeder.af', e.target.value)}
                    placeholder="AF"
                  />
                  <span className="text-sm text-gray-600">A</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 min-w-[40px]">IC:</label>
                  <input
                    type="text"
                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('floorPanel.feeder.ic')}
                    onChange={(e) => updateField('floorPanel.feeder.ic', e.target.value)}
                    placeholder="IC"
                  />
                  <span className="text-sm text-gray-600">kA</span>
                </div>
              </div>
              <RadioOption
                name="floor-feeder-result"
                selectedValue={getField('floorPanel.feeder.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('floorPanel.feeder.result', val)}
              />
              {getField('floorPanel.feeder.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('floorPanel.feeder.remark')}
                  onChange={(e) => updateField('floorPanel.feeder.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>

            {/* ขั้วต่อสายดิน */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.17.3 ขั้วต่อสายดิน</p>
              <RadioOption
                name="floor-ground-bus-result"
                selectedValue={getField('floorPanel.ground_bus.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('floorPanel.ground_bus.result', val)}
              />
              {getField('floorPanel.ground_bus.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('floorPanel.ground_bus.remark')}
                  onChange={(e) => updateField('floorPanel.ground_bus.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>
          </div>
        </div>

        {/* 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์ */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[40px]">AT:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('meterBreaker.at')}
                  onChange={(e) => updateField('meterBreaker.at', e.target.value)}
                  placeholder="AT"
                />
                <span className="text-sm text-gray-600">A</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[40px]">AF:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('meterBreaker.af')}
                  onChange={(e) => updateField('meterBreaker.af', e.target.value)}
                  placeholder="AF"
                />
                <span className="text-sm text-gray-600">A</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[40px]">IC:</label>
                <input
                  type="text"
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('meterBreaker.ic')}
                  onChange={(e) => updateField('meterBreaker.ic', e.target.value)}
                  placeholder="IC"
                />
                <span className="text-sm text-gray-600">kA</span>
              </div>
            </div>
            <RadioOption
              name="meter-breaker-result"
              selectedValue={getField('meterBreaker.result')}
              options={[
                { label: 'ถูกต้อง', value: 'correct' },
                { label: 'ต้องแก้ไข', value: 'incorrect' }
              ]}
              onSelect={(val) => updateField('meterBreaker.result', val)}
            />
            {getField('meterBreaker.result') === 'incorrect' && (
              <textarea
                className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                rows={2}
                value={getField('meterBreaker.remark')}
                onChange={(e) => updateField('meterBreaker.remark', e.target.value)}
                placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
              />
            )}
          </div>
        </div>

        {/* 2.19 สายตัวนำประธานเข้าห้องชุด */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.19 สายตัวนำประธานเข้าห้องชุด
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">ชนิด:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('roomConductor.type')}
                  onChange={(e) => updateField('roomConductor.type', e.target.value)}
                  placeholder="ชนิดสายไฟ"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ขนาด:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('roomConductor.size')}
                    onChange={(e) => updateField('roomConductor.size', e.target.value)}
                    placeholder="ขนาด"
                  />
                  <span className="text-sm text-gray-600">ตร.มม.</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">วิธีการเดินสาย:</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'ท่อร้อยสาย (Conduit)', value: 'conduit' },
                  { label: 'รางเดินสาย (Wire Way)', value: 'wireway' },
                  { label: 'อื่นๆ', value: 'other' }
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(getField('roomConductor.methods', []) || []).includes(opt.value)}
                      onChange={(e) => {
                        const current = getField('roomConductor.methods', []) || [];
                        const updated = e.target.checked 
                          ? [...current, opt.value]
                          : current.filter(v => v !== opt.value);
                        updateField('roomConductor.methods', updated);
                      }}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              {(getField('roomConductor.methods', []) || []).includes('other') && (
                <input
                  type="text"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                  value={getField('roomConductor.other')}
                  onChange={(e) => updateField('roomConductor.other', e.target.value)}
                  placeholder="ระบุวิธีการอื่นๆ"
                />
              )}
            </div>

            <RadioOption
              name="room-conductor-result"
              selectedValue={getField('roomConductor.result')}
              options={[
                { label: 'ถูกต้อง', value: 'correct' },
                { label: 'ต้องแก้ไข', value: 'incorrect' }
              ]}
              onSelect={(val) => updateField('roomConductor.result', val)}
            />
            {getField('roomPanel.cb_standard.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('roomPanel.cb_standard.remark')}
                  onChange={(e) => updateField('roomPanel.cb_standard.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
          </div>
        </div>

        {/* 2.20 แผงจ่ายไฟในห้องชุด */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.20 แผงจ่ายไฟในห้องชุด
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            {/* เซอร์กิตเบรกเกอร์ตามมาตรฐาน */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.20.1 เซอร์กิตเบรกเกอร์ตามมาตรฐาน</p>
              <RadioOption
                name="room-panel-cb-result"
                selectedValue={getField('roomPanel.cb_standard.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('roomPanel.cb_standard.result', val)}
              />
              {getField('roomPanel.cb_standard.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('roomPanel.cb_standard.remark')}
                  onChange={(e) => updateField('roomPanel.cb_standard.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>

            {/* Meter */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.20.2 Meter</p>
              <div className="flex flex-wrap gap-6 mb-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 min-w-[40px]">AT:</label>
                  <input
                    type="text"
                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('roomPanel.meter.at')}
                    onChange={(e) => updateField('roomPanel.meter.at', e.target.value)}
                    placeholder="AT"
                  />
                  <span className="text-sm text-gray-600">A</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 min-w-[40px]">AF:</label>
                  <input
                    type="text"
                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    value={getField('roomPanel.meter.af')}
                    onChange={(e) => updateField('roomPanel.meter.af', e.target.value)}
                    placeholder="AF"
                  />
                  <span className="text-sm text-gray-600">A</span>
                </div>
              </div>
              <RadioOption
                name="room-panel-meter-result"
                selectedValue={getField('roomPanel.meter.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('roomPanel.meter.result', val)}
              />
              {getField('roomPanel.meter.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('roomPanel.meter.remark')}
                  onChange={(e) => updateField('roomPanel.meter.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>

            {/* IC */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">2.20.3 IC</p>
              <RadioOption
                name="room-panel-ic-result"
                selectedValue={getField('roomPanel.ic.result')}
                options={[
                  { label: 'ถูกต้อง', value: 'correct' },
                  { label: 'ต้องแก้ไข', value: 'incorrect' }
                ]}
                onSelect={(val) => updateField('roomPanel.ic.result', val)}
              />
              {getField('roomPanel.ic.result') === 'incorrect' && (
                <textarea
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                  rows={2}
                  value={getField('roomPanel.ic.remark')}
                  onChange={(e) => updateField('roomPanel.ic.remark', e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
                />
              )}
            </div>
          </div>
        </div>

        {/* 2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <RadioOption
              name="room-panel-ground-bus-result"
              selectedValue={getField('roomPanelGroundBus.result')}
              options={[
                { label: 'ถูกต้อง', value: 'correct' },
                { label: 'ต้องแก้ไข', value: 'incorrect' }
              ]}
              onSelect={(val) => updateField('roomPanelGroundBus.result', val)}
            />
            {getField('roomPanelGroundBus.result') === 'incorrect' && (
              <textarea
                className="mt-2 w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 text-sm"
                rows={2}
                value={getField('roomPanelGroundBus.remark')}
                onChange={(e) => updateField('roomPanelGroundBus.remark', e.target.value)}
                placeholder="กรุณาระบุรายละเอียดที่ต้องแก้ไข"
              />
            )}
          </div>
        </div>

        {/* 2.22 อื่นๆ */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-300 pb-2">
            2.22 อื่นๆ
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm resize-none"
              rows={6}
              value={getField('other')}
              onChange={(e) => updateField('other', e.target.value)}
              placeholder="กรุณากรอกรายละเอียดเพิ่มเติม..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
