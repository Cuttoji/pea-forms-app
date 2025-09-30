import React from "react";

// markOptions และ InspectionRow เหมือนเดิม
const markOptions = [
    { value: "correct", label: "✓", className: "text-green-600" },
    { value: "fix", label: "×", className: "text-red-600" },
    { value: "none", label: "-", className: "text-gray-600" },
];

function InspectionRow({ item, index, onItemChange, sectionIdx }) {
    return (
        <tr className="text-gray-700 hover:bg-blue-50 transition">
            <td className="align-top text-center py-2">
                <select
                    name={`result-${index}`}
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
                    name={`detail-${index}`}
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
                    name={`note-${index}`}
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
    );
}

// ปรับให้รับ prop value (sections) จาก parent
export default function ConstructionInspectionSection({ value = [], onChange }) {
    let rowIndex = 0;

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
                                        index={rowIndex++}
                                        key={i + section.title}
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