// import React, { useState } from "react";

// const Rent = () => {
//   const [propertyName, setPropertyName] = useState("");
//   const [month, setMonth] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [dueDate, setDueDate] = useState("");
//   const [status, setStatus] = useState("Unpaid");
//   const [notes, setNotes] = useState("");

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Rent Payment</h2>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="text-gray-500 block mb-1">Property Name</label>
//             <input
//               type="text"
//               value={propertyName}
//               onChange={(e) => setPropertyName(e.target.value)}
//               placeholder="e.g. Clinic Building"
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//           </div>
//           <div>
//             <label className="text-gray-500 block mb-1">Month</label>
//             <input
//               type="month"
//               value={month}
//               onChange={(e) => setMonth(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//           </div>
//           <div>
//             <label className="text-gray-500 block mb-1">Amount</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(Number(e.target.value))}
//               placeholder="$0.00"
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//           </div>
//           <div>
//             <label className="text-gray-500 block mb-1">Due Date</label>
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//           </div>
//           <div className="col-span-2">
//             <label className="text-gray-500 block mb-1">Status</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded"
//             >
//               <option value="Paid">Paid</option>
//               <option value="Unpaid">Unpaid</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </div>
//           <div className="col-span-2">
//             <label className="text-gray-500 block mb-1">Notes</label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="Optional remarks..."
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4">
//           <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//             Save
//           </button>
//           <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
//             Print
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Rent;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

const categories = [
  { name: "Bill", path: "/Bill" },
  { name: "Expenses", path: "/Expenses" },
  { name: "Inventory", path: "/Inventory" },
  { name: "Rent", path: "/Rent" },
  { name: "Salary", path: "/Salary" },
  { name: "Total", path: "/Total" },
];

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

  const fetchRentData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/rent`
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
    0
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
        }
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
              `
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
    <div>
      <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
        <nav className="bg-white shadow-md px-6 py-4 mb-4 rounded-lg">
          <h1 className="text-xl font-bold text-gray-800">Report Dashboard</h1>
        </nav>

        <div className="bg-white shadow-sm px-6 py-3 rounded-lg mb-6 flex space-x-4 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="px-4 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-blue-100"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Main Card */}
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Record Rent Payment
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-500 block mb-1">Property Name</label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Clinic Building"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="$0.00"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="text-gray-500 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-gray-500 block mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional remarks..."
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
              Print
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-6 mb-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border p-2 rounded"
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
            className="border p-2 rounded"
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
            className="border p-2 rounded"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            onClick={generatePDF}
            className="ml-auto bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Download PDF
          </button>
        </div>

        <div className="text-right px-6 text-lg font-bold text-blue-800 mb-4">
          Total: ₹{filteredTotal} | Paid: ₹{paidTotal} | Unpaid: ₹{unpaidTotal}{" "}
          | Pending: ₹{pendingTotal}
        </div>

        {/* Rent Data */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-500">No data found.</p>
          ):(
          filteredData.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl shadow p-4"
            >
              <h2 className="text-lg font-semibold text-purple-600">
                Property Rent
              </h2>
              <p className="text-sm text-gray-600">
                Property: {item.propertyName}
              </p>
              <p className="text-sm text-gray-600">Month: {item.month}</p>
              <p className="text-sm text-gray-600">
                Due: {new Date(item.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`font-bold ${
                    item.status === "Unpaid"
                      ? "text-red-600"
                      : item.status === "Pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {item.status}
                </span>
              </p>
              <p className="text-sm text-gray-700 mb-2">Notes: {item.notes}</p>
              <div className="text-right font-bold text-indigo-700">
                Amount: ₹{item.amount}
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Rent;
