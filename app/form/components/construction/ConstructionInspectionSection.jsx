import React from "react";

const inspectionSections = [
    {
        title: "1. ระบบจำหน่ายแรงสูง",
        items: [
            "1.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)",
            "1.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์",
            "1.3 การติดตั้งเหล็กรับสายล่อฟ้า (เหล็กฉาก , เหล็กรูปรางน้ำ)",
            "1.4 การฝังสมอบก และประกอบยึดโยงระบบจำหน่าย",
            "1.5 การฝังสมอบก และประกอบยึดโยงสายล่อฟ้า",
            "1.6 การพาดสายไฟ ระยะหย่อนยาน",
            "1.7 การพาดสายล่อฟ้า ระยะหย่อนยาน",
            "1.8 ระยะห่าง, ความสูงของสายไฟ",
            "1.9 การพันและผูกลูกถ้วย",
            "1.10 การต่อสาย พันเทป(สายหุ้มฉนวน)",
            "1.11 การเชื่อมสาย, สายแยก พันเทป(สายหุ้มฉนวน)",
            "1.12 การเข้าปลายสาย",
            "1.13 การตัดต้นไม้",
            "1.14 การทาสีเสา",
            "1.15 การพ่นสี หมายเลขเสา",
            "1.16 การยึดโยง(storm guy, line guy, fix guy, etc.)",
            "1.17 การต่อลงดิน",
            "1.18 การติดตั้งกับดักเสิร์จแรงสูง",
            "1.19 อื่นๆ",
        ],
    },
    {
        title: "2. ระบบจำหน่ายแรงต่ำ",
        items: [
            "2.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)",
            "2.2 การติดตั้งคอน แร็ค",
            "2.3 การฝังสมอบก และประกอบยึดโยง",
            "2.4 การพาดสายไฟ ระยะหย่อนยาน",
            "2.5 ระยะห่าง, ความสูงของสายไฟ",
            "2.6 การผูกสายไฟกับลูกรอกแรงต่ำ",
            "2.7 การต่อสาย พันเทป",
            "2.8 การเชื่อมสาย, สายแยก พันเทป",
            "2.9 การเข้าปลายสาย พันเทป",
            "2.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป",
            "2.11 การทาสีเสา",
            "2.12 การพ่นสี หมายเลขเสา",
            "2.13 การยึดโยง(storm guy, line guy, fix guy)",
            "2.14 การต่อลงดิน",
            "2.15 ค่าความต้านทานดินรวม",
            "2.16 อื่นๆ",
        ],
    },
    {
        title: "3. การติดตั้งหม้อแปลง",
        items: [
            "3.1 การติดตั้งหม้อแปลง (ระยะความสูง, ทิศทาง)",
            "3.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์",
            "3.3 การพาดสายแรงสูงเข้าหม้อแปลง และลำดับเฟส",
            "3.4 การผูกสายไฟกับลูกถ้วย",
            "3.5 การติดตั้งกับดักเสิร์จแรงสูง, หางปลา",
            "3.6 การติดตั้งดร็อปเอาต์, พินเทอร์มินอล และฟิวส์ลิงก์",
            "3.7 การติดตั้งคอนสปัน 3,200 มม. ระยะความสูง",
            "3.8 การเข้าสายที่บุชชิ่งหม้อแปลง, หางปลา, ฉนวนครอบบุชชิ่ง",
            "3.9 การติดตั้งสายแรงต่ำ และลำดับเฟส",
            "3.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป",
            "3.11 การติดตั้งคอนสำหรับ LT,  LT สวิตช์ และ ฟิวส์แรงต่ำ",
            "3.12 การติดตั้งที่จับขอบถัง, เหล็กแขวน ท่อร้อยสายแรงต่ำ",
            "3.13 เทคอนกรีตที่คาน , โคนเสา",
            "3.14 การต่อลงดิน",
            "3.15 ค่าความต้านทานดินต่อจุด",
            "3.16 อื่นๆ",
        ],
    },
];

const markOptions = [
    { value: "correct", label: "✓" },
    { value: "fix", label: "×" },
    { value: "none", label: "-" },
];

function InspectionRow({ item, index }) {
    return (
        <tr className="text-gray-700 hover:bg-blue-50 transition">
            <td className="align-top text-center py-2">
                <select
                    name={`result-${index}`}
                    className="text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 bg-white"
                    aria-label="ผลการตรวจ"
                >
                    <option value="">-</option>
                    {markOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </td>
            <td className="text-gray-700 align-top py-2">{item}</td>
            <td className="align-top py-2">
                <input
                    type="text"
                    name={`detail-${index}`}
                    placeholder="รายละเอียดที่ต้องแก้ไข"
                    className="text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 w-full bg-gray-50"
                    aria-label="รายละเอียดที่ต้องแก้ไข"
                />
            </td>
            <td className="align-top py-2">
                <input
                    type="text"
                    name={`note-${index}`}
                    placeholder="หมายเหตุ"
                    className="text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 w-full bg-gray-50"
                    aria-label="หมายเหตุ"
                />
            </td>
        </tr>
    );
}

export default function ConstructionInspectionSection() {
    let rowIndex = 0;
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
            {inspectionSections.map((section, sIdx) => (
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
                                    <InspectionRow item={item} index={rowIndex++} key={item} />
                                ))}
                                {[...Array(5)].map((_, j) => (
                                    <InspectionRow
                                        item="..................."
                                        index={rowIndex++}
                                        key={`blank-${sIdx}-${j}`}
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