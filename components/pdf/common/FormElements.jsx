import React from "react";
import { View, Text, Svg, Rect, Path } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

export const Checkbox = ({ checked = false, size = 12 }) => (
  <Svg width={size} height={size} style={{ marginRight: 4 }}>
    <Rect
      x="0.5"
      y="0.5"
      width={size - 1}
      height={size - 1}
      stroke="#000000"
      strokeWidth="1.2"
      fill={checked ? "#f0f0f0" : "#ffffff"}
      rx="1.5"
    />
    {checked && (
      <Path
        d={`M ${size * 0.2} ${size * 0.5} L ${size * 0.4} ${size * 0.75} L ${size * 0.8} ${size * 0.25}`}
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )}
  </Svg>
);

export const CheckboxResult = ({ result, detail }) => (
  <View style={styles.resultContainer}>
    <View style={styles.checkboxRowHorizontal}>
      <View style={styles.resultRowHorizontal}>
        <Checkbox checked={result === "ถูกต้อง"} />
        <Text style={styles.resultText}>ถูกต้อง</Text>
      </View>
      <View style={styles.resultRowHorizontal}>
        <Checkbox checked={result === "ต้องแก้ไข"} />
        <Text style={styles.resultText}>ต้องแก้ไข</Text>
        {result === "ต้องแก้ไข" && detail && (
          <Text style={styles.underlineDotted}> {detail}</Text>
        )}
      </View>
    </View>
  </View>
);