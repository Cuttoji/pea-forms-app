// app/dashboard/FormListTable.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // Import client helper
import { Eye, Edit, Trash2 } from 'lucide-react';

// เรากำหนด Type สำหรับ props ที่จะรับมาจาก Server Component
type Form = {
  id: number;
  inspectionNumber: string;
  fullName: string;
  created_at: string;
};

export default function FormListTable({ forms }: { forms: Form[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (formId: number) => {
    // แสดงกล่องข้อความยืนยันก่อนลบ
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบฟอร์มนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      setDeletingId(formId);
      const { error } = await supabase
        .from('inspection_forms') // << ตรวจสอบว่าชื่อตารางถูกต้อง
        .delete()
        .match({ id: formId });

      if (error) {
        console.error("Error deleting form:", error);
        alert(`เกิดข้อผิดพลาดในการลบข้อมูล: ${error.message}`);
      } else {
        alert("ลบฟอร์มเรียบร้อยแล้ว");
        // สั่งให้ Next.js โหลดข้อมูลหน้านี้ใหม่ทั้งหมด
        router.refresh(); 
      }
      setDeletingId(null);
    }
  };

  if (!forms || forms.length === 0) {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">ไม่พบข้อมูลฟอร์ม</h3>
            <p className="text-gray-500 mt-2">คุณยังไม่เคยบันทึกฟอร์มใดๆ</p>
            <Link href="/form/residential-inspection" className="mt-4 inline-block bg-pea-primary text-white px-5 py-2.5 rounded-lg shadow hover:bg-pea-dark transition-colors">
                + สร้างฟอร์มใหม่
            </Link>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่ฟอร์ม</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ขอใช้ไฟ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {forms.map((form) => (
            <tr key={form.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{form.inspectionNumber || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.fullName || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(form.created_at).toLocaleDateString('th-TH')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                <Link 
                  href={`/form/residential-inspection?id=${form.id}`} // << ลิงก์ไปยังหน้าฟอร์มพร้อม ID
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
                  <span>{deletingId === form.id ? 'กำลังลบ...' : 'ลบ'}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}