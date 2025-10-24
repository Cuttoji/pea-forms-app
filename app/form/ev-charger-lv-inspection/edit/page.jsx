"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import EvChargerLvInspectionForm from "../EvChargerLvInspectionForm";
import evLvChargerFormSchema from "@/lib/constants/evLvChargerFormSchema";

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
        .then(({ data, error }) => {
          if (error) {
            console.error("Error loading form:", error);
            setLoading(false);
            return;
          }
          
          console.log("Raw data from DB:", data);
          
          // Helper function to safely parse JSON
          const safeJsonParse = (value, fallback = {}) => {
            if (!value) return fallback;
            if (typeof value === 'string') {
              try {
                return JSON.parse(value);
              } catch (e) {
                console.error("JSON parse error:", e);
                return fallback;
              }
            }
            return value;
          };
          
          // Parse JSON fields with fallbacks from schema
          const parsedData = {
            general: safeJsonParse(data.general, evLvChargerFormSchema.general),
            documents: safeJsonParse(data.documents, evLvChargerFormSchema.documents),
            LVSystemPEA: safeJsonParse(data.LVSystemPEA, evLvChargerFormSchema.LVSystemPEA),
            panel: safeJsonParse(data.panel, evLvChargerFormSchema.panel),
            subCircuits: safeJsonParse(data.subCircuits, []),
            summary: safeJsonParse(data.summary, { summaryType: null }),
            limitation: data.limitation || "",
            signature: safeJsonParse(data.signature, { officerSign: "", customerSign: "" }),
          };
          
          console.log("Parsed data:", parsedData);
          console.log("LVSystemPEA:", parsedData.LVSystemPEA);
          console.log("SubCircuits:", parsedData.subCircuits);
          
          setForm(parsedData);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-4">กำลังโหลด...</div>;
  if (!form) return <div className="p-4 text-red-500">ไม่พบข้อมูลฟอร์ม</div>;

  return (
    <div>
      <EvChargerLvInspectionForm initialForm={form} mode="edit" formId={id} />
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