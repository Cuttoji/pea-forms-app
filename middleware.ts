// middleware.js (ที่ root ของโปรเจกต์)
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request) {
  // สร้าง response เริ่มต้น
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // สร้าง Supabase client สำหรับ middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // ดึงข้อมูล session ของผู้ใช้
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // เงื่อนไขที่ 1: ถ้าผู้ใช้ยังไม่ล็อกอิน และพยายามจะเข้าหน้าอื่นที่ไม่ใช่หน้า auth
  if (!user && !pathname.startsWith('/auth')) {
    // Redirect ไปยังหน้า login
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // เงื่อนไขที่ 2: ถ้าผู้ใช้ล็อกอินแล้ว และพยายามจะเข้าหน้า login หรือ register
  if (user && pathname.startsWith('/auth')) {
    // Redirect ไปยังหน้าหลัก
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // หากไม่เข้าเงื่อนไขใดๆ ให้ไปต่อตามปกติ
  return response;
}

// กำหนดว่า middleware จะทำงานกับ path ไหนบ้าง
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};