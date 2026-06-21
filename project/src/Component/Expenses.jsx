import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ExpenseReportPdf from "../Component/pdf/ExpenseReportPdf.jsx";
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

const Expenses = () => {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [expenses, setExpenses] = useState([{ description: "", amount: 0 }]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = field === "amount" ? Number(value) : value;
    setExpenses(updated);
  };

  const addExpense = () => {
    setExpenses([...expenses, { description: "", amount: 0 }]);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const fetchExpensesData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReport("expenses", {
        month: selectedMonth,
        year: selectedYear,
      });
      setExpensesData(data);
    } catch (err) {
      console.error("Error fetching expenses data:", err);
      setError("Failed to load expenses. Please try again.");
      setExpensesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const filteredTotal = expensesData.reduce(
    (sum, e) => sum + (e.total || 0),
    0,
  );

  const entriesCount = expensesData?.length || 0;

  const selectedMonthLabel = selectedMonth
    ? MONTHS.find((m) => m.value === selectedMonth)?.label || "All Months"
    : "All Months";

  const monthName = selectedMonth
    ? MONTHS.find((m) => m.value === selectedMonth)?.label
    : null;

  const periodLabel = (() => {
    if (monthName && selectedYear) return `${monthName} ${selectedYear}`;
    if (!monthName && selectedYear) return `Year ${selectedYear}`;
    if (monthName && !selectedYear) return `${monthName} (all years)`;
    return "All time";
  })();

  const handleSubmit = async () => {
    const formData = {
      date,
      category,
      notes,
      expenses,
      total,
    };

    // console.log("Submitting form data:", formData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();
      // console.log("expenses saved:", result);
      alert(result.message);
      fetchExpensesData();
      // Reset form after submission
      setDate("");
      setCategory("");
      setNotes("");
      setExpenses([{ description: "", amount: 0 }]);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit expenses");
    }
  };

  const downloadExpensesExcel = () => {
    const rows = expensesData.flatMap((expense) =>
      expense.expenses.map((item, index) => ({
        Date:
          index === 0 ? new Date(expense.date).toLocaleDateString("en-IN") : "",
        Category: index === 0 ? expense.category : "",
        Description: item.description,
        Amount: item.amount,
        Notes: index === 0 ? expense.notes || "-" : "",
        Total: index === 0 ? expense.total : "",
      })),
    );

    exportToExcel({
      data: rows,
      fileName: `Expense_Report_${selectedMonth || "All_Months"}_${selectedYear || "All_Years"}`,
      sheetName: "Expenses",
    });
  };

  return (
    <ReportPage>
      {/* Toolbar: period filters + exports */}
      <ReportToolbar title="Expenses" periodLabel={periodLabel}>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Month
          </label>
          <select
            className="border border-gray-300 p-2 rounded-lg text-sm"
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
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Year
          </label>
          <select
            className="border border-gray-300 p-2 rounded-lg text-sm"
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
        </div>

        <button onClick={downloadExpensesExcel} className={EXCEL_BTN}>
          Download Excel
        </button>

        <PDFDownloadLink
          document={
            <ExpenseReportPdf
              expenses={expensesData}
              month={selectedMonthLabel}
              year={selectedYear || "All Years"}
              total={formatINR(filteredTotal)}
            />
          }
          fileName={`Expense_Report_${selectedMonth || "All_Months"}_${selectedYear || "All_Years"}.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <button className={PDF_BTN} disabled={pdfLoading}>
              {pdfLoading ? "Preparing PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </ReportToolbar>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tile
          emoji="🧾"
          label="Total Expenses"
          value={filteredTotal}
          tone="rose"
          hint="Money spent in this period"
        />
        <Tile
          emoji="🧮"
          label="Entries"
          value={String(entriesCount)}
          isCurrency={false}
          tone="gray"
        />
      </div>

      <TallyLine
        text={`Sum of ${entriesCount} expense entr${entriesCount === 1 ? "y" : "ies"} = ₹${formatINR(filteredTotal)}`}
      />

      {/* Create expense form */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Record Expenses</h2>

        {/* Expense Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-gray-500 block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="text-gray-500 block mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Utilities, Supplies"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-500 block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional info..."
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        {/* Expense Items */}
        <table className="w-full text-left mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) =>
                      handleExpenseChange(idx, "description", e.target.value)
                    }
                    placeholder="Expense detail"
                    className="w-full border border-gray-300 p-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={expense.amount}
                    onChange={(e) =>
                      handleExpenseChange(idx, "amount", e.target.value)
                    }
                    className="w-full border border-gray-300 p-1 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addExpense}
          className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
        >
          + Add Expense
        </button>

        {/* Total */}
        <div className="text-right text-lg font-bold mt-2 mb-6">
          Total: ₹ {formatINR(total)}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button onClick={handleSubmit} className={PRIMARY_BTN}>
            Save
          </button>
        </div>
      </Card>

      {/* Expense list */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : entriesCount === 0 ? (
        <EmptyState label="No expenses found for this period." />
      ) : (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expensesData?.map((expense) => (
              <div
                key={expense._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
              >
                <h2 className="text-lg font-semibold text-indigo-600">
                  Category: {expense.category}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Date: {new Date(expense.date).toLocaleDateString("en-IN")}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Notes:</strong>{" "}
                  <span className="block text-gray-600">{expense.notes}</span>
                </p>

                <h3 className="font-semibold text-gray-800 mb-1">Expenses:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
                  {expense.expenses.map((item) => (
                    <li key={item._id}>
                      {item.description} - ₹{formatINR(item.amount)}
                    </li>
                  ))}
                </ul>

                <div className="text-right font-bold text-rose-600">
                  Total: ₹{formatINR(expense.total)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </ReportPage>
  );
};

export default Expenses;
