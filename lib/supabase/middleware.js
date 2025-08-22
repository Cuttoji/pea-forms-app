import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // ถ้าผู้ใช้ยังไม่ล็อกอิน และพยายามจะเข้าหน้าอื่นที่ไม่ใช่หน้า auth
  if (!user && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ถ้าผู้ใช้ล็อกอินแล้ว และพยายามจะเข้าหน้า login/register
  if (user && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}