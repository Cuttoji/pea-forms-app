import Link from 'next/link';
import { FileText, Zap, Building, Construction } from 'lucide-react';

export const metadata = {
  title: 'หน้าหลัก | ระบบฟอร์มตรวจสอบ PEA',
  description: 'ยินดีต้อนรับสู่ระบบฟอร์มตรวจสอบออนไลน์ของการไฟฟ้าส่วนภูมิภาค',
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  linkText: string;
}

// คอมโพเนนต์ย่อยสำหรับแสดงการ์ดคุณสมบัติ/ลิงก์ไปยังฟอร์ม
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, href, linkText }) => {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border border-transparent hover:border-purple-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-[#5b2d90] rounded-full mb-4 group-hover:bg-[#5b2d90] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-[#3a1a5b] mb-3 group-hover:text-[#5b2d90] transition-colors">
        {title}
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-4 min-h-[3em]"> {/* min-h to keep card height consistent */}
        {description}
      </p>
      <span className="inline-block text-sm font-medium text-[#5b2d90] group-hover:underline">
        {linkText} &rarr;
      </span>
    </Link>
  );
};

export default function HomePage() {
  return (
    <div className="text-center py-8 sm:py-12">
      <header className="mb-12 sm:mb-16">
        {/* <img src="/pea_logo_large.png" alt="PEA Logo" className="w-32 h-auto mx-auto mb-6" /> */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5b2d90] via-[#3a1a5b] to-purple-600 mb-6">
          ระบบฟอร์มตรวจสอบ PEA
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
          เข้าถึงและจัดการแบบฟอร์มการตรวจสอบของการไฟฟ้าส่วนภูมิภาคได้อย่างสะดวก รวดเร็ว และมีประสิทธิภาพ
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <FeatureCard
          icon={<FileText size={24} />}
          title="ฟอร์มที่อยู่อาศัย"
          description="สำหรับตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัย"
          href="/form/residential-inspection" // อัปเดต path ตามโครงสร้างของคุณ
          linkText="เริ่มกรอกฟอร์ม"
        />
        <FeatureCard
          icon={<Building size={24} />}
          title="ฟอร์มอื่นๆ"
          description="สำหรับตรวจสอบการติดตั้งระบบไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย"
          href="/form/commercial-inspection" // อัปเดต path ตามโครงสร้างของคุณ
          linkText="เริ่มกรอกฟอร์ม"
        />
        <FeatureCard
          icon={<Zap size={24} />}
          title="ฟอร์ม EV Charger (แรงต่ำ)"
          description="สำหรับตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้าที่รับไฟแรงต่ำ"
          href="/form/ev-charger-lv-inspection" // อัปเดต path ตามโครงสร้างของคุณ
          linkText="เริ่มกรอกฟอร์ม"
        />
        <FeatureCard
          icon={<Zap className="transform rotate-180" size={24} />} // Example of slightly different icon
          title="ฟอร์ม EV Charger (แรงสูง)"
          description="สำหรับตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้าที่รับไฟแรงสูง"
          href="/form/ev-charger-hv-inspection" // อัปเดต path ตามโครงสร้างของคุณ
          linkText="เริ่มกรอกฟอร์ม"
        />
        <FeatureCard
          icon={<Building size={24} />}
          title="ฟอร์มคอนโด"
          description="สำหรับตรวจสอบการติดตั้งระบบไฟฟ้าในอาคารชุดหรืออาคารที่มีผู้ทรงสิทธิ์หลายราย"
          href="/form/condo-inspection" // อัปเดต path ตามโครงสร้างของคุณ
          linkText="เริ่มกรอกฟอร์ม"
        />
        <FeatureCard
          icon={<Construction size={24} />}
          title="ฟอร์มตรวจสอบงานก่อสร้าง"
          description="สำหรับตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่ายของ กฟภ."
          href="/form/construction-inspection" // อัปเดต path ตามโครงสร้างของคุณ
          linkText="เริ่มกรอกฟอร์ม"
        />
      </div>
    </div>
  );
}
