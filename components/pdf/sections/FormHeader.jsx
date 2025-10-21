import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

const PEA_LOGO = "/pea_logo.png";

const FormHeader = () => (
  <View style={styles.header}>
    <Image src={PEA_LOGO} style={styles.logo} />
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
      <Text style={styles.headerSubtitle}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
    </View>
  </View>
);

export default FormHeader;