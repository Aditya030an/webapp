import ConvertToPatientForm from "./ConvertToPatientForm";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AllEnquiry = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [enquiries, setEnquiries] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [showConvertToPatientForm, setShowConvertToPatientForm] =
    useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  // const [role, setRole] = useState("employee");
  const tabs =["all", "lead", "patient"];
  

  // useEffect(() => {
  //   const employee = localStorage.getItem("loginEmployeeData");
  //   const data = JSON.parse(employee);
  //   if (data?.personalDetails?.email === import.meta.env.VITE_ADMIN_EMAIL) {
  //     setRole("admin");
  //   }
  // }, []);

  const fetchAllEnquiries = async () => {
    try {
      const response = await fetch(`${backendURL}/api/enquiry/getEnquiry`);
      const result = await response.json();
      setEnquiries(result?.enquiries || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  // const fetchAllEmployees = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`,
  //     );

  //     const result = await response.json();
  //     console.log("Employee data:", result);

  //     if (result.success && result.employees.length > 0) {
  //       setEmployeeData(result.employees);

  //       // ⚠️ Make sure employees are sorted (latest first)
  //       const lastEmployee = result.employees[0];
  //       console.log("last employee", lastEmployee);
  //       const lastEmployeeNumber = lastEmployee?.personalDetails?.employeeId;

  //       console.log("Last employee number:", lastEmployeeNumber);

  //       // ✅ Correct regex
  //       const match = lastEmployeeNumber?.match(/^(.+)-(\d+)$/);
  //       console.log("match:", match);

  //       if (match) {
  //         const prefix = match[1]; // MR-EMP
  //         const number = parseInt(match[2], 10) + 1;

  //         const newEmployeeId = `${prefix}-${number
  //           .toString()
  //           .padStart(4, "0")}`;

  //         setLastEmployeeNumber(newEmployeeId);
  //       } else {
  //         setLastEmployeeNumber("MR-EMP-0001");
  //       }
  //     } else {
  //       setLastEmployeeNumber("MR-EMP-0001");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employee data:", error);
  //     setLastEmployeeNumber("MR-EMP-0001");
  //   }
  // };

  // // console.log("last employee number", lastEmployeeNumber);

  // useEffect(() => {
  //   fetchAllEmployees();
  // }, []);

  const getFilteredEnquiries = () => {
    let filtered = [...enquiries];

    /* ---- STATUS FILTER ---- */
    if (activeStatus === "lead") {
      filtered = filtered.filter((e) => e.enquiryStatus === "lead");
    } else if (activeStatus === "patient") {
      filtered = filtered.filter((e) => e.enquiryStatus === "patient");
    }

    /* ---- SEARCH (Name | Phone | EmployeeId | PatientId) ---- */
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((item) => {
        const nameMatch = item?.patientName?.toLowerCase().includes(term);
        const phoneMatch = item?.contactNumber?.includes(term);
        const patientIdMatch = item?.patientId?.personalDetails?.patientId
          ?.toLowerCase()
          .includes(term);

        return nameMatch || phoneMatch || patientIdMatch;
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

  const handleConvertToPatient = async (data) => {
    try {
      const payload = {
        ...data,
        enquiryId: selectedEnquiry?._id, // 👈 IMPORTANT
      };

      // console.log("payload", payload);

      const response = await fetch(`${backendURL}/api/patient/createPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert("Patient created successfully");
        fetchAllEnquiries(); // refresh list
        setShowConvertToPatientForm(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Convert to patient failed", error);
    }
  };
  return (
    <div className="px-6">
      <div className="flex flex-wrap gap-4 mt-10 mb-4 items-center ">
        {tabs?.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-4 py-2 rounded ${
              activeStatus === s ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
        <p className="text-black font-semibold">Total Enquiry :- <span className="text-gray-600"> {getFilteredEnquiries()?.length}</span></p>
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
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {getFilteredEnquiries().length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium text-gray-600">
              No enquiries match your filters
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
                {entry.enquiryStatus === "patient" && (
                  <p className="text-xs text-gray-500">
                    Patient ID:{" "}
                    <span className="font-medium">
                      {entry.patientId?.personalDetails?.patientId}
                    </span>
                  </p>
                )}

                <h3 className="font-semibold text-gray-800 text-base">
                  <span>Name- </span>

                  <span className="text-sm text-gray-500">
                    {entry?.patientName}
                  </span>
                </h3>

                <p className="font-semibold text-gray-800 text-base">
                  <span className="text-sm text-gray-500">Contact number-</span>{" "}
                  {entry?.contactNumber}
                </p>
              </div>

              {/* Complaint */}
              {activeStatus !== "employee" && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  <span className="font-medium text-gray-700">Complaint:</span>{" "}
                  {entry.chiefComplaint || "-"}
                </p>
              )}

              {/* Footer */}

              <div className="flex items-center justify-between">
                {entry.enquiryStatus === "lead" ? (
                  <button
                    onClick={() => {
                      setShowConvertToPatientForm(true);
                      setSelectedEnquiry(entry);
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Convert to Patient →
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">
                      ● Patient
                    </span>
                    <Link
                      to={`/PatientDetails/${entry?.patientId?._id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showConvertToPatientForm && (
        <ConvertToPatientForm
          selectedEnquiry={selectedEnquiry}
          onClose={() => setShowConvertToPatientForm(false)}
          onSubmit={handleConvertToPatient}
        />
      )}
    </div>
  );
};

export default AllEnquiry;
