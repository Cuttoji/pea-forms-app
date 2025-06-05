// ในหน้า page.tsx หรือ component อื่นๆ
// In your page.tsx or other components

import supabase from '@/lib/supabaseClient'; // ปรับ path ตามตำแหน่งไฟล์ของคุณ
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [user, setUser] = useState<any>(null); // หรือใช้ User type จาก Supabase

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password',
    });
    if (error) console.error('Error logging in:', error.message);
  };

  // ... (ส่วนอื่นๆ ของคอมโพเนนต์)
  return (
    <div>
      {user ? <p>Logged in as: {user.email}</p> : <p>Not logged in</p>}
      <button onClick={handleLogin}>Login (Test)</button>
    </div>
  );
}