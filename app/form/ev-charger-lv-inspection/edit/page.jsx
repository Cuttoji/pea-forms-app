"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import EvChargerLvInspectionForm from "../page"; // ใช้ฟอร์มหลักร่วมกัน

function EditEvChargerLvInspectionPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const supabase = createClient();
      supabase
        .from("ev_charger_lv_inspection")
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
      <h1 className="text-2xl font-bold mb-4">แก้ไขฟอร์ม EV Charger LV</h1>
      <EvChargerLvInspectionForm initialForm={form} mode="edit" />
    </div>
  );
}

export default function EditEvChargerLvInspectionPage() {
  return (
    <Suspense fallback={<div className="p-4">กำลังโหลด...</div>}>
      <EditEvChargerLvInspectionPageInner />
    </Suspense>
  );
}