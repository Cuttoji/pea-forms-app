"use client";
import { useState, useEffect, useCallback } from 'react';
import { createClient } from "@/lib/supabase/client";
import { FilePlus, ListFilter, SlidersHorizontal, CalendarDays, BarChart4, ClipboardCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import FormListTable from "./FormListTable";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formTypes = [
  { value: 'home_inspection_forms', label: 'แบบฟอร์มที่อยู่อาศัย' },
  { value: 'other_inspection_forms', label: 'แบบฟอร์มอื่นๆ (นอกเหนือที่อยู่อาศัย)' },
  { value: 'condo_inspection_forms', label: 'แบบฟอร์มอาคารรชุด (คอนโดมิเนียม)' },
  { value: 'ev_charger_lv_inspection', label: 'แบบฟอร์ม EV CHARGER รับไฟฟ้าแรงต่ำจาก PEA' },
  { value: 'ev_charger_hv_inspection', label: 'แบบฟอร์ม EV CHARGER รับไฟฟ้าแรงสูงจาก PEA' },
  { value: 'construction_inspection', label: 'แบบฟอร์มระบบจำหน่ายของPEA' },
];

export default function FormDashboard() {
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFormType, setSelectedFormType] = useState(formTypes[0].value);
  const [sortBy, setSortBy] = useState('created_at');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalForms, setTotalForms] = useState(0);
  const [formsToday, setFormsToday] = useState(0);
  const [formsThisWeek, setFormsThisWeek] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);

  const supabase = createClient();

  // Dashboard KPIs
  useEffect(() => {
    async function fetchDashboardStats() {
      const { count: totalCount } = await supabase
        .from('home_inspection_forms')
        .select('*', { count: 'exact', head: true });
      setTotalForms(totalCount || 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const { count: todayCount } = await supabase
        .from('home_inspection_forms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());
      setFormsToday(todayCount || 0);

      const now = new Date();
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const { count: weekCount } = await supabase
        .from('home_inspection_forms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfWeek.toISOString())
        .lt('created_at', endOfWeek.toISOString());
      setFormsThisWeek(weekCount || 0);
    }
    fetchDashboardStats();
  }, [supabase]);

  // ดึงข้อมูลฟอร์ม
  const fetchForms = useCallback(async () => {
    setIsLoading(true);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1;

    // ดึงจำนวนทั้งหมด
    let countQuery = supabase.from(selectedFormType).select('*', { count: 'exact', head: true });
    if (searchTerm) {
      countQuery = countQuery.or(`general->>inspectionNo.ilike.%${searchTerm}%,general->>customerName.ilike.%${searchTerm}%,general->>address.ilike.%${searchTerm}%`);
    }
    if (startDate) countQuery = countQuery.gte('general->>inspectionDate', startDate);
    if (endDate) countQuery = countQuery.lte('general->>inspectionDate', endDate);
    const { count: totalCount } = await countQuery;
    setTotalRecordsCount(totalCount || 0);

    // ดึงข้อมูลจริง
    let dataQuery = supabase.from(selectedFormType).select('*');
    if (searchTerm) {
      dataQuery = dataQuery.or(`general->>inspectionNo.ilike.%${searchTerm}%,general->>customerName.ilike.%${searchTerm}%,general->>address.ilike.%${searchTerm}%`);
    }
    if (startDate) dataQuery = dataQuery.gte('general->>inspectionDate', startDate);
    if (endDate) dataQuery = dataQuery.lte('general->>inspectionDate', endDate);

    let sortField = sortBy;
    if (sortBy === "fullname") sortField = "general->>customerName";
    if (sortBy === "inspectionnumber") sortField = "general->>inspectionNo";
    if (sortBy === "inspectiondate") sortField = "general->>inspectionDate";
    if (sortBy === "phasetype") sortField = "general->>systemType";
    if (sortBy === "estimatedload") sortField = "general->>load";

    const { data, error } = await dataQuery
      .order(sortField, { ascending: false })
      .range(startIndex, endIndex);

    if (error) setForms([]);
    else setForms(data || []);
    setIsLoading(false);
  }, [selectedFormType, sortBy, searchTerm, startDate, endDate, currentPage, itemsPerPage, supabase]);

  useEffect(() => { setCurrentPage(1); }, [selectedFormType, sortBy, searchTerm, startDate, endDate]);
  useEffect(() => { fetchForms(); }, [fetchForms]);

  const selectedFormLabel = formTypes.find(type => type.value === selectedFormType)?.label || '';
  const totalPages = Math.ceil(totalRecordsCount / itemsPerPage);

  // กราฟแสดงจำนวนฟอร์มแต่ละประเภท (mock: เฉพาะประเภทที่เลือก)
  const formCounts: Record<string, number> = {};
  formTypes.forEach(type => { formCounts[type.label] = 0; });
  formCounts[selectedFormLabel] = forms.length;

  const chartData = {
    labels: Object.keys(formCounts),
    datasets: [
      {
        label: 'จำนวนฟอร์ม',
        data: Object.values(formCounts),
        backgroundColor: [
          'rgba(91, 45, 144, 0.6)',
          'rgba(167, 139, 250, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(91, 45, 144, 1)',
          'rgba(167, 139, 250, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'จำนวนฟอร์มตามประเภท (ที่เลือก)' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="space-y-8 p-6 bg-gray-100 min-h-screen text-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#3a1a5b]">Operational Dashboard</h1>
          <p className="text-gray-700 mt-2 text-lg">ภาพรวมและจัดการฟอร์มการตรวจสอบระบบไฟฟ้า</p>
        </div>
        <a
          href={`/form/${selectedFormType.replace("_forms", "").replace("_inspection", "-inspection")}`}
          className="px-6 py-3 bg-[#5b2d90] text-white rounded-lg shadow-md hover:bg-[#4a2575] flex items-center gap-2 transition-all duration-200"
        >
          <FilePlus size={20} />
          สร้างฟอร์มใหม่
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">ฟอร์มทั้งหมด</p>
            <h3 className="text-4xl font-bold text-[#5b2d90] mt-2">{totalForms}</h3>
          </div>
          <ClipboardCheck size={48} className="text-[#a78bfa] opacity-60"/>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">ฟอร์มวันนี้</p>
            <h3 className="text-4xl font-bold text-[#5b2d90] mt-2">{formsToday}</h3>
          </div>
          <CalendarDays size={48} className="text-[#a78bfa] opacity-60"/>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">ฟอร์มสัปดาห์นี้</p>
            <h3 className="text-4xl font-bold text-[#5b2d90] mt-2">{formsThisWeek}</h3>
          </div>
          <BarChart4 size={48} className="text-[#a78bfa] opacity-60"/>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">ฟอร์มที่เลือก (ณ ปัจจุบัน)</p>
            <h3 className="text-4xl font-bold text-[#5b2d90] mt-2">{totalRecordsCount}</h3>
          </div>
          <ListFilter size={48} className="text-[#a78bfa] opacity-60"/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border p-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#3a1a5b] mb-4">กรองข้อมูลฟอร์ม</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="formType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ListFilter size={16}/>
                เลือกประเภทฟอร์ม
              </label>
              <select
                id="formType"
                value={selectedFormType}
                onChange={(e) => setSelectedFormType(e.target.value)}
                className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#a78bfa] focus:border-[#a78bfa] transition-all duration-150"
              >
                {formTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <SlidersHorizontal size={16}/>
                เรียงข้อมูลตาม
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#a78bfa] focus:border-[#a78bfa] transition-all duration-150"
              >
                <option value="created_at">วันที่สร้างล่าสุด</option>
                <option value="fullname">ชื่อผู้ขอใช้ไฟ</option>
                <option value="inspectionnumber">เลขที่ฟอร์ม</option>
                <option value="inspectiondate">วันที่ตรวจสอบ</option>
                <option value="phasetype">ประเภทไฟ</option>
                <option value="estimatedload">โหลดประมาณการ</option>
              </select>
            </div>
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                ค้นหา
              </label>
              <input
                type="text"
                id="search"
                placeholder="เลขที่ฟอร์ม, ชื่อ, ที่อยู่"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#a78bfa] focus:border-[#a78bfa] transition-all duration-150"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5" />
                </svg>
                วันที่ตรวจสอบ (จาก)
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#a78bfa] focus:border-[#a78bfa] transition-all duration-150"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5" />
                </svg>
                วันที่ตรวจสอบ (ถึง)
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#a78bfa] focus:border-[#a78bfa] transition-all duration-150"
              />
            </div>
            <div className='flex-1'>
              <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ListFilter size={16}/>
                รายการต่อหน้า
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="text-gray-900 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#a78bfa] focus:border-[#a78bfa] transition-all duration-150"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5b2d90] mx-auto"></div>
          <p className="mt-3 text-lg text-gray-600">กำลังโหลดข้อมูล... โปรดรอสักครู่</p>
        </div>
      ) : (
        <FormListTable forms={forms} selectedFormType={selectedFormType} formTypeLabel={selectedFormLabel} />
      )}

      {/* Pagination */}
      {totalRecordsCount > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 bg-white p-4 rounded-xl shadow-lg border mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#5b2d90] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a2575] flex items-center gap-1 transition-all duration-200"
          >
            <ChevronLeft size={20}/> ก่อนหน้า
          </button>
          <span className="text-gray-700">
            หน้า {currentPage} จาก {totalPages} ({totalRecordsCount} รายการ)
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#5b2d90] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a2575] flex items-center gap-1 transition-all duration-200"
          >
            ถัดไป <ChevronRight size={20}/>
          </button>
        </div>
      )}
    </div>
  );
}