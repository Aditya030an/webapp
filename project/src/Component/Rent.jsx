import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RentReportPdf from "../Component/pdf/RentReportPdf.jsx";
import { MdEdit, MdClose } from "react-icons/md";

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
  const [filteredData, setFilteredData] = useState([]);

  const [editId, setEditId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  const fetchRentData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/rent`,
      );
      const result = await response.json();
      if (result.success === true) {
        setRentData(result.data);
      }
    } catch (error) {
      console.error("Error fetching rent data:", error);
    }
  };

  useEffect(() => {
    fetchRentData();
  }, []);

  useEffect(() => {
    const filtered = rentData.filter((item) => {
      const rentMonth = new Date(item.month).getMonth() + 1;
      const rentYear = new Date(item.month).getFullYear();
      const matchMonth = selectedMonth
        ? rentMonth === Number(selectedMonth)
        : true;
      const matchYear = selectedYear ? rentYear === Number(selectedYear) : true;
      const matchStatus = selectedStatus
        ? item.status === selectedStatus
        : true;
      return matchMonth && matchYear && matchStatus;
    });
    setFilteredData(filtered);
  }, [rentData, selectedMonth, selectedYear, selectedStatus]);

  const filteredTotal = filteredData.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const paidTotal = filteredData
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const unpaidTotal = filteredData
    .filter((item) => item.status === "Unpaid")
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingTotal = filteredData
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);

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

      console.log('result' , result);

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

  const monthWiseSummary = filteredData.reduce((acc, item) => {
    const date = new Date(item.month);
    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = {
        Paid: 0,
        Unpaid: 0,
        Pending: 0,
        Total: 0, // ✅ NEW
      };
    }

    acc[monthYear][item.status] += item.amount;
    acc[monthYear].Total += item.amount; // ✅ NEW

    return acc;
  }, {});

  const grandTotals = Object.values(monthWiseSummary).reduce(
    (acc, curr) => {
      acc.Paid += curr.Paid;
      acc.Unpaid += curr.Unpaid;
      acc.Pending += curr.Pending;
      acc.Total += curr.Total;
      return acc;
    },
    { Paid: 0, Unpaid: 0, Pending: 0, Total: 0 },
  );

  const generatePDF = () => {
    const content = `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="text-align: center;">Rent Report</h2>
        <p><strong>Month:</strong> ${
          selectedMonth
            ? new Date(0, selectedMonth - 1).toLocaleString("default", {
                month: "long",
              })
            : "All Months"
        }</p>
        <p><strong>Year:</strong> ${selectedYear || "All Years"}</p>
        <p><strong>Status Filter:</strong> ${selectedStatus || "All"}</p>
        <p><strong>Total Amount:</strong> ₹${filteredTotal}</p>
        <p><strong>Total Paid:</strong> ₹${paidTotal}</p>
        <p><strong>Total Unpaid:</strong> ₹${unpaidTotal}</p>
        <p><strong>Total Pending:</strong> ₹${pendingTotal}</p>

        <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; margin-top: 20px;">
          <thead style="background: #f0f0f0;">
            <tr>
              <th>Property</th>
              <th>Month</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(
                (item) => `
                <tr>
                  <td>${item.propertyName}</td>
                  <td>${item.month}</td>
                  <td>${new Date(item.dueDate).toLocaleDateString()}</td>
                  <td>${item.status}</td>
                  <td>₹${item.amount}</td>
                  <td>${item.notes || ""}</td>
                </tr>
              `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    const options = {
      margin: 0.5,
      filename: `Rent_Report_${selectedMonth || "All"}_${
        selectedYear || "Years"
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(content).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Page Container */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Rent Management</h1>

          <PDFDownloadLink
            document={
              <RentReportPdf
                rents={filteredData}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedStatus={selectedStatus}
                totals={{
                  total: filteredTotal,
                  paid: paidTotal,
                  unpaid: unpaidTotal,
                  pending: pendingTotal,
                }}
              />
            }
            fileName={`Rent_Report_${selectedMonth || "All"}_${
              selectedYear || "Years"
            }.pdf`}
          >
            {({ loading }) => (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Preparing PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow p-6">
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
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Save Rent
            </button>
          </div>
        </div>

        {/* Month-wise Summary */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Month-wise Summary
          </h2>

          {Object.keys(monthWiseSummary).length === 0 ? (
            <p className="text-gray-500">No data available</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(monthWiseSummary).map(([month, data]) => (
                <div
                  key={month}
                  className="flex flex-wrap justify-between border-b pb-2"
                >
                  <span className="font-medium text-gray-800">{month}</span>

                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">Paid: ₹{data.Paid}</span>
                    <span className="text-red-600">Unpaid: ₹{data.Unpaid}</span>
                    <span className="text-yellow-600">
                      Pending: ₹{data.Pending}
                    </span>
                    <span className="font-semibold text-gray-800">
                      Total: ₹{data.Total} {/* ✅ NEW */}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 border-t pt-3 font-semibold flex flex-wrap gap-4">
          <span className="text-green-600">Paid: ₹{grandTotals.Paid}</span>
          <span className="text-red-600">Unpaid: ₹{grandTotals.Unpaid}</span>
          <span className="text-yellow-600">
            Pending: ₹{grandTotals.Pending}
          </span>
          <span>Total: ₹{grandTotals.Total}</span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="">All Years</option>
              {[2023, 2024, 2025, 2026].map((year) => (
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
          </div>

          <PDFDownloadLink
            document={
              <RentReportPdf
                rents={filteredData}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedStatus={selectedStatus}
                totals={{
                  total: filteredTotal,
                  paid: paidTotal,
                  unpaid: unpaidTotal,
                  pending: pendingTotal,
                }}
              />
            }
            fileName={`Rent_Report_${selectedMonth || "All"}_${
              selectedYear || "Years"
            }.pdf`}
          >
            {({ loading }) => (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Preparing PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-xl shadow p-4 text-sm md:text-base font-semibold text-gray-700 flex flex-wrap gap-4 justify-between">
          <span>Total: ₹{filteredTotal}</span>
          <span className="text-green-600">Paid: ₹{paidTotal}</span>
          <span className="text-red-600">Unpaid: ₹{unpaidTotal}</span>
          <span className="text-yellow-600">Pending: ₹{pendingTotal}</span>
        </div>

        {/* Rent Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No rent data found
            </p>
          ) : (
            filteredData.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow p-4 space-y-1"
              >
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
                          ? "text-green-600"
                          : item.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
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
                  ₹{item.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rent;
