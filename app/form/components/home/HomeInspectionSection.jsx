import React from "react";

const INSPECTION_ITEMS = [
  // 2.1
  {
    label: "2.1 สายตัวนำประธานเข้าอาคาร",
    subItems: [
      {
        label: "ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502",
      },
      {
        label: "ข) ชนิดและขนาด",
        extra: (
          <div className="flex flex-wrap gap-3 mt-1 text-sm">
            <label className="inline-flex items-center">
              <input type="checkbox" name="iec01" disabled /> <span className="ml-1">IEC 01</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" name="nyy" disabled /> <span className="ml-1">NYY</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" name="cv" disabled /> <span className="ml-1">CV</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" name="other" disabled /> <span className="ml-1">อื่นๆ</span>
            </label>
            <span className="ml-2">ขนาด <input className="border w-16 px-1" disabled /> ตร.มม.</span>
          </div>
        ),
      },
      {
        label: "ค) วิธีการเดินสาย",
        subItems: [
          {
            label: "เดินสายบนลูกถ้วยฉนวนในอากาศ",
            subItems: [
              { label: "1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตรถ้ามียานพาหนะลอดผ่าน" },
              { label: "2) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" },
            ],
          },
          {
            label: "เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)",
            subItems: [
              { label: "1) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" },
            ],
          },
        ],
      },
    ],
  },
  // 2.2
  {
    label: "2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์(บริภัณฑ์ประธาน)",
    subItems: [
      { label: "ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" },
      { label: "ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์ ขนาด AT......A" },
      { label: "ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)" },
    ],
  },
  // 2.3
  {
    label: "2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์",
    subItems: [
      { label: "ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน ขนาดสายต่อหลักดิน......ตร.มม." },
      { label: "ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (หรือ 25 โอห์มในบางกรณี)" },
      { label: "ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน" },
      { label: "ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์" }
    ],
  }
];

export default function HomeInspectionSection({ data = {}, onChange = () => {} }) {

  // กำหนดค่าเริ่มต้น (ถ้าไม่เคยมี)
  const flatCheckList = [];
  INSPECTION_ITEMS.forEach(main => {
    if (main.subItems) {
      main.subItems.forEach(sub => {
        if (sub.subItems) {
          sub.subItems.forEach(subsub => flatCheckList.push(subsub.label));
        } else {
          flatCheckList.push(sub.label);
        }
      });
    } else {
      flatCheckList.push(main.label);
    }
  });

  const items = data.items && data.items.length === flatCheckList.length
    ? data.items
    : flatCheckList.map(label => ({ label, result: "", detail: "" }));

  const handleRadio = (idx, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, result: value, detail: value === "ต้องแก้ไข" ? (item.detail || "") : "" } : item
    );
    onChange("items", updated);
  };

  const handleDetail = (idx, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, detail: value } : item
    );
    onChange("items", updated);
  };

  // RCD (2.4) logic
  const rcdResult = data.rcdResult || "";
  const rcdNote = data.rcdNote || "";

  return (
    <section className="border rounded-xl p-4 bg-white mb-6">
      <h2 className="font-bold text-lg mb-4">2. การตรวจสอบ</h2>

      {/* รายการตรวจสอบ 2.1-2.3 */}
      <div className="space-y-6">
        {INSPECTION_ITEMS.map((section, sectionIdx) => (
          <div key={section.label} className="mb-4">
            <div className="font-semibold mb-2">{section.label}</div>
            {section.subItems ? section.subItems.map((sub, subIdx) => (
              sub.subItems ? (
                <div key={sub.label} className="ml-4 mb-2">
                  <div className="font-medium">{sub.label}</div>
                  {sub.subItems.map((subsub, subsubIdx) => {
                    const flatIdx = flatCheckList.findIndex(l => l === subsub.label);
                    return (
                      <CheckItemRow
                        key={subsub.label}
                        label={subsub.label}
                        idx={flatIdx}
                        value={items[flatIdx]}
                        onRadio={handleRadio}
                        onDetail={handleDetail}
                      />
                    );
                  })}
                </div>
              ) : (
                <div key={sub.label} className="ml-4 mb-2">
                  <div className="flex items-baseline gap-2">
                    <span>{sub.label}</span>
                    {sub.extra && <span>{sub.extra}</span>}
                  </div>
                  {(() => {
                    const flatIdx = flatCheckList.findIndex(l => l === sub.label);
                    return (
                      <CheckItemRow
                        label=""
                        idx={flatIdx}
                        value={items[flatIdx]}
                        onRadio={handleRadio}
                        onDetail={handleDetail}
                      />
                    );
                  })()}
                </div>
              )
            )) : (
              (() => {
                const flatIdx = flatCheckList.findIndex(l => l === section.label);
                return (
                  <CheckItemRow
                    label=""
                    idx={flatIdx}
                    value={items[flatIdx]}
                    onRadio={handleRadio}
                    onDetail={handleDetail}
                  />
                );
              })()
            )}
          </div>
        ))}
      </div>

      {/* 2.4 RCD */}
      <div className="mt-8 mb-4">
        <div className="font-semibold mb-2">2.4 เครื่องตัดไฟรั่ว (RCD)</div>
        <div className="mb-2">
          ติดตั้งเครื่องตัดไฟรั่ว ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง
        </div>
        <div className="flex flex-wrap gap-5 mb-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="rcdResult"
              value="ถูกต้อง"
              checked={rcdResult === "ถูกต้อง"}
              onChange={() => onChange("rcdResult", "ถูกต้อง")}
            />
            <span className="ml-2 text-green-700">ถูกต้อง</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="rcdResult"
              value="ไม่ติดตั้ง"
              checked={rcdResult === "ไม่ติดตั้ง"}
              onChange={() => onChange("rcdResult", "ไม่ติดตั้ง")}
            />
            <span className="ml-2 text-yellow-800">
              ไม่ประสงค์ติดตั้ง/แจ้งความเสี่ยงแล้ว
            </span>
          </label>
        </div>
        {rcdResult === "ไม่ติดตั้ง" && (
          <textarea
            className="w-full border p-2 text-sm"
            rows={2}
            placeholder="หมายเหตุ / เหตุผลที่ไม่ติดตั้ง"
            value={rcdNote}
            onChange={e => onChange("rcdNote", e.target.value)}
          />
        )}
      </div>
    </section>
  );
}

// แยก row สำหรับแต่ละรายการตรวจสอบ
function CheckItemRow({ label, idx, value = {}, onRadio, onDetail }) {
  return (
    <div className="ml-6 mb-1">
      {label && <div className="mb-1">{label}</div>}
      <div className="flex gap-4 items-center">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={`result-${idx}`}
            value="ถูกต้อง"
            checked={value.result === "ถูกต้อง"}
            onChange={() => onRadio(idx, "ถูกต้อง")}
          />
          <span className="ml-2 text-green-700">ถูกต้อง</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={`result-${idx}`}
            value="ต้องแก้ไข"
            checked={value.result === "ต้องแก้ไข"}
            onChange={() => onRadio(idx, "ต้องแก้ไข")}
          />
          <span className="ml-2 text-red-700">ต้องแก้ไข</span>
        </label>
        {value.result === "ต้องแก้ไข" && (
          <textarea
            className="ml-4 border p-1 text-sm"
            rows={1}
            style={{ minWidth: 160 }}
            placeholder="รายละเอียดการแก้ไข"
            value={value.detail || ""}
            onChange={e => onDetail(idx, e.target.value)}
          />
        )}
      </div>
    </div>
  );
}