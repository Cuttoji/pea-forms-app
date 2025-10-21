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
          // แก้ไขข้อมูลที่ได้จาก database ให้มี default values
          const formattedData = {
            ...data,
            summary: data?.summary || { summaryType: null },
            limitation: data?.limitation || "",
            signature: data?.signature || { officerSign: "", customerSign: "" },
            general: data?.general || {},
            documents: data?.documents || {},
            hvSystem: data?.hvSystem || {},
            // แก้ไข transformers ให้มีโครงสร้างครบถ้วน
            transformers: Array.isArray(data?.transformers) && data.transformers.length > 0
              ? data.transformers.map(transformer => ({
                  ...transformer,
                  // เพิ่ม lvSystem ถ้าไม่มี
                  lvSystem: transformer?.lvSystem || {
                    mainCircuit: {
                      cableType: "",
                      cableSize: "",
                      conduitType: "",
                      conduitSize: "",
                      installation: "",
                      result: null,
                      detail: ""
                    },
                    mainBreaker: {
                      type: "",
                      rating: "",
                      icRating: "",
                      phases: "",
                      result: null,
                      detail: ""
                    },
                    grounding: {
                      type: "",
                      resistance: "",
                      result: null,
                      detail: ""
                    }
                  },
                  // เพิ่ม subCircuits ถ้าไม่มี
                  subCircuits: Array.isArray(transformer?.subCircuits) && transformer.subCircuits.length > 0
                    ? transformer.subCircuits
                    : []
                }))
              : [{
                  id: Date.now().toString(),
                  transformerNo: 1,
                  rating: "",
                  primaryVoltage: "",
                  secondaryVoltage: "",
                  impedance: "",
                  yearInstalled: "",
                  result: null,
                  detail: "",
                  lvSystem: {
                    mainCircuit: {
                      cableType: "",
                      cableSize: "",
                      conduitType: "",
                      conduitSize: "",
                      installation: "",
                      result: null,
                      detail: ""
                    },
                    mainBreaker: {
                      type: "",
                      rating: "",
                      icRating: "",
                      phases: "",
                      result: null,
                      detail: ""
                    },
                    grounding: {
                      type: "",
                      resistance: "",
                      result: null,
                      detail: ""
                    }
                  },
                  subCircuits: []
                }]
          };
          
          console.log("Formatted data:", formattedData); // Debug log
          setForm(formattedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading form:", error);
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