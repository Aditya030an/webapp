import  { useState, useEffect } from "react";


const EnquiryForm = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(false);

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
