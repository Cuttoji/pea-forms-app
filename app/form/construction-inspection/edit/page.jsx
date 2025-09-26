"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ConstructionInspectionForm from "../page"; // ใช้ฟอร์มหลักร่วมกัน

export default function EditConstructionInspectionPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const supabase = createClient();
      supabase
        .from("construction_inspection")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          setForm(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-4">กำลังโหลด...</div>;
  if (!form) return <div className="p-4 text-red-500">ไม่พบข้อมูลฟอร์ม</div>;

  return (
    <div className="p-4 text-gray-700">
      <h1 className="text-2xl font-bold mb-4">แก้ไขฟอร์มตรวจสอบงานก่อสร้าง</h1>
      <ConstructionInspectionForm initialForm={form} mode="edit" />
    </div>
  );
}