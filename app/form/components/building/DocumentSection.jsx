import React from "react";

const DocumentSection = ({ value = {}, onChange }) => {
    const handleDocumentChange = (docValue) => {
        onChange({
            ...value,
            electricalDocument: docValue
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white">2. การตรวจสอบเอกสาร</h3>
            </div>
            
            <div className="p-6">
                <div className="space-y-4">
                    {/* มีเอกสาร */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="electricalDocument"
                                value="has"
                                checked={value.electricalDocument === "has"}
                                onChange={() => handleDocumentChange("has")}
                                className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 mt-1"
                            />
                            <div className="flex-1">
                                <span className="text-base font-medium text-green-800 mb-3 block">
                                    มีเอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้
                                </span>
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                                        <li className="leading-relaxed">
                                            <span className="font-medium">แบบติดตั้งระบบไฟฟ้า (As-built Drawing)</span>
                                            <br />
                                            <span className="text-gray-600 ml-4">
                                                วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง
                                            </span>
                                        </li>
                                        <li className="leading-relaxed">
                                            <span className="font-medium">สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* ไม่มีเอกสาร */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="electricalDocument"
                                value="none"
                                checked={value.electricalDocument === "none"}
                                onChange={() => handleDocumentChange("none")}
                                className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 mt-1"
                            />
                            <div className="flex-1">
                                <span className="text-base font-medium text-red-800">
                                    ไม่มีเอกสารรับรองการออกแบบระบบไฟฟ้า
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Warning message when no document is selected */}
                    {value.electricalDocument === "none" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mt-4">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-yellow-800">คำเตือน: </span>
                                <span className="text-sm text-yellow-700">
                                    การไม่มีเอกสารรับรองการออกแบบระบบไฟฟ้าอาจส่งผลต่อการอนุมัติและความปลอดภัยของระบบไฟฟ้า
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Success message when document is available */}
                    {value.electricalDocument === "has" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mt-4">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-green-800">ดีเยี่ยม: </span>
                                <span className="text-sm text-green-700">
                                    มีเอกสารครบถ้วนตามข้อกำหนด ระบบไฟฟ้าได้รับการรับรองจากวิศวกรที่มีใบอนุญาต
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentSection;