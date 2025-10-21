import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { Image } from "@react-pdf/renderer";
const hvSrc = `${process.cwd()}/public/Hv.png`;

const DiagramImage = () => <Image src={hvSrc} style={styles.diagramImage} />;

const SingleLineDiagram = () => (
  <View style={styles.diagramContainer}>
    <Text style={styles.diagramTitle}>แผนผังระบบไฟฟ้า (Single Line Diagram)</Text>
    <View style={styles.diagramBox}>
      <DiagramImage />
    </View>
  </View>
);

export default SingleLineDiagram;