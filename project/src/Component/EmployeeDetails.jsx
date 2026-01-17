import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaTrash,
  FaEdit,
  FaTimes,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState("employee");

  const [employeeDetail, setEmployeeDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const employee = localStorage.getItem("loginEmployeeData");
    const data = JSON.parse(employee);
    if (data?.personalDetails?.email === import.meta.env.VITE_ADMIN_EMAIL) {
      setRole("admin");
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/employee/getEmployeeById/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        },
      );

      const result = await response.json();
      if (result?.success) {
        setEmployeeDetail(result?.employee);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  console.log("employee", employeeDetail);

  const personal = employeeDetail?.personalDetails;
  const patients = employeeDetail?.patientLook?.patientId || [];

  useEffect(() => {
    if (personal) {
      setPersonalForm({
        employeeId: personal.employeeId,
        fullName: personal.fullName,
        registrationNo: personal.registrationNo,
        qualification: personal.qualification,
        experience: personal.experience,
        contactNumber: personal.contactNumber,
        email: personal.email,
        password: personal.password,
        workingBranch: personal.workingBranch,
        status: personal.status,
        employmentType: personal.employmentType,
        joiningDate: personal.joiningDate?.slice(0, 10),
        exitDate: personal.exitDate?.slice(0, 10),
      });
    }
  }, [personal]);

  const validateEmployee = () => {
    const {
      fullName,
      qualification,
      registrationNo,
      experience,
      contactNumber,
      email,
      password,
      workingBranch,
      status,
      employmentType,
      joiningDate,
      exitDate,
    } = personalForm;

    if (
      !fullName ||
      !qualification ||
      !registrationNo ||
      !employmentType ||
      !contactNumber ||
      !email ||
      !password ||
      !workingBranch ||
      !status ||
      !joiningDate
    ) {
      alert("Please fill all required fields");
      return false;
    }

    if (experience < 0) {
      alert("Experience cannot be negative");
      return false;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      alert("Contact number must be exactly 10 digits");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Invalid email format");
      return false;
    }

    if (
      new Date(joiningDate).toISOString().slice(0, 10) >
      new Date(exitDate).toISOString().slice(0, 10)
    ) {
      alert("Joining date cannot greater then exit date");
      return false;
    }

    return true;
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;

    // Experience cannot be negative
    if (name === "experience" && value < 0) return;

    // Contact number: only digits & max 10
    if (name === "contactNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    if (name === "joiningDate") {
      if (
        new Date(value).toISOString().slice(0, 10) >
        new Date(personalForm.exitDate).toISOString().slice(0, 10)
      ) {
        return;
      }
    }

    setPersonalForm((prev) => ({ ...prev, [name]: value }));
  };

  const savePersonalDetails = async () => {
    setLoading(true);
    if (!validateEmployee()) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/updateEmployee/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify(personalForm),
        },
      );

      const result = await res.json();
      if (result?.success) {
        setEmployeeDetail(result?.employee);
        setIsEditingPersonal(false);
        setShowPassword(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (personal) {
      setPersonalForm({
        employeeId: personal.employeeId,
        fullName: personal.fullName,
        registrationNo: personal.registrationNo,
        qualification: personal.qualification,
        experience: personal.experience,
        contactNumber: personal.contactNumber,
        email: personal.email,
        password: personal.password,
        workingBranch: personal.workingBranch,
        status: personal.status,
        employmentType: personal.employmentType,
        joiningDate: personal.joiningDate?.slice(0, 10),
        exitDate: personal.exitDate?.slice(0, 10),
      });
      setShowPassword(false);
    }
    setIsEditingPersonal(false);
  };

  const handleDeleteEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/deleteEmployee/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        },
      );
      const result = await response.json();
      if (result?.success) {
        alert(result?.message);
        navigate("/");
      } else alert(result.message);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (role !== "admin")
    return (
      <div className="p-4">You are not authorized to access this page</div>
    );
  if (!employeeDetail && loading) return <div className="p-4">Loading...</div>;
  if (!employeeDetail && !loading)
    return <div className="p-4">No employee Found</div>;
  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Employee Details
        </h1>

        <button
          onClick={handleDeleteEmployee}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
            </div>
          ) : (
            <FaTrash />
          )}

          {/* <span className="text-sm font-medium">Delete Employee</span> */}
        </button>
      </div>

      {/* ================= PERSONAL DETAILS ================= */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Details
          </h2>

          {!isEditingPersonal ? (
            <button
              onClick={() => setIsEditingPersonal(true)}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <FaEdit />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                type="button"
                className="text-sm border px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={savePersonalDetails}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : (
                  "Save Employee"
                )}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Field label="Employee ID" value={personalForm.employeeId} disabled />
          <Field label="Full Name" value={personalForm.fullName} disabled />
          <Field
            label="Registration No"
            value={personalForm.registrationNo}
            disabled
          />
          <Field
            label="Qualification"
            name="qualification"
            value={personalForm.qualification}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
          />
          <Field
            label="Experience"
            name="experience"
            type="number"
            value={personalForm.experience}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
            min={0}
          />
          <Field
            label="Contact Number"
            name="contactNumber"
            value={personalForm.contactNumber}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
          />
          <Field label="Email" value={personalForm.email} disabled />
          <Field
            label="Password"
            name="password"
            value={personalForm.password}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <Field
            label="Working Branch"
            name="workingBranch"
            value={personalForm.workingBranch}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
          />
          <SelectField
            label="Status"
            name="status"
            value={personalForm.status}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
            options={["Active", "Inactive"]}
          />
          <SelectField
            label="Employment Type"
            name="employmentType"
            value={personalForm.employmentType}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
            options={[
              "Full Time",
              "Part Time",
              "Visiting Consultant",
              "Home Visit Therapist",
              "Intern / Trainee",
            ]}
          />
          <Field
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={personalForm.joiningDate}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
          />
          <Field
            label="Exit Date"
            name="exitDate"
            type="date"
            value={personalForm.exitDate}
            onChange={handlePersonalChange}
            editable={isEditingPersonal}
          />
        </div>
      </div>

      {/* ================= PATIENT LOOK ================= */}
      <div className="bg-white border rounded-lg p-5 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Patient Look
        </h2>

        {patients.length === 0 ? (
          <p className="text-sm text-gray-500">No patients assigned</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => {
              const p = patient.personalDetails;

              return (
                <div
                  key={patient._id}
                  className="border rounded-lg p-4 flex flex-col justify-between hover:shadow transition"
                >
                  {/* Patient Info */}
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-gray-600">
                      {p.age} yrs • {p.gender}
                    </p>
                    <p className="text-gray-600">
                      Patient ID:{" "}
                      <span className="font-medium">{p.patientId}</span>
                    </p>
                    <p className="text-gray-500 truncate">
                      Complaint: {p.chiefComplaint || "-"}
                    </p>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => navigate(`/PatientDetails/${patient._id}`)}
                    className="mt-3 text-sm text-blue-600 hover:underline self-start"
                  >
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;

const Field = ({
  label,
  value,
  name,
  editable,
  disabled,
  onChange,
  type = "text",
  min,
  showPassword,
  setShowPassword,
}) => {
  const formatDate = (date) => {
    if (!date) return "DD/MM/YYYY";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const isPassword = label === "Password";

  return (
    <div className="flex flex-col relative">
      <span className="text-xs text-gray-500">{label}</span>

      {/* ================= EDIT MODE ================= */}
      {editable && !disabled ? (
        <div className="relative">
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            min={min}
            onWheel={(e) => e.target.blur()}
            className="border rounded px-3 py-2 text-sm w-full pr-10"
          />

          {/* Eye Icon for password */}
          {isPassword && (
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
        </div>
      ) : (
        /* ================= VIEW MODE ================= */
        <span className="font-medium text-gray-800 flex items-center gap-2">
          {isPassword
            ? showPassword
              ? value || "-"
              : "********"
            : label === "Joining Date" || label === "Exit Date"
              ? formatDate(value)
              : value || "-"}

          {label === "Experience" && " Years"}

          {isPassword && (
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

const SelectField = ({ label, name, value, options, editable, onChange }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>

    {editable ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-3 py-2 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <span className="font-medium text-gray-800">{value || "-"}</span>
    )}
  </div>
);
