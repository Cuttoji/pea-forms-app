"use client";
import { Suspense } from "react";
import EditCondoInspectionPageInner from "./EditCondoInspectionPageInner";

// แยก logic ไปไว้ในไฟล์/ฟังก์ชันย่อย หรือในไฟล์เดียวกันก็ได้
export default function EditCondoInspectionPage() {
  return (
    <Suspense fallback={<div className="p-4">กำลังโหลด...</div>}>
      <EditCondoInspectionPageInner />
    </Suspense>
  );
}

// --- ย้าย logic เดิมมาไว้ใน component ย่อย ---
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CondoInspectionForm from "../page"; // ใช้ฟอร์มหลักร่วมกัน

function EditCondoInspectionPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const supabase = createClient();
      supabase
        .from("condo_inspection_forms")
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
      <h1 className="text-2xl font-bold mb-4">แก้ไขฟอร์มตรวจสอบอาคารชุด</h1>
      <CondoInspectionForm initialForm={form} mode="edit" />
    </div>
  );
}