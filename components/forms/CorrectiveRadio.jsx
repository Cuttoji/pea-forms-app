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

  // Convert to number for comparison, since values might come as strings
  const numericValue = Number(currentValue);

  return (
    <div className="relative border border-gray-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-300 group"> 
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <label className="relative block text-base font-semibold text-gray-800 mb-4 leading-relaxed">{label}</label>
      
      <div className="relative flex flex-wrap gap-4 mb-4">
        <label className="inline-flex items-center cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-green-200 hover:bg-green-50/50 transition-all duration-200 group/correct">
          <input
            type="radio"
            name={groupName}
            value="1"
            checked={numericValue === 1}
            onChange={() => handleStatusChange(1)}
            disabled={disabled}
            className="form-radio h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          <span className={`ml-3 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
            numericValue === 1 
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
            value="0"
            checked={numericValue === 0}
            onChange={() => handleStatusChange(0)}
            disabled={disabled}
            className="form-radio h-5 w-5 text-red-600 focus:ring-2 focus:ring-red-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          <span className={`ml-3 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
            numericValue === 0 
              ? 'text-red-700' 
              : 'text-gray-700 group-hover/incorrect:text-red-600'
          } ${disabled ? 'text-gray-400' : ''}`}>
            <span className="text-lg">❌</span>
            ต้องแก้ไข
          </span>
        </label>
      </div>
      
      {(alwaysShowNote || numericValue === 0) && (
        <div className={`transition-all duration-500 transform ${
          numericValue === 0 
            ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-l-4 border-red-400 shadow-inner' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-l-4 border-gray-300'
        } p-4 rounded-lg relative overflow-hidden`}>
          
          <div className={`absolute inset-0 ${
            numericValue === 0 
              ? 'bg-gradient-to-r from-red-400/10 to-transparent' 
              : 'bg-gradient-to-r from-gray-400/10 to-transparent'
          }`}></div>
          
          <label htmlFor={noteFieldName} className={`relative block text-sm font-semibold mb-3 flex items-center gap-2 ${
            numericValue === 0 ? 'text-red-800' : 'text-gray-800'
          }`}>
            <span className="text-lg">📝</span>
            {numericValue === 0 ? 'รายละเอียดการแก้ไข (จำเป็น):' : 'รายละเอียดเพิ่มเติม:'}
          </label>
          
          <textarea
            id={noteFieldName}
            name={noteFieldName}
            rows={3}
            className={`relative w-full p-4 border-2 rounded-lg shadow-sm transition-all duration-200 text-sm resize-none ${
              numericValue === 0
                ? 'border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 bg-white/80'
                : 'border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white/60'
            } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : 'hover:border-gray-300'}`}
            value={currentNote || ''}
            onChange={onNoteChange}
            disabled={disabled}
            placeholder={
              numericValue === 0 
                ? 'โปรดระบุรายละเอียดการแก้ไขที่จำเป็น...' 
                : 'รายละเอียดเพิ่มเติม (ไม่บังคับ)...'
            }
          />
          
          {numericValue === 0 && (
            <div className="relative flex items-center gap-2 text-sm text-red-700 mt-2 font-medium">
              <span className="text-base">⚠️</span>
              กรุณาระบุรายละเอียดการแก้ไขให้ชัดเจน
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CorrectiveRadio;
