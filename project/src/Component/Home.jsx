import React, { useState, useEffect } from "react";
import ConvertToPatientForm from "./ConvertToPatientForm";
import { Link } from "react-router-dom";
import CreateEmployeeForm from "./CreateEmployeeForm";

const EnquiryForm = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [enquiries, setEnquiries] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchByPatientId, setSearchByPatientId] = useState("");
  const [showConvertToPatientForm, setShowConvertToPatientForm] =
    useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest
  const [loading, setLoading] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [lastEmployeeNumber, setLastEmployeeNumber] = useState([]);
  const [role, setRole] = useState("employee");

  const tabsByRole = {
    admin: ["all", "lead", "patient", "other", "employee"],
    employee: ["all", "lead", "patient", "other"],
  };

  useEffect(() => {
    const employee = localStorage.getItem("loginEmployeeData");
    const data = JSON.parse(employee);
    if (data?.personalDetails?.email === import.meta.env.VITE_ADMIN_EMAIL) {
      setRole("admin");
    }
  }, []);

  const [formData, setFormData] = useState({
    patientName: "",
    gender: "",
    age: "",
    occupation: "",
    contactNumber: "",
    email: "",
    chiefComplaint: "",
    response: "",
    source: "",
    // paymentStatus: "",
    // amountPerDay: "",
    // numberOfDays: "",
    // total: "",
  });

  /* -------------------- FORM HANDLERS -------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const amount = parseFloat(formData.amountPerDay);
    const days = parseInt(formData.numberOfDays);

    if (!isNaN(amount) && !isNaN(days)) {
      setFormData((prev) => ({
        ...prev,
        total: (amount * days).toFixed(2),
      }));
    } else {
      setFormData((prev) => ({ ...prev, total: "" }));
    }
  }, [formData.amountPerDay, formData.numberOfDays]);

  /* -------------------- FETCH ENQUIRIES -------------------- */

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

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`,
      );

      const result = await response.json();
      console.log("Employee data:", result);

      if (result.success && result.employees.length > 0) {
        setEmployeeData(result.employees);

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
    fetchEmployeeData();
  }, []);

  /* -------------------- VALIDATION -------------------- */

  const validateForm = () => {
    const {
      patientName,
      gender,
      age,
      occupation,
      contactNumber,
      chiefComplaint,
      response,
      source,
      email,
    } = formData;

    if (
      !patientName ||
      !gender ||
      !age ||
      !occupation ||
      !contactNumber ||
      !chiefComplaint ||
      !response ||
      !source
    ) {
      alert("Please fill all required fields");
      return false;
    }

    if (age <= 0 || age > 120) {
      alert("Invalid age");
      return false;
    }

    if (!/^[0-9]{10}$/.test(contactNumber)) {
      alert("Invalid contact number");
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Invalid email");
      return false;
    }

    return true;
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) return;

    try {
      const response = await fetch(`${backendURL}/api/enquiry/createEnquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result?.success) {
        alert(result.message);
        fetchAllEnquiries();
        setFormData({
          patientName: "",
          gender: "",
          age: "",
          occupation: "",
          contactNumber: "",
          email: "",
          chiefComplaint: "",
          response: "",
          source: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create enquiry", error);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- FILTER LOGIC -------------------- */
  const getName = (item) =>
    item?.personalDetails?.fullName || item?.patientName || "";

  const getContact = (item) =>
    item?.personalDetails?.contactNumber || item?.contactNumber || "";

  const getEmployeeId = (item) => item?.personalDetails?.employeeId || "";

  const getPatientId = (item) =>
    item?.patientId?.personalDetails?.patientId || "";

  const getFilteredEnquiries = () => {
    let filtered = [...enquiries];

    /* ---- STATUS FILTER ---- */
    if (activeStatus === "lead") {
      filtered = filtered.filter((e) => e.enquiryStatus === "lead");
    } else if (activeStatus === "patient") {
      filtered = filtered.filter((e) => e.enquiryStatus === "patient");
    } else if (activeStatus === "employee") {
      filtered = [...employeeData];
    }

    /* ---- SEARCH (Name | Phone | EmployeeId | PatientId) ---- */
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((item) => {
        const nameMatch = getName(item).toLowerCase().includes(term);
        const phoneMatch = getContact(item).includes(term);
        const employeeIdMatch = getEmployeeId(item)
          .toLowerCase()
          .includes(term);
        const patientIdMatch = getPatientId(item).toLowerCase().includes(term);

        return nameMatch || phoneMatch || employeeIdMatch || patientIdMatch;
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

  // console.log("all enquiry", enquiries);
  // console.log("all lead", getFilteredEnquiries());

  /* -------------------- UI -------------------- */

  return (
    <div className="w-full p-6">
      {/* FORM */}
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add Enquiry</h2>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
            />
            <FormField
              label="Gender"
              name="gender"
              type="select"
              options={["Male", "Female", "Other"]}
              value={formData.gender}
              onChange={handleChange}
            />
            <FormField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
            <FormField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
            />
            <FormField
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <FormField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormField
              label="Chief Complaint"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleChange}
            />
            <FormField
              label="Response"
              name="response"
              type="select"
              options={["Pending", "Done", "Deny"]}
              value={formData.response}
              onChange={handleChange}
            />
            <FormField
              label="Source"
              name="source"
              type="select"
              options={["Walk-in", "Phone", "Referral", "Online"]}
              value={formData.source}
              onChange={handleChange}
            />
            {/* <FormField
              label="Payment Status"
              name="paymentStatus"
              type="select"
              options={["Paid", "Unpaid", "Partially Paid"]}
              value={formData.paymentStatus}
              onChange={handleChange}
            />
            <FormField
              label="Amount / Day"
              name="amountPerDay"
              type="number"
              value={formData.amountPerDay}
              onChange={handleChange}
            />
            <FormField
              label="Days"
              name="numberOfDays"
              type="number"
              value={formData.numberOfDays}
              onChange={handleChange}
            />
            <FormField
              label="Total"
              name="total"
              value={formData.total}
              onChange={() => {}}
            /> */}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            {loading ? "Adding..." : " + Add Enquiry"}
          </button>
        </form>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 mt-10 mb-4">
        {tabsByRole[role]?.map((s) => (
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
        {activeStatus === "employee" && (
          <div className="flex justify-end ">
            <button
              onClick={() => setShowEmployeeForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Create Employee
            </button>
          </div>
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

                {activeStatus === "employee" && (
                  <p className="text-xs text-gray-500">
                    Employee ID:{" "}
                    <span className="font-medium">
                      {entry?.personalDetails?.employeeId}
                    </span>
                  </p>
                )}

                <h3 className="font-semibold text-gray-800 text-base">
                  <span>Name- </span>
                  {activeStatus === "employee" ? (
                    <span className="text-sm text-gray-500">
                      {entry?.personalDetails?.fullName}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {entry?.patientName}
                    </span>
                  )}
                </h3>

                <p className="font-semibold text-gray-800 text-base">
                  <span className="text-sm text-gray-500">Contact number-</span>{" "}
                  {activeStatus === "employee"
                    ? entry?.personalDetails?.contactNumber
                    : entry?.contactNumber}
                </p>
              </div>

              {/* Complaint */}
              {activeStatus !== "employee" && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  <span className="font-medium text-gray-700">Complaint:</span>{" "}
                  {entry.chiefComplaint || "-"}
                </p>
              )}

              {activeStatus === "employee" && (
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
              )}

              {/* Footer */}
              {activeStatus !== "employee" ? (
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
              ) : (
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
              )}
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

      {showEmployeeForm && (
        <CreateEmployeeForm
          onClose={() => setShowEmployeeForm(false)}
          lastEmployeeNumber={lastEmployeeNumber}
          fetchEmployeeData={fetchEmployeeData}
        />
      )}
    </div>
  );
};

/* -------------------- FORM FIELD -------------------- */
const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
}) => (
  <div>
    <label className="block mb-1">{label}</label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded"
      />
    )}
  </div>
);

export default EnquiryForm;
