import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateEmployeeForm = ({
  onClose,
  lastEmployeeNumber,
  fetchEmployeeData,
}) => {
  const [formData, setFormData] = useState({
    employeeId: lastEmployeeNumber || "MR-EMP-0001",
    fullName: "",
    qualification: "",
    registrationNo: "",
    experience: "",
    contactNumber: "",
    email: "",
    password: "",
    workingBranch: "",
    status: "Active",
    employmentType: "",
    joiningDate: "",
    exitDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // TEMP auto ID (backend should generate real one)
    setFormData((prev) => ({
      ...prev,
      employeeId: lastEmployeeNumber || "MR-EMP-0001",
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert input value to Date
    const newDate = value ? new Date(value) : null;

    if (name === "joiningDate" && formData.exitDate) {
      const exitDate = new Date(formData.exitDate);

      if (newDate > exitDate) {
        alert("Joining date cannot be after exit date");
        return;
      }
    }

    // if (name === "exitDate" && formData.joiningDate) {
    //   const joiningDate = new Date(formData.joiningDate);

    //   if (newDate < joiningDate) {
    //     alert("Exit date cannot be before joining date");
    //     return;
    //   }
    // }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    } = formData;

    if (
      !fullName ||
      !qualification ||
      !registrationNo ||
      !employmentType ||
      !joiningDate ||
      !password ||
      !workingBranch ||
      !status
    ) {
      alert("Please fill all required fields");
      return false;
    }

    if (experience < 0) {
      alert("Experience cannot be negative");
      return false;
    }

    if (!/^[0-9]{10}$/.test(contactNumber)) {
      alert("Contact number must be 10 digits");
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Invalid email format");
      return false;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return false;
    }
    // if (!exitDate) {
    //   if (joiningDate > exitDate) {
    //     alert("Exit date cannot be before joining date");
    //     return false;
    //   }
    // }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateEmployee()) return;

    //   router -> api/employee/createEmployee
    try {
      console.log("form data", formData);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/createEmployee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             token: localStorage.getItem("webapptoken"),
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("result employee  , , , ", result);
      if (result?.success) {
        alert(result?.message);
        fetchEmployeeData();
        setFormData({
          employeeId: lastEmployeeNumber || "MR-EMP-0001",
          fullName: "",
          qualification: "",
          registrationNo: "",
          experience: "",
          contactNumber: "",
          email: "",
          password: "",
          workingBranch: "",
          status: "Active",
          employmentType: "",
          joiningDate: "",
          exitDate: "",
        });
        onClose();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to create employee", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg p-6 max-h-[80%] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create Employee</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <Input label="Employee ID" value={formData.employeeId} readOnly />
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />

          <Input
            label="Qualification / Specialization"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
          <Input
            label="Registration No"
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleChange}
          />

          <Input
            label="Experience (Years)"
            name="experience"
            type="number"
            min={0}
            value={formData.experience}
            onChange={handleChange}
          />
          <Input
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setFormData((p) => ({ ...p, contactNumber: value }));
            }}
          />

          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Input
            label="Working Branch"
            name="workingBranch"
            value={formData.workingBranch}
            onChange={handleChange}
          />

          <Select
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            options={[
              "Full Time",
              "Part Time",
              "Visiting Consultant",
              "Home Visit Therapist",
              "Intern / Trainee",
            ]}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={["Active", "Inactive"]}
          />

          <Input
            label="Date of Joining"
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
          />
          <Input
            label="Date of Exit"
            type="date"
            name="exitDate"
            value={formData.exitDate}
            onChange={handleChange}
          />

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
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
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, readOnly, ...props }) => (
  <div>
    {console.log("props", props)}
    <label className="block text-sm mb-1">
      {label}
      {label !== "Date of Exit" && <span className="text-red-500">*</span>}
    </label>
    <div className="flex items-center justify-between gap-2">
      <input
        {...props}
        {...(props?.showPassword && { type: "text" })}
        // type="text"
        readOnly={readOnly}
        className={`w-full border p-2 rounded ${readOnly ? "bg-gray-100" : ""}`}
      />
      {label === "Password" &&
        (props?.showPassword ? (
          <button
            type="button"
            onClick={() => props?.setShowPassword(false)}
            className="text-gray-500"
          >
            <FaEye />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => props?.setShowPassword(true)}
            className="text-gray-500"
          >
            <FaEyeSlash />
          </button>
        ))}
    </div>
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <select {...props} className="w-full border p-2 rounded">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default CreateEmployeeForm;
