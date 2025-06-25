/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // *** แทนที่ตรงนี้ด้วย Hostname ของคุณที่คัดลอกมาจากขั้นตอนที่ 1 ***
        hostname: 'cznbhkepfkhisdknayce.supabase.co', 
        port: '',
        // อนุญาตให้โหลดรูปจาก bucket 'form-images' เท่านั้นเพื่อความปลอดภัย
        pathname: '/storage/v1/object/public/form-images/**', 
      },
    ],
  },
};

export default nextConfig;