// app/dashboard/FormListTable.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";

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
  forms: any[];
  selectedFormType: string;
  formTypeLabel: string;
  isLoading?: boolean;
  error?: string | null;
}

// helper สำหรับคืนค่าจาก general ตาม key หลายชื่อ
const getGeneralValue = (general: any, keys: string[]) => {
  for (const key of keys) {
    const value = general?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "-";
};

// ฟังก์ชันดึงข้อมูลจาก schema (jsonb) ของแต่ละฟอร์ม
const getField = (form: any, selectedFormType: string, field: string) => {
  const general = form?.general ?? {};

  // mapping field → possible keys ใน general
  const fieldMap: Record<string, string[]> = {
    inspectionnumber: ["inspectionNo", "inspectionNumber"],
    fullname: ["customerName", "fullName"],
    phasetype: ["systemType", "phaseType"],
    estimatedload: ["load", "estimatedLoad"],
    inspectiondate: ["inspectionDate"],
    address: ["address"]
  };

  // ตรวจสอบว่า field ที่ขอมี mapping หรือไม่
  if (fieldMap[field]) {
    return getGeneralValue(general, fieldMap[field]);
  }

  // ถ้าไม่รู้จัก field หรือ form type
  console.warn(`Unknown field "${field}" or form type "${selectedFormType}" in getField`);
  return "-";
};

export default function FormListTable({
  forms,
  selectedFormType,
  formTypeLabel,
  isLoading = false,
  error = null,
}: FormListTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
      setIsDeleting(id);
      try {
        const { error } = await supabase
          .from(selectedFormType)
          .delete()
          .match({ id });

        if (error) {
          console.error('Delete error:', error);
          toast.error("เกิดข้อผิดพลาดในการลบฟอร์ม: " + error.message);
        } else {
          toast.success("ลบฟอร์มสำเร็จแล้ว");
          router.refresh();
        }
      } catch (err) {
        console.error('Unexpected delete error:', err);
        toast.error("เกิดข้อผิดพลาดที่ไม่คาดคิด");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const getFormPath = (formType: string) => {
    const pathMap = {
      'home_inspection_forms': 'home-inspection',
      'condo_inspection_forms': 'condo-inspection',
      'ev_charger_hv_inspection': 'ev-charger-hv-inspection',
      'ev_charger_lv_inspection': 'ev-charger-lv-inspection',
      'other_inspection_forms': 'other-inspection',
      'construction_inspection': 'construction-inspection'
    };
    const path = pathMap[formType as keyof typeof pathMap];
    if (!path) {
      console.warn(`Unknown form type: ${formType}, defaulting to home-inspection`);
      return 'home-inspection';
    }
    return path;
  };

  const handleEditClick = (formId: string) => {
    try {
      if (!formId) {
        toast.error("ไม่พบรหัสฟอร์ม");
        return;
      }
      const formPath = getFormPath(selectedFormType);

      // ค้นหา form object ที่ต้องการ
      const formObj = forms.find((f) => f.id === formId);
      if (!formObj) {
        toast.error("ไม่พบข้อมูลฟอร์ม");
        return;
      }

      // เก็บข้อมูลฟอร์มทั้งหมดลง sessionStorage เพื่อให้หน้าแก้ไขสามารถแสดงข้อมูลที่กรอกไว้ครบ
      try {
        sessionStorage.setItem('selectedFormType', selectedFormType);
        sessionStorage.setItem('formId', formId);
        sessionStorage.setItem('formData', JSON.stringify(formObj));
      } catch (storageError) {
        // ignore
      }

      const editUrl = `/form/${formPath}?id=${formId}`;
      window.location.href = editUrl;
    } catch (error) {
      console.error('Error in handleEditClick:', error);
      toast.error("เกิดข้อผิดพลาดในการเปิดฟอร์ม");
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-pea-dark">{formTypeLabel}</h2>
        </div>
        <div className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-pea-dark">{formTypeLabel}</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pea-primary mx-auto mb-4"></div>
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              เลขที่ฟอร์ม
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ชื่อผู้ขอใช้ไฟ
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ประเภท
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              โหลด (A)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              วันที่สร้าง
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              วันที่ตรวจสอบ
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ที่อยู่
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              การกระทำ
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {forms.map((form) => (
            <tr key={form.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-pea-dark text-gray-700">
                {getField(form, selectedFormType, "inspectionnumber")}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {getField(form, selectedFormType, "fullname")}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {getField(form, selectedFormType, "phasetype")}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {getField(form, selectedFormType, "estimatedload")}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(form.created_at || "")}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(getField(form, selectedFormType, "inspectiondate"))}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={getField(form, selectedFormType, "address")}>
                {getField(form, selectedFormType, "address")}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleEditClick(form.id)}
                    title="ดู/แก้ไข"
                    className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50"
                    disabled={isDeleting === form.id}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    title="ลบ"
                    className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                    disabled={isDeleting === form.id}
                  >
                    {isDeleting === form.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 size={18} />
                    )}
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