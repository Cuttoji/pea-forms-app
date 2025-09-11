// app/dashboard/FormListTable.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, Trash2 } from "lucide-react";

// ฟังก์ชันสำหรับจัดรูปแบบวันที่
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (err) {
    console.error('Date formatting error:', err);
    return "-";
  }
};

interface FormListTableProps {
  forms: FormData[];
  selectedFormType: string;
  formTypeLabel: string;
}

interface FormData {
  id: string;
  inspectionnumber?: string;
  fullname?: string;
  phasetype?: string;
  estimatedload?: string;
  created_at?: string;
  inspectiondate?: string;
  address?: string;
}

export default function FormListTable({ forms, selectedFormType, formTypeLabel }: FormListTableProps) {
  const router = useRouter();
  
  // Add error handling for Supabase client creation
  let supabase;
  try {
    supabase = createClient();
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    supabase = null;
  }

  const handleDelete = async (id: string) => {
    if (!supabase) {
      toast.error("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
      return;
    }
    
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

  const getFormPath = (formType: string) => {
    const pathMap = {
      'inspection_forms': 'residential-inspection',
      'condo_inspection_forms': 'condo-inspection',
      'ev_charger_hv_inspection': 'ev-charger-inspection',
      'ev_charger_lv_inspection': 'ev-charger-lv-inspection',
      'other_inspection': 'other-inspection',
      'other_inspection_forms': 'other-inspection',
      'construction_inspection_forms': 'construction-inspection',
      'construction_inspection': 'construction-inspection'
    };
    
    const path = pathMap[formType as keyof typeof pathMap];
    if (!path) {
      console.warn(`Unknown form type: ${formType}, defaulting to residential-inspection`);
      return 'residential-inspection';
    }
    return path;
  };

  const handleEditClick = (formId: string) => {
    try {
      if (!formId) {
        toast.error("ไม่พบรหัสฟอร์ม");
        return;
      }
      
      // Find the form in the already loaded forms array
      const selectedForm = forms.find(form => form.id === formId);
      if (!selectedForm) {
        console.error('Form not found in local data:', { formId });
        toast.error("ไม่พบข้อมูลฟอร์มในรายการ");
        return;
      }
      
      // Simple approach - just use the form path and ID
      const formPath = getFormPath(selectedFormType);
      
      // Try-catch for sessionStorage in case of private browsing mode
      try {
        sessionStorage.setItem('selectedFormType', selectedFormType);
        sessionStorage.setItem('formId', formId);
        console.log('Stored in sessionStorage:', { selectedFormType, formId });
      } catch (storageError) {
        console.warn('Failed to use sessionStorage:', storageError);
        // Continue anyway - this is just a backup
      }
      
      // Simplified URL with minimal parameters
      const editUrl = `/form/${formPath}?id=${formId}`;
      
      console.log('Navigating to:', editUrl);
      
      // Direct navigation without async/await
      window.location.href = editUrl;
      
    } catch (error) {
      console.error('Error in handleEditClick:', error);
      toast.error("เกิดข้อผิดพลาดในการเปิดฟอร์ม");
    }
  };

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
                {form.inspectionnumber || "-"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {form.fullname || "-"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {form.phasetype === "1_phase" ? "1 เฟส" : "3 เฟส"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {form.estimatedload || "-"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(form.created_at || "")}
              </td>
              {/* --- START: ข้อมูลที่เพิ่มเข้ามา --- */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(form.inspectiondate || "")}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={form.address}>
                {form.address || "-"}
              </td>
              {/* --- END: ข้อมูลที่เพิ่มเข้ามา --- */}
              <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => handleEditClick(form.id)}
                    title="ดู/แก้ไข" 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(form.id)} 
                    title="ลบ" 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
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