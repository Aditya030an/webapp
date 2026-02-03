import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
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
    display: "table",
    width: "auto",
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
    fontWeight: "bold",
    fontSize: 10,
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

const ExpenseReportPdf = ({ expenses, month, year, total }) => {
  return (
  
      <PdfTemplate showHeader={false}>
        <Text style={styles.title}>Expense Report</Text>

        <View style={styles.section}>
          <Text style={styles.meta}>
            Month: {month || "All Months"}
          </Text>
          <Text style={styles.meta}>
            Year: {year || "All Years"}
          </Text>
          <Text style={styles.meta}>
            Grand Total: Rs. {total}
          </Text>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          {/* HEADER */}
          <View style={styles.row}>
            <Text style={[styles.headerCell, { width: "12%" }]}>Date</Text>
            <Text style={[styles.headerCell, { width: "15%" }]}>Category</Text>
            <Text style={[styles.headerCell, { width: "30%" }]}>Description</Text>
            <Text style={[styles.headerCell, { width: "10%" }]}>Amount</Text>
            <Text style={[styles.headerCell, { width: "23%" }]}>Notes</Text>
            <Text style={[styles.headerCell, { width: "10%" }]}>Total</Text>
          </View>

          {/* ROWS */}
          {expenses.map((exp) =>
            exp.expenses.map((item, index) => (
              <View style={styles.row} key={item._id}>
                <Text style={[styles.cell, { width: "12%" }]}>
                  {index === 0
                    ? new Date(exp.date).toLocaleDateString("en-IN")
                    : ""}
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  {index === 0 ? exp.category : ""}
                </Text>
                <Text style={[styles.cell, { width: "30%" }]}>
                  {item.description}
                </Text>
                <Text style={[styles.cell, { width: "10%" }]}>
                  Rs.{item.amount}
                </Text>
                <Text style={[styles.cell, { width: "23%" }]}>
                  {index === 0 ? exp.notes || "-" : ""}
                </Text>
                <Text style={[styles.cell, { width: "10%" }]}>
                  {index === 0 ? `Rs. ${exp.total}` : ""}
                </Text>
              </View>
            ))
          )}
        </View>
      </PdfTemplate>
  
  );
};

export default ExpenseReportPdf;
