"use client";

import React, { memo, useCallback } from 'react';

/**
 * CorrectiveRadio
 * ปุ่มเลือก "ถูกต้อง" หรือ "ต้องแก้ไข" สำหรับแต่ละรายการ
 * - ถ้าเลือก "ต้องแก้ไข" จะแสดง textarea เพื่อให้ระบุรายละเอียดเพิ่มเติม
 *
 * @param {Array} items - [{ section, sub_item, item_title }]
 * @param {Array} values - [{ result, detail }]
 * @param {Function} onChange - (updatedValues) => void
 * @param {Boolean} disabled - true เพื่อปิดการใช้งาน input ทั้งหมด
 */
const CorrectiveRadio = memo(({
  items = [],
  values = [],
  onChange,
  disabled = false,
}) => {
  // เปลี่ยนสถานะ (ถูกต้อง/ต้องแก้ไข)
  const handleStatusChange = useCallback((idx, result) => {
    const updated = values.map((item, i) =>
      i === idx ? { ...item, result } : item
    );
    onChange(updated);
  }, [values, onChange]);

  // เปลี่ยนรายละเอียดเมื่อเลือก "ต้องแก้ไข"
  const handleNoteChange = useCallback((idx, e) => {
    const { value } = e.target;
    const updated = values.map((item, i) =>
      i === idx ? { ...item, detail: value } : item
    );
    onChange(updated);
  }, [values, onChange]);

  return (
    <div className="space-y-5">
      {items.map((item, idx) => (
        <div
          key={item.section + (item.sub_item || '') + item.item_title}
          className="relative border border-gray-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-white to-gray-50/50 shadow group"
        >
          <div className="mb-2 font-semibold text-gray-800 flex gap-2">
            <span className="text-purple-700">
              {item.section}
              {item.sub_item ? ` (${item.sub_item})` : ""}
            </span>
            <span>{item.item_title}</span>
          </div>
          {/* Radio ถูกต้อง/ต้องแก้ไข */}
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="inline-flex items-center cursor-pointer p-2">
              <input
                type="radio"
                name={`result-${idx}`}
                value="ถูกต้อง"
                checked={values[idx]?.result === 'ถูกต้อง'}
                onChange={() => handleStatusChange(idx, 'ถูกต้อง')}
                disabled={disabled}
              />
              <span className="ml-2 text-green-700">ถูกต้อง</span>
            </label>
            <label className="inline-flex items-center cursor-pointer p-2">
              <input
                type="radio"
                name={`result-${idx}`}
                value="ต้องแก้ไข"
                checked={values[idx]?.result === 'ต้องแก้ไข'}
                onChange={() => handleStatusChange(idx, 'ต้องแก้ไข')}
                disabled={disabled}
              />
              <span className="ml-2 text-red-700">ต้องแก้ไข</span>
            </label>
          </div>

          {/* ช่องรายละเอียดเมื่อเลือก "ต้องแก้ไข" */}
          {(values[idx]?.result === 'ต้องแก้ไข') && (
            <div className="mb-2 text-gray-700 bg-gray-100">
              <textarea
                rows={2}
                className="w-full border p-2 text-sm"
                placeholder="รายละเอียดการแก้ไข"
                value={values[idx]?.detail || ''}
                onChange={e => handleNoteChange(idx, e)}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

CorrectiveRadio.displayName = 'CorrectiveRadio';
export default CorrectiveRadio;