# PEA Forms App

## คู่มือเริ่มต้นใช้งานและพัฒนาโปรเจกต์นี้ แบบละเอียด

PEA Forms App คือเว็บแอปพลิเคชันที่พัฒนาด้วย JavaScript/TypeScript สำหรับจัดการฟอร์มต่างๆ (เช่น สร้าง/แก้ไข/ดูข้อมูล) โดยใช้ Next.js และเชื่อมต่อกับฐานข้อมูล Supabase

---

## ขั้นตอนการเริ่มต้นใช้งาน

### 1. ติดตั้งโปรแกรมที่จำเป็นในเครื่อง

- **Node.js** (แนะนำติดตั้งเวอร์ชัน LTS ล่าสุด)  
  ดาวน์โหลดที่ [https://nodejs.org/](https://nodejs.org/)

- **Git** (ใช้สำหรับ clone โปรเจกต์จาก GitHub)  
  ดาวน์โหลดที่ [https://git-scm.com/](https://git-scm.com/)

---

### 2. ดาวน์โหลดโปรเจกต์

- **วิธีที่ 1:** ดาวน์โหลดเป็นไฟล์ ZIP  
  - กดปุ่ม "Code" แล้วเลือก "Download ZIP"  
  - แตกไฟล์ ZIP ไปยังโฟลเดอร์ที่ต้องการ

- **วิธีที่ 2:** Clone ผ่านคำสั่ง Git  
  เปิด Terminal แล้วรันคำสั่ง:
  ```bash
  git clone https://github.com/Cuttoji/pea-forms-app.git
  cd pea-forms-app
  ```

---

### 3. ติดตั้ง Dependencies

เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วรันคำสั่งใดคำสั่งหนึ่ง (เลือกที่ใช้):

```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
```

---

### 4. ตั้งค่า Environment Variables

1. สร้างไฟล์ชื่อ `.env.local` ที่ root ของโปรเจกต์
2. ใส่ค่าตัวแปร เช่น (สำหรับเชื่อมต่อกับ Supabase):

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

> เปลี่ยนค่า `your_supabase_url` และ `your_supabase_anon_key` ให้ตรงกับโปรเจกต์ Supabase ของคุณ

---

### 5. เตรียมฐานข้อมูล Supabase

1. สร้างโปรเจกต์บน [Supabase.io](https://supabase.io/)
2. เข้าสู่ Project ของคุณ
3. ไปที่เมนู **Table Editor** หรือ **SQL Editor**
4. สร้าง Table ตาม schema ที่ใช้ในโปรเจกต์  
   - ดูตัวอย่าง SQL หรือคำอธิบายในไฟล์ README หรือไฟล์ SQL ภายในโปรเจกต์ (หากมี)
5. ตรวจสอบชื่อ Table, ชื่อ Column และชนิดข้อมูลให้ตรงกับที่เขียนในโค้ด  
6. นำค่าที่ได้มาใส่ใน `.env.local` (ข้อ 4)

---

### 6. เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา

รันคำสั่ง (เลือก 1 อัน ตามที่ติดตั้ง):

```bash
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
```

> เซิร์ฟเวอร์จะรันที่ http://localhost:3000

---

### 7. เปิดแอปในเบราว์เซอร์

- เปิดเว็บเบราว์เซอร์ แล้วไปที่ [http://localhost:3000](http://localhost:3000)
- คุณจะเห็นหน้าแรกของแอปพลิเคชัน

---

### 8. เริ่มต้นพัฒนา/แก้ไขโค้ด

- แก้ไขไฟล์ในโฟลเดอร์ `app/` หรือไฟล์อื่นๆ ตามต้องการ
- เมื่อบันทึกไฟล์ หน้าเว็บจะรีโหลดอัตโนมัติ (hot reload)

---

### 9. (ไม่บังคับ) Deploy ขึ้น Vercel

1. สมัครและเข้าสู่ระบบที่ [Vercel](https://vercel.com/)
2. กด **Import Project** แล้วเลือก repo นี้
3. ตั้งค่าตัวแปร Environment Variables ใน Vercel ให้เหมือนกับในไฟล์ `.env.local`
4. กด **Deploy** เพื่อออนไลน์เว็บแอป

---

## สิ่งที่ต้องติดตั้งเพิ่มเติม (กรณีต้องแก้ไข PDF)

- หากต้องการพัฒนา/ปรับแต่งไฟล์ PDF ในแอป ให้ติดตั้งไลบรารี `@react-pdf/renderer` เพิ่ม:

```bash
npm install @react-pdf/renderer
# หรือ
yarn add @react-pdf/renderer
# หรือ
pnpm add @react-pdf/renderer
```

---

## สรุปสิ่งที่ต้องมีในเครื่อง

- Node.js (เวอร์ชัน LTS)
- Git (ถ้าต้องการ clone โปรเจกต์)
- Dependencies ของโปรเจกต์ (`npm install` หรือ `yarn install` หรือ `pnpm install`)

---

## หมายเหตุ

- หากเจอปัญหาเกี่ยวกับการเชื่อมต่อกับฐานข้อมูล ตรวจสอบค่าในไฟล์ `.env.local` และการตั้งค่า Table ใน Supabase ให้ตรงกับโค้ด
- หากต้องการข้อมูล schema ของฐานข้อมูลหรือ SQL ตัวอย่าง กรุณาดูในโฟลเดอร์ `/docs` หรือสอบถามผู้พัฒนา

---