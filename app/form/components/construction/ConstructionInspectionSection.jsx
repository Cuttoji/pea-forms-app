import React from "react";

// markOptions และ InspectionRow เหมือนเดิม
const markOptions = [
    { value: "correct", label: "✓", className: "text-green-600" },
    { value: "fix", label: "×", className: "text-red-600" },
    { value: "none", label: "-", className: "text-gray-600" },
];

function InspectionRow({ item, index, onItemChange, sectionIdx }) {
    // ตรวจสอบว่าเป็น item พิเศษที่มี field เพิ่มเติมหรือไม่
    const hasOhm = 'ohm' in item;
    const hasSystem = 'system' in item;
    const hasOther = 'other' in item;
    const hasTransformerFields = 'number' in item || 'phase' in item || 'kva' in item;
    const hasType = 'type' in item;

    // ถ้าเป็น TR item ให้แสดงแบบพิเศษ
    if (item.key === 'tr_3_0') {
        return (
            <tr className="bg-gray-50">
                <td colSpan="4" className="py-4 px-4">
                    <div className="border-2 border-blue-300 rounded-lg p-4 bg-white">
                        <div className="flex flex-wrap gap-6 items-start">
                            {/* เลขที่หม้อแปลง */}
                            <div className="flex items-center gap-2">
                                <label className="font-semibold text-gray-700">TR</label>
                                <input
                                    type="text"
                                    className="w-32 px-3 py-2 border-2 border-gray-300 rounded text-base"
                                    value={item.number || ""}
                                    onChange={(e) => onItemChange(sectionIdx, index, "number", e.target.value)}
                                    placeholder="เลขที่"
                                />
                            </div>
                            
                            {/* เฟส */}
                            <div className="flex items-center gap-2">
                                <label className="font-semibold text-gray-700">Ø</label>
                                <select
                                    className="w-28 px-3 py-2 border-2 border-gray-300 rounded text-base"
                                    value={item.phase || ""}
                                    onChange={(e) => onItemChange(sectionIdx, index, "phase", e.target.value)}
                                >
                                    <option value="">เลือก</option>
                                    <option value="1">1 เฟส</option>
                                    <option value="3">3 เฟส</option>
                                </select>
                            </div>
                            
                            {/* kVA */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="w-28 px-3 py-2 border-2 border-gray-300 rounded text-base"
                                    value={item.kva || ""}
                                    onChange={(e) => onItemChange(sectionIdx, index, "kva", e.target.value)}
                                    placeholder="kVA"
                                />
                                <label className="font-semibold text-gray-700">kVA</label>
                            </div>
                            
                            {/* ประเภท */}
                            <div className="flex-1 min-w-[400px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        id="type-แขวนตาส่ง"
                                        className="w-5 h-5"
                                        checked={Array.isArray(item.type) && item.type.includes('แขวน')}
                                        onChange={(e) => {
                                            const currentTypes = Array.isArray(item.type) ? item.type : [];
                                            const newTypes = e.target.checked
                                                ? [...currentTypes, 'แขวน']
                                                : currentTypes.filter(t => t !== 'แขวน');
                                            onItemChange(sectionIdx, index, "type", newTypes);
                                        }}
                                    />
                                    <label htmlFor="type-แขวนตาส่ง" className="text-base">แขวน</label>
                                    
                                    <input
                                        type="checkbox"
                                        id="type-ตั้งร้าน"
                                        className="w-5 h-5 ml-4"
                                        checked={Array.isArray(item.type) && item.type.includes('นั่งร้าน')}
                                        onChange={(e) => {
                                            const currentTypes = Array.isArray(item.type) ? item.type : [];
                                            const newTypes = e.target.checked
                                                ? [...currentTypes, 'นั่งร้าน']
                                                : currentTypes.filter(t => t !== 'นั่งร้าน');
                                            onItemChange(sectionIdx, index, "type", newTypes);
                                        }}
                                    />
                                    <label htmlFor="type-ตั้งร้าน" className="text-base">นั่งร้าน</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <>
            <tr className="text-gray-700 hover:bg-blue-50 transition">
                <td className="align-top text-center py-2">
                    <select
                        name={`result-${item.key}`}
                        className="border text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 bg-white"
                        aria-label="ผลการตรวจ"
                        value={item.result || ""}
                        onChange={(e) =>
                            onItemChange(sectionIdx, index, "result", e.target.value)
                        }
                    >
                        <option value="">-</option>
                        {markOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </td>
                <td className="text-gray-700 align-top py-2">{item.label}</td>
                <td className="align-top py-2">
                    <input
                        type="text"
                        name={`detail-${item.key}`}
                        placeholder="รายละเอียดที่ต้องแก้ไข"
                        className="text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 w-full bg-gray-50"
                        aria-label="รายละเอียดที่ต้องแก้ไข"
                        value={item.detail || ""}
                        onChange={(e) =>
                            onItemChange(sectionIdx, index, "detail", e.target.value)
                        }
                    />
                </td>
                <td className="align-top py-2">
                    <input
                        type="text"
                        name={`note-${item.key}`}
                        placeholder="หมายเหตุ"
                        className="text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 w-full bg-gray-50"
                        aria-label="หมายเหตุ"
                        value={item.note || ""}
                        onChange={(e) =>
                            onItemChange(sectionIdx, index, "note", e.target.value)
                        }
                    />
                </td>
            </tr>
            
            {/* แถวเพิ่มเติมสำหรับฟิลด์พิเศษ */}
            {(hasOhm || hasSystem || hasOther) && (
                <tr className="bg-blue-50">
                    <td></td>
                    <td colSpan="3" className="py-2 px-4">
                        <div className="flex flex-wrap gap-4">
                            {/* ฟิลด์ความต้านทานดิน */}
                            {hasOhm && (
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs text-gray-600 mb-1">ค่าความต้านทาน (Ω):</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={item.ohm || ""}
                                        onChange={(e) => onItemChange(sectionIdx, index, "ohm", e.target.value)}
                                        placeholder="Ω"
                                    />
                                </div>
                            )}
                            
                            {/* ฟิลด์ระบบ (สำหรับ 1.17.1 และ 3.15) */}
                            {hasSystem && (
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs text-gray-600 mb-1">ระบบ:</label>
                                    <select
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={item.system || ""}
                                        onChange={(e) => onItemChange(sectionIdx, index, "system", e.target.value)}
                                    >
                                        <option value="">เลือกระบบ</option>
                                        <option value="3phase">3 เฟส</option>
                                        <option value="1phase">1 เฟส</option>
                                    </select>
                                </div>
                            )}
                            
                            {/* ฟิลด์อื่นๆ */}
                            {hasOther && (
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-xs text-gray-600 mb-1">ระบุอื่นๆ:</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={item.other || ""}
                                        onChange={(e) => onItemChange(sectionIdx, index, "other", e.target.value)}
                                        placeholder="ระบุรายละเอียด"
                                    />
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

// ปรับให้รับ prop value (sections) จาก parent
export default function ConstructionInspectionSection({ value = [], onChange }) {
    // ฟังก์ชันสำหรับอัปเดตค่าใน section
    const handleItemChange = (sectionIdx, itemIdx, field, fieldValue) => {
        const newSections = value.map((section, sIdx) => {
            if (sIdx !== sectionIdx) return section;
            return {
                ...section,
                items: section.items.map((item, iIdx) =>
                    iIdx === itemIdx ? { ...item, [field]: fieldValue } : item
                ),
            };
        });
        onChange && onChange(newSections);
    };

    return (
        <div
            style={{ fontFamily: "sans-serif", fontSize: "1em" }}
            className="p-4 bg-white shadow-lg rounded-xl mb-8 text-gray-700"
        >
            <h2 className="text-2xl font-bold mb-4 text-blue-900">ผลการตรวจสอบงานก่อสร้าง</h2>
            <div className="mb-4 text-sm flex flex-wrap items-center gap-2">
                <span className="mr-4">
                    <b>ช่องผลการตรวจ</b> ให้ทำเครื่องหมาย
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded">✓ = ถูกต้อง</span>
                <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded">× = ต้องแก้ไข</span>
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded">- = ไม่มีการตรวจ</span>
            </div>
            {value.map((section, sIdx) => (
                <div key={section.title} className="mb-10">
                    <h3 className="text-lg font-semibold mb-2 text-blue-800">{section.title}</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table
                            border="0"
                            cellPadding="0"
                            cellSpacing="0"
                            className="w-full border-collapse"
                        >
                            <thead>
                                <tr className="bg-blue-50 text-blue-900">
                                    <th className="py-2 px-2 font-semibold border-b border-gray-200" style={{ width: 80 }}>ผลการตรวจ</th>
                                    <th className="py-2 px-2 font-semibold border-b border-gray-200">รายการ</th>
                                    <th className="py-2 px-2 font-semibold border-b border-gray-200" style={{ width: 220 }}>รายละเอียดที่ต้องแก้ไข</th>
                                    <th className="py-2 px-2 font-semibold border-b border-gray-200" style={{ width: 160 }}>หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {section.items.map((item, i) => (
                                    <InspectionRow
                                        item={item}
                                        index={i}
                                        key={item.key || i}
                                        onItemChange={handleItemChange}
                                        sectionIdx={sIdx}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}