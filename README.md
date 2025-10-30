# 📋 PEA Forms App

แอปพลิเคชันสำหรับจัดการฟอร์มของ PEA ที่พัฒนาด้วย Next.js และ Supabase

---

## 📖 สารบัญ

1. [PEA Forms App คืออะไร?](#pea-forms-app-คืออะไร)
2. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
3. [ความต้องการของระบบ](#ความต้องการของระบบ)
4. [วิธีติดตั้งและเริ่มใช้งาน](#วิธีติดตั้งและเริ่มใช้งาน)
5. [การตั้งค่าฐานข้อมูล](#การตั้งค่าฐานข้อมูล)
6. [คำอธิบายโครงสร้างโปรเจกต์](#คำอธิบายโครงสร้างโปรเจกต์)
7. [คำสั่งที่ใช้บ่อย](#คำสั่งที่ใช้บ่อย)
8. [การ Deploy ขึ้น Production](#การ-deploy-ขึ้น-production)
9. [การแก้ปัญหาเบื้องต้น](#การแก้ปัญหาเบื้องต้น)

---

## 🎯 PEA Forms App คืออะไร?

PEA Forms App เป็นเว็บแอปพลิเคชันที่สร้างมาเพื่อ:
- **สร้างฟอร์ม** ต่างๆ สำหรับงานของ PEA
- **จัดการข้อมูล** ที่กรอกในฟอร์ม
- **แสดงผล PDF** จากข้อมูลที่กรอก
- **เก็บข้อมูล** ในฐานข้อมูล Supabase อย่างปลอดภัย

---

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลยี | ความหมาย | ใช้ทำอะไร |
|-----------|----------|-----------|
| **Next.js** | Framework ของ React | สร้างเว็บแอปพลิเคชัน |
| **JavaScript/TypeScript** | ภาษาโปรแกรม | เขียนโค้ด (90.8% JavaScript, 9.1% TypeScript) |
| **Supabase** | ฐานข้อมูล (Backend as a Service) | เก็บและจัดการข้อมูล |
| **React PDF** | ไลบรารี | สร้างและแสดงผล PDF |
| **CSS** | ภาษาตกแต่ง | ออกแบบหน้าตาเว็บ |

---

## 💻 ความต้องการของระบบ

### ✅ สิ่งที่ต้องมีในคอมพิวเตอร์:

1. **Node.js** (เวอร์ชัน 18.0 หรือใหม่กว่า - แนะนำเวอร์ชัน LTS)
   - ดาวน์โหลด: [https://nodejs.org/](https://nodejs.org/)
   - ตรวจสอบเวอร์ชันด้วยคำสั่ง: `node --version`

2. **Git** (สำหรับดาวน์โหลดโปรเจกต์)
   - ดาวน์โหลด: [https://git-scm.com/](https://git-scm.com/)
   - ตรวจสอบเวอร์ชันด้วยคำสั่ง: `git --version`

3. **Text Editor** (แนะนำ)
   - [Visual Studio Code](https://code.visualstudio.com/)
   - [WebStorm](https://www.jetbrains.com/webstorm/)

4. **บัญชี Supabase** (ฟรี)
   - สมัครที่: [https://supabase.com/](https://supabase.com/)

---

## 🚀 วิธีติดตั้งและเริ่มใช้งาน

### 📥 ขั้นตอนที่ 1: ดาวน์โหลดโปรเจกต์

**วิธีที่ 1: ใช้ Git Clone (แนะนำ)**

1. เปิด Terminal หรือ Command Prompt
2. ไปยังโฟลเดอร์ที่ต้องการเก็บโปรเจกต์ เช่น:
   ```bash
   cd Desktop
   ```

3. Clone โปรเจกต์:
   ```bash
   git clone https://github.com/Cuttoji/pea-forms-app.git
   ```

4. เข้าไปในโฟลเดอร์โปรเจกต์:
   ```bash
   cd pea-forms-app
   ```

**วิธีที่ 2: ดาวน์โหลด ZIP**

1. ไปที่ [https://github.com/Cuttoji/pea-forms-app](https://github.com/Cuttoji/pea-forms-app)
2. กดปุ่ม **Code** สีเขียว
3. เลือก **Download ZIP**
4. แตกไฟล์ ZIP
5. เปิด Terminal ในโฟลเดอร์ที่แตกไฟล์

---

### 📦 ขั้นตอนที่ 2: ติดตั้ง Dependencies

Dependencies คือ ไลบรารีและโมดูลที่โปรเจกต์ต้องใช้

**เลือกคำสั่งใดคำสั่งหนึ่ง:**

```bash
# ถ้าใช้ npm (มาพร้อม Node.js)
npm install

# ถ้าใช้ yarn
yarn install

# ถ้าใช้ pnpm (เร็วที่สุด)
pnpm install
```

> ⏱️ **ระยะเวลา:** ประมาณ 2-5 นาที (ขึ้นอยู่กับความเร็วอินเทอร์เน็ต)

---

### 🔐 ขั้นตอนที่ 3: สร้างบัญชี Supabase

1. ไปที่ [https://supabase.com/](https://supabase.com/)
2. กด **Start your project** หรือ **Sign Up**
3. สมัครด้วย GitHub, Google หรือ Email
4. กด **New Project**
5. กรอกข้อมูล:
   - **Name**: เช่น `pea-forms-db`
   - **Database Password**: สร้างรหัสผ่านที่แข็งแรง (เก็บไว้ด้วย!)
   - **Region**: เลือก `Southeast Asia (Singapore)` หรือที่ใกล้ที่สุด
6. กด **Create new project**
7. รอประมาณ 2-3 นาที

---

### 🗂️ ขั้นตอนที่ 4: ตั้งค่าฐานข้อมูล Supabase

#### 4.1 สร้าง Table

1. ในหน้า Supabase Project ของคุณ
2. ไปที่เมนูซ้ายมือ → **Table Editor**
3. กด **Create a new table**
4. เอาคำสั้งใน **supabase database editor**ไปใช้สร้าง
5. กด **Save**

#### 4.2 เอา API Keys

1. ไปที่เมนู **Settings** (⚙️) → **API**
2. คัดลอกค่าต่อไปนี้:
   - **Project URL** (เช่น `https://xxxxx.supabase.co`)
   - **anon public key** (เช่น `eyJhbGc...`)

---

### ⚙️ ขั้นตอนที่ 5: ตั้งค่า Environment Variables

1. ในโฟลเดอร์โปรเจกต์ `pea-forms-app`
2. สร้างไฟล์ใหม่ชื่อ `.env.local` (ไฟล์ที่ซ่อนอยู่)

   **บน Windows:**
   ```bash
   type nul > .env.local
   ```

   **บน Mac/Linux:**
   ```bash
   touch .env.local
   ```

3. เปิดไฟล์ `.env.local` ด้วย Text Editor
4. วางโค้ดนี้ และแก้ไขค่า:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Optional: เพิ่มตัวแปรอื่นๆ ตามต้องการ
   # NEXT_PUBLIC_APP_NAME=PEA Forms App
   ```

5. **บันทึกไฟล์**

> ⚠️ **สำคัญ:** ห้ามแชร์ไฟล์ `.env.local` กับใคร เพราะมีข้อมูลลับ!

---

### ▶️ ขั้นตอนที่ 6: รันโปรเจกต์

1. เปิด Terminal ในโฟลเดอร์โปรเจกต์
2. รันคำสั่ง:

   ```bash
   npm run dev
   ```

3. รอจนเห็นข้อความ:
   ```
   ✓ Ready in 2.5s
   ○ Local:   http://localhost:3000
   ```

4. เปิดเว็บเบราว์เซอร์ แล้วไปที่: **http://localhost:3000**

🎉 **ขอแสดงความยินดี!** คุณรันโปรเจกต์สำเร็จแล้ว

---

## 📂 คำอธิบายโครงสร้างโปรเจกต์

```
pea-forms-app/
│
├── app/                    # โฟลเดอร์หลักของ Next.js App Router
│   ├── page.js            # หน้าแรก (Home Page)
│   ├── layout.js          # Layout ร่วมของทุกหน้า
│   └── forms/             # โฟลเดอร์สำหรับหน้าฟอร์มต่างๆ
│
├── components/             # Components ที่ใช้ซ้ำได้
│   ├── ui                 # ui component
│   └── PDF                # PDF component
│
├── lib/                    # ไลบรารีและ utilities
│   └── supabase.js        # การตั้งค่า Supabase client
│
├── public/                 # ไฟล์ Static (รูปภาพ, ไอคอน)
│   └── images/
│
├── styles/                 # ไฟล์ CSS
│   └── globals.css
│
├── .env.local             # ตัวแปร Environment (ไม่ commit)
├── .gitignore             # ไฟล์ที่ไม่ต้องการ commit
├── package.json           # รายการ Dependencies
├── next.config.js         # การตั้งค่า Next.js
├── README.md              # ไฟล์นี้
└── supabase database editor.txt # ไฟล์คำสั่งสร้างฐานข้อมูลในsupabase
```

---

## 🎮 คำสั่งที่ใช้บ่อย

| คำสั่ง | ความหมาย | เมื่อไหร่ควรใช้ |
|--------|----------|----------------|
| `npm run dev` | รันเซิร์ฟเวอร์พัฒนา (Development) | ตอนพัฒนาโปรเจกต์ |
| `npm run build` | Build โปรเจกต์สำหรับ Production | ก่อน Deploy |
| `npm start` | รันเซิร์ฟเวอร์ Production | หลัง Build เสร็จแล้ว |
| `npm run lint` | ตรวจสอบโค้ด | ก่อน commit โค้ด |
| `npm install <package>` | ติดตั้ง package เพิ่ม | ต้องการไลบรารีใหม่ |

**ตัวอย่างการใช้งาน:**

```bash
# รันโปรเจกต์แบบพัฒนา (มี Hot Reload)
npm run dev

# Build โปรเจกต์
npm run build

# รันโปรเจกต์แบบ Production
npm start

# ติดตั้ง React PDF Renderer
npm install @react-pdf/renderer
```

---

## 📤 การ Deploy ขึ้น Production

### วิธีที่ 1: Deploy ด้วย Vercel (ฟรี + แนะนำ)

1. **สมัคร/เข้าสู่ระบบ Vercel**
   - ไปที่ [https://vercel.com/](https://vercel.com/)
   - Sign up ด้วย GitHub account

2. **Import โปรเจกต์**
   - กด **Add New...** → **Project**
   - เลือก repository `Cuttoji/pea-forms-app`
   - กด **Import**

3. **ตั้งค่า Environment Variables**
   - ใน Vercel Project Settings
   - ไปที่ **Settings** → **Environment Variables**
   - เพิ่มค่าเหมือนในไฟล์ `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
     ```

4. **Deploy**
   - กด **Deploy**
   - รอประมาณ 2-3 นาที
   - จะได้ URL เช่น `https://pea-forms-app.vercel.app`

5. **Update โปรเจกต์ในอนาคต**
   - Push code ใหม่ไปยัง GitHub
   - Vercel จะ Deploy อัตโนมัติ!

---

### วิธีที่ 2: Deploy แบบ Manual

```bash
# 1. Build โปรเจกต์
npm run build

# 2. Test การ build
npm start

# 3. Upload โฟลเดอร์ .next, public, package.json ไปยัง Server
# 4. รันคำสั่ง npm start บน Server
```

---

## 🐛 การแก้ปัญหาเบื้องต้น

### ❌ ปัญหา: `npm install` ไม่ทำงาน

**วิธีแก้:**
```bash
# ลบโฟลเดอร์ node_modules และ package-lock.json
rm -rf node_modules package-lock.json

# ติดตั้งใหม่
npm install
```

---

### ❌ ปัญหา: หน้าเว็บแสดง "Supabase Connection Error"

**วิธีแก้:**
1. ตรวจสอบไฟล์ `.env.local` ว่ามีค่าถูกต้องหรือไม่
2. ตรวจสอบว่า Supabase Project ยังทำงานอยู่
3. ลอง Restart เซิร์ฟเวอร์ใหม่:
   ```bash
   # กด Ctrl+C เพื่อหยุด
   # จากนั้นรันใหม่
   npm run dev
   ```

---

### ❌ ปัญหา: Port 3000 ถูกใช้งานอยู่แล้ว

**วิธีแก้:**
```bash
# เปลี่ยน Port เป็น 3001
npm run dev -- -p 3001
```

หรือแก้ไขใน `package.json`:
```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

---

### ❌ ปัญหา: PDF ไม่แสดงผล

**วิธีแก้:**
```bash
# ติดตั้ง React PDF Renderer
npm install @react-pdf/renderer

# Restart เซิร์ฟเวอร์
npm run dev
```

---

### ❌ ปัญหา: แก้โค้ดแล้วหน้าเว็บไม่เปลี่ยน

**วิธีแก้:**
1. กด **Ctrl + C** เพื่อหยุดเซิร์ฟเวอร์
2. ลบ cache:
   ```bash
   rm -rf .next
   ```
3. รันใหม่:
   ```bash
   npm run dev
   ```

---

## 🤝 การ Contribute

หากต้องการช่วยพัฒนาโปรเจกต์นี้:

1. **Fork** โปรเจกต์
2. สร้าง **Branch** ใหม่:
   ```bash
   git checkout -b feature/ชื่อฟีเจอร์ใหม่
   ```
3. **Commit** การเปลี่ยนแปลง:
   ```bash
   git commit -m "เพิ่มฟีเจอร์..."
   ```
4. **Push** ไปยัง Branch:
   ```bash
   git push origin feature/ชื่อฟีเจอร์ใหม่
   ```
5. เปิด **Pull Request**


---

## 🎓 แหล่งเรียนรู้เพิ่มเติม

- [เอกสาร Next.js](https://nextjs.org/docs)
- [เอกสาร Supabase](https://supabase.com/docs)
- [เอกสาร React PDF](https://react-pdf.org/)
- [JavaScript Tutorial](https://javascript.info/)

---

<div align="center">

</div>