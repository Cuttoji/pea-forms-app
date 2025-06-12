// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"; // ✅ Import server helper
import FormListTable from "./FormListTable"; // Import client component
import { FilePlus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ดึงข้อมูลฟอร์มเฉพาะของผู้ใช้ที่ล็อกอินอยู่
  // RLS Policy จะช่วยกรองข้อมูลให้โดยอัตโนมัติ
  const { data: forms, error } = await supabase
    .from('inspection_forms') // << ตรวจสอบว่าชื่อตารางถูกต้อง
    .select('id, inspectionNumber, fullName, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching forms for dashboard:", error);
    // คุณอาจจะแสดงหน้า error ที่นี่
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-pea-dark">Dashboard</h1>
                <p className="text-gray-500">รายการฟอร์มทั้งหมดของคุณ</p>
            </div>
            <Link href="/form/residential-inspection" className="inline-flex items-center gap-2 bg-pea-primary text-white px-4 py-2 rounded-lg shadow hover:bg-pea-dark transition-colors">
                <FilePlus size={18} />
                <span>สร้างฟอร์มใหม่</span>
            </Link>
        </div>

        {/* ส่งข้อมูลที่ดึงได้ไปให้ Client Component แสดงผล */}
        <FormListTable forms={forms || []} />
    </div>
  );
}