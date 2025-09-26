# PEA Forms App

## ขั้นตอนการเริ่มต้นใช้งานโปรเจกต์นี้อย่างละเอียด

### 1. ติดตั้งโปรแกรมที่จำเป็น
- ติดตั้ง [Node.js (แนะนำเวอร์ชันล่าสุด LTS)](https://nodejs.org/)
- ติดตั้ง [Git](https://git-scm.com/) (ถ้าต้องการ clone โปรเจกต์จาก GitHub)

### 2. ดาวน์โหลดหรือ Clone โปรเจกต์
- ถ้าได้ไฟล์ ZIP ให้แตกไฟล์
- ถ้า clone จาก GitHub ให้ใช้คำสั่ง
  ```bash
  git clone <repo-url>
  cd pea-forms-app

### 3. ติดตั้ง dependencies
เปิด terminal ในโฟลเดอร์โปรเจกต์
รันคำสั่งใดคำสั่งหนึ่ง (ตามที่ใช้ package manager)

npm install
# หรือ
yarn install
# หรือ
pnpm install

### 4. ตั้งค่า Environment Variables
สร้างไฟล์ .env.local ที่ root ของโปรเจกต์
ใส่ค่าเช่น (ตัวอย่างสำหรับ Supabase)

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

### 5. สร้างฐานข้อมูล (Supabase)
เข้าไปที่ Supabase
สร้าง Project ใหม่ (หรือใช้ Project เดิม)
ไปที่เมนู Table Editor หรือ SQL Editor
สร้าง table ตาม schema ที่โปรเจกต์ใช้ (ดูตัวอย่าง SQL ในไฟล์หรือ README)
ตรวจสอบให้แน่ใจว่าชื่อ table ตรงกับที่ใช้ในโค้ด

### 6. เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา
รันคำสั่ง
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev

### 7. เปิดเว็บแอปในเบราว์เซอร์
เปิดเบราว์เซอร์แล้วไปที่ http://localhost:3000
จะเห็นหน้าแรกของแอป

### 8. เริ่มแก้ไข/พัฒนา
แก้ไขไฟล์ในโฟลเดอร์ app/ หรือไฟล์อื่นๆ ตามต้องการ
เมื่อบันทึกไฟล์ หน้าเว็บจะรีเฟรชอัตโนมัติ

### 9. (ถ้าต้องการ) Deploy ขึ้น Vercel
สมัครและล็อกอิน Vercel
กด Import Project แล้วเลือก repo นี้
ตั้งค่า Environment Variables ใน Vercel ให้เหมือนกับ .env.local
กด Deploy

## สิ่งที่ต้องติดตั้ง

- Node.js (แนะนำเวอร์ชันล่าสุด LTS)
- Git (ถ้าต้องการ clone โปรเจกต์จาก GitHub)
- Dependencies ของโปรเจกต์ (ติดตั้งด้วยคำสั่ง `npm install`, `yarn install` หรือ `pnpm install`)

**หมายเหตุ:**  
หากจะพัฒนา/แก้ไข PDF ให้ติดตั้งไลบรารี @react-pdf/renderer ด้วย  
```bash
npm install @react-pdf/renderer
# หรือ
yarn add @react-pdf/renderer
# หรือ
pnpm add @react-pdf/renderer