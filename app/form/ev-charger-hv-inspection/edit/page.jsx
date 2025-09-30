"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import EvChargerHvInspectionForm from "../EvChargerHvInspectionForm";

function EditEvChargerHvInspectionPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const supabase = createClient();
      supabase
        .from("ev_charger_hv_inspection")
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
      <h1 className="text-2xl font-bold mb-4">แก้ไขฟอร์ม EV Charger HV</h1>
      <EvChargerHvInspectionForm initialForm={form} mode="edit" />
    </div>
  );
}

export default function EditEvChargerHvInspectionPage() {
  return (
    <Suspense fallback={<div className="p-4">กำลังโหลด...</div>}>
      <EditEvChargerHvInspectionPageInner />
    </Suspense>
  );
}