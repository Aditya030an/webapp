import { useState, useEffect, useCallback } from "react";
import SalaryReportPdf from "./pdf/SalaryReportPdf";
import { MdEdit, MdClose } from "react-icons/md";
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
  PRIMARY_BTN,
} from "./reports/ReportUI";

// "YYYY-MM" of the current month — used as the default pay month for a new row.
const currentPayMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const blankEmployee = () => ({
  name: "",
  role: "",
  month: currentPayMonth(),
  salary: 0,
  paid: false,
});

const Salary = () => {
  const [employees, setEmployees] = useState([blankEmployee()]);

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
    setEmployees([...employees, blankEmployee()]);
  };

  const totalSalary = employees.reduce(
    (sum, emp) => sum + (Number(emp.salary) || 0),
    0,
  );

  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [editId, setEditId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  const [allEmployeeData, setAllEmployeeData] = useState([]);

  const filteredEmployeeOptions = (searchValue) => {
    return allEmployeeData.filter((emp) =>
      emp?.personalDetails?.fullName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()),
    );
  };

  const handleEmployeeSelect = (index, employee) => {
    const updated = [...employees];

    updated[index] = {
      ...updated[index],
      name: employee?.personalDetails?.fullName || "",
      role: employee?.personalDetails?.qualification || "",
    };

    setEmployees(updated);
    setActiveDropdown(null);
  };

  // Server-side filtered: each entry already contains only the matching
  // employees with a recomputed totalSalary, so we render/total it directly.
  const fetchSalaryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReport("salary", {
        month: selectedMonth,
        year: selectedYear,
      });
      setSalaryData(data);
    } catch (err) {
      console.error("Error fetching salary data:", err);
      setError("Failed to load salary data. Please try again.");
      setSalaryData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  const fetchAllEmployees = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`,
      );

      const result = await response.json();

      if (result.success && result.employees.length > 0) {
        setAllEmployeeData(result?.employees);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      employees,
      totalSalary,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/salary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      fetchSalaryData();
      alert(result.message || "Salary report saved successfully!");
      setEmployees([blankEmployee()]);
    } catch (error) {
      console.error(error);
      alert("Error saving salary report. Please try again later.");
    }
  };

  const updatePaidStatus = async (entryId, empId, paid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/salary/${entryId}/${empId}`,
        {
          method: "PUT", // ✅ using PUT now
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paid }),
        },
      );

      const result = await response.json();

      if (result.success) {
        fetchSalaryData();
        setEditId(null);
        setUpdateStatus(null);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const totalFiltered = salaryData.reduce(
    (sum, entry) => sum + (Number(entry.totalSalary) || 0),
    0,
  );

  const paidTotal = salaryData.reduce(
    (sum, entry) =>
      sum +
      entry.employees
        .filter((e) => e.paid)
        .reduce((s, e) => s + (Number(e.salary) || 0), 0),
    0,
  );
  const unpaidTotal = salaryData.reduce(
    (sum, entry) =>
      sum +
      entry.employees
        .filter((e) => !e.paid)
        .reduce((s, e) => s + (Number(e.salary) || 0), 0),
    0,
  );

  const monthName = MONTHS.find(
    (m) => String(m.value) === String(selectedMonth),
  )?.label;
  const periodLabel =
    selectedMonth && selectedYear
      ? `${monthName} ${selectedYear}`
      : !selectedMonth && selectedYear
        ? `Year ${selectedYear}`
        : selectedMonth && !selectedYear
          ? `${monthName} (all years)`
          : "All time";

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const downloadSalaryExcel = () => {
    const rows = salaryData.flatMap((entry) =>
      entry.employees.map((emp, index) => ({
        Date:
          index === 0
            ? new Date(entry.createdAt).toLocaleDateString("en-IN")
            : "",
        Name: emp.name,
        Role: emp.role,
        Month: emp.month,
        Salary: emp.salary,
        Status: emp.paid ? "Paid" : "Unpaid",
        "Entry Total": index === 0 ? entry.totalSalary : "",
      })),
    );

    exportToExcel({
      data: rows,
      fileName: `Salary_Report_${selectedMonth || "All"}_${selectedYear || "All"}`,
      sheetName: "Salary",
    });
  };

  return (
    <ReportPage>
      <ReportToolbar title="Salary" periodLabel={periodLabel}>
        <select
          className="border p-2 rounded text-sm"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
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
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button onClick={downloadSalaryExcel} className={EXCEL_BTN}>
          Download Excel
        </button>
        <SalaryReportPdf
          filteredEntries={salaryData}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          totalFiltered={totalFiltered}
          paidTotal={paidTotal}
          unpaidTotal={unpaidTotal}
        />
      </ReportToolbar>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Tile emoji="👥" label="Total Salary" value={totalFiltered} tone="gray" />
        <Tile emoji="✅" label="Paid" value={paidTotal} tone="emerald" />
        <Tile emoji="⏳" label="Unpaid" value={unpaidTotal} tone="rose" />
      </div>

      <TallyLine
        text={`Paid ₹${formatINR(paidTotal)} + Unpaid ₹${formatINR(
          unpaidTotal,
        )} = Total ₹${formatINR(totalFiltered)}`}
      />

      {/* Salary Form */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Add Salary Sheet
        </h2>

        <div className="overflow-x-auto">
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
                    <div className="relative">
                      <input
                        type="text"
                        value={emp.name}
                        onChange={(e) => {
                          handleChange(idx, "name", e.target.value);
                          setActiveDropdown(idx);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={() => setActiveDropdown(idx)}
                        placeholder="Employee name"
                        className="w-full border border-gray-300 p-2 rounded"
                      />

                      {activeDropdown === idx && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow max-h-40 overflow-y-auto"
                        >
                          {filteredEmployeeOptions(emp.name).map((employee) => (
                            <div
                              key={employee._id}
                              onClick={() =>
                                handleEmployeeSelect(idx, employee)
                              }
                              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                            >
                              <p className="font-medium text-sm text-gray-800">
                                {employee?.personalDetails?.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {employee?.personalDetails?.qualification ||
                                  "No qualification"}
                              </p>
                            </div>
                          ))}

                          {filteredEmployeeOptions(emp.name).length === 0 && (
                            <div className="px-3 py-2 text-gray-400 text-sm">
                              No employee found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
                      min={0}
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
        </div>

        <button
          onClick={addEmployee}
          className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
        >
          + Add Employee
        </button>

        <div className="text-right text-lg font-bold mt-2 mb-6">
          Total Salary: ₹{formatINR(totalSalary)}
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={handleSubmit} className={PRIMARY_BTN}>
            Save
          </button>
        </div>
      </Card>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : salaryData.length === 0 ? (
        <EmptyState label="No salary records for this period." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salaryData.map((entry) => (
            <div
              key={entry._id}
              className="bg-white border border-gray-200 rounded-xl shadow p-4"
            >
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Salary Sheet
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                Date: {new Date(entry.createdAt).toLocaleDateString("en-IN")}
              </p>
              <div className="mb-3">
                {entry.employees.map((emp) => (
                  <div
                    key={emp._id}
                    className="border-t border-gray-200 pt-2 mt-2 text-sm text-gray-700"
                  >
                    <div className="flex emps-center justify-between">
                      <p>
                        <span className="font-medium">Name:</span> {emp.name}
                      </p>
                      <button
                        onClick={() => {
                          setEditId(editId === emp._id ? null : emp._id);
                          setUpdateStatus(emp?.paid);
                        }}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        {editId === emp._id ? (
                          <MdClose size={18} className="text-red-500" />
                        ) : (
                          <MdEdit size={18} className="text-blue-500" />
                        )}
                      </button>
                    </div>
                    <p>
                      <span className="font-medium">Role:</span> {emp.role}
                    </p>
                    <p>
                      <span className="font-medium">Month:</span> {emp.month}
                    </p>
                    <p>
                      <span className="font-medium">Salary:</span> ₹
                      {formatINR(emp.salary)}
                    </p>
                    {editId === emp._id ? (
                      <div className="text-sm">
                        Paid:
                        <select
                          value={updateStatus ? "true" : "false"}
                          onChange={(e) =>
                            setUpdateStatus(e.target.value === "true")
                          }
                          className="ml-2 border px-2 py-1 rounded"
                        >
                          <option value="true">Paid</option>
                          <option value="false">Unpaid</option>
                        </select>
                        <button
                          disabled={updateStatus === emp.paid}
                          onClick={() =>
                            updatePaidStatus(entry._id, emp._id, updateStatus)
                          }
                          className={`px-2 py-1 rounded text-xs ml-2 ${
                            updateStatus === emp.paid
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm">
                        Paid:{" "}
                        <span
                          className={`font-semibold ${
                            emp.paid ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {emp.paid ? "Paid" : "Unpaid"}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-right text-indigo-700 font-bold">
                Total Salary: ₹{formatINR(entry.totalSalary)}
              </div>
            </div>
          ))}
        </div>
      )}
    </ReportPage>
  );
};

export default Salary;
