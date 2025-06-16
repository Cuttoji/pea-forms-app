// app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import FormListTable from "./FormListTable";
import { FilePlus, ListFilter, SlidersHorizontal } from "lucide-react";

const formTypes = [
  { value: 'inspection_forms', label: 'ฟอร์มที่อยู่อาศัย' },
  { value: 'condo_inspection_forms', label: 'ฟอร์มอาคารชุด' },
  { value: 'ev_inspection_forms', label: 'ฟอร์ม EV Charger' },
  { value: 'commercial_inspection_forms', label: 'ฟอร์มเชิงพาณิชย์' },
  { value: 'industrial_inspection_forms', label: 'ฟอร์มอุตสาหกรรม' },
  { value: 'solar_inspection_forms', label: 'ฟอร์ม Solar Inspection' },
  { value: 'other_inspection_forms', label: 'ฟอร์มอื่นๆ' },
];

export default function DashboardPage() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFormType, setSelectedFormType] = useState(formTypes[0].value);
  const [sortBy, setSortBy] = useState('created_at');

  const supabase = createClient();

  const fetchForms = useCallback(async () => {
    setIsLoading(true);
    
    const columnsToSelect = 'id, inspectionNumber, fullName, created_at, requestNumber, requestDate, inspectionDate, address, phaseType, estimatedLoad';

    const { data, error } = await supabase
      .from(selectedFormType)
      .select(columnsToSelect)
      .order(sortBy, { ascending: false });

    if (error) {
      console.error("Error fetching forms:", error);
      setForms([]);
    } else {
      setForms(data || []);
    }
    setIsLoading(false);
  }, [selectedFormType, sortBy, supabase]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const selectedFormLabel = formTypes.find(type => type.value === selectedFormType)?.label || '';

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-pea-dark">Dashboard</h1>
                <p className="text-gray-900 mt-1">ภาพรวมและจัดการฟอร์มทั้งหมด</p>
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border">
            <div className='flex-1'>
                <label htmlFor="formType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <ListFilter size={16}/>
                  เลือกประเภทฟอร์ม
                </label>
                <select
                    id="formType"
                    value={selectedFormType}
                    onChange={(e) => setSelectedFormType(e.target.value)}
                    className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pea-primary focus:border-pea-primary"
                >
                    {formTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>
            <div className='flex-1'>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <SlidersHorizontal size={16}/>
                  เรียงข้อมูลตาม
                </label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pea-primary focus:border-pea-primary"
                >
                    <option value="created_at">วันที่สร้างล่าสุด</option>
                    <option value="fullName">ชื่อผู้ขอใช้ไฟ</option>
                    <option value="inspectionNumber">เลขที่ฟอร์ม</option>
                    <option value="inspectionDate">วันที่ตรวจสอบ</option>
                    <option value="phaseType">ประเภทไฟ</option>
                    <option value="estimatedLoad">โหลดประมาณการ</option>
                </select>
            </div>
        </div>

        {isLoading ? (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pea-primary mx-auto"></div>
                <p className="mt-3 text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
        ) : (
            // ✅ ส่ง prop 'formTypeLabel' เพิ่มเข้าไป
            <FormListTable forms={forms} selectedFormType={selectedFormType} formTypeLabel={selectedFormLabel} />
        )}
    </div>
  );
}