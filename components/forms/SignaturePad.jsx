"use client";

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RefreshCw, Check } from 'lucide-react';


const SignaturePad = forwardRef(({ title, onSave, onClear }, ref) => {
SignaturePad.displayName = 'SignaturePad';
  const sigPadRef = useRef(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ทำให้ Component แม่สามารถเรียกใช้ฟังก์ชัน 'clear' ผ่าน ref ได้
  // (จำเป็นสำหรับการ Reset ฟอร์มทั้งหมด)
  useImperativeHandle(ref, () => ({
    clear: () => {
      handleClear();
    },
  }));

  const handleBeginStroke = () => {
    setIsSigned(true);
    setIsSaved(false); // ถ้าเริ่มวาดใหม่ ให้สถานะบันทึกเป็น false
  };

  const handleClear = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
    setIsSigned(false);
    setIsSaved(false);
    if (onClear) {
      onClear(); // แจ้ง Component แม่ให้ล้าง state
    }
  };

  const handleSave = () => {
    if (sigPadRef.current && isSigned) {
      const dataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
      if (onSave) {
        onSave(dataUrl); // ส่งข้อมูลที่บันทึกไปให้ Component แม่
      }
      setIsSaved(true);
    }
  };

  return (
    <div className="w-full space-y-2">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <div className={`relative w-full aspect-[2/1] bg-gray-50 rounded-lg border-2 ${isSaved ? 'border-green-400' : 'border-gray-300'} transition-all`}>
        <SignatureCanvas
          ref={sigPadRef}
          penColor='black'
          canvasProps={{ className: 'w-full h-full rounded-lg' }}
          onBegin={handleBeginStroke}
        />
        {!isSigned && !isSaved && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            เซ็นชื่อที่นี่
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 h-10">
        {isSaved ? (
          <p className="text-sm text-green-600 font-semibold flex items-center gap-2">
            <Check size={18} />
            บันทึกแล้ว
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleClear}
              disabled={!isSigned}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className="inline mr-2" />
              ล้าง
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default SignaturePad;