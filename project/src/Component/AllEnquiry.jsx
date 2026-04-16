import ConvertToPatientForm from "./ConvertToPatientForm";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AllEnquiry = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [enquiries, setEnquiries] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [patientStatus, setPatientStatus] = useState("all");
  const [showConvertToPatientForm, setShowConvertToPatientForm] =
    useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deletingEnquiryId, setDeletingEnquiryId] = useState(null);
  const [updatingPatientId, setUpdatingPatientId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // const [role, setRole] = useState("employee");
  const tabs = ["all", "lead", "patient"];

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

  useEffect(() => {
    const employeeData = localStorage.getItem("loginEmployeeData");

    if (!employeeData) {
      setIsAdmin(false);
      return;
    }

    try {
      const employee = JSON.parse(employeeData);
      const loggedInEmail = employee?.personalDetails?.email
        ?.trim()
        ?.toLowerCase();
      const adminEmail =
        import.meta.env.VITE_ADMIN_EMAIL?.trim()?.toLowerCase();

      setIsAdmin(loggedInEmail === adminEmail);
    } catch (error) {
      console.error("Failed to parse loginEmployeeData:", error);
      setIsAdmin(false);
    }
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

    /* ---- PATIENT STATUS FILTER ---- */
    if (patientStatus !== "all") {
      filtered = filtered.filter((e) => {
        const status = e?.patientId?.personalDetails?.patientStatus;

        if (patientStatus === "active") return status === true;
        if (patientStatus === "inactive") return status === false;

        return true;
      });
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
    const confirmDelete = window.confirm(
      "Are you sure you want to convert this enquiry into patient ?",
    );

    if (!confirmDelete) return;
    try {
      const payload = {
        ...data,
        enquiryId: selectedEnquiry?._id, // 👈 IMPORTANT
      };

      console.log("payload", payload);

      const response = await fetch(`${backendURL}/api/patient/createPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log("result", result);

      if (result?.success) {
        alert("Patient created successfully");
        fetchAllEnquiries(); // refresh list
        setShowConvertToPatientForm(false);
      } else {
        alert(result?.message);
      }
    } catch (error) {
      console.error("Convert to patient failed", error);
    }
  };

  const handlePatientStatusChange = async (patientId, patientStatus) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to update the patient status from ${!patientStatus ? "Active" : "In-Active"} to ${patientStatus ? "Active" : "In-active "} ?`,
      );

      if (!confirmDelete) return;

      setUpdatingPatientId(patientId);

      const response = await fetch(
        `${backendURL}/api/patient/updatePatientStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId,
            patientStatus,
          }),
        },
      );

      const result = await response.json();

      if (result?.success) {
        alert("Patient status updated successfully");
        fetchAllEnquiries();
      } else {
        alert(result?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating patient status:", error);
      alert("Something went wrong");
    } finally {
      setUpdatingPatientId(null);
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?",
    );

    if (!confirmDelete) return;
    try {
      setDeletingEnquiryId(enquiryId);
      const response = await fetch(
        `${backendURL}/api/enquiry/deleteEnquiryById/${enquiryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("webapptoken"),
          },
        },
      );

      const result = await response.json();

      if (result?.success) {
        console.log("result", result);
        fetchAllEnquiries(); // refresh list
        alert("Enquiry deleted successfully");
      } else {
        alert(result?.message);
      }
    } catch (error) {
      console.error("Delete enquiry failed", error);
    } finally {
      setDeletingEnquiryId(null);
    }
  };

  console.log("enquiries", enquiries);
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
        <p className="text-black font-semibold">
          Total Enquiry :-{" "}
          <span className="text-gray-600">
            {" "}
            {getFilteredEnquiries()?.length}
          </span>
        </p>
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

        {/* PATIENT STATUS FILTER */}
        {activeStatus === "patient" && (
          <select
            value={patientStatus}
            onChange={(e) => setPatientStatus(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/4"
          >
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        )}
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
              className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              {isAdmin && (
                <button
                  className={`absolute top-2 right-2 cursor-pointer ${deletingEnquiryId === entry._id ? "cursor-not-allowed" : "cursor-pointer"} `}
                  disabled={deletingEnquiryId === entry._id}
                  onClick={() => handleDeleteEnquiry(entry._id)}
                >
                  {deletingEnquiryId === entry._id ? (
                    <AiOutlineLoading3Quarters className="text-2xl text-red-500 animate-spin" />
                  ) : (
                    <MdDelete className="text-2xl text-red-500 hover:text-red-600" />
                  )}
                </button>
              )}
              {/* {console.log("entry" , entry)} */}
              {/* Header */}
              <div className="mb-2">
                {entry.enquiryStatus === "patient" && (
                  <div className="mb-2 space-y-2">
                    <p className="text-xs text-gray-500">
                      Patient ID:{" "}
                      <span className="font-medium">
                        {entry.patientId?.personalDetails?.patientId}
                      </span>
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">
                        Status:{" "}
                        <span
                          className={
                            entry?.patientId?.personalDetails?.patientStatus
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {entry?.patientId?.personalDetails?.patientStatus
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </p>
                      {isAdmin && (
                        <select
                          value={
                            entry?.patientId?.personalDetails?.patientStatus
                              ? "true"
                              : "false"
                          }
                          disabled={updatingPatientId === entry?.patientId?._id}
                          onChange={(e) =>
                            handlePatientStatusChange(
                              entry?.patientId?._id,
                              e.target.value === "true",
                            )
                          }
                          className="px-3 py-1.5 border rounded-md text-sm"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      )}
                    </div>
                  </div>
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
                <p className="font-semibold text-gray-800 text-base">
                  <span className="text-sm text-gray-500">Remark-</span>{" "}
                  {entry?.remark}
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
