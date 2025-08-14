"use client";
import React, { useState, useRef, useEffect } from 'react';

const ImageUpload = ({ onImageSelected, initialImageUrl = null, disabled = false }) => {
  const [preview, setPreview] = useState(initialImageUrl);
  const [objectUrl, setObjectUrl] = useState(null); // สำหรับเก็บ object URL ที่สร้างขึ้น
  const fileInputRef = useRef(null);
  const videoRef = useRef(null); // Ref สำหรับ video element เพื่อแสดงผลจากกล้อง
  const canvasRef = useRef(null); // Ref สำหรับ canvas element เพื่อจับภาพ
  const [showCamera, setShowCamera] = useState(false); // State เพื่อควบคุมการแสดงผลของกล้อง
  const [videoStream, setVideoStream] = useState(null); // State เพื่อเก็บ stream ของกล้อง

  // อัปเดต preview เมื่อ initialImageUrl เปลี่ยน
  useEffect(() => {
    setPreview(initialImageUrl);
  }, [initialImageUrl]);

  // Cleanup object URL เมื่อ preview เปลี่ยนหรือ component unmount
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  // Cleanup: หยุด stream ของกล้องเมื่อ component unmount หรือเมื่อกล้องถูกปิด
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (showCamera) stopCamera(); // ถ้ากล้องเปิดอยู่ ให้หยุดกล้องก่อน
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelected(null);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    stopCamera(); // หยุดกล้องด้วยหากมีการลบรูปภาพ
  };

  // ฟังก์ชันสำหรับกล้อง
  const startCamera = async () => {
    if (disabled) return;
    setPreview(null); // ล้างพรีวิวที่มีอยู่ก่อนหน้านี้เมื่อจะเปิดกล้อง

    // ตรวจสอบว่า browser รองรับ mediaDevices และ getUserMedia หรือไม่
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      alert("เบราว์เซอร์ของคุณไม่รองรับการใช้งานกล้อง");
      setShowCamera(false);
      return;
    }

    try {
      // ขอสิทธิ์เข้าถึงกล้อง
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // เริ่มเล่นวิดีโอ
      }
      setVideoStream(stream);
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("ไม่สามารถเข้าถึงกล้องได้: " + err.message);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop()); // หยุด track ทั้งหมดใน stream
      setVideoStream(null);
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (disabled || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // กำหนดขนาด canvas ให้เท่ากับขนาดของวิดีโอ
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // วาดเฟรมปัจจุบันจากวิดีโอลงบน canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // แปลงเนื้อหาใน canvas เป็น Blob (สำหรับสร้าง File object)
    canvas.toBlob((blob) => {
      if (blob) {
        // สร้าง File object จาก Blob
        const file = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' });
        
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        const url = URL.createObjectURL(blob);
        setPreview(url); // แสดงรูปที่ถ่ายในพรีวิว
        setObjectUrl(url);
        onImageSelected(file); // ส่ง File object กลับไป
        stopCamera(); // หยุดกล้องหลังจากถ่ายรูป
      }
    }, 'image/png'); // กำหนดประเภทของรูปภาพ
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-900 mb-1">
        แนบรูปภาพ (อัปโหลด / ถ่ายรูป)
      </label>
      <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2 mb-3">
        💡 <strong>หมายเหตุ:</strong> การอัปโหลดรูปภาพเป็นตัวเลือกเสริม หากไม่สามารถอัปโหลดได้ ระบบจะบันทึกข้อมูลอื่นๆ ไว้ให้ และสามารถแก้ไขเพิ่มรูปภาพได้ภายหลัง
      </div>
      <div className="mt-2 flex items-start gap-4">
        {/* พื้นที่พรีวิว / แสดงผลวิดีโอจากกล้อง */}
        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
          {showCamera ? (
            // แสดง video stream หากกล้องเปิดอยู่
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
          ) : preview ? (
            // แสดงรูปภาพพรีวิวหากมี
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            // แสดงข้อความ "ตัวอย่าง" หากยังไม่มีรูปภาพหรือกล้องไม่ได้เปิด
            <div className="text-center">
              <span className="text-sm text-gray-500">ตัวอย่าง</span>
              <div className="text-xs text-gray-400 mt-1">รูปภาพ</div>
            </div>
          )}
          {/* Canvas ที่ซ่อนไว้สำหรับจับภาพ */}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>

        {/* ปุ่มควบคุมการทำงาน */}
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif, image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={disabled || showCamera}
            className="hidden"
            id="image-upload-input"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              htmlFor="image-upload-input"
              className={`cursor-pointer text-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors ${disabled || showCamera ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              📁 เลือกรูปภาพ
            </label>

            {/* ปุ่มควบคุมกล้อง */}
            {!showCamera ? (
              <button
                type="button"
                onClick={startCamera}
                disabled={disabled}
                className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100 disabled:opacity-50 transition-colors"
              >
                📷 ถ่ายรูป
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={takePhoto}
                  disabled={disabled}
                  className="rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-100 disabled:opacity-50 transition-colors"
                >
                  📸 ถ่าย
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  disabled={disabled}
                  className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                  ❌ ปิดกล้อง
                </button>
              </>
            )}
          </div>

          {/* ปุ่มลบรูปภาพ */}
          {preview && !showCamera && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              🗑️ ลบรูปภาพ
            </button>
          )}
          
          {/* แสดงสถานะกล้อง */}
          {showCamera && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              📹 กล้องเปิดอยู่ - กดปุ่ม "ถ่าย" เพื่อจับภาพ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;