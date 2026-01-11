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
  });

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
      });
    }
  }, [selectedEnquiry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.address){
      alert("Please fill in all the required fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Convert Lead to Patient
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <Input label="Name" value={formData.name} readOnly />
            <Input label="Age" value={formData.age} readOnly />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Select
              label="Gender"
              value={formData.gender}
              disabled
              options={["Male", "Female", "Other"]}
            />
            <Input
              label="Phone Number"
              value={formData.contactNumber}
              readOnly
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
            value={formData.chiefComplaint}
            readOnly
          />

          <Input label="Status" value="Patient" readOnly />

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
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Convert to Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------- INPUT COMPONENTS -------------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      {...props}
      className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
    >
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
    <label className="block text-sm font-medium mb-1">{label}</label>
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

export default ConvertToPatientForm;
