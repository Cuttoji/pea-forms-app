"use client";
import React from "react";
import ImageUpload from "@/components/forms/ImageUpload";
import dynamic from "next/dynamic";

const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), { 
  ssr: false 
});

/**
 * GeneralInfoSection - Government form style UI/UX
 */
export default function GeneralInfoSection({ data = {}, onChange = () => {} }) {
  return (
    <div className="space-y-6 text-gray-700">
      {/* Header Section */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#5b2d90] text-white px-6 py-4">
          <h1 className="text-xl font-bold text-center">
            แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์ <span>สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</span>
          </h1>
        </div>
        
        {/* Custom Project Info Section */}
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">ชื่องาน:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.projectName || ""}
                onChange={e => onChange("projectName", e.target.value)}
                placeholder="กรอกชื่องาน"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">อนุมัติเลขที่:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.approvalNo || ""}
                onChange={e => onChange("approvalNo", e.target.value)}
                placeholder="กรอกเลขอนุมัติ"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">ลงวันที่:</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.approvalDate || ""}
                onChange={e => onChange("approvalDate", e.target.value)}
                placeholder="mm/dd/yyyy"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">หมายเลขงาน:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.jobNo || ""}
                onChange={e => onChange("jobNo", e.target.value)}
                placeholder="กรอกหมายเลขงาน"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">วัน/เดือน/ปี ที่ดำเนินการตรวจ:</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.inspectionDate2 || ""}
                onChange={e => onChange("inspectionDate2", e.target.value)}
                placeholder="mm/dd/yyyy"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">กฟภ. ดำเนินการ</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.peaType || ""}
                onChange={e => onChange("peaType", e.target.value)}
              >
                <option value="">-- เลือก --</option>
                <option value="pea">กฟภ. ดำเนินการ</option>
                <option value="company">งานจ้างฯบริษัท</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">ปริมาณงานแรงสูง (วงจร-กม.):</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.hvAmount || ""}
                onChange={e => onChange("hvAmount", e.target.value)}
                placeholder="กรอกจำนวน"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">จำนวนเสา (ต้น):</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.hvPoleCount || ""}
                onChange={e => onChange("hvPoleCount", e.target.value)}
                placeholder="กรอกจำนวนเสา"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">รับไฟจากสถานี:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.stationName || ""}
                onChange={e => onChange("stationName", e.target.value)}
                placeholder="กรอกชื่อสถานี"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">ฟีดเดอร์:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.feeder || ""}
                onChange={e => onChange("feeder", e.target.value)}
                placeholder="กรอกชื่อฟีดเดอร์"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">เฟสที่ต่อ:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.phase || ""}
                onChange={e => onChange("phase", e.target.value)}
                placeholder="กรอกเฟส"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">หม้อแปลงรวม (KVA):</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.kva || ""}
                onChange={e => onChange("kva", e.target.value)}
                placeholder="กรอก KVA"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">ปริมาณงานแรงต่ำ (วงจร-กม.):</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.lvAmount || ""}
                onChange={e => onChange("lvAmount", e.target.value)}
                placeholder="กรอกจำนวน"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">จำนวนเสา (ต้น):</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.lvPoleCount || ""}
                onChange={e => onChange("lvPoleCount", e.target.value)}
                placeholder="กรอกจำนวนเสา"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">ผู้ควบคุมงาน:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.supervisor || ""}
                onChange={e => onChange("supervisor", e.target.value)}
                placeholder="กรอกชื่อผู้ควบคุมงาน"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">ตำแหน่ง:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.position || ""}
                onChange={e => onChange("position", e.target.value)}
                placeholder="กรอกตำแหน่ง"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">สังกัด:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.department || ""}
                onChange={e => onChange("department", e.target.value)}
                placeholder="กรอกสังกัด"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: ข้อมูลทั่วไป */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">1.1</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">ข้อมูลทั่วไป</h2>
          </div>
        </div>
        
        <div className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">ชื่อผู้ขอใช้ไฟ</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.customerName || ""}
                onChange={e => onChange("customerName", e.target.value)}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">โทรศัพท์มือถือ</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.phone || ""}
                onChange={e => onChange("phone", e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">ที่อยู่</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 resize-none"
              rows={3}
              value={data.address || ""}
              onChange={e => onChange("address", e.target.value)}
              placeholder="กรอกที่อยู่"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">ระบบไฟฟ้า</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.systemType || ""}
                onChange={e => onChange("systemType", e.target.value)}
              >
                <option value="">-- เลือก --</option>
                <option value="3เฟส">22 kV</option>
                <option value="1เฟส">33 kV</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">โหลดประมาณ (kW)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                value={data.load || ""}
                onChange={e => onChange("load", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: สำรองสำหรับตำแหน่งและรูปถ่าย */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">1.2</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">สำรองสำหรับตำแหน่งและรูปถ่าย</h2>
          </div>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          {/* Map Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">ละติจูด</label>
                <input
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                  value={data.latitude || ""}
                  onChange={e => onChange("latitude", e.target.value)}
                  placeholder="13.7563"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">ลองจิจูด</label>
                <input
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                  value={data.longitude || ""}
                  onChange={e => onChange("longitude", e.target.value)}
                  placeholder="100.5018"
                />
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden relative">
              <div className="relative z-10">
                <OpenStreetMapComponent 
                  onLocationSelect={(location) => {
                    onChange("latitude", location.lat.toFixed(6));
                    onChange("longitude", location.lng.toFixed(6));
                  }}
                  initialLatitude={parseFloat(data.latitude) || 13.7563}
                  initialLongitude={parseFloat(data.longitude) || 100.5018}
                  height="400px"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 mt-1">ℹ️</div>
                <div className="text-sm text-blue-800">
                  <strong>คำแนะนำ:</strong> คลิกบนแผนที่เพื่อเลือกตำแหน่งที่ต้องการ หรือกรอกค่าละติจูดและลองจิจูดโดยตรง 
                  ระบบจะอัพเดทตำแหน่งบนแผนที่อัตโนมัติ
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">อัพโหลดรูปภาพ</h3>
            <div className="mt-2">
              <ImageUpload 
                onImageSelected={(imageUrl) => onChange("houseImage", imageUrl)}
                initialImageUrl={data.houseImage}
                label="รูปหน้าบ้าน"
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}