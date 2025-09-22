import React from "react";
import SignaturePad from "@/components/forms/SignaturePad";

export default function SummarySection({ value = {}, onChange = () => {} }) {
    // ป้องกัน undefined/null
    const safeValue = value && typeof value === "object" ? value : {};

    // Helper สำหรับเซ็นลายเซ็น
    const handleSignChange = (field, dataUrl) => {
        onChange({ ...safeValue, [field]: dataUrl });
    };

    return (
        <div
            style={{
                fontFamily: "Tahoma, Arial, sans-serif",
                fontSize: 16,
                lineHeight: 1.7,
                color: "#333",
                marginBottom: 32,
                maxWidth: 900,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
                padding: 32,
            }}
        >
            <b className="block text-xl text-blue-900 mb-4">ผลการตรวจสอบ</b>
            <div className="mb-6">
                <label className="inline-flex items-center mr-8">
                    <input
                        type="radio"
                        name="summaryResult"
                        value="correct"
                        checked={safeValue.summaryResult === "correct"}
                        onChange={e => onChange({ ...safeValue, summaryResult: "correct" })}
                        className="mr-2 accent-green-600 h-4 w-4"
                    />
                    <span className="text-green-700 font-medium">ตรวจสอบแล้ว ถูกต้องตามมาตรฐาน กฟภ.</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        name="summaryResult"
                        value="fix"
                        checked={safeValue.summaryResult === "fix"}
                        onChange={e => onChange({ ...safeValue, summaryResult: "fix" })}
                        className="mr-2 accent-red-600 h-4 w-4"
                    />
                    <span className="text-red-700 font-medium">ตรวจสอบแล้ว เห็นควรแก้ไขให้ถูกต้องตามรายการข้างต้น</span>
                </label>
            </div>

            <div className="max-w-md">
                <div className="mb-2 font-semibold text-blue-800">ผู้ตรวจสอบฯ</div>
                <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <input
                            type="text"
                            name="inspector1"
                            value={safeValue.inspector1 || ""}
                            onChange={e => onChange({ ...safeValue, inspector1: e.target.value })}
                            placeholder="ชื่อ-สกุล"
                            className="border-b border-gray-400 px-2 py-1"
                            style={{ width: 220 }}
                        />
                        <span>ตำแหน่ง</span>
                        <input
                            type="text"
                            name="inspectorPosition1"
                            value={safeValue.inspectorPosition1 || ""}
                            onChange={e => onChange({ ...safeValue, inspectorPosition1: e.target.value })}
                            placeholder="ตำแหน่ง"
                            className="border-b border-gray-400 px-2 py-1"
                            style={{ width: 120 }}
                        />
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">ลายเซ็น</span>
                        <SignaturePad
                            value={safeValue.inspectorSign1 || ""}
                            onChange={dataUrl => handleSignChange("inspectorSign1", dataUrl)}
                            width={180}
                            height={60}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}