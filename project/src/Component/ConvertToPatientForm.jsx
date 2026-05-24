import React, { useEffect, useState } from "react";

const ConvertToPatientForm = ({ selectedEnquiry, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contactNumber: "",
    address: "",
    chiefComplaint: "",
    enquiryStatus: "patient",
    remark: "",
    response: "",
    source: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEnquiry) {
      setFormData({
        name: selectedEnquiry.patientName || "",
        age: selectedEnquiry.age || "",
        gender: selectedEnquiry.gender || "",
        contactNumber: selectedEnquiry.contactNumber || "",
        address: "",
        chiefComplaint: selectedEnquiry.chiefComplaint || "",
        enquiryStatus: "patient",
        remark: selectedEnquiry?.remark || "",
      });
    }
  }, [selectedEnquiry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const {
      name,
      age,
      gender,
      contactNumber,
      address,
      chiefComplaint,
      enquiryStatus,
      remark,
      response,
      source,
    } = formData;

    if (
      !name ||
      !gender ||
      !age ||
      !contactNumber ||
      !chiefComplaint ||
      !address ||
      !enquiryStatus ||
      !remark ||
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

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    };

    onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 h-[600px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Convert Lead to Patient</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Select
              label="Gender"
              value={formData.gender}
              name="gender"
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />
            <Input
              label="Phone Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              maxLength={10}
            />
          </div>

          {/* ONLY EDITABLE FIELD */}
          <Textarea
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <Textarea
            label="Chief Complaint"
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
          />

          <Input label="Status" value="Patient" readOnly />

          <Textarea
            label="Remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
          />
          <div className="flex items-center justify-between gap-3">
            <FormField
              label="Response"
              name="response"
              type="select"
              options={["Pending", "Done", "Deny"]}
              value={formData.response}
              onChange={handleChange}
              required={true}
            />
            <FormField
              label="Source"
              name="source"
              type="select"
              options={["Walk-in", "Phone", "Referral", "Online"]}
              value={formData.source}
              onChange={handleChange}
              required={true}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Converting..." : "Convert to Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------- INPUT COMPONENTS -------------------- */

const Input = ({ label, maxLength, readOnly, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      {...props}
      readOnly={readOnly}
      maxLength={maxLength}
      className={`w-full border rounded-md p-2 ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
      }`}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <select {...props} className="w-full border rounded-md p-2 bg-white">
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, readOnly, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <textarea
      {...props}
      readOnly={readOnly}
      rows="1"
      className={`w-full border rounded-md p-2 ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const FormField = ({
  label,
  required,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  maxLength,
  min,
}) => (
  <div className="w-full">
    <label className="block mb-1 flex gap-2 items-center">
      {label}
      {required && <p className="text-red-600">*</p>}
    </label>
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
        maxLength={maxLength}
        min={min}
      />
    )}
  </div>
);

export default ConvertToPatientForm;
