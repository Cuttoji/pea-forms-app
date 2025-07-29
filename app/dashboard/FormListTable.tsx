// app/dashboard/FormListTable.tsx
"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, FileText, Trash2 } from "lucide-react";

// ฟังก์ชันสำหรับจัดรูปแบบวันที่
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "-";
  }
};

export default function FormListTable({ forms, selectedFormType, formTypeLabel }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id) => {
    if (window.confirm(`คุณต้องการลบฟอร์มนี้ (${id}) ใช่หรือไม่?`)) {
      const { error } = await supabase
        .from(selectedFormType)
        .delete()
        .match({ id });

      if (error) {
        toast.error("เกิดข้อผิดพลาดในการลบฟอร์ม: " + error.message);
      } else {
        toast.success("ลบฟอร์มสำเร็จแล้ว");
        router.refresh();
      }
    }
  };

  const getFormPath = (formType) => {
    switch (formType) {
      case 'inspection_forms':
        return 'residential-inspection';
      case 'condo_inspection_forms':
        return 'condo-inspection';
      case 'ev_charger_hv_inspection':
        return 'ev-charger-inspection';
      case 'ev_charger_lv_inspection':
        return 'ev-charger-lv-inspection';
      case 'commercial_inspection_forms': 
        return 'commercial-inspection';
      case 'construction_inspection_forms':
        return 'construction-inspection';
      // เพิ่มกรณีอื่นๆ ตามต้องการ
      default:
        return 'residential-inspection';
    }
  };

  const formPath = getFormPath(selectedFormType);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-pea-dark">{formTypeLabel}</h2>
        <p className="text-sm text-gray-500">
          พบ {forms.length} รายการ
        </p>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              เลขที่ฟอร์ม
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ชื่อผู้ขอใช้ไฟ
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ประเภท
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              โหลด (A)
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              วันที่สร้าง
            </th>
            {/* --- START: คอลัมน์ที่เพิ่มเข้ามา --- */}
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              วันที่ตรวจสอบ
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ที่อยู่
            </th>
            {/* --- END: คอลัมน์ที่เพิ่มเข้ามา --- */}
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              การกระทำ
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {forms.map((form) => (
            <tr key={form.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-pea-dark text-gray-700">
                {form.inspectionNumber || "-"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {form.fullName || "-"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {form.phaseType === "1_phase" ? "1 เฟส" : "3 เฟส"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {form.estimatedLoad || "-"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(form.created_at)}
              </td>
              {/* --- START: ข้อมูลที่เพิ่มเข้ามา --- */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(form.inspectionDate)}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={form.address}>
                {form.address || "-"}
              </td>
              {/* --- END: ข้อมูลที่เพิ่มเข้ามา --- */}
              <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-3">
                  <Link href={`/form/${formPath}?id=${form.id}`} title="ดู/แก้ไข" className="text-blue-600 hover:text-blue-900">
                    <Eye size={18} />
                  </Link>
                  <button onClick={() => handleDelete(form.id)} title="ลบ" className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {forms.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>ไม่พบข้อมูลในประเภทฟอร์มนี้</p>
        </div>
      )}
    </div>
  );
}