import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import AllBillPdf from "./pdf/AllBillPdf";
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
} from "./reports/ReportUI";

// Canonical received/paid figure for a bill.
const received = (bill) =>
  bill.paymentStatus === "Paid"
    ? bill.total || 0
    : Math.min(bill.advancePayment || 0, bill.total || 0);

const Bill = () => {
  const [paymentModeFilter, setPaymentModeFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");

  const [billData, setBillData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchReport("bill", {
          month: selectedMonth,
          year: selectedYear,
        });
        if (active) setBillData(data);
      } catch (err) {
        if (active) {
          console.error("Error fetching bill data:", err);
          setError("Failed to load bills. Please try again.");
          setBillData([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [selectedMonth, selectedYear]);

  // The data is already filtered by period server-side. Only the in-page
  // service/payment-mode/payment-status filters are applied client-side.
  const filteredBills = billData.filter((bill) => {
    const serviceMatch =
      serviceTypeFilter === "All" ? true : bill.billType === serviceTypeFilter;

    const paymentModeMatch =
      paymentModeFilter === "All" ? true : bill.status === paymentModeFilter;

    const paymentStatusMatch =
      paymentStatusFilter === "All"
        ? true
        : bill.paymentStatus === paymentStatusFilter;

    return serviceMatch && paymentModeMatch && paymentStatusMatch;
  });

  // Three reconciling figures: Total Billed = Received + Outstanding.
  const totalBilled = filteredBills.reduce(
    (sum, bill) => sum + (bill.total || 0),
    0
  );
  const totalReceived = filteredBills.reduce(
    (sum, bill) => sum + received(bill),
    0
  );
  const totalOutstanding = totalBilled - totalReceived;

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
        Received: index === 0 ? received(bill) : "",
        Outstanding: index === 0 ? (bill.total || 0) - received(bill) : "",
      }))
    );

    exportToExcel({
      data: rows,
      fileName: `Bills_Report_${new Date().toISOString().slice(0, 10)}`,
      sheetName: "Bills",
    });
  };

  const monthName = selectedMonth
    ? MONTHS.find((m) => String(m.value) === String(selectedMonth))?.label
    : "";

  const periodLabel =
    selectedMonth && selectedYear
      ? `${monthName} ${selectedYear}`
      : selectedYear
      ? `Year ${selectedYear}`
      : selectedMonth
      ? `${monthName} (all years)`
      : "All time";

  return (
    <ReportPage>
      <ReportToolbar title="Bills & Revenue" periodLabel={periodLabel}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Months</option>
          {MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Years</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button onClick={downloadBillsExcel} className={EXCEL_BTN}>
          Download Bills Excel
        </button>

        <DownloadBillPdfButton filteredBills={filteredBills} />
      </ReportToolbar>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Tile emoji="📥" label="Total Billed" value={totalBilled} tone="blue" />
        <Tile
          emoji="✅"
          label="Received"
          value={totalReceived}
          tone="emerald"
          hint="Paid bills + advances"
        />
        <Tile
          emoji="⏳"
          label="Outstanding"
          value={totalOutstanding}
          tone="amber"
          hint="Still to collect"
        />
      </div>

      <TallyLine
        text={`Received ₹${formatINR(totalReceived)} + Outstanding ₹${formatINR(
          totalOutstanding
        )} = Total Billed ₹${formatINR(totalBilled)}`}
      />

      <Card>
        <div className=" flex flox-row flex-wrap justify-between gap-4">
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
      </Card>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : filteredBills.length === 0 ? (
        <EmptyState label="No bills found for this period." />
      ) : (
        <Card className="overflow-x-auto">
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
                <th className="border px-3 py-2">Received</th>
                <th className="border px-3 py-2">Outstanding</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.map((bill) =>
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
                      ₹{formatINR(item.price)}
                    </td>
                    <td className="border px-3 py-2">
                      ₹{formatINR(item.qty * item.price)}
                    </td>

                    {index === 0 && (
                      <>
                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2 font-semibold"
                        >
                          ₹{formatINR(bill.total)}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className="border px-3 py-2 text-green-700"
                        >
                          ₹{formatINR(received(bill))}
                        </td>

                        <td
                          rowSpan={bill.items.length}
                          className={`border px-3 py-2 font-bold ${
                            bill.paymentStatus === "Paid"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          ₹{formatINR((bill.total || 0) - received(bill))}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}
    </ReportPage>
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
          className={`flex items-center gap-2 ${PDF_BTN}`}
          disabled={loading}
        >
          <FiDownload size={18} />
          {loading ? "Preparing PDF..." : "Download Bills PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
};
