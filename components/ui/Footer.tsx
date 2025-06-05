import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-gray-800 text-white text-center text-sm p-6 mt-10">
      <p>© {new Date().getFullYear()} การไฟฟ้าส่วนภูมิภาค (PEA)</p>
      <p>สงวนลิขสิทธิ์ | All Rights Reserved</p>
      <div className="mt-2">
        <Link href="/privacy-policy" className="hover:underline mx-2">นโยบายความเป็นส่วนตัว</Link>
        <Link href="/terms-of-service" className="hover:underline mx-2">ข้อกำหนดการใช้งาน</Link>
      </div>
    </footer>
  );
};