import React from 'react';

const CorrectiveRadio = ({
  groupName,
  label,
  currentValue,
  currentNote,
  onStatusChange,
  onNoteChange,
  disabled = false,
  alwaysShowNote = false,
}) => {
  const noteFieldName = `${groupName}_note`;

  const handleStatusChange = (value) => {
    if (onStatusChange) {
      onStatusChange(groupName, value, noteFieldName);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"> 
      <label className="block text-sm font-semibold text-gray-800 mb-3">{label}</label>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
        <label className="inline-flex items-center cursor-pointer group">
          <input
            type="radio"
            name={groupName}
            value="ถูกต้อง"
            checked={currentValue === 'ถูกต้อง'}
            onChange={() => handleStatusChange('ถูกต้อง')}
            disabled={disabled}
            className="form-radio h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className={`ml-2 text-sm font-medium ${currentValue === 'ถูกต้อง' ? 'text-green-700' : 'text-gray-700'} ${disabled ? 'text-gray-400' : ''} group-hover:text-green-600`}>
            ✅ ถูกต้อง
          </span>
        </label>
        <label className="inline-flex items-center cursor-pointer group">
          <input
            type="radio"
            name={groupName}
            value="ต้องแก้ไข"
            checked={currentValue === 'ต้องแก้ไข'}
            onChange={() => handleStatusChange('ต้องแก้ไข')}
            disabled={disabled}
            className="form-radio h-5 w-5 text-red-600 focus:ring-2 focus:ring-red-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className={`ml-2 text-sm font-medium ${currentValue === 'ต้องแก้ไข' ? 'text-red-700' : 'text-gray-700'} ${disabled ? 'text-gray-400' : ''} group-hover:text-red-600`}>
            ❌ ต้องแก้ไข
          </span>
        </label>
      </div>
      
      {(alwaysShowNote || currentValue === 'ต้องแก้ไข') && (
        <div className={`transition-all duration-300 ${currentValue === 'ต้องแก้ไข' ? 'bg-red-50 border-l-4 border-red-200' : 'bg-gray-50'} p-3 rounded`}>
          <label htmlFor={noteFieldName} className="block text-xs font-medium text-gray-900 mb-2">
            {currentValue === 'ต้องแก้ไข' ? '📝 รายละเอียดการแก้ไข (จำเป็น):' : '📝 รายละเอียดเพิ่มเติม:'}
          </label>
          <textarea
            id={noteFieldName}
            name={noteFieldName}
            rows={3}
            className="text-gray-900 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
            value={currentNote || ''}
            onChange={onNoteChange}
            disabled={disabled}
            placeholder={currentValue === 'ต้องแก้ไข' ? 'โปรดระบุรายละเอียดการแก้ไขที่จำเป็น...' : 'รายละเอียดเพิ่มเติม (ไม่บังคับ)...'}
          />
          {currentValue === 'ต้องแก้ไข' && (
            <div className="text-xs text-red-600 mt-1">
              ⚠️ กรุณาระบุรายละเอียดการแก้ไขให้ชัดเจน
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CorrectiveRadio;
