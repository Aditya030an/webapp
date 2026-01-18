import React, { useEffect, useState } from "react";
import CreateEmployeeForm from "./CreateEmployeeForm";
import { Link } from "react-router-dom";

const AllEmployee = () => {
  const [allEmployeeData, setAllEmployeeData] = useState([]);
  const [lastEmployeeNumber, setLastEmployeeNumber] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const fetchAllEmployees = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`,
      );

      const result = await response.json();
      console.log("Employee data:", result);

      if (result.success && result.employees.length > 0) {
        setAllEmployeeData(result.employees);

        // ⚠️ Make sure employees are sorted (latest first)
        const lastEmployee = result.employees[0];
        console.log("last employee", lastEmployee);
        const lastEmployeeNumber = lastEmployee?.personalDetails?.employeeId;

        console.log("Last employee number:", lastEmployeeNumber);

        // ✅ Correct regex
        const match = lastEmployeeNumber?.match(/^(.+)-(\d+)$/);
        console.log("match:", match);

        if (match) {
          const prefix = match[1]; // MR-EMP
          const number = parseInt(match[2], 10) + 1;

          const newEmployeeId = `${prefix}-${number
            .toString()
            .padStart(4, "0")}`;

          setLastEmployeeNumber(newEmployeeId);
        } else {
          setLastEmployeeNumber("MR-EMP-0001");
        }
      } else {
        setLastEmployeeNumber("MR-EMP-0001");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setLastEmployeeNumber("MR-EMP-0001");
    }
  };

  // console.log("last employee number", lastEmployeeNumber);

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const getFilteredEnquiries = () => {
    let filtered = [...allEmployeeData];

    /* ---- SEARCH (Name | Phone | EmployeeId | PatientId) ---- */
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((item) => {
        const nameMatch = item?.personalDetails?.fullName
          ?.toLowerCase()
          .includes(term);
        const phoneMatch = item?.personalDetails?.contactNumber?.includes(term);
        const employeeIdMatch = item?.personalDetails?.employeeId
          ?.toLowerCase()
          .includes(term);

        return nameMatch || phoneMatch || employeeIdMatch;
      });
    }

    /* ---- SORT BY CREATED AT ---- */
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };
  return (
    <div className="px-2">
      <div className="flex flex-wrap gap-2 mt-10 mb-4 text-black font-semibold text-xl">
        {"employee".toUpperCase()} :-  <span className="text-gray-600">{getFilteredEnquiries().length}</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name, phone, or patient ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/2"
        />

        {/* SORT */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <div className="flex justify-end ">
          <button
            onClick={() => setShowEmployeeForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Create Employee
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {getFilteredEnquiries().length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium text-gray-600">
              No Employee match your filters
            </p>
            <p className="text-sm text-gray-400">
              Try changing filters or search keywords
            </p>
          </div>
        ) : (
          getFilteredEnquiries().map((entry) => (
            <div
              key={entry._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              {/* {console.log("entry" , entry)} */}
              {/* Header */}
              <div className="mb-2">
                <p className="text-xs text-gray-500">
                  Employee ID:{" "}
                  <span className="font-medium">
                    {entry?.personalDetails?.employeeId}
                  </span>
                </p>

                <h3 className="font-semibold text-gray-800 text-base">
                  <span>Name- </span>
                  <span className="text-sm text-gray-500">
                    {entry?.personalDetails?.fullName}
                  </span>
                </h3>

                <p className="font-semibold text-gray-800 text-base">
                  <span className="text-sm text-gray-500">Contact number-</span>{" "}
                  {entry?.personalDetails?.contactNumber}
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {entry?.personalDetails?.experience} yrs
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium"> Qualification:</span>{" "}
                  {entry?.personalDetails?.qualification || "-"}
                </p>
                <p>
                  <span className="font-medium">Branch:</span>{" "}
                  {entry?.personalDetails?.workingBranch}
                </p>
              </div>

              {/* Footer */}

              <div className="flex items-center justify-between gap-2 ">
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`font-medium ${
                      entry?.personalDetails?.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {entry?.personalDetails?.status}
                  </span>
                </p>
                <Link
                  to={`/EmployeeDetails/${entry?._id}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showEmployeeForm && (
        <CreateEmployeeForm
          onClose={() => setShowEmployeeForm(false)}
          lastEmployeeNumber={lastEmployeeNumber}
          fetchAllEmployees={fetchAllEmployees}
        />
      )}
    </div>
  );
};

export default AllEmployee;
