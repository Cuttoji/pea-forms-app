"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const ImageUpload = ({ onImageSelected, initialImageUrl = null, disabled = false }) => {
  const [preview, setPreview] = useState(initialImageUrl);
  const [objectUrl, setObjectUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setShowCamera(false);
  };

  // อัปเดต preview เมื่อ initialImageUrl เปลี่ยน
  useEffect(() => {
    if (initialImageUrl && 
        typeof initialImageUrl === 'string' && 
        initialImageUrl !== preview && 
        initialImageUrl.trim() !== '') {
      console.log('Setting initial image URL:', initialImageUrl);
      setPreview(initialImageUrl);
      setImageError(false);
      setIsImageLoading(true);
    }
  }, [initialImageUrl, preview]);

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
      if (showCamera) stopCamera();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImageError(false);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImageError(false);
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
        setImageError(false);
        onImageSelected(file); // ส่ง File object กลับไป
        stopCamera(); // หยุดกล้องหลังจากถ่ายรูป
      }
    }, 'image/png'); // กำหนดประเภทของรูปภาพ
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
    console.error('Failed to load image:', preview);
  };

  const openImageInNewTab = () => {
    if (isValidPreview() && !imageError) {
      window.open(preview, '_blank');
    }
  };

  // Helper function to check if preview is valid
  const isValidPreview = () => {
    return preview && typeof preview === 'string' && preview.trim() !== '';
  };

  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-gray-900 mb-2">
        📷 แนบรูปภาพ (อัปโหลด / ถ่ายรูป)
      </label>
      
      <div className="text-sm text-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <strong className="font-semibold">หมายเหตุ:</strong> การอัปโหลดรูปภาพเป็นตัวเลือกเสริม หากไม่สามารถอัปโหลดได้ ระบบจะบันทึกข้อมูลอื่นๆ ไว้ให้ และสามารถแก้ไขเพิ่มรูปภาพได้ภายหลัง
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-6">
        {/* พื้นที่พรีวิว */}
        <div className="w-40 h-40 rounded-2xl border-3 border-dashed border-gray-300 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0 relative shadow-inner hover:shadow-lg transition-all duration-300 group">
          {showCamera ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl"></video>
          ) : isValidPreview() ? (
            <div className="relative w-full h-full">
              {isImageLoading && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-purple-500"></div>
                </div>
              )}
              {imageError ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
                  <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-xs text-center font-medium">ไม่สามารถ<br />โหลดรูป</span>
                </div>
              ) : (
                <Image 
                  src={preview} 
                  alt="Preview" 
                  fill
                  className={`object-cover cursor-pointer hover:scale-105 transition-all duration-300 rounded-xl ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onClick={openImageInNewTab}
                  title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
                  unoptimized
                />
              )}
            </div>
          ) : (
            <div className="text-center p-4 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-600">ตัวอย่าง</span>
              <div className="text-xs text-gray-400 mt-1">รูปภาพ</div>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>

        {/* ปุ่มควบคุม */}
        <div className="flex flex-col gap-3 flex-1">
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif, image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={disabled || showCamera}
            className="hidden"
            id="image-upload-input"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              htmlFor="image-upload-input"
              className={`cursor-pointer text-center rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 shadow-md hover:shadow-lg ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-200 ${disabled || showCamera ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center justify-center gap-2">
                📁 เลือกรูปภาพ
              </span>
            </label>

            {!showCamera ? (
              <button
                type="button"
                onClick={startCamera}
                disabled={disabled}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  📷 ถ่ายรูป
                </span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={takePhoto}
                  disabled={disabled}
                  className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    📸 ถ่าย
                  </span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  disabled={disabled}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    ❌ ปิดกล้อง
                  </span>
                </button>
              </>
            )}
          </div>

          {/* ปุ่มเพิ่มเติม */}
          {isValidPreview() && !showCamera && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 px-4 py-3 text-sm font-semibold text-red-700 shadow-md hover:shadow-lg ring-1 ring-red-200 hover:ring-red-300 disabled:opacity-50 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  🗑️ ลบรูปภาพ
                </span>
              </button>
              
              {!imageError && (
                <button
                  type="button"
                  onClick={openImageInNewTab}
                  disabled={disabled}
                  className="rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 px-4 py-3 text-sm font-semibold text-purple-700 shadow-md hover:shadow-lg ring-1 ring-purple-200 hover:ring-purple-300 disabled:opacity-50 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    🔍 ดูรูปขนาดเต็ม
                  </span>
                </button>
              )}
            </div>
          )}
          
          {/* สถานะ */}
          {showCamera && (
            <div className="text-sm text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl shadow-inner border border-blue-300">
              <div className="flex items-center gap-2">
                <span className="text-lg animate-pulse">📹</span>
                <span className="font-medium">กล้องเปิดอยู่ - กดปุ่ม ถ่าย เพื่อจับภาพ</span>
              </div>
            </div>
          )}

          {isValidPreview() && !showCamera && (
            <div className="text-sm text-green-700 bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl shadow-inner border border-green-300">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="font-medium">มีรูปภาพแล้ว - คลิกที่รูปหรือปุ่ม ดูรูปขนาดเต็ม เพื่อดูรายละเอียด</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;