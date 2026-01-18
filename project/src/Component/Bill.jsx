import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import AllBillPdf from "./pdf/AllBillPdf";

import html2pdf from "html2pdf.js";

const Bill = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");

  const [billData, setBillData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchBillData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/bill`,
      );
      const result = await response.json();
      // console.log("Bill data:", result);
      if (result.success && result.data.length > 0) {
        setBillData(result.data);
      }
    } catch (error) {
      console.error("Error fetching bill data:", error);
    }
  };

  useEffect(() => {
    fetchBillData();
  }, []);
  console.log("billData", billData);

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
    (a, b) => new Date(a) - new Date(b),
  );

  const generatePDF = () => {
    const selectedFilteredBills = filteredBills.filter((bill) => {
      const date = new Date(bill.date);
      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear)
      );
    });

    console.log("selectedFilteredBills", selectedFilteredBills);
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
      selectedMonth - 1,
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
              ${
                idx === 0
                  ? `<td rowspan="${bill.items.length}">${bill.billNumber}</td>`
                  : ""
              }
              ${
                idx === 0
                  ? `<td rowspan="${bill.items.length}">${new Date(
                      bill.date,
                    ).toLocaleDateString()}</td>`
                  : ""
              }
              ${
                idx === 0
                  ? `<td rowspan="${bill.items.length}">${bill.customer}</td>`
                  : ""
              }
              ${
                idx === 0
                  ? `<td rowspan="${bill.items.length}">${bill.status}</td>`
                  : ""
              }
              ${
                idx === 0
                  ? `<td rowspan="${bill.items.length}">${bill.billType} Service</td>`
                  : ""
              }
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>₹${item.price}</td>
              <td>₹${(item.qty * item.price).toFixed(2)}</td>
            </tr>
          `,
              )
              .join(""),
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
      <div className="w-full flex items-start justify-around mt-3 flex-wrap">
        {/* Filter Buttons */}
        <div className="flex flex-col mb-6">
          <div className="space-y-6">
            {/* Service Type Filter */}
            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Service Type Filter
              </h3>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setServiceTypeFilter("All")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    serviceTypeFilter === "All"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Services
                </button>

                <button
                  onClick={() => setServiceTypeFilter("Home")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    serviceTypeFilter === "Home"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Home Service
                </button>

                <button
                  onClick={() => setServiceTypeFilter("Clinic")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    serviceTypeFilter === "Clinic"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Clinic Service
                </button>
              </div>
            </div>

            {/* Payment Type Filter */}
            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Payment Type Filter
              </h3>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleFilter("All")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    filterStatus === "All"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => handleFilter("Cash")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    filterStatus === "Cash"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cash
                </button>

                <button
                  onClick={() => handleFilter("Online")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    filterStatus === "Online"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Online
                </button>
              </div>
            </div>
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
            : ₹
            {totalExpense.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
                      },
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
                    .toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </p>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {sortedMonths.map((month) => (
                    <li key={month} className="text-gray-700">
                      <span className="font-medium">{month}:</span> ₹
                      {monthlyExpenses[month].toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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

      <div className="flex justify-end px-4 mb-4">
        <DownloadBillPdfButton filteredBills={filteredBills} />
      </div>

      {/* Bills Display */}

      <div className="overflow-x-auto p-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="border px-3 py-2">Bill No</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Customer</th>
              <th className="border px-3 py-2">Service</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Item</th>
              <th className="border px-3 py-2">Qty</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Subtotal</th>
              <th className="border px-3 py-2">Total</th>
              <th className="border px-3 py-2">Advance</th>
              <th className="border px-3 py-2">Balance</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-4 text-gray-500">
                  No bills found
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) =>
                bill.items.map((item, index) => (
                  <tr key={item._id} className="text-sm hover:bg-gray-50">
                    {/* Bill-level fields only on first item row */}
                    {index === 0 && (
                      <>
                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2 font-semibold"
                        >
                          {bill.billNumber}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2"
                        >
                          {new Date(bill.date).toLocaleDateString("en-GB")}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2"
                        >
                          {bill.customer}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2"
                        >
                          {bill.billType}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className={`border px-3 py-2 font-medium ${
                            bill.status === "Cash"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {bill.status}
                        </td>
                      </>
                    )}

                    {/* Item-level fields */}
                    <td className="border px-3 py-2">{item.name}</td>
                    <td className="border px-3 py-2">{item.qty}</td>
                    <td className="border px-3 py-2">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                    <td className="border px-3 py-2">
                      ₹{(item.qty * item.price).toLocaleString("en-IN")}
                    </td>

                    {/* Totals only once */}
                    {index === 0 && (
                      <>
                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2 font-semibold"
                        >
                          ₹{bill.total.toLocaleString("en-IN")}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2"
                        >
                          ₹{bill.advancePayment.toLocaleString("en-IN") || 0}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2 font-bold text-green-700"
                        >
                          ₹
                          {(
                            bill.total - (bill.advancePayment ?? 0)
                          ).toLocaleString("en-IN")}
                        </td>
                      </>
                    )}
                  </tr>
                )),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bill;

const DownloadBillPdfButton = ({ filteredBills }) => {
  if (!filteredBills || filteredBills.length === 0) return null;

  return (
    <PDFDownloadLink
      document={<AllBillPdf filteredBills={filteredBills} />}
      fileName={`Bills_Report_${new Date().toISOString().slice(0, 10)}.pdf`}
    >
      {({ loading }) => (
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-60"
          disabled={loading}
        >
          <FiDownload size={18} />
          {loading ? "Preparing PDF..." : "Download Bills PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
};
