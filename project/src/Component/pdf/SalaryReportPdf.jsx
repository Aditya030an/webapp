// SalaryReportPdf.jsx
import React from "react";
import { PDFDownloadLink, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate"; // your existing PdfTemplate

const SalaryReportPdf = ({ filteredEntries, selectedMonth, selectedYear, totalFiltered, paidTotal, unpaidTotal }) => {
  // Convert month number to month name
  const monthName = selectedMonth
    ? new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })
    : "All Months";

  return (
    <PDFDownloadLink
      document={
        <PdfTemplate showHeader={false}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>Salary Report</Text>
            <Text>Month: {monthName}</Text>
            <Text>Year: {selectedYear || "All Years"}</Text>
            <Text>Total Salary: Rs. {totalFiltered}</Text>
            <Text>Paid: Rs. {paidTotal}</Text>
            <Text>Unpaid: Rs. {unpaidTotal}</Text>
          </View>

          {filteredEntries.length === 0 ? (
            <Text>No salary data for this month/year.</Text>
          ) : (
            filteredEntries.map((entry) => (
              <View key={entry._id} style={{ marginBottom: 10, padding: 4, border: "1 solid #000" }}>
                <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                  Salary Sheet - {new Date(entry.createdAt).toLocaleDateString()}
                </Text>
                {entry.employees.map((emp, idx) => (
                  <View
                    key={idx}
                    style={{
                      marginBottom: 2,
                      paddingBottom: 2,
                      borderBottom: "1 solid #ccc",
                    }}
                  >
                    <Text>Name: {emp.name}</Text>
                    <Text>Role: {emp.role}</Text>
                    <Text>Month: {emp.month}</Text>
                    <Text>Salary: Rs. {emp.salary}</Text>
                    <Text>Status: {emp.paid ? "Paid" : "Unpaid"}</Text>
                  </View>
                ))}
                <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                  Total Salary: Rs. {entry.totalSalary}
                </Text>
              </View>
            ))
          )}
        </PdfTemplate>
      }
      fileName={`Salary_Report_${selectedMonth || "All"}_${selectedYear || "All"}.pdf`}
    >
      {({ loading }) => (
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Preparing PDF..." : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default SalaryReportPdf;
