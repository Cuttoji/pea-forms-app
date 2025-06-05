// app/api/register/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, username } = await request.json();

    // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วน
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลอีเมล, รหัสผ่าน และชื่อผู้ใช้งานให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
        return NextResponse.json(
            { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
            { status: 400 }
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // ใช้ SUPABASE_SERVICE_ROLE_KEY สำหรับการดำเนินการทางฝั่งเซิร์ฟเวอร์ที่ต้องการสิทธิ์สูง
    // (เช่น การสร้างโปรไฟล์โดยข้าม RLS ชั่วคราว หรือการดำเนินการอื่นๆ ที่ละเอียดอ่อน)
    // **สำคัญมาก**: คีย์นี้ต้องไม่ขึ้นต้นด้วย NEXT_PUBLIC_ และต้องเก็บเป็นความลับบนเซิร์ฟเวอร์เท่านั้น
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Supabase URL or Service Role Key is not configured.');
      return NextResponse.json(
        { error: 'การตั้งค่า Supabase ไม่สมบูรณ์บนเซิร์ฟเวอร์' },
        { status: 500 }
      );
    }

    // สร้าง Admin Supabase client สำหรับการทำงานบนเซิร์ฟเวอร์
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        // persistSession: false, // ไม่จำเป็นสำหรับ Admin client
        autoRefreshToken: false, // ไม่จำเป็นสำหรับ Admin client
      },
    });

    // เรียก Supabase เพื่อสมัครสมาชิกให้ผู้ใช้
    // Supabase จะจัดการส่งอีเมลยืนยันโดยอัตโนมัติ หากเปิดใช้งานในการตั้งค่าโปรเจกต์
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
      email: email,
      password: password,
      // คุณสามารถส่งข้อมูลเพิ่มเติม (options.data) ไปพร้อมกับการสมัครได้
      // ซึ่งข้อมูลนี้จะถูกเก็บไว้ใน user_metadata ของผู้ใช้ในตาราง auth.users
      // options: {
      //   data: {
      //     username: username, // หรือข้อมูลอื่นๆ ที่คุณต้องการเชื่อมโยงกับผู้ใช้ตั้งแต่ต้น
      //   }
      // }
    });

    if (signUpError) {
      console.error('Supabase signUp error:', signUpError);
      return NextResponse.json(
        { error: signUpError.message || 'เกิดข้อผิดพลาดระหว่างการสมัครสมาชิก' },
        { status: signUpError.status || 400 }
      );
    }

    if (!signUpData.user) {
      console.error('User object not returned from signUp but no explicit error.');
      return NextResponse.json(
        { error: 'ไม่สามารถสร้างผู้ใช้ได้ หรืออาจกำลังรอการยืนยันอีเมล' },
        { status: 500 } // หรือ 400 ขึ้นอยู่กับว่าคุณต้องการจัดการเคสนี้อย่างไร
      );
    }

    // ณ จุดนี้ ผู้ใช้ได้ถูกสร้างในตาราง auth.users ของ Supabase แล้ว
    // และ Supabase ควรจะส่งอีเมลยืนยันไปแล้ว (ถ้าเปิดใช้งานไว้)
    // signUpData.user จะมีข้อมูลของผู้ใช้ที่เพิ่งสร้าง (เช่น id, email)
    // signUpData.session จะเป็น null หากต้องมีการยืนยันอีเมล

    // (ทางเลือก) สร้างโปรไฟล์ในตาราง 'profiles' ของคุณ
    // การใช้ service_role key ช่วยให้สามารถเขียนข้อมูลลงตาราง profiles ได้โดยตรงจากเซิร์ฟเวอร์
    let profileMessage = 'กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี';

    const { error: profileError } = await supabaseAdmin
      .from('profiles') // ตรวจสอบว่าชื่อตาราง 'profiles' ถูกต้อง
      .insert({
        id: signUpData.user.id, // ใช้ user ID จาก auth.users เป็น khóaหลัก/foreign key
        username: username,
        email: email, // อาจจะเก็บ email ซ้ำใน profiles หรือไม่ก็ได้ ขึ้นอยู่กับการออกแบบของคุณ
        // updated_at: new Date().toISOString(), // (ถ้ามีคอลัมน์ updated_at)
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // หากการสร้างโปรไฟล์ล้มเหลว คุณอาจต้องการจัดการเพิ่มเติม เช่น:
      // 1. Log error และยังคงแจ้งผู้ใช้ว่าสมัครสำเร็จ (แต่โปรไฟล์อาจมีปัญหา)
      // 2. พิจารณาว่าเป็นความล้มเหลวบางส่วน และแจ้งผู้ใช้
      // 3. (ซับซ้อนกว่า) ลองลบผู้ใช้ที่เพิ่งสร้างใน auth.users ถ้าการสร้างโปรไฟล์สำคัญมาก
      //    await supabaseAdmin.auth.admin.deleteUser(signUpData.user.id);
      //    return NextResponse.json({ error: 'Failed to create profile after user registration.' }, { status: 500 });
      profileMessage += ' (แต่เกิดปัญหาในการบันทึกโปรไฟล์)';
    }

    return NextResponse.json(
      {
        message: `สมัครสมาชิกสำเร็จ! ${profileMessage}`,
        user: { id: signUpData.user.id, email: signUpData.user.email }, // ส่งข้อมูลผู้ใช้ที่จำเป็นกลับไป
        // ไม่ควรส่ง session กลับไปหากต้องยืนยันอีเมล เพราะ session จะเป็น null
      },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}