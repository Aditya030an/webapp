import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";


const Salary = () => {
  const [employees, setEmployees] = useState([
    { name: "", role: "", month: "", salary: 0, paid: false },
  ]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");


  const handleChange = (index, field, value) => {
    const updated = [...employees];
    updated[index][field] =
      field === "salary"
        ? Number(value)
        : field === "paid"
        ? value === "true"
        : value;
    setEmployees(updated);
  };

  const addEmployee = () => {
    
    setEmployees([
      ...employees,
      { name: "", role: "", month: "", salary: 0, paid: false },
    ]);
  };

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  const [salaryData, setSalaryData] = useState([]);

  const fetchSalaryData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/salary`
      );
      const result = await response.json();
      console.log("salary data:", result);
      if (result.success === true) {
        setSalaryData(result.data);
      }
    } catch (error) {
      console.error("Error fetching salary data:", error);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const handleSubmit = async () => {
    const salaryData = {
      employees,
      totalSalary,
    };

    console.log("salaryData", salaryData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/salary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(salaryData),
        }
      );

      const result = await response.json();
      console.log("salary", result);
      fetchSalaryData();
      alert(result.message || "Salary report saved successfully!");
      setEmployees([{ name: "", role: "", month: "", salary: 0, paid: false }]);
    } catch (error) {
      console.error(error);
      alert("Error saving salary report. Please try again later.");
    }
  };

  const filteredEntries = salaryData.filter((entry) => {
    return entry.employees.some((emp) => {
      const [yr, mo] = emp.month.split("-");
      const matchMonth = selectedMonth
        ? Number(mo) === Number(selectedMonth)
        : true;
      const matchYear = selectedYear
        ? Number(yr) === Number(selectedYear)
        : true;
      return matchMonth && matchYear;
    });
  });

  const totalFiltered = filteredEntries.reduce(
    (sum, entry) => sum + entry.totalSalary,
    0
  );
  const paidTotal = filteredEntries.reduce(
    (sum, entry) =>
      sum +
      entry.employees.filter((e) => e.paid).reduce((s, e) => s + e.salary, 0),
    0
  );
  const unpaidTotal = filteredEntries.reduce(
    (sum, entry) =>
      sum +
      entry.employees.filter((e) => !e.paid).reduce((s, e) => s + e.salary, 0),
    0
  );

  const generatePDF = () => {
    const content = `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="text-align: center;">Salary Report</h2>
      <p><strong>Month:</strong> ${
  selectedMonth
    ? new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })
    : "All Months"
}</p>
        <p><strong>Year:</strong> ${selectedYear || "All Years"}</p>
        <p><strong>Total Salary:</strong> ₹${totalFiltered}</p>
        <p><strong>Paid:</strong> ₹${paidTotal}</p>
        <p><strong>Unpaid:</strong> ₹${unpaidTotal}</p>
        <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; font-size: 12px; margin-top: 20px;">
          <thead style="background: #f0f0f0;">
            <tr>
              <th>Name</th><th>Role</th><th>Month</th><th>Salary</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEntries
              .map((entry) =>
                entry.employees
                  .map(
                    (emp) => `
              <tr>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>${emp.month}</td>
                <td>₹${emp.salary}</td>
                <td>${emp.paid ? "Paid" : "Unpaid"}</td>
              </tr>
            `
                  )
                  .join("")
              )
              .join("")}
          </tbody>
        </table>
      </div>`;

    html2pdf().from(content).save("Salary_Report.pdf");
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">
        {/* Salary Form */}
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Salary Management
          </h2>

          <table className="w-full text-left mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Employee Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Month</th>
                <th className="p-2">Salary</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">
                    <input
                      type="text"
                      value={emp.name}
                      onChange={(e) =>
                        handleChange(idx, "name", e.target.value)
                      }
                      placeholder="Employee name"
                      className="w-full border border-gray-300 p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={emp.role}
                      onChange={(e) =>
                        handleChange(idx, "role", e.target.value)
                      }
                      placeholder="e.g. Therapist"
                      className="w-full border border-gray-300 p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="month"
                      value={emp.month}
                      onChange={(e) =>
                        handleChange(idx, "month", e.target.value)
                      }
                      className="w-full border border-gray-300 p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={emp.salary}
                      onChange={(e) =>
                        handleChange(idx, "salary", e.target.value)
                      }
                      className="w-full border border-gray-300 p-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={emp.paid ? "true" : "false"}
                      onChange={(e) =>
                        handleChange(idx, "paid", e.target.value)
                      }
                      className="w-full border border-gray-300 p-1 rounded"
                    >
                      <option value="false">Unpaid</option>
                      <option value="true">Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addEmployee}
            className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
          >
            + Add Employee
          </button>

          <div className="text-right text-lg font-bold mt-2 mb-6">
            Total Salary: ${totalSalary.toFixed(2)}
          </div>

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
        <div className="px-6 py-4">
          <div className="flex gap-4 mb-4">
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
          <div className="text-right font-bold text-blue-700 mb-2">
            Monthly Total: ₹{totalFiltered} | Paid: ₹{paidTotal} | Unpaid: ₹
            {unpaidTotal}
          </div>
        </div>
      </div>
   <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredEntries.length === 0 ? (
    <div className="col-span-full text-center text-gray-500 text-lg font-medium">
      No Salary in this month and year.
    </div>
  ) : (
    filteredEntries.map((entry) => (
      <div
        key={entry._id}
        className="bg-white border border-gray-200 rounded-xl shadow p-4"
      >
        <h2 className="text-lg font-semibold text-blue-700 mb-2">
          Salary Sheet
        </h2>
        <p className="text-sm text-gray-500 mb-1">
          Date: {new Date(entry.createdAt).toLocaleDateString()}
        </p>
        <div className="mb-3">
          {entry.employees.map((emp) => (
            <div
              key={emp._id}
              className="border-t border-gray-200 pt-2 mt-2 text-sm text-gray-700"
            >
              <p>
                <span className="font-medium">Name:</span> {emp.name}
              </p>
              <p>
                <span className="font-medium">Role:</span> {emp.role}
              </p>
              <p>
                <span className="font-medium">Month:</span> {emp.month}
              </p>
              <p>
                <span className="font-medium">Salary:</span> ₹{emp.salary}
              </p>
              <p>
                <span className="font-medium">Paid:</span>{" "}
                <span
                  className={
                    emp.paid
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {emp.paid ? "Yes" : "No"}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="text-right text-indigo-700 font-bold">
          Total Salary: ₹{entry.totalSalary}
        </div>
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default Salary;
