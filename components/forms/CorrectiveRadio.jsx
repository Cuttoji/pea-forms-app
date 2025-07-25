import React from 'react';

const CorrectiveRadio = ({
  groupName,
  label,
  currentValue,
  currentNote,
  onStatusChange,
  onNoteChange,
  disabled = false,
  alwaysShowNote = false, // เพิ่ม prop นี้
}) => {
  const noteFieldName = `${groupName}_note`;

  return (
    <div className="border-b border-gray-200 pb-4 mb-6"> 
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name={groupName}
            value="ถูกต้อง"
            checked={currentValue === 'ถูกต้อง'}
            onChange={() => onStatusChange(groupName, 'ถูกต้อง', noteFieldName)}
            disabled={disabled}
            className="form-radio h-5 w-5 text-[#5b2d90] focus:ring-2 focus:ring-purple-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>ถูกต้อง</span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name={groupName}
            value="ต้องแก้ไข"
            checked={currentValue === 'ต้องแก้ไข'}
            onChange={() => onStatusChange(groupName, 'ต้องแก้ไข', noteFieldName)}
            disabled={disabled}
            className="form-radio h-5 w-5 text-[#5b2d90] focus:ring-2 focus:ring-purple-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>ต้องแก้ไข</span>
        </label>
      </div>
      {(alwaysShowNote || currentValue === 'ต้องแก้ไข') && (
        <div className="mt-3">
          <label htmlFor={noteFieldName} className="block text-xs font-medium text-gray-900 mb-1">
            รายละเอียด{currentValue === 'ต้องแก้ไข' ? 'การแก้ไข' : ''}:
          </label>
          <textarea
            id={noteFieldName}
            name={noteFieldName}
            rows={2}
            className="text-gray-900 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
            value={currentNote || ''}
            onChange={onNoteChange}
            disabled={disabled}
            placeholder="โปรดระบุรายละเอียด..."
          />
        </div>
      )}
    </div>
  );
};

export default CorrectiveRadio;
