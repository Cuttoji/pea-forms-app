// app/components/forms/SignaturePad.jsx
"use client";

import React, { useState, useEffect, useRef, useImperativeHandle } from "react";

const SignaturePad = React.forwardRef(({ title, onSave, onClear }, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawing, setHasDrawing] = useState(false);

    const getPosition = (event) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = event.touches && event.touches.length > 0 ? event.touches[0] : null;
        return {
            x: (touch ? touch.clientX : event.clientX) - rect.left,
            y: (touch ? touch.clientY : event.clientY) - rect.top,
        };
    };

    const startDrawing = (event) => {
        if (event.type === 'touchstart') event.preventDefault();
        const { x, y } = getPosition(event);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawing(true);
    };

    const draw = (event) => {
        if (!isDrawing) return;
        if (event.type === 'touchmove') event.preventDefault();
        const { x, y } = getPosition(event);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setIsDrawing(false);
        if (typeof onSave === 'function' && hasDrawing) {
            onSave(canvasRef.current.toDataURL('image/png'));
        }
    };

    const clearCanvas = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawing(false);

        if (typeof onClear === 'function') onClear();
        if (typeof onSave === 'function') onSave("");
    };

    // เปิดเผยฟังก์ชันให้ Parent component เรียกใช้ผ่าน ref ได้
    useImperativeHandle(ref, () => ({
        clear: clearCanvas,
        toDataURL: (type = 'image/png') => hasDrawing ? canvasRef.current.toDataURL(type) : "",
        isEmpty: () => !hasDrawing,
    }));

    // useEffect สำหรับตั้งค่า canvas เมื่อโหลด
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        
        const setCanvasSize = () => {
          // ตั้งค่าขนาด canvas ให้เท่ากับขนาดของ element จริง
          if (!canvas.offsetWidth || !canvas.offsetHeight) return;
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          // ตั้งค่าสไตล์การวาด
          context.strokeStyle = 'black';
          context.lineWidth = 2;
          context.lineCap = 'round';
          context.lineJoin = 'round';
        };

        // ใช้ Timeout เล็กน้อยเพื่อให้แน่ใจว่า layout เสถียรแล้ว
        const timer = setTimeout(setCanvasSize, 50);
        window.addEventListener('resize', setCanvasSize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    return (
        <div className="w-full">
            <style jsx global>{`.sigCanvas { touch-action: none; }`}</style>
            <label className="block text-sm font-medium text-gray-700 mb-1">{title}:</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-40 bg-gray-50 cursor-crosshair sigCanvas"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <button
                type="button"
                onClick={clearCanvas}
                className="mt-2 text-xs text-gray-600 hover:text-red-600 hover:underline"
            >
                ล้างลายเซ็น
            </button>
        </div>
    );
});

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;