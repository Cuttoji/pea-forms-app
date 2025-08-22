import Link from 'next/link';
import { Zap, Building, Construction, Home, Factory } from 'lucide-react';

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
  gradient: string;
}

// คอมโพเนนต์ย่อยสำหรับแสดงการ์ดคุณสมบัติ/ลิงก์ไปยังฟอร์ม
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, href, linkText, gradient }) => {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border border-gray-200 hover:border-purple-300 transform hover:-translate-y-2 hover:scale-105"
    >
      <div className={`flex items-center justify-center w-16 h-16 ${gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors leading-tight">
        {title}
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-6 min-h-[4em] leading-relaxed">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center text-sm font-semibold text-purple-600 group-hover:text-purple-700 transition-colors">
          {linkText}
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl mb-8 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 mb-6 leading-tight">
            ระบบฟอร์มตรวจสอบ PEA
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            เข้าถึงและจัดการแบบฟอร์มการตรวจสอบของการไฟฟ้าส่วนภูมิภาคได้อย่างสะดวก รวดเร็ว และมีประสิทธิภาพ
          </p>
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              💡 <strong>เคล็ดลับ:</strong> คลิกที่การ์ดด้านล่างเพื่อเริ่มกรอกแบบฟอร์มตรวจสอบที่ต้องการ
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Home size={28} />}
            title="ฟอร์มที่อยู่อาศัย"
            description="สำหรับตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัย บ้านเดี่ยว และอาคารพักอาศัย"
            href="/form/residential-inspection"
            linkText="เริ่มกรอกฟอร์ม"
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <FeatureCard
            icon={<Factory size={28} />}
            title="ฟอร์มพาณิชย์กรรม"
            description="สำหรับตรวจสอบการติดตั้งระบบไฟฟ้าประเภทพาณิชย์กรรม โรงงาน และสถานประกอบการ"
            href="/form/commercial-inspection"
            linkText="เริ่มกรอกฟอร์ม"
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <FeatureCard
            icon={<Zap size={28} />}
            title="ฟอร์ม EV Charger (แรงต่ำ)"
            description="สำหรับตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้าที่รับไฟแรงต่ำ สำหรับที่อยู่อาศัยและธุรกิจขนาดเล็ก"
            href="/form/ev-charger-lv-inspection"
            linkText="เริ่มกรอกฟอร์ม"
            gradient="bg-gradient-to-br from-yellow-500 to-orange-600"
          />
          <FeatureCard
            icon={<Zap className="transform rotate-180" size={28} />}
            title="ฟอร์ม EV Charger (แรงสูง)"
            description="สำหรับตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงสูงโดยติดตั้งหม้อแปลงเฉพาะราย"
            href="/form/ev-charger-hv-inspection"
            linkText="เริ่มกรอกฟอร์ม"
            gradient="bg-gradient-to-br from-red-500 to-pink-600"
          />
          <FeatureCard
            icon={<Building size={28} />}
            title="ฟอร์มคอนโดมิเนียม"
            description="สำหรับตรวจสอบการติดตั้งระบบไฟฟ้าในอาคารชุด คอนโดมิเนียม หรืออาคารที่มีผู้ทรงสิทธิ์หลายราย"
            href="/form/condo-inspection"
            linkText="เริ่มกรอกฟอร์ม"
            gradient="bg-gradient-to-br from-purple-500 to-violet-600"
          />
          <FeatureCard
            icon={<Construction size={28} />}
            title="ฟอร์มตรวจสอบงานก่อสร้าง"
            description="สำหรับตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่ายไฟฟ้าของ กฟภ. ตามข้อกำหนดทางเทคนิค"
            href="/form/construction-inspection"
            linkText="เริ่มกรอกฟอร์ม"
            gradient="bg-gradient-to-br from-gray-600 to-slate-700"
          />
        </div>

        {/* Additional Information Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ข้อมูลเพิ่มเติม</h2>
            <p className="text-gray-600">แบบฟอร์มทั้งหมดได้รับการออกแบบตามมาตรฐานการไฟฟ้าส่วนภูมิภาค</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-xl mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">ตรวจสอบอย่างละเอียด</h3>
              <p className="text-gray-600 text-sm">ครอบคลุมทุกมาตรฐานความปลอดภัย</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-xl mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">ประหยัดเวลา</h3>
              <p className="text-gray-600 text-sm">ระบบออนไลน์ที่รวดเร็วและสะดวก</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-xl mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">รายงานมาตรฐาน</h3>
              <p className="text-gray-600 text-sm">สร้างรายงานได้ทันทีหลังตรวจสอบ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
