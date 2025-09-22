import React from "react";

const inspectionSections = [
	{
		title: "1. ระบบจำหน่ายแรงสูง",
		items: [
			{ label: "1.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)" },
			{ label: "1.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์" },
			{ label: "1.3 การติดตั้งเหล็กรับสายล่อฟ้า (เหล็กฉาก , เหล็กรูปรางน้ำ)" },
			{ label: "1.4 การฝังสมอบก และประกอบยึดโยงระบบจำหน่าย" },
			{ label: "1.5 การฝังสมอบก และประกอบยึดโยงสายล่อฟ้า" },
			{ label: "1.6 การพาดสายไฟ ระยะหย่อนยาน" },
			{ label: "1.7 การพาดสายล่อฟ้า ระยะหย่อนยาน" },
			{
				label: (
					<div>
						1.8 ระยะห่าง, ความสูงของสายไฟ
						<ul className="list-disc ml-6 text-xs text-gray-600">
							<li>ข้ามถนน &gt; 6.1 ม., ข้ามทางหลวง 22 kV &gt; 7.5 ม., ข้ามทางหลวง 33 kV &gt; 9 ม.</li>
							<li>ข้ามทางรถไฟ &gt; 9 ม.</li>
							<li>ระยะห่างสายด้านข้างกับสิ่งก่อสร้างต่างๆ</li>
							<li>ระยะห่างระบบจำหน่ายแรงสูง กับสายส่ง</li>
							<li>ระยะห่างระบบจำหน่ายแรงสูง กับแรงต่ำ</li>
						</ul>
					</div>
				),
			},
			{ label: "1.9 การพันและผูกลูกถ้วย" },
			{ label: "1.10 การต่อสาย พันเทป(สายหุ้มฉนวน)" },
			{ label: "1.11 การเชื่อมสาย, สายแยก พันเทป(สายหุ้มฉนวน)" },
			{ label: "1.12 การเข้าปลายสาย" },
			{ label: "1.13 การตัดต้นไม้" },
			{ label: "1.14 การทาสีเสา" },
			{ label: "1.15 การพ่นสี หมายเลขเสา" },
			{ label: "1.16 การยึดโยง(storm guy, line guy, fix guy, etc.)" },
			{ label: "1.17 การต่อลงดิน" },
			{
				label: (
					<div>
						<span>1.17.1 ค่าความต้านทานดินต่อจุด</span>
						<input
							type="text"
							name="hv_ground_ohm"
							placeholder="(โอห์ม)"
							className="ml-2 px-2 py-1 border rounded text-sm w-24"
						/>
						<span className="ml-2">ระบบ</span>
						<input
							type="text"
							name="hv_ground_system"
							placeholder="โอห์ม"
							className="ml-2 px-2 py-1 border rounded text-sm w-24"
						/>
					</div>
				),
			},
			{ label: "1.18 การติดตั้งกับดักเสิร์จแรงสูง" },
			{
				label: (
					<div>
						1.19 อื่นๆ
						<textarea
							name="hv_other"
							className="block mt-1 w-full border rounded px-2 py-1 text-sm"
							rows={2}
						/>
					</div>
				),
			},
		],
	},
	{
		title: "2. ระบบจำหน่ายแรงต่ำ",
		items: [
			{ label: "2.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)" },
			{ label: "2.2 การติดตั้งคอน แร็ค" },
			{ label: "2.3 การฝังสมอบก และประกอบยึดโยง" },
			{ label: "2.4 การพาดสายไฟ ระยะหย่อนยาน" },
			{
				label: (
					<div>
						2.5 ระยะห่าง, ความสูงของสายไฟ
						<ul className="list-disc ml-6 text-xs text-gray-600">
							<li>ข้ามถนน &gt; 5.5 ม., ข้ามทางหลวง &gt; 6.0 ม.</li>
							<li>ข้ามทางรถไฟ &gt; 7 ม.</li>
							<li>ระยะห่างสายด้านข้างกับสิ่งก่อสร้างต่างๆ</li>
						</ul>
					</div>
				),
			},
			{ label: "2.6 การผูกสายไฟกับลูกรอกแรงต่ำ" },
			{ label: "2.7 การต่อสาย พันเทป" },
			{ label: "2.8 การเชื่อมสาย, สายแยก พันเทป" },
			{ label: "2.9 การเข้าปลายสาย พันเทป" },
			{ label: "2.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป" },
			{ label: "2.11 การทาสีเสา" },
			{ label: "2.12 การพ่นสี หมายเลขเสา" },
			{ label: "2.13 การยึดโยง(storm guy, line guy, fix guy)" },
			{ label: "2.14 การต่อลงดิน" },
			{
				label: (
					<div>
						<span>2.15 ค่าความต้านทานดินรวม</span>
						<input
							type="text"
							name="lv_ground_ohm"
							placeholder="(โอห์ม)"
							className="ml-2 px-2 py-1 border rounded text-sm w-24"
						/>
					</div>
				),
			},
			{
				label: (
					<div>
						2.16 อื่นๆ
						<textarea
							name="lv_other"
							className="block mt-1 w-full border rounded px-2 py-1 text-sm"
							rows={2}
						/>
					</div>
				),
			},
		],
	},
	{
		title: "3. การติดตั้งหม้อแปลง",
		items: [
			{
				label: (
					<div>
						<span>TR</span>
						<input
							type="text"
							name="tr_number"
							placeholder="หมายเลข"
							className="mx-2 px-2 py-1 border rounded text-sm w-16"
						/>
						<span>Ø</span>
						<input
							type="text"
							name="tr_phase"
							placeholder="เฟส"
							className="mx-2 px-2 py-1 border rounded text-sm w-10"
						/>
						<input
							type="text"
							name="tr_kva"
							placeholder="kVA"
							className="mx-2 px-2 py-1 border rounded text-sm w-16"
						/>
						<label className="ml-2">
							<input type="checkbox" name="tr_type" value="แขวนเสา" className="mr-1" />
							แขวนเสา
						</label>
						<label className="ml-2">
							<input type="checkbox" name="tr_type" value="นั่งร้าน" className="mr-1" />
							านร้าน
						</label>
					</div>
				),
			},
			{ label: "3.1 การติดตั้งหม้อแปลง (ระยะความสูง, ทิศทาง)" },
			{ label: "3.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์" },
			{ label: "3.3 การพาดสายแรงสูงเข้าหม้อแปลง และลำดับเฟส" },
			{ label: "3.4 การผูกสายไฟกับลูกถ้วย" },
			{ label: "3.5 การติดตั้งกับดักเสิร์จแรงสูง, หางปลา" },
			{ label: "3.6 การติดตั้งดร็อปเอาต์, พินเทอร์มินอล และฟิวส์ลิงก์" },
			{ label: "3.7 การติดตั้งคอนสปัน 3,200 มม. ระยะความสูง" },
			{ label: "3.8 การเข้าสายที่บุชชิ่งหม้อแปลง, หางปลา, ฉนวนครอบบุชชิ่ง" },
			{ label: "3.9 การติดตั้งสายแรงต่ำ และลำดับเฟส" },
			{ label: "3.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป" },
			{ label: "3.11 การติดตั้งคอนสำหรับ LT, LT สวิตช์ และ ฟิวส์แรงต่ำ" },
			{ label: "3.12 การติดตั้งที่จับขอบถัง, เหล็กแขวน ท่อร้อยสายแรงต่ำ" },
			{ label: "3.13 เทคอนกรีตที่คาน , โคนเสา" },
			{ label: "3.14 การต่อลงดิน" },
			{
				label: (
					<div>
						<span>- ตัวถังหม้อแปลง</span>
						<span className="ml-4">- สายกราวด์ด้านแรงสูง</span>
						<span className="ml-4">- สายกราวด์ด้านแรงต่ำ</span>
					</div>
				),
			},
			{
				label: (
					<div>
						<span>3.15 ค่าความต้านทานดินต่อจุด</span>
						<input
							type="text"
							name="tr_ground_ohm"
							placeholder="(โอห์ม)"
							className="ml-2 px-2 py-1 border rounded text-sm w-24"
						/>
						<span className="ml-2">ระบบ</span>
						<input
							type="text"
							name="tr_ground_system"
							placeholder="โอห์ม"
							className="ml-2 px-2 py-1 border rounded text-sm w-24"
						/>
					</div>
				),
			},
			{
				label: (
					<div>
						3.16 อื่นๆ
						<textarea
							name="tr_other"
							className="block mt-1 w-full border rounded px-2 py-1 text-sm"
							rows={2}
						/>
					</div>
				),
			},
		],
	},
];

const markOptions = [
	{ value: "correct", label: "✓", className: "text-green-600" },
	{ value: "fix", label: "×", className: "text-red-600" },
	{ value: "none", label: "-", className: "text-gray-600" },
];

function InspectionRow({ item, index }) {
	return (
		<tr className="text-gray-700 hover:bg-blue-50 transition">
			<td className="align-top text-center py-2">
				<select
					name={`result-${index}`}
					className="border text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 bg-white"
					aria-label="ผลการตรวจ"
				>
					<option value="">-</option>
					{markOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</td>
			<td className="text-gray-700 align-top py-2">{item.label}</td>
			<td className="align-top py-2">
				<input
					type="text"
					name={`detail-${index}`}
					placeholder="รายละเอียดที่ต้องแก้ไข"
					className="text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 w-full bg-gray-50"
					aria-label="รายละเอียดที่ต้องแก้ไข"
				/>
			</td>
			<td className="align-top py-2">
				<input
					type="text"
					name={`note-${index}`}
					placeholder="หมายเหตุ"
					className="text-gray-700 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 w-full bg-gray-50"
					aria-label="หมายเหตุ"
				/>
			</td>
		</tr>
	);
}

export default function ConstructionInspectionSection() {
	let rowIndex = 0;
	return (
		<div
			style={{ fontFamily: "sans-serif", fontSize: "1em" }}
			className="p-4 bg-white shadow-lg rounded-xl mb-8 text-gray-700"
		>
			<h2 className="text-2xl font-bold mb-4 text-blue-900">ผลการตรวจสอบงานก่อสร้าง</h2>
			<div className="mb-4 text-sm flex flex-wrap items-center gap-2">
				<span className="mr-4">
					<b>ช่องผลการตรวจ</b> ให้ทำเครื่องหมาย
				</span>
				<span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded">✓ = ถูกต้อง</span>
				<span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded">× = ต้องแก้ไข</span>
				<span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded">- = ไม่มีการตรวจ</span>
			</div>
			{inspectionSections.map((section, sIdx) => (
				<div key={section.title} className="mb-10">
					<h3 className="text-lg font-semibold mb-2 text-blue-800">{section.title}</h3>
					<div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
						<table
							border="0"
							cellPadding="0"
							cellSpacing="0"
							className="w-full border-collapse"
						>
							<thead>
								<tr className="bg-blue-50 text-blue-900">
									<th className="py-2 px-2 font-semibold border-b border-gray-200" style={{ width: 80 }}>ผลการตรวจ</th>
									<th className="py-2 px-2 font-semibold border-b border-gray-200">รายการ</th>
									<th className="py-2 px-2 font-semibold border-b border-gray-200" style={{ width: 220 }}>รายละเอียดที่ต้องแก้ไข</th>
									<th className="py-2 px-2 font-semibold border-b border-gray-200" style={{ width: 160 }}>หมายเหตุ</th>
								</tr>
							</thead>
							<tbody>
                            {section.items.map((item, i) => (
                                <InspectionRow item={item} index={rowIndex++} key={i + section.title} />
                            ))}
                            {/* ลดจำนวนช่องว่างเหลือ 2 แถว */}
                            {[...Array()].map((_, j) => (
                                <InspectionRow
                                item={{ label: "..................." }}
                                index={rowIndex++}
                                key={`blank-${sIdx}-${j}`}
                                />
                            ))}
                            </tbody>
						</table>
					</div>
				</div>
			))}
		</div>
	);
}