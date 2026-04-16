import React from "react";

const PersonalInfoSection = ({ personalDetails }) => {

  console.log("personal details patient" , personalDetails);
  return (
    <section className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-3">Personal Information</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>
          <b>Name:</b> {personalDetails?.name}
        </p>
        <p>
          <b>Age:</b> {personalDetails?.age}
        </p>
        <p>
          <b>Gender:</b> {personalDetails?.gender}
        </p>
        <p>
          <b>Phone:</b> {personalDetails?.contactNumber}
        </p>
        <p>
          <b>Address:</b> {personalDetails?.address}
        </p>
        <p>
          <b>Patient ID:</b> {personalDetails?.patientId}
        </p>
        <p className="">
          <b>Chief Complaint:</b> {personalDetails?.chiefComplaint}
        </p>
        <p>
          <b>Patient Status:</b> {personalDetails?.patientStatus ? "Active": "In-Active"}
        </p>
      </div>
    </section>
  );
};

export default PersonalInfoSection;
