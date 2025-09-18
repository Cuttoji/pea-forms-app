import React from "react";

const checklist = [
    {
        section: "2.14 สายตัวนำประธานแรงต่ำ",
        items: [
            {
                label:
                    "2.14.1 สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ มอก. 293-2541 หรือ IEC 60502",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
            {
                label: "2.14.2 ชนิดและขนาดของสายไฟฟ้า",
                type: "checkbox-group",
                options: [
                    { label: "IEC 01", value: "iec01" },
                    { label: "NYY", value: "nyy" },
                    { label: "CV", value: "cv" },
                    { label: "อื่นๆ", value: "other", hasInput: true },
                ],
                extra: [
                    {
                        label: "ขนาด",
                        type: "input",
                        suffix: "ตร.มม.",
                    },
                    {
                        label: "",
                        type: "radio",
                        options: [
                            { label: "ถูกต้อง", value: "correct" },
                            { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                        ],
                    },
                ],
            },
            {
                label: "2.14.3 วิธีการเดินสาย",
                type: "checkbox-group",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                    { label: "บนลูกถ้วยฉนวนในอากาศ", value: "air" },
                    { label: "ท่อร้อยสาย (Conduit)", value: "conduit" },
                    { label: "รางเดินสาย (Wire Way)", value: "wireway" },
                    { label: "รางเคเบิล (Cable Tray)", value: "cabletray" },
                    { label: "บัสเวย์ (Bus Way)", value: "busway" },
                    { label: "เดินฝังใต้ดิน", value: "underground" },
                    { label: "อื่นๆ", value: "other", hasInput: true },
                ],
            },
        ],
        note: `* การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร สำหรับสายตัวนำอะลูมิเนียม อนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร`,
    },
    {
        section: "2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร",
        items: [
            {
                label: "",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
            {
                label: "เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2",
                type: "checkbox",
                value: "cb_iec60947_2",
            },
            {
                label: "สวิตช์พร้อมฟิวส์",
                type: "checkbox",
                value: "switch_fuse",
            },
            {
                label: "มาตรฐานอื่นๆ โปรดระบุ",
                type: "input",
                value: "other_standard",
            },
            {
                label: "ผลิตภัณฑ์",
                type: "input",
                value: "product",
            },
            {
                label: "Type",
                type: "input",
                value: "type",
            },
            {
                label: "In",
                type: "input",
                value: "in",
                suffix: "A",
            },
            {
                label: "IC",
                type: "input",
                value: "ic",
                suffix: "kA",
            },
            {
                label: "แรงดัน",
                type: "input",
                value: "voltage",
                suffix: "V",
            },
            {
                label: "AT",
                type: "input",
                value: "at",
                suffix: "A",
            },
            {
                label: "AF",
                type: "input",
                value: "af",
                suffix: "A",
            },
            {
                label: "(เฉพาะเซอร์กิตเบรกเกอร์)",
                type: "note",
            },
        ],
        note: "บริภัณฑ์ประธานแรงต่ำที่มีขนาดตั้งแต่ 1,000 A ขึ้นไป ต้องติดตั้ง Ground Fault Protection (GFP)",
    },
    {
        section: "2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร",
        items: [
            {
                label: "2.16.1 ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน",
                type: "input",
                value: "ground_wire_size",
                suffix: "ตร.มม.",
                extra: [
                    {
                        type: "radio",
                        options: [
                            { label: "ถูกต้อง", value: "correct" },
                            { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                        ],
                    },
                ],
            },
            {
                label:
                    "2.16.2 ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากในการปฏิบัติและการไฟฟ้าส่วนภูมิภาคเห็นชอบ ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีก 1 แท่ง",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
            {
                label:
                    "2.16.3 ต้องทำจุดทดสอบ สำหรับใช้วัดค่าความต้านทานการต่อลงดิน",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
            {
                label:
                    "2.16.4 แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่ กฟภ. กำหนด",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
        ],
    },
    {
        section: "2.17 แผงจ่ายไฟประจำชั้น",
        items: [
            {
                label:
                    "2.17.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898 หรือ IEC60947-2",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
            {
                label:
                    "2.17.2 เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดสายป้อนแต่ละชั้น",
                type: "input-group",
                fields: [
                    { label: "AT", value: "at", suffix: "A" },
                    { label: "AF", value: "af", suffix: "A" },
                    { label: "IC", value: "ic", suffix: "kA" },
                ],
                extra: [
                    {
                        type: "radio",
                        options: [
                            { label: "ถูกต้อง", value: "correct" },
                            { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                        ],
                    },
                ],
            },
            {
                label: "2.17.3 การติดตั้งขั้วต่อสายดิน (Ground Bus)",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
        ],
    },
    {
        section: "2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์ มีขนาดสอดคล้องกับขนาดมิเตอร์",
        items: [
            {
                label: "",
                type: "input-group",
                fields: [
                    { label: "AT", value: "at", suffix: "A" },
                    { label: "AF", value: "af", suffix: "A" },
                    { label: "IC", value: "ic", suffix: "kA" },
                ],
                extra: [
                    {
                        type: "radio",
                        options: [
                            { label: "ถูกต้อง", value: "correct" },
                            { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                        ],
                    },
                ],
            },
        ],
    },
    {
        section: "2.19 สายตัวนำประธานเข้าห้องชุด",
        items: [
            {
                label: "",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
            {
                label: "สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ IEC 60502",
                type: "note",
            },
            {
                label: "ชนิด",
                type: "input",
                value: "type",
            },
            {
                label: "ขนาด",
                type: "input",
                value: "size",
                suffix: "ตร.มม.",
            },
            {
                label: "",
                type: "checkbox-group",
                options: [
                    { label: "เดินในท่อร้อยสาย", value: "conduit" },
                    { label: "เดินในรางเดินสาย", value: "wireway" },
                    { label: "อื่นๆ", value: "other", hasInput: true },
                ],
            },
        ],
    },
    {
        section: "2.20 แผงจ่ายไฟในห้องชุด",
        items: [
            {
                label: "2.20.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
            {
                label: "2.20.2 เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์",
                type: "input-group",
                fields: [
                    { label: "AT", value: "at", suffix: "A" },
                    { label: "AF", value: "af", suffix: "A" },
                ],
                extra: [
                    {
                        type: "radio",
                        options: [
                            { label: "ถูกต้อง", value: "correct" },
                            { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                        ],
                    },
                ],
            },
            {
                label:
                    "2.20.3 พิกัดตัดกระแสลัดวงจรสูงสุด (Interrupting Capacity , IC) ของเซอร์กิตเบรกเกอร์ ไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
        ],
    },
    {
        section:
            "2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน (Ground Bus) สำหรับต่อกับอุปกรณ์และเครื่องใช้ไฟฟ้า",
        items: [
            {
                label: "",
                type: "radio",
                options: [
                    { label: "ถูกต้อง", value: "correct" },
                    { label: "ต้องแก้ไข", value: "incorrect", hasRemark: true },
                ],
            },
        ],
    },
    {
        section: "2.22 อื่นๆ",
        items: [
            {
                label: "",
                type: "input",
                value: "other",
                multiline: true,
            },
        ],
    },
];

// Helper component for consistent styling
function CorrectableRow({ label, value, onChange, detail = false, placeholder = "ระบุรายละเอียดที่ต้องแก้ไข..." }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="text-sm font-medium text-gray-800 mb-3">{label}</div>
      <div className="flex items-start gap-3 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors">
          <input
            type="radio"
            checked={value?.result === "ถูกต้อง"}
            onChange={() => onChange({ ...value, result: "ถูกต้อง", detail: "" })}
            className="w-4 h-4 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-green-700 font-medium">ถูกต้อง</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
          <input
            type="radio"
            checked={value?.result === "ต้องแก้ไข"}
            onChange={() => onChange({ ...value, result: "ต้องแก้ไข" })}
            className="w-4 h-4 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-red-700 font-medium">ต้องแก้ไข</span>
        </label>
        {value?.result === "ต้องแก้ไข" && detail && (
          <input
            type="text"
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder={placeholder}
            value={value?.detail || ""}
            onChange={e => onChange({ ...value, detail: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}

function renderInput(item, idx, values, handleChange) {
    switch (item.type) {
        case "radio":
            return (
                <div key={idx} className="mb-6 bg-white rounded-lg p-4">
                    {item.label && <div className="text-sm font-medium text-gray-800 mb-3">{item.label}</div>}
                    <div className="flex flex-wrap gap-3">
                        {item.options.map((opt, i) => (
                            <label key={i} className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                                opt.value === "correct" ? "bg-green-50 hover:bg-green-100" : "bg-red-50 hover:bg-red-100"
                            }`}>
                                <input
                                    type="radio"
                                    name={item.label + idx}
                                    value={opt.value}
                                    checked={values[item.label + idx] === opt.value}
                                    onChange={e => handleChange(item.label + idx, e.target.value)}
                                    className={`w-4 h-4 focus:ring-2 ${
                                        opt.value === "correct" ? "text-green-600 focus:ring-green-500" : "text-red-600 focus:ring-red-500"
                                    }`}
                                />
                                <span className={`text-sm font-medium ${
                                    opt.value === "correct" ? "text-green-700" : "text-red-700"
                                }`}>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                    {item.options.some(opt => opt.hasRemark && values[item.label + idx] === opt.value) && (
                        <input
                            type="text"
                            placeholder="โปรดระบุ"
                            className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={values[item.label + idx + "_remark"] || ""}
                            onChange={e => handleChange(item.label + idx + "_remark", e.target.value)}
                        />
                    )}
                </div>
            );

        case "checkbox":
            return (
                <label key={idx} className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors mb-3">
                    <input
                        type="checkbox"
                        checked={!!values[item.value]}
                        onChange={e => handleChange(item.value, e.target.checked)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </label>
            );

        case "checkbox-group":
            return (
                <div key={idx} className="mb-6 bg-white rounded-lg p-4">
                    {item.label && <div className="text-sm font-medium text-gray-800 mb-4">{item.label}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {item.options.map((opt, i) => (
                            <div key={i}>
                                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={!!values[item.label + idx + "_" + opt.value]}
                                        onChange={e => handleChange(item.label + idx + "_" + opt.value, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                                </label>
                                {opt.hasInput && values[item.label + idx + "_" + opt.value] && (
                                    <input
                                        type="text"
                                        placeholder="โปรดระบุ"
                                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={values[item.label + idx + "_" + opt.value + "_input"] || ""}
                                        onChange={e => handleChange(item.label + idx + "_" + opt.value + "_input", e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );

        case "input":
            return (
                <div key={idx} className="mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        {item.label && <span className="text-sm font-medium text-gray-700">{item.label}</span>}
                        <input
                            type={item.multiline ? "textarea" : "text"}
                            value={values[item.value] || ""}
                            onChange={e => handleChange(item.value, e.target.value)}
                            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {item.suffix && <span className="text-sm text-gray-600 font-medium">{item.suffix}</span>}
                    </div>
                </div>
            );

        case "input-group":
            return (
                <div key={idx} className="mb-6 bg-white rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        {item.fields.map((f, j) => (
                            <div key={j} className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700 min-w-[30px]">{f.label}</label>
                                <input
                                    type="text"
                                    value={values[item.label + idx + "_" + f.value] || ""}
                                    onChange={e => handleChange(item.label + idx + "_" + f.value, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {f.suffix && <span className="text-sm text-gray-600 font-medium">{f.suffix}</span>}
                            </div>
                        ))}
                    </div>
                    {item.extra && item.extra.map((ex, k) => (
                        <div key={k}>
                            {renderInput({ ...ex, label: item.label + idx + "_extra" + k }, idx + "_extra" + k, values, handleChange)}
                        </div>
                    ))}
                </div>
            );

        case "note":
            return (
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="text-sm text-blue-700 italic">{item.label}</div>
                </div>
            );

        default:
            return null;
    }
}

export default function LVSystemSection({ value = {}, onChange = () => {} }) {
    const [values, setValues] = React.useState(value);

    const handleChange = (key, val) => {
        const newValues = { ...values, [key]: val };
        setValues(newValues);
        onChange(newValues);
    };

    return (
        <div className="text-gray-700 shadow-lg rounded-lg overflow-hidden border border-gray-200 mt-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">ระบบจำหน่ายแรงต่ำ</h2>
            </div>

            <div className="p-6 space-y-6">
                {checklist.map((section, i) => (
                    <div key={i} className=" rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold mr-3">
                                {section.section.split(' ')[0]}
                            </span>
                            {section.section.replace(/^[\d.]+\s*/, '')}
                        </h3>
                        
                        <div className="space-y-4">
                            {section.items.map((item, idx) =>
                                renderInput(item, i + "_" + idx, values, handleChange)
                            )}
                        </div>

                        {section.note && (
                            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-yellow-800">หมายเหตุ: </span>
                                        <span className="text-sm text-yellow-700">{section.note}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}