import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";

const styles = StyleSheet.create({
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0f5c8e",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
  },
  value: {
    fontSize: 11,
    fontWeight: "bold",
  },
  divider: {
    borderBottom: "1 solid #ccc",
    marginVertical: 6,
  },
  highlight: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 8,
  },
});

const TotalReportPdf = ({ data, selectedMonth, selectedYear }) => {
  const totalOutgoing =
    data.outgoing.expenses +
    data.outgoing.inventory +
    data.outgoing.rent +
    data.outgoing.salary;

  const netBalance = data.income.received - totalOutgoing;

  const monthName = selectedMonth
    ? new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })
    : "All Months";

  return (
    <PdfTemplate showHeader={false}>
      {/* ===== TITLE ===== */}
      <View style={styles.section}>
        <Text style={styles.title}>Financial Summary Report</Text>
        <Text style={styles.label}>
          Period: {monthName} {selectedYear || ""}
        </Text>
      </View>

      {/* ===== INCOME ===== */}
      <View style={styles.section}>
        <Text style={styles.title}>Income Calculation</Text>

        <Row label="Total Billed" value={data.income.billed} />
        <Row label="Received Amount" value={data.income.received} />
        <Row
          label="Pending Amount"
          value={data.income.pending}
        />
        <Row label="Wallet Balance" value={data.income.wallet} />

        <View style={styles.divider} />

        <Text style={styles.label}>
          Pending = Billed − Received
        </Text>
      </View>

      {/* ===== EXPENSE ===== */}
      <View style={styles.section}>
        <Text style={styles.title}>Expense Calculation</Text>

        <Row label="Expenses" value={data.outgoing.expenses} />
        <Row label="Inventory" value={data.outgoing.inventory} />
        <Row label="Rent" value={data.outgoing.rent} />
        <Row label="Salary" value={data.outgoing.salary} />

        <View style={styles.divider} />

        <Row label="Total Outgoing" value={totalOutgoing} bold />
        <Text style={styles.label}>
          Total Outgoing = Expenses + Inventory + Rent + Salary
        </Text>
      </View>

      {/* ===== FINAL ===== */}
      <View style={styles.section}>
        <Text style={styles.title}>Final Result</Text>

        <Text style={styles.label}>
          Net Balance = Received − Total Outgoing
        </Text>

        <Text
          style={[
            styles.highlight,
            { color: netBalance >= 0 ? "green" : "red" },
          ]}
        >
          {netBalance >= 0 ? "PROFIT" : "LOSS"} : Rs. 
          {Math.abs(netBalance)}
        </Text>
      </View>
    </PdfTemplate>
  );
};

const Row = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, bold && { fontSize: 12 }]}>
      Rs. {value}
    </Text>
  </View>
);

export default TotalReportPdf;
