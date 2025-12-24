// import React, { useState } from "react";

// const EnquiryForm = () => {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   // console.log("backend Url", backendURL);
//   const [formData, setFormData] = useState({
//     patientName: "",
//     sex: "",
//     age: "",
//     occupation: "",
//     contactNumber: "",
//     email: "",
//     chiefComplaint: "",
//     response: "",
//     source: "",
//     paymentStatus: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const {
//       patientName,
//       sex,
//       age,
//       occupation,
//       contactNumber,
//       email,
//       chiefComplaint,
//       response,
//       source,
//       paymentStatus,
//     } = formData;

//     if (
//       !patientName ||
//       !sex ||
//       !age ||
//       !occupation ||
//       !contactNumber ||
//       !email ||
//       !chiefComplaint ||
//       !response ||
//       !source ||
//       !paymentStatus
//     ) {
//       alert("Please fill in all the required fields.");
//       return false;
//     }

//     const ageNum = parseInt(age);
//     if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
//       alert("Please enter a valid age.");
//       return false;
//     }

//     const contactRegex = /^[0-9]{10}$/;
//     if (!contactRegex.test(contactNumber)) {
//       alert("Please enter a valid 10-digit contact number.");
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       alert("Please enter a valid email address.");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     console.log(formData);

//     try {
//       const response = await fetch(`${backendURL}/api/enquiry/createEnquiry`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       console.log("result inside frontend_+_+_+" , result);
//       if (result?.success) {
//         alert(result?.message);
//         localStorage.setItem("token" , result?.token);
//         setFormData({
//           // Clear form
//           patientName: "",
//           sex: "",
//           age: "",
//           occupation: "",
//           contactNumber: "",
//           email: "",
//           chiefComplaint: "",
//           response: "",
//           source: "",
//           paymentStatus: "",
//         });
//       } else {
//         alert("Failed to submit enquiry: " + result?.message);
//       }
//     } catch (error) {
//       console.error("Error submitting enquiry:", error);
//     }
//   };
//   return (
//     <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-3xl mx-auto mt-10">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//         Add Enquiry
//       </h2>

//       <form className="space-y-6 text-sm">
//         {/* Row 1 */}
//         <div className="flex flex-col md:flex-row gap-6">
//           <FormField
//             label="Patient Name"
//             name="patientName"
//             type="text"
//             value={formData.patientName}
//             onChange={handleChange}
//           />
//           <FormField
//             label="Sex"
//             name="sex"
//             type="select"
//             options={["Male", "Female", "Other"]}
//             value={formData.sex}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Row 2 */}
//         <div className="flex flex-col md:flex-row gap-6">
//           <FormField
//             label="Age"
//             name="age"
//             type="number"
//             value={formData.age}
//             onChange={handleChange}
//           />
//           <FormField
//             label="Occupation"
//             name="occupation"
//             type="text"
//             value={formData.occupation}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Row 3 */}
//         <div className="flex flex-col md:flex-row gap-6">
//           <FormField
//             label="Contact Number"
//             name="contactNumber"
//             type="text"
//             value={formData.contactNumber}
//             onChange={handleChange}
//           />
//           <FormField
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Row 4 */}
//         <div className="flex flex-col md:flex-row gap-6">
//           <FormField
//             label="Chief Complaint"
//             name="chiefComplaint"
//             type="text"
//             value={formData.chiefComplaint}
//             onChange={handleChange}
//           />
//           <FormField
//             label="Response"
//             name="response"
//             type="select"
//             options={["Pending", "Done", "Deny"]}
//             value={formData.response}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Row 5 */}
//         <div className="flex flex-col md:flex-row gap-6">
//           <FormField
//             label="Source"
//             name="source"
//             type="select"
//             options={["Walk-in", "Phone", "Referral", "Online"]}
//             value={formData.source}
//             onChange={handleChange}
//           />
//           <FormField
//             label="Payment Status"
//             name="paymentStatus"
//             type="select"
//             options={["Paid", "Unpaid", "Partially Paid"]}
//             value={formData.paymentStatus}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//           >
//             + Add Enquiry
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // Reusable Form Field Component
// const FormField = ({ label, name, type, value, onChange, options = [] }) => (
//   <div className="w-full">
//     <label className="block text-gray-700 font-medium mb-1">{label}</label>
//     {type === "select" ? (
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         <option value="">-- Select --</option>
//         {options.map((opt, idx) => (
//           <option key={idx} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     ) : (
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={label}
//         className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     )}
//   </div>
// );

// export default EnquiryForm;

import React, { useState, useEffect } from "react";

const EnquiryForm = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [enquiries, setEnquiries] = useState([]);

  const [formData, setFormData] = useState({
    patientName: "",
    sex: "",
    age: "",
    occupation: "",
    contactNumber: "",
    email: "",
    chiefComplaint: "",
    response: "",
    source: "",
    paymentStatus: "",
    amountPerDay: "",
    numberOfDays: "",
    total: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const { amountPerDay, numberOfDays } = formData;
    const amount = parseFloat(amountPerDay);
    const days = parseInt(numberOfDays);
    if (!isNaN(amount) && !isNaN(days)) {
      const calcTotal = amount * days;
      setFormData((prev) => ({ ...prev, total: calcTotal.toFixed(2) }));
    } else {
      setFormData((prev) => ({ ...prev, total: "" }));
    }
  }, [formData.amountPerDay, formData.numberOfDays]);

  const fetchAllEnquiries = async () => {
    try {
      const response = await fetch(`${backendURL}/api/enquiry/getEnquiry`);
      const result = await response.json();
      console.log("enquiry result", result);
      setEnquiries(result.enquiries); // Save the data in state
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  const validateForm = () => {
    const {
      patientName,
      sex,
      age,
      occupation,
      contactNumber,
      email,
      chiefComplaint,
      response,
      source,
      paymentStatus,
    } = formData;

    if (
      !patientName ||
      !sex ||
      !age ||
      !occupation ||
      !contactNumber ||
      !chiefComplaint ||
      !response ||
      !source ||
      !paymentStatus
    ) {
      alert("Please fill in all the required fields.......");
      return false;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      alert("Please enter a valid age.");
      return false;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contactNumber)) {
      alert("Please enter a valid 10-digit contact number.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "") {
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log(formData);

    try {
      const response = await fetch(`${backendURL}/api/enquiry/createEnquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("result inside frontend_+_+_+", result);
      if (result?.success) {
        alert(result?.message);
        localStorage.setItem("token", result?.token);
        fetchAllEnquiries();
        setFormData({
          patientName: "",
          sex: "",
          age: "",
          occupation: "",
          contactNumber: "",
          email: "",
          chiefComplaint: "",
          response: "",
          source: "",
          paymentStatus: "",
          amountPerDay: "",
          numberOfDays: "",
          total: "",
        });
      } else {
        alert("Failed to submit enquiry: " + result?.message);
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
    }
  };

  console.log("enquiries", enquiries);

  return (
    <div className="w-full p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-3xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Add Enquiry
        </h2>

        <form className="space-y-6 text-sm">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              label="Patient Name"
              name="patientName"
              type="text"
              value={formData.patientName}
              onChange={handleChange}
            />
            <FormField
              label="Sex"
              name="sex"
              type="select"
              options={["Male", "Female", "Other"]}
              value={formData.sex}
              onChange={handleChange}
            />
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-6">
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
              type="text"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              label="Contact Number"
              name="contactNumber"
              type="text"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Row 4 */}
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              label="Chief Complaint"
              name="chiefComplaint"
              type="text"
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
          </div>

          {/* Row 5 */}
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              label="Source"
              name="source"
              type="select"
              options={["Walk-in", "Phone", "Referral", "Online"]}
              value={formData.source}
              onChange={handleChange}
            />
            <FormField
              label="Payment Status"
              name="paymentStatus"
              type="select"
              options={["Paid", "Unpaid", "Partially Paid"]}
              value={formData.paymentStatus}
              onChange={handleChange}
            />
          </div>

          {/* Row 6 - Amount, Days */}
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              label="Amount per Day"
              name="amountPerDay"
              type="number"
              value={formData.amountPerDay}
              onChange={handleChange}
            />
            <FormField
              label="Number of Days"
              name="numberOfDays"
              type="number"
              value={formData.numberOfDays}
              onChange={handleChange}
            />
          </div>

          {/* Row 7 - Total */}
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              onChange={() => {}} // make it read-only
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              + Add Enquiry
            </button>
          </div>
        </form>
      </div>

      {enquiries?.length > 0 ? (
        <div className="mt-0">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Enquiries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {enquiries.map((entry) => (
              <div
                key={entry?._id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {entry?.patientName}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span>{" "}
                  {entry?.contactNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Chief Complaint:</span>{" "}
                  {entry?.chiefComplaint}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No enquiries found</div>
      )}
    </div>
  );
};

// Reusable Form Field Component
const FormField = ({ label, name, type, value, onChange, options = [] }) => (
  <div className="w-full">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select --</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        // readOnly={name === "total"}
      />
    )}
  </div>
);

export default EnquiryForm;
