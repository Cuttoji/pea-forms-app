// components/forms/ImageUpload.jsx
"use client";
import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageSelected, disabled = false }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // เมื่อผู้ใช้เลือกไฟล์
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelected(file); // ส่ง object ของไฟล์กลับไป
    }
  };

  // เมื่อผู้ใช้กดปุ่ม "ลบรูปภาพ"
  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // รีเซ็ตค่าใน input file
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-900 mb-1">
        แนบรูปภาพ (อัปโหลด)
      </label>
      <div className="mt-2 flex items-center gap-4">
        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-gray-500">ตัวอย่าง</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={disabled}
            className="hidden" // ซ่อน input เริ่มต้น
            id="image-upload-input"
          />
          <label
            htmlFor="image-upload-input"
            className={`cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            เลือกรูปภาพ...
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 disabled:opacity-50"
            >
              ลบรูปภาพ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;