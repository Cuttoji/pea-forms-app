import React from 'react';

const RadioEV = ({ name, value, onChange, disabled = false, detailValue = "", onDetailChange }) => {
    return (
        <>
            {/* Radio ถูกต้อง/ต้องแก้ไข */}
            <div className="flex flex-wrap gap-4 mb-4">
                <label className="inline-flex items-center cursor-pointer p-2">
                    <input
                        type="radio"
                        name={name}
                        value="ถูกต้อง"
                        checked={value === 'ถูกต้อง'}
                        onChange={onChange}
                        disabled={disabled}
                        className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-green-700">ถูกต้อง</span>
                </label>
                <label className="inline-flex items-center cursor-pointer p-2">
                    <input
                        type="radio"
                        name={name}
                        value="ต้องแก้ไข"
                        checked={value === 'ต้องแก้ไข'}
                        onChange={onChange}
                        disabled={disabled}
                        className="text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                </label>
            </div>

            {/* รายละเอียดถ้าต้องแก้ไข */}
            {value === 'ต้องแก้ไข' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        รายละเอียดการแก้ไข
                    </label>
                    <textarea
                        value={detailValue}
                        onChange={onDetailChange}
                        rows={2}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="ระบุรายละเอียดที่ต้องแก้ไข..."
                        disabled={disabled}
                    />
                </div>
            )}
        </>
    );
};

export default RadioEV;