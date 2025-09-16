"use client";

import React, { useRef } from "react";
import SignaturePad from "@/components/forms/SignaturePad";

export default function SignaturePadSection({ value = {}, onChange = () => {} }) {
  const customerRef = useRef(null);
  const officerRef = useRef(null);

  // สำหรับเคลียร์ทั้งหมด (หากต้องการจากฟอร์มแม่)
  React.useImperativeHandle(
    null,
    () => ({
      clearAll: () => {
        customerRef.current?.clear();
        officerRef.current?.clear();
      },
    }),
    []
  );

  return (
    <div className="flex flex-wrap gap-8 w-full">
      <div className="flex-1 min-w-[300px] max-w-[480px]">
        <SignaturePad
          ref={customerRef}
          title="ผู้ขอใช้ไฟฟ้าหรือผู้แทน"
          initialDataUrl={value.customerSign}
          onSave={img => onChange({ ...value, customerSign: img })}
          onClear={() => onChange({ ...value, customerSign: "" })}
        />
      </div>
      <div className="flex-1 min-w-[300px] max-w-[480px]">
        <SignaturePad
          ref={officerRef}
          title="เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค"
          initialDataUrl={value.officerSign}
          onSave={img => onChange({ ...value, officerSign: img })}
          onClear={() => onChange({ ...value, officerSign: "" })}
        />
      </div>
    </div>
  );
}