import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: Partial<ResponseCookie>) => {
          cookieStore.set(name, value, options);
        },
        remove: (name: string) => {
          cookieStore.delete(name);
        },
      },
    }
  );
}
