import { Text, View, StyleSheet } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  meta: {
    fontSize: 11,
    marginBottom: 6,
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

const InventoryReportPdf = ({ inventory }) => {
  const grandTotal = inventory.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <PdfTemplate>
      <Text style={styles.title}>Inventory Report</Text>
      <Text style={styles.meta}>Total Inventory Value: Rs. {grandTotal}</Text>

      {/* TABLE */}
      <View style={styles.table}>
        {/* HEADER */}
        <View style={styles.row}>
          <Text style={[styles.headerCell, { width: "15%" }]}>Date</Text>
          <Text style={[styles.headerCell, { width: "35%" }]}>Item Name</Text>
          <Text style={[styles.headerCell, { width: "15%" }]}>Qty</Text>
          <Text style={[styles.headerCell, { width: "15%" }]}>Unit Price</Text>
          <Text style={[styles.headerCell, { width: "20%" }]}>Total</Text>
        </View>

        {/* ROWS */}
        {inventory.map((inv) =>
          inv.items.map((item, index) => (
            <View key={item._id} style={styles.row}>
              {/* DATE (only once) */}
              <Text style={[styles.cell, { width: "15%" }]}>
                {index === 0
                  ? new Date(inv.createdAt).toLocaleDateString("en-IN")
                  : ""}
              </Text>

              {/* ITEM NAME */}
              <Text style={[styles.cell, { width: "35%" }]}>
                {item.name}
              </Text>

              {/* QTY */}
              <Text
                style={[
                  styles.cell,
                  { width: "15%", textAlign: "center" },
                ]}
              >
                {item.quantity}
              </Text>

              {/* UNIT PRICE */}
              <Text
                style={[
                  styles.cell,
                  { width: "15%", textAlign: "right" },
                ]}
              >
                Rs. {item.unitPrice}
              </Text>

              {/* TOTAL (only once) */}
              <Text
                style={[
                  styles.cell,
                  { width: "20%", textAlign: "right" },
                ]}
              >
                {index === 0 ? `Rs. ${inv.total}` : ""}
              </Text>
            </View>
          ))
        )}
      </View>
    </PdfTemplate>
  );
};

export default InventoryReportPdf;
