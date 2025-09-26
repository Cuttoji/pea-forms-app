"use client";
import dynamic from "next/dynamic";

const FormDashboard = dynamic(() => import("@/app/dashboard/FormDashboard"), { ssr: false });

export default function DashboardPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4 text-gray-700">PEA Forms Dashboard</h1>
      <FormDashboard />
    </main>
  );
}