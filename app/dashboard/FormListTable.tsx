// app/dashboard/FormListTable.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Edit, Trash2 } from 'lucide-react';

// ✅ เพิ่ม fullName ใน Type ให้ครบ
type Form = {
  id: number;
  inspectionNumber: string;
  fullName: string;
  requestNumber: string;
  requestDate: string;
  inspectionDate: string;
  address: string;
  phaseType: string;
  estimatedLoad: number;
  created_at: string;
};

// ✅ รับ prop 'formTypeLabel' เพิ่มเข้ามา
export default function FormListTable({ forms, selectedFormType, formTypeLabel }: { forms: Form[], selectedFormType: string, formTypeLabel: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getEditPath = (formId: number) => {
    let basePath = '/form/residential-inspection';
    if (selectedFormType === 'condo_inspection_forms') {
        basePath = '/form/condo-inspection';
    } else if (selectedFormType === 'ev_inspection_forms') {
        basePath = '/form/ev-charger-lv-inspection';
    }
    return `${basePath}?id=${formId}`;
  };

  const handleDelete = async (formId: number) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบฟอร์มนี้?")) {
      setDeletingId(formId);
      const { error } = await supabase
        .from(selectedFormType)
        .delete()
        .match({ id: formId });

      if (error) {
        alert(`เกิดข้อผิดพลาดในการลบข้อมูล: ${error.message}`);
      } else {
        alert("ลบฟอร์มเรียบร้อยแล้ว");
        router.refresh(); 
      }
      setDeletingId(null);
    }
  };

  if (!forms || forms.length === 0) {
    return (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
            <h3 className="text-xl font-semibold text-gray-700">ไม่พบข้อมูลฟอร์ม</h3>
            <p className="text-gray-500 mt-2">คุณยังไม่เคยบันทึกฟอร์มประเภทนี้</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่ฟอร์ม</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ฟอร์ม</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่อยู่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ตรวจสอบ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">โหลดประมาณการ</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {forms.map((form) => (
            <tr key={form.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{form.inspectionNumber || '-'}</div>
                <div className="text-gray-500 text-xs">{form.requestNumber ? `คำร้อง: ${form.requestNumber}`: ''}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {formTypeLabel}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.fullName || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600 max-w-xs truncate" title={form.address}>{form.address || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.inspectionDate ? new Date(form.inspectionDate).toLocaleDateString('th-TH') : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.phaseType || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.estimatedLoad ? `${form.estimatedLoad} kVA` : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                <Link 
                  href={getEditPath(form.id)} 
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                  title="ดู/แก้ไข"
                >
                  <Edit size={14} />
                  <span>ดู/แก้ไข</span>
                </Link>
                <button
                  onClick={() => handleDelete(form.id)}
                  disabled={deletingId === form.id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 disabled:opacity-50"
                  title="ลบ"
                >
                  {deletingId === form.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div> : <Trash2 size={14} />}
                  <span>{deletingId === form.id ? '...' : 'ลบ'}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}