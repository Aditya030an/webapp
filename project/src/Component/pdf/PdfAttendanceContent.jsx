import { View, Text, StyleSheet } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  col: {
    width: "50%",
    marginBottom: 4,
  },
  row: {
    fontSize: 11,
    marginBottom: 3,
  },
  label: {
    fontWeight: "bold",
  },
  infoRow: {
    marginBottom: 6,
  },

  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },

  tableRow: {
    flexDirection: "row",
  },

  cellHeader: {
    flex: 1,
    borderWidth: 1,
    padding: 6,
    fontWeight: "bold",
    backgroundColor: "#eee",
  },

  cell: {
    flex: 1,
    borderWidth: 1,
    padding: 6,
  },
  summaryRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },

  summaryCell: {
    flex: 1,
    borderWidth: 1,
    padding: 6,
    fontWeight: "bold",
  },
});

const PdfAttendanceContent = ({ attendance, patient }) => {
  console.log("att", attendance);
  console.log("patient", patient);
  const totalDays = attendance?.length || 0;

  const presentCount = attendance.filter(
    (item) => item?.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item?.status === "Absent"
  ).length;

  return (
    <PdfTemplate>
      <View wrap>
        <View style={styles.section}>
          <Text style={styles.title}>Patient Details</Text>

          <View style={styles.grid}>
            <View style={styles.col}>
              <Text style={styles.row}>
                <Text style={styles.label}>Patient ID:</Text>{" "}
                {patient.patientId}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.row}>
                <Text style={styles.label}>Name:</Text> {patient.name}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.row}>
                <Text style={styles.label}>Age:</Text> {patient.age}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.row}>
                <Text style={styles.label}>Gender:</Text> {patient.gender}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.row}>
                <Text style={styles.label}>Contact:</Text>{" "}
                {patient.contactNumber}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.row}>
                <Text style={styles.label}>Address:</Text> {patient.address}
              </Text>
            </View>
            <View style={{ width: "100%" }}>
              <Text style={styles.row}>
                <Text style={styles.label}>Chief Complaint:</Text>{" "}
                {patient.chiefComplaint}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.title}>Attendance Report</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <Text style={styles.cellHeader}>Date</Text>
            <Text style={styles.cellHeader}>Status</Text>
          </View>

          {/* Rows */}
          {attendance.map((item, index) => (
            <View key={index} style={styles.tableRow} wrap={false}>
              <Text style={styles.cell}>
                {new Date(item?.date).toLocaleDateString("en-IN")}
              </Text>
              <Text style={styles.cell}>{item?.status}</Text>
            </View>
          ))}

          {/* Summary Row */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryCell}>Total Days: {totalDays}</Text>
            <Text style={styles.summaryCell}>
              Present: {presentCount} | Absent: {absentCount}
            </Text>
          </View>
        </View>
      </View>
    </PdfTemplate>
  );
};

export default PdfAttendanceContent;
