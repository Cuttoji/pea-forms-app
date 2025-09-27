"use client";
import { Eye, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function getField(general: any, keys: string[]) {
  if (!general) return "-";
  for (const key of keys) {
    if (
      general[key] !== undefined &&
      general[key] !== null &&
      general[key] !== ""
    )
      return general[key];
  }
  return "-";
}

interface FormListTableProps {
  forms: any[];
  selectedFormType: string;
  formTypeLabel: string;
}

export default function FormListTable({
  forms,
  selectedFormType,
  formTypeLabel,
}: FormListTableProps) {
  // ปุ่มดู/แก้ไข
  function handleEdit(id: string) {
    // แปลง selectedFormType ให้เป็น path ที่ถูกต้อง
    let path = selectedFormType
      .replace("_forms", "")
      .replace("_inspection", "-inspection");

    // กรณี special case (ถ้ามี)
    if (selectedFormType === "ev_charger_lv_inspection") path = "ev-charger-lv-inspection";
    if (selectedFormType === "ev_charger_hv_inspection") path = "ev-charger-hv-inspection";
    if (selectedFormType === "construction_inspection") path = "construction-inspection";
    if (selectedFormType === "other_inspection_forms") path = "other-inspection";

    // เปลี่ยน path ให้เป็น /form/[form-type]/edit?id=...
    window.location.href = `/form/${path}/edit?id=${id}`;
  }

async function handleDelete(id: string) {
  if (confirm("ยืนยันการลบฟอร์มนี้?")) {
    const supabase = createClient();
    const { error } = await supabase
      .from(selectedFormType) // <<< ใช้ตารางตามประเภทฟอร์ม
      .delete()
      .eq("id", id);

    if (error) {
      alert("เกิดข้อผิดพลาดในการลบฟอร์ม");
      return;
    }
    // อัปเดตรายการฟอร์มต่อ เช่น รีเฟรชหน้าหรือ reload ข้อมูล
    window.location.reload(); // หรือเรียกฟังก์ชัน fetch ใหม่
  }
}

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow text-gray-700">
      <table className="min-w-full text-sm">
        <thead className="bg-[#ede9f7]">
          <tr>
            {selectedFormType === "construction_inspection" ? (
              <>
                <th className="p-3 font-bold text-[#3a1a5b] border-b">ชื่องาน</th>
                <th className="p-3 font-bold text-[#3a1a5b] border-b">อนุมัติเลขที่</th>
              </>
            ) : (
              <th className="p-3 font-bold text-[#3a1a5b] border-b">เลขที่คำร้อง</th>
            )}
            <th className="p-3 font-bold text-[#3a1a5b] border-b">ชื่อผู้ขอใช้ไฟ</th>
            <th className="p-3 font-bold text-[#3a1a5b] border-b">ประเภท</th>
            <th className="p-3 font-bold text-[#3a1a5b] border-b">โหลด (A)</th>
            <th className="p-3 font-bold text-[#3a1a5b] border-b">วันที่สร้าง</th>
            <th className="p-3 font-bold text-[#3a1a5b] border-b">วันที่ตรวจสอบ</th>
            <th className="p-3 font-bold text-[#3a1a5b] border-b">ที่อยู่</th>
            <th className="p-3 font-bold text-[#3a1a5b] border-b text-center">การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {forms.length === 0 ? (
            <tr>
              <td colSpan={selectedFormType === "construction_inspection" ? 9 : 8} className="text-center text-gray-400 py-8">
                ไม่มีข้อมูล
              </td>
            </tr>
          ) : (
            forms.map((form) => (
              <tr key={form.id} className="hover:bg-[#f6f3fa] transition">
                {selectedFormType === "construction_inspection" ? (
                  <>
                    <td className="p-3 border-b">{getField(form.general, ["projectName"])}</td>
                    <td className="p-3 border-b">{getField(form.general, ["approvalNo"])}</td>
                  </>
                ) : (
                  <td className="p-3 border-b">{getField(form.general, ["inspectionNo", "inspection_number", "inspectionNumber"])}</td>
                )}
                <td className="p-3 border-b">{getField(form.general, ["customerName", "fullName"])}</td>
                <td className="p-3 border-b">{getField(form.general, ["systemType", "phaseType"])}</td>
                <td className="p-3 border-b">{getField(form.general, ["load", "estimatedLoad"])}</td>
                <td className="p-3 border-b">{form.created_at ? new Date(form.created_at).toLocaleDateString("th-TH") : "-"}</td>
                <td className="p-3 border-b">{getField(form.general, ["inspectionDate", "inspectionDate2"])}</td>
                <td className="p-3 border-b">{getField(form.general, ["address"])}</td>
                <td className="p-3 border-b text-center">
                  <button
                    onClick={() => handleEdit(form.id)}
                    className="inline-flex items-center text-blue-700 hover:text-blue-900 mr-2"
                    title="ดู/แก้ไข"
                  >
                    <Eye size={18} />
                    <span className="ml-1 hidden md:inline">ดู/แก้ไข</span>
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="inline-flex items-center text-red-600 hover:text-red-900"
                    title="ลบ"
                  >
                    <Trash2 size={18} />
                    <span className="ml-1 hidden md:inline">ลบ</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="p-2 text-xs text-gray-400 text-right">
        {formTypeLabel}
      </div>
    </div>
  );
}