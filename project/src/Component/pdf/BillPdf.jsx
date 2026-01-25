import { Text, View, StyleSheet } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";
import { useEffect } from "react";

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "bold",
  },

  /* ===== Patient Grid ===== */
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

  /* ===== Table ===== */
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  th: {
    flex: 1,
    padding: 6,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  td: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
});

const BillPdf = ({ bill, patient }) => {
  useEffect(() => {
    if (!bill || !patient) return;
  }, [bill, patient]);

  const dueAmount = Math.max(0, bill.total - bill.advancePayment);

  return (
    <PdfTemplate showHeader={false}>
      {/* ===== Patient Details ===== */}
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

      {/* ===== Billing Details ===== */}
      <View style={styles.section}>
        <Text style={styles.title}>Billing Details</Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Bill No:</Text> {bill.billNumber}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Bill Type:</Text> {bill.billType}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Date:</Text>{" "}
          {new Date(bill.date).toLocaleDateString("en-GB")}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Payment Mode:</Text> {bill.status}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Payment Status:</Text> {bill?.paymentStatus}
        </Text>
      </View>

      {/* ===== Items Table ===== */}
      <View style={[styles.section, styles.table]}>
        <View style={styles.tableRow}>
          <Text style={styles.th}>Service Name</Text>
          <Text style={styles.th}>Number Of Service</Text>
          <Text style={styles.th}>Rate</Text>
          <Text style={styles.th}>Amount</Text>
        </View>

        {bill.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.td}>{item.name}</Text>
            <Text style={styles.td}>{item.qty}</Text>
            <Text style={styles.td}>Rs. {item.price}</Text>
            <Text style={styles.td}>
              Rs. {item.qty * item.price}
            </Text>
          </View>
        ))}
      </View>

      {/* ===== Payment Summary ===== */}
      <View style={styles.section}>
        <Text style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text> Rs. {bill.total}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Total Advance Amount:</Text> Rs.{" "}
          {bill.advancePayment + bill.amountInWallet}
        </Text>

        {/* <Text style={styles.row}>
          <Text style={styles.label}>Wallet Balance:</Text> Rs.{" "}
          {bill.amountInWallet}
        </Text> */}

        <Text style={styles.row}>
          <Text style={styles.label}>
            {
              bill?.paymentStatus === "Unpaid" ? "Due Amount" : "Received Amount"
            }</Text> Rs. {dueAmount}
        </Text>

        {bill.amountInWallet > 0 && (
          <Text style={{ fontSize: 10, marginTop: 6 }}>
            * Rs. {bill.amountInWallet} has been added to wallet for future
            bills.
          </Text>
        )}
      </View>
    </PdfTemplate>
  );
};

export default BillPdf;
