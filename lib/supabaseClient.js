import supabase from '@/lib/supabaseClient';
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password',
    });
    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div>
      {user ? <p>Logged in as: {user.email}</p> : <p>Not logged in</p>}
      <button onClick={handleLogin}>Login (Test)</button>
    </div>
  );
}

// ตัวอย่างฟังก์ชันดึง updated_at จาก profiles
export async function fetchProfilesUpdatedAt() {
  const { data, error } = await supabase
    .from('profiles')
    .select('updated_at');
  if (error) {
    console.error('Fetch updated_at error:', error.message);
    return [];
  }
  // data เป็น array ของ { updated_at }
  return data;
}