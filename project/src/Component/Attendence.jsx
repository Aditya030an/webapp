import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const printRef = useRef();
  const currentMonth = date.slice(0, 7); // YYYY-MM

  useEffect(() => {
    getAllEmployees();
  }, []);

  const getAllEmployees = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`
      );
      const result = await res.json();
      if (result?.success) {
        setEmployees(result?.employees);
      } else {
        alert("Failed to fetch employees");
      }
    } catch (err) {
      alert("Error fetching employees");
      console.error(err);
    }
  };

  const addEmployee = async () => {
    if (!name.trim()) return alert("Name is required");
    if (!role) return alert("Please select a role");

    const exists = employees.find(
      (emp) => emp.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) return alert("Employee already exists!");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/addEmployee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, role }),
        }
      );
      const result = await response.json();
      if (!result?.success) return alert(result?.message);
      alert("Employee added successfully");
      setEmployees((prev) => [...prev, result?.employee]);

      setName("");
      setRole("");
    } catch (err) {
      alert("Failed to add employee");
      console.error(err);
    }
  };

  const handleStatusChange = async (empId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || {}),
        [currentMonth]: {
          ...(prev[empId]?.[currentMonth] || {}),
          [date]: status,
        },
      },
    }));

    // Send update to backend
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/update-attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ empId, date, status }),
        }
      );
      const result = await res.json();
      console.log("updates employee", result);
      if (!result?.success) {
        alert("Failed to update attendance: " + result?.message);
      } else {
        alert(result?.message);
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert("Error updating attendance");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesRole = filterRole === "All" || emp?.role === filterRole;
    const matchesSearch = emp?.name
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());
    return matchesRole && matchesSearch;
  });



const handlePrint = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(200, 0, 0);
  doc.text("Akhand Param Dham Physiotherapy Center", pageWidth / 2, y, { align: "center" });

  y += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text("Dr. Mayank Gupta | B.P.T., C. Yoga, C.C.H.", 10, y);
  y += 6;
  doc.text("Consultant Physiotherapist", 10, y);
  y += 6;
  doc.text("Reg. No.: SCH-01/DEG2/25326/2014", 10, y);

  const rawDate = new Date(date);
  const formattedDate = `${String(rawDate.getDate()).padStart(2, "0")}-${String(rawDate.getMonth() + 1).padStart(2, "0")}-${rawDate.getFullYear()}`;
  doc.text(`Date: ${formattedDate}`, pageWidth - 60, y);
  y += 10;

  doc.line(10, y, pageWidth - 10, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Attendance Details (${filterRole})`, 10, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  filteredEmployees.forEach((emp, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const empId = emp._id || emp.id;
    doc.text(`${idx + 1}. ${emp.name} (${emp.role}):`, 10, y);
    y += 8;

    const attendanceByMonth = attendance[empId] || {};
    // Loop over months in attendance
    Object.entries(attendanceByMonth).forEach(([month, days]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`  Month: ${month}`, 15, y);
      y += 8;
      doc.setFont("helvetica", "normal");

      // For each day in that month
      Object.entries(days).forEach(([day, status]) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`    ${day}: ${status}`, 20, y);
        y += 7;
      });
    });

    y += 5; // Space after each employee
  });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "italic");
  doc.text("Swami Parmanand Netralaya, Near NDPS School, Khandwa Road, Indore", pageWidth / 2, 280, { align: "center" });
  doc.text("Mob: 98276-36538 | Timing: Morning 9–12, Evening 4–6", pageWidth / 2, 286, { align: "center" });

  doc.save(`Attendance_${currentMonth}_${filterRole}.pdf`);
};


  console.log("all employ", employees);
console.log("attendence" , attendance);

  employees.forEach((emp) => {
    console.log(`Name: ${emp?.name}`);
    const attendance = emp?.attendance;
    console.log("Attendance:" , attendance);
    if (attendance && Object.keys(attendance).length > 0) {
      for (const month in attendance) {
        console.log(`  Month: ${month}`);
        for (const date in attendance[month]) {
          console.log(`    ${date}: ${attendance[month][date]}`);
        }
      }
    } else {
      console.log("  No attendance found.");
    }
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Attendance Tracker
      </h1>

      {/* Add Employee */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Employee/Patient</h2>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Name"
            className="border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">--Select Role--</option>
            <option value="Employee">Employee</option>
            <option value="Patient">Patient</option>
          </select>
          <button
            onClick={addEmployee}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-xs"
        />
      </div>

      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <label className="block font-medium mb-1">Filter by Role:</label>
          <select
            className="border px-3 py-2 rounded w-full max-w-xs"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Employee">Employee</option>
            <option value="Patient">Patient</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Search by Name:</label>
          <input
            type="text"
            placeholder="Search"
            className="border px-3 py-2 rounded w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Print Attendance
        </button>
      </div>

      {/* Attendance Table */}
      <div ref={printRef}>
        {filteredEmployees.length === 0 ? (
          <p className="text-gray-500">
            No {filterRole.toLowerCase()}s found. Add one above ⬆️
          </p>
        ) : (
          <>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                  <th className="border px-4 py-2 text-left">
                    Status for {date}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const empId = emp?._id || emp?.id;
                  const status =
                    attendance[empId]?.[currentMonth]?.[date] || "";
                  console.log("statues", status);
                  return (
                    <tr key={empId}>
                      <td>{emp?.name}</td>
                      <td>{emp?.role}</td>
                      <td>
                        <select
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(empId, e.target.value)
                          }
                        >
                          <option value="">--Select--</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-2">
                Summary for {currentMonth} ({filterRole})
              </h2>
              <ul className="list-disc pl-6 text-sm">
                {filteredEmployees.map((emp) => {
                  const empId = emp?._id || emp?.id;
                  const days = attendance[empId]?.[currentMonth] || {};
                  const presentCount = Object.values(days).filter(
                    (s) => s === "Present"
                  )?.length;
                  const absentCount = Object.values(days).filter(
                    (s) => s === "Absent"
                  )?.length;
                  const leaveCount = Object.values(days).filter(
                    (s) => s === "Leave"
                  )?.length;
                  return (
                    <li key={empId}>
                      <strong>{emp?.name}:</strong> {presentCount} Present,{" "}
                      {absentCount} Absent, {leaveCount} Leave
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
