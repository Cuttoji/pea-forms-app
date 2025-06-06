// app/api/submit-form/[formType]/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const formTypeFromPath = params.formType;
  let formData;

  try {
    formData = await request.json();
  } catch (error) {
    console.error('Error parsing JSON body:', error);
    return NextResponse.json({ error: 'ข้อมูลที่ส่งมาไม่ใช่ JSON ที่ถูกต้อง' }, { status: 400 });
  }

  if (!formTypeFromPath || typeof formTypeFromPath !== 'string') {
    return NextResponse.json({ error: 'ไม่พบประเภทของฟอร์ม (formType) ใน URL path' }, { status: 400 });
  }

  if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
    return NextResponse.json({ error: 'กรุณาส่งข้อมูลฟอร์ม (formData) มาใน request body' }, { status: 400 });
  }

  // สร้างชื่อตารางจาก formType (ชื่อ folder)
  // โดยทั่วไปจะแปลง hyphen (-) เป็น underscore (_)
  // ตัวอย่าง: "residential-inspection" -> ตารางชื่อ "residential_inspection"
  //         "ev-charger-lv-inspection" -> ตารางชื่อ "ev_charger_lv_inspection"
  // คุณจะต้องสร้างตารางเหล่านี้ใน Supabase ด้วยชื่อที่ตรงกัน
  const tableName = formTypeFromPath.replace(/-/g, '_');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ใช้ Service Role Key สำหรับ Server-side

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL หรือ Service Role Key is not configured on the server.');
    return NextResponse.json(
      { error: 'การตั้งค่า Supabase บนเซิร์ฟเวอร์ไม่สมบูรณ์' },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Attempting to insert into table: ${tableName} with data:`, formData);

  try {
    // formData ที่ส่งมาจาก client ควรจะมี key ตรงกับชื่อคอลัมน์ในตาราง Supabase
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert([formData]) // Supabase insert คาดหวัง array ของ objects
      .select(); // (ทางเลือก) ดึงข้อมูลที่เพิ่ง insert กลับมา

    if (error) {
      console.error(`Supabase error inserting into table '${tableName}':`, error);
      // ตรวจสอบ error code เพื่อให้ข้อมูลที่เฉพาะเจาะจงมากขึ้น
      if (error.code === '42P01') { // รหัสสำหรับ "undefined_table" ใน PostgreSQL
          return NextResponse.json({ error: `ไม่พบตารางชื่อ '${tableName}' ในฐานข้อมูล` }, { status: 400 });
      }
      // อาจมี error อื่นๆ เช่น constraint violations, data type mismatches
      return NextResponse.json(
        {
          error: `เกิดข้อผิดพลาดในการบันทึกข้อมูลลงตาราง '${tableName}': ${error.message}`,
          details: error.details
        },
        { status: 400 } // หรือ error.status ถ้ามี
      );
    }

    return NextResponse.json(
      {
        message: `ข้อมูลสำหรับฟอร์ม '${formTypeFromPath}' ถูกบันทึกไปยังตาราง '${tableName}' เรียบร้อยแล้ว`,
        submittedData: data // ข้อมูลที่ถูก insert (ถ้าใช้ .select())
      },
      { status: 201 } // 201 Created
    );

  } catch (apiError) { // ดักจับ error ที่อาจเกิดขึ้นใน try block ของ API route เอง
    console.error('API Route unexpected error:', apiError);
    return NextResponse.json(
      { error: apiError.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิดบนเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}