import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
// import logo from "../../../public/logo.jpeg"; // your logo

import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 110,
    paddingBottom: 120,
    paddingHorizontal: 40,
    fontFamily: "Roboto",
    fontSize: 11,
  },

  header: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 40,
    borderBottom: "1 solid #0f5c8e",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    width: 90,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTop: "1 solid #0f5c8e",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 9,
    color: "#555",
  },

  content: {
    marginTop: 20,
    marginBottom: 40,
  },
  signature: {
    position: "absolute",
    bottom: 80, // ⬅️ just above footer
    right: 40,
    textAlign: "right",
    fontSize: 11,
  },
});

const PdfTemplate = ({ children }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header} fixed>
          <Image src="/logo.jpeg" style={styles.logo} />
          <View>
            <Text style={{ marginBottom: 4 }}>Dr. Mayank Gupta (PT), BPT</Text>
            <Text style={{ marginBottom: 4 }}>
              Certified PNF Practitioner (IPNFA – Level 3A)
            </Text>
            <Text style={{ marginBottom: 4 }}>
              Certified in Mulligan Concept Manual Therapy (C.O.M.M.T)
            </Text>
            <Text style={{ marginBottom: 4 }}>
              Certified Pilates Instructor
            </Text>
            <Text style={{ marginBottom: 4 }}>
              Registration No.: SCH-01/DEG2/25326/2014
            </Text>
          </View>
        </View>

        {/* Dynamic Content */}
        <View style={styles.content}>{children}</View>
        {/* <View style={{ marginTop: 30 }}>
          <Text>Authorized Signature</Text>
          <Text style={{ marginTop: 25, fontWeight: "bold" }}>
            Dr. Mayank Gupta (PT)
          </Text>
        </View> */}

        {/* Signature */}
        <View style={styles.signature} fixed>
          <Text>Authorized Signature</Text>
          <Text style={{ marginTop: 25, fontWeight: "bold" }}>
            Dr. Mayank Gupta (PT)
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
          Bhawna Nager, Akhand Param Dham Near NDP'S School khandwa road indore 452020
            {/* Movement Rehab, Near NDPS School, Khandwa Road, Indore 452020 */}
          </Text>
          <Text>+91 6262 666 558 | movementrehab.in@gmail.com</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplate;
