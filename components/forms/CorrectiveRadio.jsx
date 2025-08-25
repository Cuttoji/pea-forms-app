"use client";

import React, { memo, useCallback } from 'react';

const CorrectiveRadio = memo(({
  groupName,
  label,
  currentValue,
  currentNote,
  onStatusChange,
  onNoteChange,
  disabled = false,
  alwaysShowNote = false,
}) => {
  const handleStatusChange = useCallback((value) => {
    onStatusChange(groupName, value, `${groupName}_note`);
  }, [groupName, onStatusChange]);

  const handleNoteChange = useCallback((e) => {
    const { name, value } = e.target;
    onNoteChange({ target: { name, value } });
  }, [onNoteChange]);

  const noteFieldName = `${groupName}_note`;

  return (
    <div className="relative border border-gray-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-300 group"> 
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <label className="relative block text-base font-semibold text-gray-800 mb-4 leading-relaxed">{label}</label>
      
      <div className="relative flex flex-wrap gap-4 mb-4">
        <label className="inline-flex items-center cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-green-200 hover:bg-green-50/50 transition-all duration-200 group/correct">
          <input
            type="radio"
            name={groupName}
            value="ถูกต้อง"
            checked={currentValue === 'ถูกต้อง'}
            onChange={() => handleStatusChange('ถูกต้อง')}
            disabled={disabled}
            className="form-radio h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          <span className={`ml-3 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
            currentValue === 'ถูกต้อง' 
              ? 'text-green-700' 
              : 'text-gray-700 group-hover/correct:text-green-600'
          } ${disabled ? 'text-gray-400' : ''}`}>
            <span className="text-lg">✅</span>
            ถูกต้อง
          </span>
        </label>
        
        <label className="inline-flex items-center cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-red-200 hover:bg-red-50/50 transition-all duration-200 group/incorrect">
          <input
            type="radio"
            name={groupName}
            value="ไม่ถูกต้อง"
            checked={currentValue === 'ไม่ถูกต้อง'}
            onChange={() => handleStatusChange('ไม่ถูกต้อง')}
            disabled={disabled}
            className="form-radio h-5 w-5 text-red-600 focus:ring-2 focus:ring-red-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          <span className={`ml-3 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
            currentValue === 'ไม่ถูกต้อง' 
              ? 'text-red-700' 
              : 'text-gray-700 group-hover/incorrect:text-red-600'
          } ${disabled ? 'text-gray-400' : ''}`}>
            <span className="text-lg">❌</span>
            ไม่ถูกต้อง
          </span>
        </label>

        <label className="inline-flex items-center cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 group/no-check">
          <input
            type="radio"
            name={groupName}
            value="-"
            checked={currentValue === '-' || !currentValue}
            onChange={() => handleStatusChange('-')}
            disabled={disabled}
            className="form-radio h-5 w-5 text-gray-600 focus:ring-2 focus:ring-gray-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          <span className={`ml-3 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
            currentValue === '-' 
              ? 'text-gray-800' 
              : 'text-gray-700 group-hover/no-check:text-gray-600'
          } ${disabled ? 'text-gray-400' : ''}`}>
            <span className="text-lg">➖</span>
            ไม่มีการตรวจ (-)
          </span>
        </label>
      </div>
      
      {(alwaysShowNote || currentValue === 'ไม่ถูกต้อง') && (
        <div className={`transition-all duration-500 transform ${
          currentValue === 'ไม่ถูกต้อง' 
            ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-l-4 border-red-400 shadow-inner' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-l-4 border-gray-300'
        } p-4 rounded-lg relative overflow-hidden`}>
          
          <div className={`absolute inset-0 ${
            currentValue === 'ไม่ถูกต้อง' 
              ? 'bg-gradient-to-r from-red-400/10 to-transparent' 
              : 'bg-gradient-to-r from-gray-400/10 to-transparent'
          }`}></div>
          
          <label htmlFor={noteFieldName} className={`relative block text-sm font-semibold mb-3 flex items-center gap-2 ${
            currentValue === 'ไม่ถูกต้อง' ? 'text-red-800' : 'text-gray-800'
          }`}>
            <span className="text-lg">📝</span>
            {currentValue === 'ไม่ถูกต้อง' ? 'รายละเอียดการแก้ไข (จำเป็น):' : 'รายละเอียดเพิ่มเติม:'}
          </label>
          
          <textarea
            id={noteFieldName}
            name={noteFieldName}
            rows={3}
            className={`relative w-full p-4 border-2 rounded-lg shadow-sm transition-all duration-200 text-sm resize-none ${
              currentValue === 'ไม่ถูกต้อง'
                ? 'border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 bg-white/80'
                : 'border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white/60'
            } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : 'hover:border-gray-300'}`}
            value={currentNote || ''}
            onChange={handleNoteChange}
            disabled={disabled}
            placeholder={
              currentValue === 'ไม่ถูกต้อง' 
                ? 'โปรดระบุรายละเอียดการแก้ไขที่จำเป็น...' 
                : 'รายละเอียดเพิ่มเติม (ไม่บังคับ)...'
            }
          />
          
          {currentValue === 'ไม่ถูกต้อง' && (
            <div className="relative flex items-center gap-2 text-sm text-red-700 mt-2 font-medium">
              <span className="text-base">⚠️</span>
              กรุณาระบุรายละเอียดการแก้ไขให้ชัดเจน
            </div>
          )}
        </div>
      )}
    </div>
  );
});

CorrectiveRadio.displayName = 'CorrectiveRadio';

export default CorrectiveRadio;