import React from "react";
import { View, Text, Svg, Rect, Path } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

export const Checkbox = ({ checked = false, size = 10 }) => (
  <Svg width={size} height={size} style={{ marginRight: 4 }}>
    {/* กรอบสี่เหลี่ยม */}
    <Rect
      x="0.5"
      y="0.5"
      width={size - 1}
      height={size - 1}
      stroke="#000000"
      strokeWidth="1"
      fill={checked ? "#ffffff" : "#ffffff"}
      rx="1"
    />
    {/* เครื่องหมายถูก ✓ */}
    {checked && (
      <Path
        d={`M ${size * 0.25} ${size * 0.5} L ${size * 0.45} ${size * 0.7} L ${size * 0.75} ${size * 0.3}`}
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )}
  </Svg>
);

// Checkbox Component - แสดงทั้ง checked และ unchecked
export const CheckboxResult = ({ result, detail }) => {
  // Support both string ("ถูกต้อง"/"ต้องแก้ไข") and boolean (true/false)
  const isCorrect = result === "ถูกต้อง" || result === true;
  const isIncorrect = result === "ต้องแก้ไข" || result === false;
  
  return (
    <View style={styles.resultContainer}>
      <View style={styles.checkboxRowHorizontal}>
        <View style={styles.resultRowItem}>
          <Checkbox checked={isCorrect} size={10} />
          <Text style={[styles.resultText, { fontSize: 9 }]}>ถูกต้อง</Text>
        </View>
        <View style={styles.resultRowItem}>
          <Checkbox checked={isIncorrect} size={10} />
          <Text style={[styles.resultText, { fontSize: 9 }]}>ต้องแก้ไข</Text>
          {isIncorrect && detail && (
            <Text style={[styles.detailDots, { fontSize: 9 }]}> {detail}</Text>
          )}
        </View>
      </View>
    </View>
  );
};