import { Text, View, StyleSheet } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center",
  },

  meta: {
    fontSize: 11,
    marginBottom: 4,
  },

  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
  },

  headerCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#e5e7eb",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
  },

  cell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
});

const RentReportPdf = ({
  rents,
  selectedMonth,
  selectedYear,
  selectedStatus,
  totals,
}) => {
  return (
    <PdfTemplate>
      <Text style={styles.title}>Rent Report</Text>

      {/* META INFO */}
      <View>
        <Text style={styles.meta}>
          Month:{" "}
          {selectedMonth
            ? new Date(0, selectedMonth - 1).toLocaleString("default", {
                month: "long",
              })
            : "All Months"}
        </Text>
        <Text style={styles.meta}>
          Year: {selectedYear || "All Years"}
        </Text>
        <Text style={styles.meta}>
          Status: {selectedStatus || "All"}
        </Text>

        <Text style={styles.meta}>
          Total: Rs. {totals.total} | Paid: Rs. {totals.paid} | Unpaid: Rs. 
          {totals.unpaid} | Pending: Rs. {totals.pending}
        </Text>
      </View>

      {/* TABLE */}
      <View style={styles.table}>
        {/* HEADER */}
        <View style={styles.row}>
          <Text style={[styles.headerCell, { width: "20%" }]}>
            Property
          </Text>
          <Text style={[styles.headerCell, { width: "15%" }]}>
            Month
          </Text>
          <Text style={[styles.headerCell, { width: "15%" }]}>
            Due Date
          </Text>
          <Text style={[styles.headerCell, { width: "15%" }]}>
            Status
          </Text>
          <Text style={[styles.headerCell, { width: "15%" }]}>
            Amount
          </Text>
          <Text style={[styles.headerCell, { width: "20%" }]}>
            Notes
          </Text>
        </View>

        {/* ROWS */}
        {rents.map((item) => (
          <View key={item._id} style={styles.row}>
            <Text style={[styles.cell, { width: "20%" }]}>
              {item.propertyName}
            </Text>

            <Text style={[styles.cell, { width: "15%" }]}>
              {item.month}
            </Text>

            <Text style={[styles.cell, { width: "15%" }]}>
              {new Date(item.dueDate).toLocaleDateString("en-IN")}
            </Text>

            <Text style={[styles.cell, { width: "15%" }]}>
              {item.status}
            </Text>

            <Text
              style={[
                styles.cell,
                { width: "15%", textAlign: "right" },
              ]}
            >
              Rs. {item.amount}
            </Text>

            <Text style={[styles.cell, { width: "20%" }]}>
              {item.notes || "-"}
            </Text>
          </View>
        ))}
      </View>
    </PdfTemplate>
  );
};

export default RentReportPdf;
