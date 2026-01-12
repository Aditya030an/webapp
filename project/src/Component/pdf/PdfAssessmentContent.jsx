import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { assessmentFieldConfig } from "../showAssesmentDetails/assessmentFieldConfig";

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
  },
  value: {
    width: "60%",
  },

  table: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 10,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#eee",
  },
  // meta: {
  //   fontSize: 11,
  //   color: "#555",
  //   position: "absolute",
  //   top: 0, // ⬅️ just above footer
  //   right: 0,
  //   textAlign: "right",
  // },
  meta: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
    marginBottom: 12,
  },
});

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const PdfAssessmentContent = ({ data, assessmentType }) => {
  const fields = assessmentFieldConfig[assessmentType] || [];

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{assessmentType} Report</Text>
        <Text style={styles.meta}>
          Created On: {formatDate(data?.createdAt)}
        </Text>
      </View>

      {fields.map((field) => {
        const value = data[field.key];

        // 🔹 TABLE (Obesity)
        if (field.type === "table") {
          return (
            <View key={field.key} style={styles.section} wrap={false}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                {field.label}
              </Text>

              {!value?.length ? (
                <Text>No data available</Text>
              ) : (
                <View style={styles.table}>
                  {/* Header */}
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    {field.columns.map((col) => (
                      <Text key={col.key} style={styles.cell}>
                        {col.label}
                      </Text>
                    ))}
                  </View>

                  {/* Rows */}
                  {value.map((row, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      {field.columns.map((col) => (
                        <Text key={col.key} style={styles.cell}>
                          {col.type === "date"
                            ? formatDate(row[col.key])
                            : row[col.key] || "-"}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }

        // 🔹 NORMAL FIELD
        return (
          <View key={field.key} style={styles.row} wrap>
            <Text style={styles.label}>{field.label}</Text>
            <Text style={styles.value}>
              {field.type === "date"
                ? formatDate(value)
                : typeof value === "object"
                ? "-"
                : value || "-"}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default PdfAssessmentContent;
