"use client";
import dynamic from "next/dynamic";

const FormDashboard = dynamic(() => import("@/app/dashboard/FormDashboard"), { ssr: false });

export default function DashboardPage() {
  return (
    <main>
      <FormDashboard />
    </main>
  );
}