
import './globals.css';
import { Kanit, Inter } from 'next/font/google';
import ClientLayout from '@/components/layout/ClientLayout';
import { Toaster } from "sonner";
import React from 'react';

export const metadata = {
  title: 'ระบบฟอร์มตรวจสอบ PEA',
  description: 'เข้าถึงและจัดการแบบฟอร์มการตรวจสอบของการไฟฟ้าส่วนภูมิภาค',
  icons: {
    icon: '/pea_logo.png',
  },
};

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${kanit.variable} ${inter.variable}`}>
      <body className="font-kanit bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 text-gray-800 min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}