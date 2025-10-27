// app/api/submit-form/[formType]/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request, context) {
  const { params } = context;
  const formTypeFromPath = params.formType;
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

  // Map formType to table name
  const tableMap = {
    "home-inspection": "home_inspection_forms",
    "condo-inspection": "condo_inspection_forms",
    "construction-inspection": "construction_inspection",
    "ev-charger-lv-inspection": "ev_charger_lv_inspection",
    "ev-charger-hv-inspection": "ev_charger_hv_inspection",
    "other-inspection": "other_inspection_forms",
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

  let data, error;
  if (formData.id) {
    // ถ้ามี id ให้ update
    ({ data, error } = await supabase
      .from(tableName)
      .update(formData)
      .eq("id", formData.id)
      .select());
  } else {
    // ถ้าไม่มี id ให้ insert
    ({ data, error } = await supabase
      .from(tableName)
      .insert([formData])
      .select());
  }

  if (error) {
    return NextResponse.json({ error: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}` }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: data[0] });
}
