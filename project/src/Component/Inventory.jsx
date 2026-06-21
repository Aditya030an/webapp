import { useState, useEffect } from "react";
import InventoryReportPdf from "./pdf/InventoryReportPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
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

const Inventory = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [items, setItems] = useState([
    { name: "", date: currentDate, quantity: 0, unitPrice: 0 },
  ]);
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] =
      field === "quantity" || field === "unitPrice" ? Number(value) : value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", date: currentDate, quantity: 0, unitPrice: 0 },
    ]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const fetchInventoryData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReport("inventory", {
        month: selectedMonth,
        year: selectedYear,
      });
      setInventoryData(data);
    } catch (err) {
      console.error("Error fetching Inventory data:", err);
      setError("Failed to load inventory records. Please try again.");
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const handleSubmit = async () => {
    const formData = {
      items,
      total,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/inventory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const result = await response.json();
      alert(result.message);
      fetchInventoryData();
      setItems([{ name: "", date: currentDate, quantity: 0, unitPrice: 0 }]);
    } catch (err) {
      console.error("Error submitting inventory:", err);
      alert("Failed to submit inventory");
    }
  };

  const filteredTotal = inventoryData.reduce(
    (sum, entry) => sum + entry.total,
    0,
  );

  const monthName = selectedMonth
    ? MONTHS.find((m) => m.value === selectedMonth)?.label
    : null;
  let periodLabel = "All time";
  if (selectedMonth && selectedYear) {
    periodLabel = `${monthName} ${selectedYear}`;
  } else if (selectedYear) {
    periodLabel = `Year ${selectedYear}`;
  } else if (selectedMonth) {
    periodLabel = `${monthName} (all years)`;
  }

  const entryCount = inventoryData.length;

  const downloadInventoryExcel = () => {
    const rows = inventoryData.flatMap((entry) =>
      entry.items.map((item, index) => ({
        Date:
          index === 0
            ? new Date(entry.createdAt).toLocaleDateString("en-IN")
            : "",
        "Item Name": item.name,
        Qty: item.quantity,
        "Unit Price": item.unitPrice,
        Subtotal: item.quantity * item.unitPrice,
        "Entry Total": index === 0 ? entry.total : "",
      })),
    );

    exportToExcel({
      data: rows,
      fileName: `Inventory_Report_${selectedMonth || "All_Months"}_${selectedYear || "All_Years"}`,
      sheetName: "Inventory",
    });
  };

  return (
    <ReportPage>
      <ReportToolbar title="Inventory" periodLabel={periodLabel}>
        <select
          className="border p-2 rounded text-sm"
          value={selectedMonth || ""}
          onChange={(e) =>
            setSelectedMonth(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All Months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded text-sm"
          value={selectedYear || ""}
          onChange={(e) =>
            setSelectedYear(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All Years</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button onClick={downloadInventoryExcel} className={EXCEL_BTN}>
          Download Excel
        </button>

        <PDFDownloadLink
          document={<InventoryReportPdf inventory={inventoryData} />}
          fileName={`Inventory_Report_${selectedMonth || "All_Month"}_${selectedYear || "All_Year"}.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <button className={PDF_BTN}>
              {pdfLoading ? "Preparing PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </ReportToolbar>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tile
          emoji="📦"
          label="Inventory Value"
          value={filteredTotal}
          tone="rose"
          hint="Total cost in this period"
        />
        <Tile
          emoji="🧮"
          label="Entries"
          value={String(entryCount)}
          isCurrency={false}
          tone="gray"
        />
      </div>

      <Card>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Add Inventory Purchase
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Item Name</th>
                <th className="p-2">Date</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit Price</th>
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
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) =>
                        handleItemChange(idx, "date", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(idx, "unitPrice", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    ₹{formatINR(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addItem}
          className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
        >
          + Add Item
        </button>

        <div className="text-right text-lg font-bold mb-6">
          Inventory Value: ₹{formatINR(total)}
        </div>

        <div className="flex justify-end">
          <button onClick={handleSubmit} className={PRIMARY_BTN}>
            Save
          </button>
        </div>
      </Card>

      {loading && <Loading />}

      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && inventoryData.length === 0 && (
        <EmptyState label="No inventory records for this period." />
      )}

      {!loading && !error && inventoryData.length > 0 && (
        <Card>
          <TallyLine
            text={`Sum of ${entryCount} entr${entryCount === 1 ? "y" : "ies"} = ₹${formatINR(filteredTotal)}`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {inventoryData.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
              >
                <h2 className="text-lg font-semibold text-indigo-600">
                  Purchase Details
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
                <h3 className="font-semibold text-gray-800 mb-1">Items:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
                  {order.items.map((item) => (
                    <li key={item._id} className="mb-2">
                      <div>
                        {item.name} - {item.quantity} pcs × ₹{item.unitPrice}
                      </div>

                      <div className="text-xs text-gray-500">
                        Date:{" "}
                        {item?.date
                          ? new Date(item.date).toLocaleDateString("en-IN")
                          : new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="text-right font-bold text-green-700">
                  Total: ₹{formatINR(order.total)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </ReportPage>
  );
};

export default Inventory;
