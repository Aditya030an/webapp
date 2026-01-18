import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2pdf from "html2pdf.js";


const Expenses = () => {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [expenses, setExpenses] = useState([{ description: "", amount: 0 }]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = field === "amount" ? Number(value) : value;
    setExpenses(updated);
  };

  const addExpense = () => {
    setExpenses([...expenses, { description: "", amount: 0 }]);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const [expensesData, setExpensesData] = useState([]);

  const fetchExpensesData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/expenses`
      );
      const result = await response.json();
      console.log("Expenses data:", result);
      if (result.success === true) {
        setExpensesData(result.data);
      }
    } catch (error) {
      console.error("Error fetching bill data:", error);
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  const filterExpensesByMonthYear = () => {
    let filtered = expensesData;

    if (selectedMonth || selectedYear) {
      filtered = expensesData.filter((exp) => {
        const expDate = new Date(exp.date);
        const matchesMonth = selectedMonth
          ? expDate.getMonth() + 1 === Number(selectedMonth)
          : true;
        const matchesYear = selectedYear
          ? expDate.getFullYear() === Number(selectedYear)
          : true;
        return matchesMonth && matchesYear;
      });
    }

    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    filterExpensesByMonthYear();
  }, [expensesData, selectedMonth, selectedYear]);

  const filteredTotal = filteredExpenses.reduce((sum, e) => sum + e.total, 0);

  const handleSubmit = async () => {
    const formData = {
      date,
      category,
      notes,
      expenses,
      total,
    };

    console.log("Submitting form data:", formData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("expenses saved:", result);
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

  const generatePDF = () => {
    if (!filteredExpenses.length) return alert("No data to generate PDF");

    const content = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="text-align:center;">Monthly Expense Report</h2>
    <p><strong>Month:</strong> ${
      selectedMonth
        ? new Date(0, selectedMonth - 1).toLocaleString("default", {
            month: "long",
          })
        : "All Months"
    }</p>
    <p><strong>Year:</strong> ${selectedYear || "All Years"}</p>
    <p><strong>Total Expense:</strong> ₹${filteredTotal}</p>

    <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; margin-top: 20px; font-size: 12px;">
      <thead style="background-color: #f2f2f2;">
        <tr>
          <th width="10%">Date</th>
          <th width="15%">Category</th>
          <th width="30%">Description</th>
          <th width="10%">Amount</th>
          <th width="25%">Notes</th>
          <th width="10%">Total</th>
        </tr>
      </thead>
      <tbody>
        ${filteredExpenses
          .map((expense) => {
            const itemRows = expense.expenses
              .map(
                (item, index) => `
            <tr>
              ${
                index === 0
                  ? `<td rowspan="${expense.expenses.length}">${new Date(
                      expense.date
                    ).toLocaleDateString()}</td>`
                  : ""
              }
              ${
                index === 0
                  ? `<td rowspan="${expense.expenses.length}">${expense.category}</td>`
                  : ""
              }
              <td>${item.description}</td>
              <td>₹${item.amount}</td>
              ${
                index === 0
                  ? `<td rowspan="${expense.expenses.length}">${
                      expense.notes || "-"
                    }</td>`
                  : ""
              }
              ${
                index === 0
                  ? `<td rowspan="${expense.expenses.length}">₹${expense.total}</td>`
                  : ""
              }
            </tr>
          `
              )
              .join("");
            return itemRows;
          })
          .join("")}
      </tbody>
    </table>
  </div>
  `;

    const opt = {
      margin: 0.5,
      filename: `Expense_Report_${selectedMonth || "All Months"}_${
        selectedYear || "All Years"
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(content).save();
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
        
        {/* Main Form */}
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Record Expenses
          </h2>

          {/* Expense Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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
            <div className="col-span-2">
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
            Total: ${total.toFixed(2)}
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
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Select Month
          </label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedMonth || ""}
            onChange={(e) =>
              setSelectedMonth(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Select Year
          </label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedYear || ""}
            onChange={(e) =>
              setSelectedYear(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">All Years</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="text-right text-lg font-bold text-green-700 px-4">
        Monthly Total: ₹{filteredTotal}
      </div>

      <button
        onClick={generatePDF}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Download PDF
      </button>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExpenses?.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow p-4">
            <p className="text-gray-600">No expenses found.</p>
          </div>
        ) : (
          filteredExpenses?.map((expense) => (
            <div
              key={expense._id}
              className="bg-white border border-gray-200 rounded-xl shadow p-4"
            >
              <h2 className="text-lg font-semibold text-indigo-600">
                Category: {expense.category}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                Date: {new Date(expense.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Notes:</strong>{" "}
                <span className="block text-gray-600">{expense.notes}</span>
              </p>

              <h3 className="font-semibold text-gray-800 mb-1">Expenses:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
                {expense.expenses.map((item) => (
                  <li key={item._id}>
                    {item.description} - ₹{item.amount}
                  </li>
                ))}
              </ul>

              <div className="text-right font-bold text-green-700">
                Total: ₹{expense.total}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Expenses;
