import { useState, useEffect, useCallback } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RentReportPdf from "../Component/pdf/RentReportPdf.jsx";
import { MdEdit, MdClose } from "react-icons/md";
import { exportToExcel } from "../utils/exportToExcel";
import { fetchReport, MONTHS, YEARS, formatINR } from "../utils/reportFetch";
import {
  ReportPage,
  Card,
  ReportToolbar,
  Tile,
  TallyLine,
  Loading,
  ErrorState,
  EmptyState,
  EXCEL_BTN,
  PDF_BTN,
  PRIMARY_BTN,
} from "./reports/ReportUI";

const Rent = () => {
  const [propertyName, setPropertyName] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Unpaid");
  const [notes, setNotes] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [rentData, setRentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  // Data is already filtered server-side by the selected period (dueDate based).
  const fetchRentData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReport("rent", {
        month: selectedMonth,
        year: selectedYear,
      });
      setRentData(data);
    } catch (err) {
      console.error("Error fetching rent data:", err);
      setError("Failed to load rent data. Please try again.");
      setRentData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchRentData();
  }, [fetchRentData]);

  // Only status filtering remains client-side; period filtering is server-side.
  const displayedData = selectedStatus
    ? rentData.filter((item) => item.status === selectedStatus)
    : rentData;

  const totalAmount = displayedData.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const paidTotal = displayedData
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const unpaidTotal = displayedData
    .filter((item) => item.status === "Unpaid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const pendingTotal = displayedData
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { propertyName, month, amount, dueDate, status, notes };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/rent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const result = await response.json();
      alert(result.message);
      fetchRentData();
      setPropertyName("");
      setMonth("");
      setAmount(0);
      setDueDate("");
      setStatus("Unpaid");
      setNotes("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    console.log(id, newStatus);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/rent/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();

      console.log("result", result);

      if (result.success) {
        fetchRentData(); // refresh
        setEditId(null);
        setUpdateStatus(null);
      } else {
        alert(result.message);
        setEditId(null);
        setUpdateStatus(null);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // Derived from the already-filtered data using the real dueDate field
  // (not the free-text `month` string).
  const monthWiseSummary = displayedData.reduce((acc, item) => {
    const date = new Date(item.dueDate);
    const monthYear = isNaN(date.getTime())
      ? "Unknown"
      : date.toLocaleString("default", { month: "short", year: "numeric" });

    if (!acc[monthYear]) {
      acc[monthYear] = { Paid: 0, Unpaid: 0, Pending: 0, Total: 0 };
    }

    const value = Number(item.amount || 0);
    if (acc[monthYear][item.status] !== undefined) {
      acc[monthYear][item.status] += value;
    }
    acc[monthYear].Total += value;

    return acc;
  }, {});

  const downloadRentExcel = () => {
    const rows = displayedData.map((item) => ({
      Property: item.propertyName,
      Month: item.month,
      "Due Date": new Date(item.dueDate).toLocaleDateString("en-IN"),
      Status: item.status,
      Amount: Number(item.amount || 0),
      Notes: item.notes || "-",
    }));

    exportToExcel({
      data: rows,
      fileName: `Rent_Report_${selectedMonth || "All"}_${selectedYear || "All_Years"}`,
      sheetName: "Rent",
    });
  };

  const rentPdfDocument = (
    <RentReportPdf
      rents={displayedData}
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
      selectedStatus={selectedStatus}
      totals={{
        total: totalAmount,
        paid: paidTotal,
        unpaid: unpaidTotal,
        pending: pendingTotal,
      }}
    />
  );

  const pdfFileName = `Rent_Report_${selectedMonth || "All"}_${
    selectedYear || "Years"
  }.pdf`;

  // Plain-language label of the active period for the toolbar.
  const monthName = selectedMonth
    ? MONTHS.find((m) => String(m.value) === String(selectedMonth))?.label
    : "";
  const periodLabel = selectedMonth
    ? selectedYear
      ? `${monthName} ${selectedYear}`
      : `${monthName} (all years)`
    : selectedYear
      ? `Year ${selectedYear}`
      : "All time";

  return (
    <ReportPage>
      {/* Toolbar: title + period + filters + exports */}
      <ReportToolbar title="Rent" periodLabel={periodLabel}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="input w-full sm:w-auto"
        >
          <option value="">All Months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="input w-full sm:w-auto"
        >
          <option value="">All Years</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input w-full sm:w-auto"
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Pending">Pending</option>
        </select>

        <button onClick={downloadRentExcel} className={EXCEL_BTN}>
          Download Excel
        </button>

        <PDFDownloadLink document={rentPdfDocument} fileName={pdfFileName}>
          {({ loading: pdfLoading }) => (
            <button className={PDF_BTN} disabled={pdfLoading}>
              {pdfLoading ? "Preparing PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </ReportToolbar>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile emoji="🏠" label="Total Rent" value={totalAmount} tone="gray" />
        <Tile emoji="✅" label="Paid" value={paidTotal} tone="emerald" />
        <Tile emoji="❌" label="Unpaid" value={unpaidTotal} tone="rose" />
        <Tile emoji="⌛" label="Pending" value={pendingTotal} tone="amber" />
      </div>

      <TallyLine
        text={`Paid ₹${formatINR(paidTotal)} + Unpaid ₹${formatINR(
          unpaidTotal,
        )} + Pending ₹${formatINR(pendingTotal)} = Total ₹${formatINR(
          totalAmount,
        )}`}
      />

      {/* Form Card */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Record Rent Payment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Property Name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              className="input"
            />

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input"
            />

            <input
              type="number"
              placeholder="Amount"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input md:col-span-2"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
            </select>

            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input md:col-span-2"
            />
          </div>

        <div className="flex justify-end mt-4">
          <button onClick={handleSubmit} className={PRIMARY_BTN}>
            Save Rent
          </button>
        </div>
      </Card>

      {/* Month-wise Summary */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Month-wise Summary
        </h2>

        {Object.keys(monthWiseSummary).length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(monthWiseSummary).map(([label, data]) => (
              <div
                key={label}
                className="flex flex-wrap justify-between border-b pb-2"
              >
                <span className="font-medium text-gray-800">{label}</span>

                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-600">
                    Paid: ₹{formatINR(data.Paid)}
                  </span>
                  <span className="text-rose-600">
                    Unpaid: ₹{formatINR(data.Unpaid)}
                  </span>
                  <span className="text-amber-600">
                    Pending: ₹{formatINR(data.Pending)}
                  </span>
                  <span className="font-semibold text-gray-800">
                    Total: ₹{formatINR(data.Total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Rent Cards */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : displayedData.length === 0 ? (
        <EmptyState label="No rent records for this period." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedData.map((item) => (
            <Card key={item._id} className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-indigo-600">
                  {item.propertyName}
                </h3>
                <button
                  onClick={() => {
                    setEditId(editId === item._id ? null : item._id);
                    setUpdateStatus(item?.status);
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  {editId === item._id ? (
                    <MdClose size={18} className="text-red-500" />
                  ) : (
                    <MdEdit size={18} className="text-blue-500" />
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-600">Month: {item.month}</p>

              <p className="text-sm text-gray-600">
                Due: {new Date(item.dueDate).toLocaleDateString()}
              </p>
              {editId === item._id ? (
                <div className="text-sm">
                  Status:
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="ml-2 border px-2 py-1 rounded"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <button
                    disabled={updateStatus === item.status}
                    onClick={() => handleStatusUpdate(item._id, updateStatus)}
                    className={`px-2 py-1 rounded text-xs ml-2 ${
                      updateStatus === item.status
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    OK
                  </button>
                </div>
              ) : (
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      item.status === "Paid"
                        ? "text-emerald-600"
                        : item.status === "Pending"
                          ? "text-amber-600"
                          : "text-rose-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </p>
              )}

              {item.notes && (
                <p className="text-sm text-gray-500">Notes: {item.notes}</p>
              )}

              <div className="text-right font-bold text-gray-800 pt-2">
                ₹{formatINR(item.amount)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </ReportPage>
  );
};

export default Rent;
