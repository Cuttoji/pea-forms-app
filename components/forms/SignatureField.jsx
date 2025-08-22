import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignatureField = ({ 
  title, 
  onSave, 
  requireName = true,
  requireTitle = true
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const sigPad = useRef(null);

  const handleSave = () => {
    if (!sigPad.current.isEmpty()) {
      const signatureData = {
        image: sigPad.current.toDataURL(),
        name,
        position,
        timestamp: new Date().toISOString(),
        certificate: null // Add digital certificate implementation
      };
      onSave(signatureData);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-semibold mb-3">{title}</h4>
      
      {requireName && (
        <input
          type="text"
          placeholder="ชื่อ-นามสกุล"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 w-full p-2 border rounded"
        />
      )}

      {requireTitle && (
        <input
          type="text"
          placeholder="ตำแหน่ง"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="mb-2 w-full p-2 border rounded"
        />
      )}

      <div className="border rounded mb-2 touch-none">
        <SignaturePad
          ref={sigPad}
          canvasProps={{
            className: "w-full h-40"
          }}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white rounded">
          บันทึก
        </button>
        <button onClick={() => sigPad.current.clear()} className="px-4 py-2 bg-gray-200 rounded">
          ล้าง
        </button>
      </div>
    </div>
  );
};

export default SignatureField;
