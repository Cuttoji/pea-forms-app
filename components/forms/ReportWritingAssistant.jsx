"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Plus } from "lucide-react";

// คำศัพท์และวลีภาษาไทยที่เข้าใจง่ายสำหรับการเขียนรายงาน
const templateCategories = [
  {
    category: "ขอบเขตการตรวจสอบ",
    description: "วลีที่ใช้อธิบายขอบเขตและข้อจำกัดในการตรวจสอบ",
    templates: [
      {
        label: "ตรวจสอบเฉพาะส่วนที่มองเห็นได้",
        text: "ตรวจสอบเฉพาะระบบไฟฟ้าในส่วนที่สามารถมองเห็นได้เท่านั้น",
      },
      {
        label: "พื้นที่เข้าถึงไม่ได้",
        text: "ไม่สามารถเข้าถึงบางพื้นที่ได้ เนื่องจากมีสิ่งกีดขวางหรือพื้นที่ปิด",
      },
      {
        label: "ตรวจตามที่ผู้ขอใช้ไฟฟ้าอนุญาต",
        text: "ตรวจสอบเฉพาะพื้นที่ที่ผู้ขอใช้ไฟฟ้าอนุญาตให้เข้าตรวจสอบ",
      },
      {
        label: "ไม่มีข้อจำกัดเพิ่มเติม",
        text: "ไม่มีข้อจำกัดในการตรวจสอบ สามารถตรวจสอบได้ครบถ้วนตามมาตรฐาน",
      },
    ],
  },
  {
    category: "ผลการตรวจสอบ",
    description: "วลีที่ใช้อธิบายผลการตรวจสอบอย่างชัดเจน",
    templates: [
      {
        label: "ติดตั้งถูกต้องตามมาตรฐาน",
        text: "ระบบไฟฟ้าติดตั้งถูกต้องตามมาตรฐานการติดตั้งไฟฟ้าสำหรับประเทศไทย",
      },
      {
        label: "ต้องแก้ไขก่อนติดตั้งมิเตอร์",
        text: "พบข้อบกพร่องที่ต้องแก้ไขให้ถูกต้องก่อนดำเนินการติดตั้งมิเตอร์ได้",
      },
      {
        label: "ติดตั้งได้ตามเงื่อนไข",
        text: "สามารถติดตั้งมิเตอร์ได้ แต่ผู้ขอใช้ไฟฟ้าต้องดำเนินการแก้ไขตามข้อกำหนด",
      },
    ],
  },
  {
    category: "ข้อเสนอแนะ",
    description: "คำแนะนำที่เป็นประโยชน์สำหรับผู้ขอใช้ไฟฟ้า",
    templates: [
      {
        label: "แนะนำติดตั้งเครื่องตัดไฟรั่ว",
        text: "แนะนำให้ติดตั้งเครื่องตัดไฟรั่ว (RCD) เพื่อความปลอดภัยในการใช้ไฟฟ้า",
      },
      {
        label: "ควรตรวจสอบระบบเป็นประจำ",
        text: "ควรตรวจสอบระบบไฟฟ้าเป็นประจำเพื่อความปลอดภัยและประสิทธิภาพ",
      },
      {
        label: "ใช้ช่างที่มีใบอนุญาต",
        text: "ควรให้ช่างไฟฟ้าที่มีใบรับรองมาตรฐานเป็นผู้ดำเนินการแก้ไข",
      },
      {
        label: "ติดต่อ กฟภ. เมื่อต้องการเพิ่มโหลด",
        text: "หากต้องการเพิ่มโหลดไฟฟ้าในอนาคต กรุณาติดต่อการไฟฟ้าส่วนภูมิภาคก่อนดำเนินการ",
      },
    ],
  },
  {
    category: "ปัญหาที่พบบ่อย",
    description: "วลีอธิบายปัญหาที่มักพบในการตรวจสอบ",
    templates: [
      {
        label: "สายไฟขนาดไม่เหมาะสม",
        text: "พบสายไฟมีขนาดไม่เหมาะสมกับโหลดที่ใช้งาน ต้องเปลี่ยนเป็นขนาดที่ถูกต้อง",
      },
      {
        label: "การต่อลงดินไม่ถูกต้อง",
        text: "การต่อสายดินไม่เป็นไปตามมาตรฐาน ต้องดำเนินการแก้ไขให้ถูกต้อง",
      },
      {
        label: "เบรกเกอร์ไม่ตรงตามขนาด",
        text: "ขนาดเบรกเกอร์ไม่สอดคล้องกับขนาดสายไฟ ต้องเปลี่ยนให้ตรงตามมาตรฐาน",
      },
      {
        label: "ความสูงของสายไม่เพียงพอ",
        text: "ความสูงของสายไฟจากพื้นไม่เป็นไปตามมาตรฐานที่กำหนด",
      },
    ],
  },
];

export default function ReportWritingAssistant({
  onSelectTemplate,
  position = "below", // "below" | "inline" 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleTemplateClick = (text) => {
    if (onSelectTemplate) {
      onSelectTemplate(text);
    }
    setIsExpanded(false);
  };

  const toggleCategory = (categoryIndex) => {
    setExpandedCategory(expandedCategory === categoryIndex ? null : categoryIndex);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="report-assistant-panel"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
      >
        <FileText size={16} />
        <span>ผู้ช่วยเขียนรายงาน</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Template Panel */}
      {isExpanded && (
        <div
          id="report-assistant-panel"
          className={`mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${
            position === "inline" ? "" : "absolute z-20 left-0 right-0 max-w-md"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
            <h3 className="text-white font-semibold text-sm">
              📝 ผู้ช่วยเขียนรายงาน
            </h3>
            <p className="text-purple-100 text-xs mt-1">
              เลือกวลีที่เข้าใจง่ายเพื่อเพิ่มลงในรายงาน
            </p>
          </div>

          {/* Categories */}
          <div className="max-h-80 overflow-y-auto">
            {templateCategories.map((cat, catIndex) => (
              <div key={cat.category} className="border-b border-gray-100 last:border-b-0">
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(catIndex)}
                  aria-expanded={expandedCategory === catIndex}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="font-medium text-gray-800 text-sm">
                      {cat.category}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedCategory === catIndex ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Templates */}
                {expandedCategory === catIndex && (
                  <div className="px-2 pb-2 space-y-1">
                    {cat.templates.map((template, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleTemplateClick(template.text)}
                        className="w-full flex items-start gap-2 px-3 py-2 text-left bg-gray-50 hover:bg-purple-50 rounded-md transition-colors group"
                      >
                        <Plus
                          size={14}
                          className="text-purple-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-medium text-purple-700 mb-0.5">
                            {template.label}
                          </span>
                          <span className="block text-xs text-gray-600 leading-relaxed">
                            {template.text}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              💡 คลิกวลีเพื่อเพิ่มลงในช่องกรอกข้อมูล
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
