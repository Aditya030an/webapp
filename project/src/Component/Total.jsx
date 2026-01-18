import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

const Total = () => {
  const [categoryTotal, setCategoryTotal] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchCategoryTotal = async () => {
      try {
        const billResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/report/bill`,
        );
        const expensesResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/report/expenses`,
        );
        const inventoryResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/report/inventory`,
        );
        const rentResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/report/rent`,
        );
        const salaryResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/report/salary`,
        );

        const billData = await billResponse.json();
        const expensesData = await expensesResponse.json();
        const inventoryData = await inventoryResponse.json();
        const rentData = await rentResponse.json();
        const salaryData = await salaryResponse.json();

        const isMatch = (dateStr) => {
          const date = new Date(dateStr);
          const monthMatch = selectedMonth
            ? date.getMonth() + 1 === Number(selectedMonth)
            : true;
          const yearMatch = selectedYear
            ? date.getFullYear() === Number(selectedYear)
            : true;
          return monthMatch && yearMatch;
        };

        const billFiltered = billData.data.filter((b) => isMatch(b.date));
        const expensesFiltered = expensesData.data.filter((e) =>
          isMatch(e.date),
        );
        const inventoryFiltered = inventoryData.data.filter((i) =>
          isMatch(i.createdAt),
        );
        const rentFiltered = rentData.data.filter((r) => isMatch(r.dueDate));
        const salaryFiltered = salaryData.data.filter((s) =>
          s.employees.some((e) => {
            const [year, month] = e.month.split("-");
            const monthMatch = selectedMonth
              ? Number(month) === Number(selectedMonth)
              : true;
            const yearMatch = selectedYear
              ? Number(year) === Number(selectedYear)
              : true;
            return monthMatch && yearMatch;
          }),
        );

        const totals = {
          billTotal: billFiltered.reduce((sum, b) => sum + b.total, 0),
          totalBill: billFiltered.length,
          expensesTotal: expensesFiltered.reduce((sum, e) => sum + e.total, 0),
          totalExpenses: expensesFiltered.length,
          inventoryTotal: inventoryFiltered.reduce(
            (sum, i) => sum + i.total,
            0,
          ),
          totalInventory: inventoryFiltered.length,
          rentTotal: rentFiltered.reduce((sum, r) => sum + r.amount, 0),
          totalRent: rentFiltered.length,
          salaryTotal: salaryFiltered.reduce(
            (sum, s) => sum + s.totalSalary,
            0,
          ),
          totalSalary: salaryFiltered.length,
        };

        setCategoryTotal(totals);
      } catch (error) {
        console.error("Error fetching category total:", error);
      }
    };

    fetchCategoryTotal();
  }, [selectedMonth, selectedYear]);

  const generatePDF = () => {
    const monthName = selectedMonth
      ? new Date(0, selectedMonth - 1).toLocaleString("default", {
          month: "long",
        })
      : "All Months";
    const year = selectedYear || "All Years";
    const total =
      categoryTotal?.billTotal +
      categoryTotal?.expensesTotal +
      categoryTotal?.inventoryTotal +
      categoryTotal?.rentTotal +
      categoryTotal?.salaryTotal;

    const content = `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="text-align: center;">Overall Report</h2>
        <p><strong>Month:</strong> ${monthName}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; font-size: 12px; margin-top: 20px;">
          <thead style="background: #f0f0f0;">
            <tr><th>Category</th><th>Count</th><th>Total</th></tr>
          </thead>
          <tbody>
            <tr><td>Bills</td><td>${categoryTotal?.totalBill}</td><td>₹${categoryTotal?.billTotal}</td></tr>
            <tr><td>Expenses</td><td>${categoryTotal?.totalExpenses}</td><td>₹${categoryTotal?.expensesTotal}</td></tr>
            <tr><td>Inventory</td><td>${categoryTotal?.totalInventory}</td><td>₹${categoryTotal?.inventoryTotal}</td></tr>
            <tr><td>Rent</td><td>${categoryTotal?.totalRent}</td><td>₹${categoryTotal?.rentTotal}</td></tr>
            <tr><td>Salary</td><td>${categoryTotal?.totalSalary}</td><td>₹${categoryTotal?.salaryTotal}</td></tr>
          </tbody>
        </table>
      </div>`;

    html2pdf().from(content).save("Overall_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
      <div className="flex gap-4 px-6 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>

      <div className="pt-10 px-6 pb-10">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Total</h2>
            <span className="text-xl font-semibold text-blue-600">
              ₹
              {categoryTotal?.billTotal +
                categoryTotal?.expensesTotal +
                categoryTotal?.inventoryTotal +
                categoryTotal?.rentTotal +
                categoryTotal?.salaryTotal}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700">Bills</h3>
              <p className="text-xl font-bold text-blue-900">
                ₹{categoryTotal?.billTotal}
              </p>
              <p className="text-sm text-gray-500">
                Total Bills: {categoryTotal?.totalBill}
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-red-700">Expenses</h3>
              <p className="text-xl font-bold text-red-900">
                ₹{categoryTotal?.expensesTotal}
              </p>
              <p className="text-sm text-gray-500">
                Total Expenses: {categoryTotal?.totalExpenses}
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-green-700">
                Inventory
              </h3>
              <p className="text-xl font-bold text-green-900">
                ₹{categoryTotal?.inventoryTotal}
              </p>
              <p className="text-sm text-gray-500">
                Total Inventory: {categoryTotal?.totalInventory}
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-yellow-700">Rent</h3>
              <p className="text-xl font-bold text-yellow-900">
                ₹{categoryTotal?.rentTotal}
              </p>
              <p className="text-sm text-gray-500">
                Total Rent: {categoryTotal?.totalRent}
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-purple-700">Salary</h3>
              <p className="text-xl font-bold text-purple-900">
                ₹{categoryTotal?.salaryTotal}
              </p>
              <p className="text-sm text-gray-500">
                Total Salary: {categoryTotal?.totalSalary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Total;
