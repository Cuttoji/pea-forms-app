import React from "react";
import ImageUpload from "@/components/forms/ImageUpload";

const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), { 
  ssr: false 
});

export default function GeneralInfoSection({ data = {}, onChange = () => {} }) {
return (
    <section className="border rounded-xl p-4 bg-white mb-6">
        <div className="mb-3 flex flex-wrap gap-4">
            <div>
                <label className="block font-medium mb-1">การตรวจสอบครั้งที่</label>
                <input
                    type="text"
                    className="border p-2 rounded w-16"
                    value={data.inspectionNo || ""}
                    onChange={e => onChange("inspectionNo", e.target.value)}
                />
            </div>
            <div>
                <label className="block font-medium mb-1">วันที่</label>
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={data.inspectionDate || ""}
                    onChange={e => onChange("inspectionDate", e.target.value)}
                />
            </div>
            <div>
                <label className="block font-medium mb-1">การตรวจสอบตามคำร้องขอใช้ไฟฟ้าที่</label>
                <input
                    type="text"
                    className="border p-2 rounded w-24"
                    value={data.requestNo || ""}
                    onChange={e => onChange("requestNo", e.target.value)}
                />
            </div>
            <div>
                <label className="block font-medium mb-1">วันที่</label>
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={data.requestDate || ""}
                    onChange={e => onChange("requestDate", e.target.value)}
                />
            </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
            สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน
        </div>
        {/* ข้อมูลการตรวจสอบ */}
        <h2 className="font-bold text-lg mb-4">1. ข้อมูลทั่วไป</h2>
        <div className="mb-3 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[220px]">
                <label className="block font-medium mb-1">ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า (นาย / นาง / น.ส.)</label>
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={data.customerName || ""}
                    onChange={e => onChange("customerName", e.target.value)}
                />
            </div>
            <div className="flex-1 min-w-[220px]">
                <label className="block font-medium mb-1">โทรศัพท์</label>
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={data.phone || ""}
                    onChange={e => onChange("phone", e.target.value)}
                />
            </div>
        </div>
        <div className="mb-3">
            <label className="block font-medium mb-1">ที่อยู่</label>
            <input
                type="text"
                className="border p-2 rounded w-full"
                value={data.address || ""}
                onChange={e => onChange("address", e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                            <label className="block font-medium mb-1">รูปหน้าบ้าน</label>
                            <ImageUpload
                                    value={data.houseImage}
                                    onChange={(file) => onChange("houseImage", file)}
                                    accept="image/*"
                            />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                            <label className="block font-medium mb-1">แผนที่</label>
                            <OpenStreetMapComponent
                                    position={data.mapPosition || [13.7563, 100.5018]} // Default to Bangkok
                                    onPositionChange={(position) => onChange("mapPosition", position)}
                                    height="300px"
                            />
                    </div>
            </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-4 items-end">
            <div>
                <label className="block font-medium mb-1">ระบบไฟฟ้า</label>
                <select
                    className="border p-2 rounded w-44"
                    value={data.systemType || ""}
                    onChange={e => onChange("systemType", e.target.value)}
                >
                    <option value="">-- เลือก --</option>
                    <option value="3เฟส">3 เฟส (400/230 V)</option>
                    <option value="1เฟส">1 เฟส (230 V)</option>
                </select>
            </div>
            <div>
                <label className="block font-medium mb-1">โหลดประมาณ</label>
                <input
                    type="text"
                    className="border p-2 rounded w-24"
                    value={data.load || ""}
                    onChange={e => onChange("load", e.target.value)}
                    placeholder="kW"
                />
                <span className="ml-2 text-gray-600">kW</span>
            </div>
            <div>
                <label className="block font-medium mb-1">แอมแปร์</label>
                <input
                    type="text"
                    className="border p-2 rounded w-20"
                    value={data.amperes || ""}
                    onChange={e => onChange("amperes", e.target.value)}
                    placeholder="A"
                />
                <span className="ml-2 text-gray-600">A</span>
            </div>
        </div>
    </section>
);
}