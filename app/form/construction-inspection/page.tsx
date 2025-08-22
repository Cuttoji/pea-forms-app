"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Loading component
function FormLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="ml-3 text-gray-600">กำลังโหลดฟอร์ม...</p>
    </div>
  );
}

// Form content component that uses useSearchParams
function ConstructionFormContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        ฟอร์มตรวจสอบงานก่อสร้าง
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {id ? (
          <p className="text-lg text-gray-700">แก้ไขฟอร์มรหัส: {id}</p>
        ) : (
          <p className="text-lg text-gray-700">สร้างฟอร์มใหม่</p>
        )}
        
        {/* Add your form components here */}
        <div className="mt-6">
          <p className="text-gray-600">ฟอร์มกำลังอยู่ในระหว่างการพัฒนา</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function ConstructionPage() {
  return (
    <Suspense fallback={<FormLoading />}>
      <ConstructionFormContent />
    </Suspense>
  );
}
