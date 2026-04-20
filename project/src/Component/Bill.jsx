import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import AllBillPdf from "./pdf/AllBillPdf";
import { exportToExcel } from "../utils/exportToExcel";
import html2pdf from "html2pdf.js";

const Bill = () => {
  const [paymentModeFilter, setPaymentModeFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");

  const [billData, setBillData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchBillData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/bill`
      );
      const result = await response.json();

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

  const filteredBills = billData.filter((bill) => {
    const serviceMatch =
      serviceTypeFilter === "All" ? true : bill.billType === serviceTypeFilter;

    const paymentModeMatch =
      paymentModeFilter === "All" ? true : bill.status === paymentModeFilter;

    const paymentStatusMatch =
      paymentStatusFilter === "All"
        ? true
        : bill.paymentStatus === paymentStatusFilter;

    if (selectedMonth && selectedYear) {
      const billDate = new Date(bill.date);
      return (
        billDate.getMonth() + 1 === Number(selectedMonth) &&
        billDate.getFullYear() === Number(selectedYear) &&
        serviceMatch &&
        paymentModeMatch &&
        paymentStatusMatch
      );
    }

    return serviceMatch && paymentModeMatch && paymentStatusMatch;
  });

  const totalExpense = filteredBills.reduce((sum, bill) => sum + bill.total, 0);

  const totalPaidAmount = filteredBills
    .filter((bill) => bill.paymentStatus === "Paid")
    .reduce((sum, bill) => sum + (bill.advancePayment ?? 0), 0);

  const totalUnpaidAmount = filteredBills
    .filter((bill) => bill.paymentStatus === "Unpaid")
    .reduce(
      (sum, bill) => sum + Math.max(0, bill.total - (bill.advancePayment ?? 0)),
      0
    );

  const monthlyExpenses = filteredBills.reduce((acc, bill) => {
    if (!bill.date) return acc;
    const d = new Date(bill.date);
    const monthYear = d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!acc[monthYear]) acc[monthYear] = 0;
    acc[monthYear] += bill.total;
    return acc;
  }, {});

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

    const totalMonthly = selectedFilteredBills
      .reduce((sum, bill) => sum + bill.total, 0)
      .toFixed(2);

    const totalYearly = Object.entries(monthlyExpenses)
      .reduce((sum, [key, value]) => {
        const [, year] = key.split(" ");
        if (Number(year) === Number(selectedYear)) {
          return sum + value;
        }
        return sum;
      }, 0)
      .toFixed(2);

    const totalMonthlyPaid = selectedFilteredBills
      .filter((bill) => bill.paymentStatus === "Paid")
      .reduce((sum, bill) => sum + (bill.advancePayment ?? 0), 0)
      .toFixed(2);

    const totalMonthlyUnpaid = selectedFilteredBills
      .filter((bill) => bill.paymentStatus === "Unpaid")
      .reduce(
        (sum, bill) =>
          sum + Math.max(0, bill.total - (bill.advancePayment ?? 0)),
        0
      )
      .toFixed(2);

    const content = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="text-align:center;">Monthly Expense Report</h2>

        <p><strong>Month:</strong> ${new Date(
          selectedYear,
          selectedMonth - 1
        ).toLocaleString("default", { month: "long" })}</p>

        <p><strong>Year:</strong> ${selectedYear}</p>
        <p><strong>Payment Mode:</strong> ${paymentModeFilter}</p>
        <p><strong>Payment Status:</strong> ${paymentStatusFilter}</p>
        <p><strong>Service Type:</strong> ${serviceTypeFilter} Service</p>

        <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; margin-top: 20px;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th>Bill No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Payment Mode</th>
              <th>Payment Status</th>
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
                            bill.date
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
                        ? `<td rowspan="${bill.items.length}">${bill.paymentStatus}</td>`
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
                `
                  )
                  .join("")
              )
              .join("")}
          </tbody>
        </table>

        <h3 style="margin-top: 30px;">Summary</h3>
        <p><strong>Total Monthly Expense:</strong> ₹${totalMonthly}</p>
        <p><strong>Total Monthly Paid Amount:</strong> ₹${totalMonthlyPaid}</p>
        <p><strong>Total Monthly Unpaid Amount:</strong> ₹${totalMonthlyUnpaid}</p>
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

  const downloadBillsExcel = () => {
    const rows = filteredBills.flatMap((bill) =>
      bill.items.map((item, index) => ({
        "Bill No": index === 0 ? bill.billNumber : "",
        Date:
          index === 0 ? new Date(bill.date).toLocaleDateString("en-IN") : "",
        Customer: index === 0 ? bill.customer : "",
        Service: index === 0 ? `${bill.billType} Service` : "",
        "Payment Mode": index === 0 ? bill.status : "",
        "Payment Status": index === 0 ? bill.paymentStatus : "",
        Item: item.name,
        Qty: item.qty,
        Price: item.price,
        Subtotal: item.qty * item.price,
        Total: index === 0 ? bill.total : "",
        Advance: index === 0 ? (bill.advancePayment ?? 0) : "",
        Balance: index === 0 ? bill.total - (bill.advancePayment ?? 0) : "",
      }))
    );

    exportToExcel({
      data: rows,
      fileName: `Bills_Report_${new Date().toISOString().slice(0, 10)}`,
      sheetName: "Bills",
    });
  };

  const downloadMonthlyBillsExcel = () => {
    if (!selectedMonth || !selectedYear) {
      return alert("Please select month and year");
    }

    const selectedFilteredBills = filteredBills.filter((bill) => {
      const date = new Date(bill.date);
      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear)
      );
    });

    const rows = selectedFilteredBills.flatMap((bill) =>
      bill.items.map((item, index) => ({
        "Bill No": index === 0 ? bill.billNumber : "",
        Date:
          index === 0 ? new Date(bill.date).toLocaleDateString("en-IN") : "",
        Customer: index === 0 ? bill.customer : "",
        Service: index === 0 ? `${bill.billType} Service` : "",
        "Payment Mode": index === 0 ? bill.status : "",
        "Payment Status": index === 0 ? bill.paymentStatus : "",
        Item: item.name,
        Qty: item.qty,
        Price: item.price,
        Subtotal: item.qty * item.price,
        Total: index === 0 ? bill.total : "",
        Advance: index === 0 ? (bill.advancePayment ?? 0) : "",
        Balance: index === 0 ? bill.total - (bill.advancePayment ?? 0) : "",
      }))
    );

    exportToExcel({
      data: rows,
      fileName: `Monthly_Bills_Report_${selectedMonth}_${selectedYear}`,
      sheetName: "Monthly Bills",
    });
  };

  return (
    <div>
      <div className="w-full flex items-start justify-around mt-3 flex-wrap">
        <div className="flex flex-col mb-6">
          <div className="space-y-6">
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

            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Payment Mode Filter
              </h3>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setPaymentModeFilter("All")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    paymentModeFilter === "All"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => setPaymentModeFilter("Cash")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    paymentModeFilter === "Cash"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cash
                </button>

                <button
                  onClick={() => setPaymentModeFilter("Online")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    paymentModeFilter === "Online"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Online
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Payment Status Filter
              </h3>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setPaymentStatusFilter("All")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    paymentStatusFilter === "All"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => setPaymentStatusFilter("Paid")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    paymentStatusFilter === "Paid"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Paid
                </button>

                <button
                  onClick={() => setPaymentStatusFilter("Unpaid")}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    paymentStatusFilter === "Unpaid"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unpaid
                </button>
              </div>
            </div>
          </div>

          <div className="text-center px-4 text-lg font-bold text-blue-800 mb-2 mt-6">
            Total Amount: ₹
            {totalExpense.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>

          <div className="text-center px-4 text-base font-semibold text-green-700">
            Paid Amount: ₹
            {totalPaidAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>

          <div className="text-center px-4 text-base font-semibold text-red-700">
            Unpaid Amount: ₹
            {totalUnpaidAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="mx-auto px-4 mb-6">
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

          <div className="mx-auto px-4 mb-6">
            <h3 className="text-xl font-semibold mb-2">Monthly Expenses:</h3>

            <div className="flex items-center gap-8">
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
                  className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-md hover:bg-green-700"
                >
                  Download Monthly Report PDF
                </button>
              )}

              {selectedMonth && selectedYear && (
                <button
                  onClick={downloadMonthlyBillsExcel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download Monthly Report Excel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 px-4 mb-4">
        <button
          onClick={downloadBillsExcel}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Download Bills Excel
        </button>

        <DownloadBillPdfButton filteredBills={filteredBills} />
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="border px-3 py-2">Bill No</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Customer</th>
              <th className="border px-3 py-2">Service</th>
              <th className="border px-3 py-2">Payment Mode</th>
              <th className="border px-3 py-2">Payment Status</th>
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
                <td colSpan="13" className="text-center py-4 text-gray-500">
                  No bills found
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) =>
                bill.items.map((item, index) => (
                  <tr key={item._id} className="text-sm hover:bg-gray-50">
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
                              ? "text-orange-600"
                              : "text-blue-600"
                          }`}
                        >
                          {bill.status}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className={`border px-3 py-2 font-semibold ${
                            bill.paymentStatus === "Paid"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {bill.paymentStatus}
                        </td>
                      </>
                    )}

                    <td className="border px-3 py-2">{item.name}</td>
                    <td className="border px-3 py-2">{item.qty}</td>
                    <td className="border px-3 py-2">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                    <td className="border px-3 py-2">
                      ₹{(item.qty * item.price).toLocaleString("en-IN")}
                    </td>

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
                          ₹{(bill.advancePayment ?? 0).toLocaleString("en-IN")}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className={`border px-3 py-2 font-bold ${
                            bill.paymentStatus === "Paid"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          ₹
                          {Math.max(
                            0,
                            bill.total - (bill.advancePayment ?? 0)
                          ).toLocaleString("en-IN")}
                        </td>
                      </>
                    )}
                  </tr>
                ))
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