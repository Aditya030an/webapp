// import { Link } from "react-router-dom";
// import React, { useState } from "react";

// const categories = [
//   { name: "Bill", path: "/Bill" },
//   { name: "Expenses", path: "/Expenses" },
//   { name: "Inventory", path: "/Inventory" }, // Corrected spelling from Investory to Inventory
//   { name: "Rent", path: "/Rent" },
//   { name: "Salary", path: "/Salary" },
// ];

// const Bill = () => {
//   const [billNumber, setBillNumber] = useState("");
//   const [customer, setCustomer] = useState("");
//   const [date, setDate] = useState("");
//   const [status, setStatus] = useState("Unpaid");
//   const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][field] =
//       field === "qty" || field === "price" ? Number(value) : value;
//     setItems(updatedItems);
//   };

//   const addItem = () => {
//     setItems([...items, { name: "", qty: 1, price: 0 }]);
//   };

//   const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
//       {/* Navbar */}
//       <nav className="bg-white shadow-md px-6 py-4 mb-6 rounded-lg">
//         <h1 className="text-xl font-bold text-gray-800">Report Dashboard</h1>
//       </nav>

//       {/* Category Links */}
//       <div className="bg-white shadow-sm px-6 py-3 rounded-lg mb-6 flex space-x-4 overflow-x-auto">
//         {categories.map((cat) => (
//           <Link
//             key={cat.name}
//             to={cat.path}
//             className="px-4 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-blue-100"
//           >
//             {cat.name}
//           </Link>
//         ))}
//       </div>

//       {/* Main Content */}
//       <div className="pt-32 px-6 pb-10">
//         <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">Create Bill</h2>
//             <select
//               className="px-4 py-1 rounded-full text-sm bg-gray-100 border border-gray-300"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <option value="Paid">Paid</option>
//               <option value="Unpaid">Unpaid</option>
//             </select>
//           </div>

//           {/* Bill Info Inputs */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="text-gray-500 block">Bill Number</label>
//               <input
//                 type="text"
//                 value={billNumber}
//                 onChange={(e) => setBillNumber(e.target.value)}
//                 className="w-full border border-gray-300 p-2 rounded"
//                 placeholder="e.g. INV-2025-001"
//               />
//             </div>
//             <div>
//               <label className="text-gray-500 block">Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full border border-gray-300 p-2 rounded"
//               />
//             </div>
//             <div>
//               <label className="text-gray-500 block">Customer</label>
//               <input
//                 type="text"
//                 value={customer}
//                 onChange={(e) => setCustomer(e.target.value)}
//                 className="w-full border border-gray-300 p-2 rounded"
//                 placeholder="e.g. John Doe"
//               />
//             </div>
//           </div>

//           {/* Items Table */}
//           <table className="w-full text-left mb-6">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Quantity</th>
//                 <th className="p-2">Price</th>
//                 <th className="p-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, idx) => (
//                 <tr key={idx} className="border-b">
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={item.name}
//                       onChange={(e) =>
//                         handleItemChange(idx, "name", e.target.value)
//                       }
//                       className="w-full border border-gray-300 p-1 rounded"
//                       placeholder="Service name"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       min="1"
//                       value={item.qty}
//                       onChange={(e) =>
//                         handleItemChange(idx, "qty", e.target.value)
//                       }
//                       className="w-full border border-gray-300 p-1 rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       min="0"
//                       value={item.price}
//                       onChange={(e) =>
//                         handleItemChange(idx, "price", e.target.value)
//                       }
//                       className="w-full border border-gray-300 p-1 rounded"
//                     />
//                   </td>
//                   <td className="p-2 text-gray-800">
//                     ${item.qty * item.price}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Add Item Button */}
//           <button
//             onClick={addItem}
//             className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
//           >
//             + Add Item
//           </button>

//           {/* Total */}
//           <div className="text-right text-xl font-bold mt-4">
//             Total: ${total.toFixed(2)}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 mt-6">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//               Save
//             </button>
//             <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
//               Print
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Bill;

import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { CSVLink } from "react-csv";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
const categories = [
  { name: "Bill", path: "/Bill" },
  { name: "Expenses", path: "/Expenses" },
  { name: "Inventory", path: "/Inventory" },
  { name: "Rent", path: "/Rent" },
  { name: "Salary", path: "/Salary" },
  { name: "Total", path: "/Total" },
];

const Bill = () => {
  const [billNumber, setBillNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState("");
  const [billType, setBillType] = useState("Home");
  const [status, setStatus] = useState("Cash");
  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");

  const [billData, setBillData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Ref for the bill content to be printed
  const billContentRef = useRef();

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "qty" || field === "price" ? Number(value) : value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);
  };

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Prepare CSV data
  const csvData = [
    ["Bill Number", billNumber],
    ["Customer", customer],
    ["Date", date],
    ["Status", status],
    ...items.map((item) => [
      item.name,
      item.qty,
      item.price,
      item.qty * item.price,
    ]),
    ["Total", total],
  ];

  const fetchBillData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/bill`
      );
      const result = await response.json();
      console.log("Bill data:", result);
      if (result.success && result.data.length > 0) {
        setBillData(result.data);

        // Get last bill number and increment
        const lastBill = result.data[result.data.length - 1];
        const lastBillNumber = lastBill.billNumber;
        const match = lastBillNumber.match(/(\D+)-(\d+)-(\d+)/);
        if (match) {
          const prefix = match[1];
          const year = match[2];
          const number = parseInt(match[3]) + 1;
          const newBillNumber = `${prefix}-${year}-${number
            .toString()
            .padStart(3, "0")}`;
          setBillNumber(newBillNumber);
        } else {
          setBillNumber("MOV-2025-001");
        }
      } else {
        setBillNumber("MOV-2025-001");
      }
    } catch (error) {
      console.error("Error fetching bill data:", error);
      setBillNumber("MOV-2025-001");
    }
  };

  useEffect(() => {
    fetchBillData();
  }, []);

  const handleSubmit = async () => {
    const billDataToSave = {
      billNumber,
      billType,
      customer,
      date,
      status,
      items,
      total,
    };

    console.log("inside handleSubmit", billDataToSave);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/bill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(billDataToSave),
        }
      );

      const result = await response.json();
      console.log("Bill saved:", result);
      alert(result.message);
      fetchBillData(); // Refresh after saving
      setCustomer("");
      setDate("");
      setStatus("Cash");
      setBillType("Home");
      setItems([{ name: "", qty: 1, price: 0 }]);
    } catch (error) {
      console.error("Error submitting bill:", error);
      alert("Failed to submit bill");
    }
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  // Filter bills based on status and service type
  const filteredBills = billData.filter((bill) => {
    const serviceMatch =
      serviceTypeFilter === "All" ? true : bill.billType === serviceTypeFilter;
    const paymentMatch =
      filterStatus === "All" ? true : bill.status === filterStatus;

    if (selectedMonth && selectedYear) {
      const billDate = new Date(bill.date);
      return (
        billDate.getMonth() + 1 === Number(selectedMonth) &&
        billDate.getFullYear() === Number(selectedYear) &&
        serviceMatch &&
        paymentMatch
      );
    }
    return serviceMatch && paymentMatch;
  });

  // Calculate total expense for filtered bills
  const totalExpense = filteredBills.reduce((sum, bill) => sum + bill.total, 0);

  // Calculate monthly expenses (group by month-year string)
  const monthlyExpenses = filteredBills.reduce((acc, bill) => {
    if (!bill.date) return acc;
    const d = new Date(bill.date);
    // Format like: Jan 2025
    const monthYear = d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!acc[monthYear]) acc[monthYear] = 0;
    acc[monthYear] += bill.total;
    return acc;
  }, {});

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyExpenses).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  
  const generatePDF = () => {
    const selectedFilteredBills = filteredBills.filter((bill) => {
      const date = new Date(bill.date);
      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear)
      );
    });
    
    console.log("selectedFilteredBills", selectedFilteredBills)
  const totalMonthly = selectedFilteredBills
    .reduce((sum, bill) => sum + bill.total, 0)
    .toFixed(2);

  const totalYearly = Object.entries(monthlyExpenses)
    .reduce((sum, [key, value]) => {
      const [month, year] = key.split(" ");
      if (Number(year) === Number(selectedYear)) {
        return sum + value;
      }
      return sum;
    }, 0)
    .toFixed(2);

  const content = `
  <div style="font-family: Arial, sans-serif;">
    <h2 style="text-align:center;">Monthly Expense Report</h2>
    
    <p><strong>Month:</strong> ${new Date(
      selectedYear,
      selectedMonth - 1
    ).toLocaleString("default", {
      month: "long",
    })}</p>
    
    <p><strong>Year:</strong> ${selectedYear}</p>
    <p><strong>Payment Mode:</strong> ${filterStatus}</p>
    <p><strong>Service Type:</strong> ${serviceTypeFilter} Service</p>

    <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; margin-top: 20px;">
      <thead style="background-color: #f2f2f2;">
        <tr>
          <th>Bill No</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Service Type</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${selectedFilteredBills
          .map((bill) =>
            bill.items
              .map(
                (item, idx) => `
            <tr>
              ${idx === 0 ? `<td rowspan="${bill.items.length}">${bill.billNumber}</td>` : ""}
              ${idx === 0 ? `<td rowspan="${bill.items.length}">${new Date(bill.date).toLocaleDateString()}</td>` : ""}
              ${idx === 0 ? `<td rowspan="${bill.items.length}">${bill.customer}</td>` : ""}
              ${idx === 0 ? `<td rowspan="${bill.items.length}">${bill.status}</td>` : ""}
              ${idx === 0 ? `<td rowspan="${bill.items.length}">${bill.billType} Service</td>` : ""}
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>₹${item.price}</td>
              <td>₹${(item.qty * item.price).toFixed(2)}</td>
            </tr>
          `
              )
              .join("")
          )
          .join("")}
      </tbody>
    </table>

    <h3 style="margin-top: 30px;">Summary</h3>
    <p><strong>Total Monthly Expense:</strong> ₹${totalMonthly}</p>
    <p><strong>Total Yearly Expense:</strong> ₹${totalYearly}</p>
  </div>
  `;

  const opt = {
    margin: 0.5,
    filename: `Expense_Report_${selectedMonth}_${selectedYear}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(opt).from(content).save();
};

  // Check if there are any monthly expenses to display
  const hasMonthlyExpenses = Object.keys(monthlyExpenses).length > 0;

  return (
    <div>
      <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
        {/* Navbar */}
        <nav className="bg-white shadow-md px-6 py-4 mb-6 rounded-lg">
          <h1 className="text-xl font-bold text-gray-800">Report Dashboard</h1>
        </nav>

        {/* Category Links */}
        <div className="bg-white shadow-sm px-6 py-3 rounded-lg mb-6 flex space-x-4 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat?.name}
              to={cat?.path}
              className="px-4 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-blue-100"
            >
              {cat?.name}
            </Link>
          ))}
        </div>

        <div className="flex space-x-4 items-center justify-center mb-2">
          <button
            onClick={() => setBillType("Home")}
            className={`${
              billType === "Home" ? "bg-blue-500" : "bg-gray-500"
            } text-white px-4 py-2 rounded-lg`}
          >
            Home Service
          </button>
          <button
            onClick={() => setBillType("Client")}
            className={`${
              billType === "Client" ? "bg-blue-500" : "bg-gray-500"
            } text-white px-4 py-2 rounded-lg`}
          >
            Client Service
          </button>
        </div>

        {/* Main Content */}
        <div className=" px-6 pb-10">
          <div
            ref={billContentRef}
            className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create Bill</h2>
              <select
                className="px-4 py-1 rounded-full text-sm bg-gray-100 border border-gray-300"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {/* Bill Info Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-gray-500 block">Bill Number</label>
                <input
                  type="text"
                  value={billNumber}
                  readOnly
                  onChange={(e) => setBillNumber(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g. INV-2025-001"
                />
              </div>
              <div>
                <label className="text-gray-500 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="text-gray-500 block">Customer</label>
                <input
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Item</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(idx, "name", e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 rounded"
                        placeholder="Service name"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(idx, "qty", e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(idx, "price", e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="p-2 text-gray-800">
                      ₹{(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Item Button */}
            <button
              onClick={addItem}
              className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
            >
              + Add Item
            </button>

            {/* Total */}
            <div className="text-right text-xl font-bold mt-4">
              Total: ₹{total.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 max-w-3xl mx-auto">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg">
              Download PDF
            </button>
            <CSVLink
              data={csvData}
              filename={"bill.csv"}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="w-full flex items-start justify-around mt-3 flex-wrap">
        {/* Filter Buttons */}
        <div className="flex flex-col mb-6">
          <div className="flex justify-center px-4 mb-4 space-x-2 flex-wrap">
            <button
              onClick={() => setServiceTypeFilter("All")}
              className={`px-4 py-2 rounded-md border ${
                serviceTypeFilter === "All"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } mb-2`}
            >
              All Services
            </button>
            <button
              onClick={() => setServiceTypeFilter("Home")}
              className={`px-4 py-2 rounded-md border ${
                serviceTypeFilter === "Home"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } mb-2`}
            >
              Home Service
            </button>
            <button
              onClick={() => setServiceTypeFilter("Client")}
              className={`px-4 py-2 rounded-md border ${
                serviceTypeFilter === "Client"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } mb-2`}
            >
              Client Service
            </button>
          </div>
          <div className="flex justify-center px-4 mb-4 space-x-2 flex-wrap">
            <button
              onClick={() => handleFilter("All")}
              className={`px-4 py-2 rounded-md border ${
                filterStatus === "All"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } mb-2`}
            >
              All
            </button>
            <button
              onClick={() => handleFilter("Cash")}
              className={`px-4 py-2 rounded-md border ${
                filterStatus === "Cash"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } mb-2`}
            >
              Cash
            </button>
            <button
              onClick={() => handleFilter("Online")}
              className={`px-4 py-2 rounded-md border ${
                filterStatus === "Online"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } mb-2`}
            >
              Online
            </button>
          </div>

          {/* Show total expense for filtered bills */}
          <div className="text-center px-4 text-lg font-bold text-blue-800 mb-4">
            {serviceTypeFilter === "All"
              ? "All Services"
              : `${serviceTypeFilter} Services`}{" "}
            -{" "}
            {filterStatus === "All"
              ? "All Payments"
              : `${filterStatus} Payments`}
            : ₹{totalExpense.toFixed(2)}
          </div>
        </div>

        {/* Monthly Expenses */}

        <div className=" mx-auto px-4 mb-6">
          <div className="flex gap-4 items-center mb-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, i) => (
                <option key={i} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Select Year</option>
              {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className=" mx-auto px-4 mb-6">
            <h3 className="text-xl font-semibold mb-2">Monthly Expenses:</h3>

            <div className="flex items-center gap-8 ">

            

            {selectedMonth && selectedYear ? (
              <p className="text-gray-800">
                Selected:{" "}
                <span className="font-semibold">
                  {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                    "default",
                    {
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>{" "}
                - ₹
                {Object.entries(monthlyExpenses)
                  .reduce((sum, [key, value]) => {
                    const [monthName, yearVal] = key.split(" ");
                    const date = new Date(`${monthName} 1, ${yearVal}`);
                    const monthIndex = date.getMonth() + 1;
                    if (
                      monthIndex === Number(selectedMonth) &&
                      Number(yearVal) === Number(selectedYear)
                    ) {
                      return sum + value;
                    }
                    return sum;
                  }, 0)
                  .toFixed(2)}
              </p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {sortedMonths.map((month) => (
                  <li key={month} className="text-gray-700">
                    <span className="font-medium">{month}:</span> ₹
                    {monthlyExpenses[month].toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          {selectedMonth && selectedYear && (
            <button
              onClick={generatePDF}
              className=" px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download Monthly Report PDF
            </button>
          )}
          </div>
          </div>

        </div>
      </div>

      {/* Bills Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredBills.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg font-medium">
            No bills found for the selected filters.
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill?._id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
            >
              <div className="mb-2">
                <div className="flex items-center gap-2 justify-between">
                  <h2 className="text-xl font-semibold text-blue-600">
                    {bill?.billNumber}
                  </h2>
                  <h4 className="text-md font-semibold text-gray-600">
                    {bill?.billType}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Customer: {bill?.customer}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(bill?.date).toLocaleDateString()}
                </p>
                <p
                  className={`text-md font-medium ${
                    bill.status === "Cash" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  Status: {bill.status}
                </p>
              </div>

              <div className="mb-2">
                <h3 className="font-semibold text-gray-800">Items:</h3>
                <ul className="list-disc pl-5">
                  {bill.items.map((item) => (
                    <li key={item?._id} className="text-sm text-gray-700">
                      {item?.name} - Qty: {item?.qty} × ₹{item?.price}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right font-bold text-green-700">
                Total: ₹{bill?.total.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bill;
