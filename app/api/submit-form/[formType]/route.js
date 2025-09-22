// app/api/submit-form/[formType]/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request, context) {
  const { params } = await context;
  const formTypeFromPath = context.params.formType;
  let formData;

  try {
    formData = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "ข้อมูลที่ส่งมาไม่ใช่ JSON ที่ถูกต้อง" }, { status: 400 });
  }

  if (!formTypeFromPath || typeof formTypeFromPath !== "string") {
    return NextResponse.json({ error: "ไม่พบประเภทของฟอร์ม (formType) ใน URL path" }, { status: 400 });
  }

  if (!formData || typeof formData !== "object" || Object.keys(formData).length === 0) {
    return NextResponse.json({ error: "กรุณาส่งข้อมูลฟอร์ม (formData) มาใน request body" }, { status: 400 });
  }

  // Map formType to table name (เติม s ให้ตรงกับชื่อ table)
  const tableMap = {
    "home-inspection": "home_inspections",
    "condo-inspection": "condo_inspections",
    "construction-inspection": "construction_inspections",
    "ev-lv-charger-inspection": "ev_lv_charger_inspections",
    "ev-hv-charger-inspection": "ev_hv_charger_inspections",
    "other-inspection": "other_inspections",
  };
  const tableName = tableMap[formTypeFromPath];
  if (!tableName) {
    return NextResponse.json({ error: "ไม่รองรับประเภทฟอร์มนี้" }, { status: 400 });
  }

  // Init Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json({ error: "Supabase config ไม่ถูกต้อง" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Insert data
  const { data, error } = await supabase.from(tableName).insert([formData]).select();

  if (error) {
    return NextResponse.json({ error: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}` }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: data[0] });
}