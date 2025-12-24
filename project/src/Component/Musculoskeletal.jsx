import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Musculoskeletal = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    sex: "",
    occupation: "",
    address: "",
    contactNumber: "",
    referredBy: "",
    dateOfEvaluation: "",
    chiefComplaint: "",
    historyOfPresentIllness: "",
    durationOfCondition: "",
    onset: "",
    aggravatingFactors: "",
    medicalHistory: "",
    surgicalHistory: "",
    familyHistory: "",
    personalHistory: "",
    posture: "",
    scars: "",
    tenderness: "",
    temperature: "",
    typeofPain: "",
    siteOfPain: "",
    duration: "",
    vasScore: 0,
    jointROM: "",
    painDuringMovement: "",
    mmt: "",
    muscleWeakness: "",
    mentionSpecificTests: "",
    gait: "",
    assistiveDevices: "",
    functionalIndependence: "",
    xray: "",
    summarizeClinicalProblems: "",
    shortTermGoals: "",
    longTermGoals: "",
    patientConsent: "",
    physiotherapistName: "",
    signature: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        if (id) {
          const dataResponse = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/assessment/getmusculoskeletal/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
              },
            }
          );
          const dataResult = await dataResponse.json();
          console.log("data", dataResult);
          if (dataResult.success && dataResult.form) {
            setFormData((prev) => ({
              ...prev,
              ...dataResult.form, // This will spread all matching keys into formData
            }));
            setHistory(dataResult?.form?.history);
          }
        } else {
          const response = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/enquiry/getPersonalDetails`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
              },
            }
          );
          const result = await response.json();
          const data = result?.enquiryPersonalDetails?.[0];
          console.log(data);
          setFormData((prev) => ({
            ...prev,
            patientName: data?.patientName,
            age: data?.age,
            sex: data?.sex,
            occupation: data?.occupation,
            contactNumber: data?.contactNumber,
            chiefComplaint: data?.chiefComplaint,
          }));
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    fetchPersonalDetails();
  }, [id]);

  const validateForm = () => {
    const { patientName, age, contactNumber, chiefComplaint, address } =
      formData;

    if (!patientName || !age || !contactNumber || !chiefComplaint || !address) {
      alert("Please fill in all the required fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    try {
      const endpoint = id
        ? `${
            import.meta.env.VITE_BACKEND_URL
          }/api/assessment/updateMusculoskeletal/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/assessment/musculoskeletal`;

      const method = id ? "PUT" : "POST";

      const cleanFormData = { ...formData };
      delete cleanFormData.history;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(cleanFormData),
      });

      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        alert(result.message);
        setFormData({
          patientName: "",
          age: "",
          sex: "",
          occupation: "",
          address: "",
          contactNumber: "",
          referredBy: "",
          dateOfEvaluation: "",
          chiefComplaint: "",
          historyOfPresentIllness: "",
          durationOfCondition: "",
          onset: "",
          aggravatingFactors: "",
          medicalHistory: "",
          surgicalHistory: "",
          familyHistory: "",
          personalHistory: "",
          posture: "",
          scars: "",
          tenderness: "",
          temperature: "",
          typeOfPain: "",
          siteOfPain: "",
          duration: "",
          vasScore: 0,
          jointROM: "",
          painDuringMovement: "",
          mmt: "",
          muscleWeakness: "",
          mentionSpecificTests: "",
          gait: "",
          assistiveDevices: "",
          functionalIndependence: "",
          xray: "",
          summarizeClinicalProblems: "",
          shortTermGoals: "",
          longTermGoals: "",
          patientConsent: "",
          physiotherapistName: "",
          signature: "",
          date: "",
        });
        setHistory(result?.updatedForm?.history);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  console.log("history data", history);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">History</h1>
        {history?.length === 0 ? (
          <p>No history found</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{index + 1} </strong> <strong>Updated At:</strong>{" "}
                {new Date(item.updatedAt).toLocaleString("en-IN")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Name:</strong> {item.data.patientName}
                </p>
                <p>
                  <strong>Age:</strong> {item.data.age}
                </p>
                <p>
                  <strong>Sex:</strong> {item.data.sex}
                </p>
                <p>
                  <strong>Occupation:</strong> {item.data.occupation}
                </p>
                <p>
                  <strong>Contact:</strong> {item.data.contactNumber}
                </p>
                <p>
                  <strong>Address:</strong> {item.data.address}
                </p>
                <p>
                  <strong>Referred By:</strong> {item.data.referredBy}
                </p>
                <p>
                  <strong>Evaluation Date:</strong>{" "}
                  {new Date(item.data.dateOfEvaluation).toLocaleDateString()}
                </p>
                <p>
                  <strong>Chief Complaint:</strong> {item.data.chiefComplaint}
                </p>
                <p>
                  <strong>Illness History:</strong>{" "}
                  {item.data.historyOfPresentIllness}
                </p>
                <p>
                  <strong>Duration of Condition:</strong>{" "}
                  {item.data.durationOfCondition}
                </p>
                <p>
                  <strong>Onset:</strong> {item.data.onset}
                </p>
                <p>
                  <strong>Aggravating Factors:</strong>{" "}
                  {item.data.aggravatingFactors}
                </p>
                <p>
                  <strong>Medical History:</strong> {item.data.medicalHistory}
                </p>
                <p>
                  <strong>Surgical History:</strong> {item.data.surgicalHistory}
                </p>
                <p>
                  <strong>Family History:</strong> {item.data.familyHistory}
                </p>
                <p>
                  <strong>Personal History:</strong> {item.data.personalHistory}
                </p>
                <p>
                  <strong>Posture:</strong> {item.data.posture}
                </p>
                <p>
                  <strong>VAS Score:</strong> {item.data.vasScore}
                </p>
                <p>
                  <strong>MMT:</strong> {item.data.mmt}
                </p>
                <p>
                  <strong>Gait:</strong> {item.data.gait}
                </p>
                <p>
                  <strong>Physiotherapy Modalities:</strong>{" "}
                  {item.data.physiotherapyModalities}
                </p>
                <p>
                  <strong>Physiotherapist Name:</strong>{" "}
                  {item.data.physiotherapistName}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(item.data.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl my-10 space-y-10"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Orthopedic Physiotherapy Evaluation Form
        </h1>

        {/* SECTION 1: Patient Information */}
        <Section title="Patient Information">
          <Grid>
            <Input
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              readOnly={true}
            />
            <Input
              label="Referred By"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
            />
            <Input
              label="Date of Evaluation"
              type="date"
              name="dateOfEvaluation"
              value={formData.dateOfEvaluation}
              onChange={handleChange}
            />
          </Grid>
        </Section>

        {/* SECTION 2: Present Complaints */}
        <Section title="Presenting Complaints">
          <Textarea
            label="Chief Complaint"
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
            readOnly={true}
          />
          <Textarea
            label="History of Present Illness"
            name="historyOfPresentIllness"
            value={formData.historyOfPresentIllness}
            onChange={handleChange}
          />
          <Textarea
            label="Duration"
            name="durationOfCondition"
            value={formData.durationOfCondition}
            onChange={handleChange}
          />
          <Textarea
            label="Onset (Sudden/Gradual)"
            name="onset"
            value={formData.onset}
            onChange={handleChange}
          />
          <Textarea
            label="Aggravating/Relieving Factors"
            name="aggravatingFactors"
            value={formData.aggravatingFactors}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 3: Past History */}
        <Section title="Medical History">
          <Textarea
            label="Medical History (DM, HTN, etc.)"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
          />
          <Textarea
            label="Surgical History"
            name="surgicalHistory"
            value={formData.surgicalHistory}
            onChange={handleChange}
          />
          <Textarea
            label="Family History"
            name="familyHistory"
            value={formData.familyHistory}
            onChange={handleChange}
          />
          <Textarea
            label="Personal History (Smoking, Alcohol, etc.)"
            name="personalHistory"
            value={formData.personalHistory}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 4: Observation */}
        <Section title="Observation">
          <Textarea
            label="Posture / Gait / Deformities"
            name="posture"
            value={formData.posture}
            onChange={handleChange}
          />
          <Textarea
            label="Muscle Atrophy / Scars / Swelling"
            name="scars"
            value={formData.scars}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 5: Palpation */}
        <Section title="Palpation">
          <Textarea
            label="Tenderness / Swelling / Muscle Spasm"
            name="tenderness"
            value={formData.tenderness}
            onChange={handleChange}
          />
          <Textarea
            label="Temperature / Crepitus / Edema"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 6: Pain Assessment */}
        <Section title="Pain Assessment">
          <Grid>
            <Input
              label="Site of Pain"
              name="siteOfPain"
              value={formData.siteOfPain}
              onChange={handleChange}
            />
            <Input
              label="Type of Pain (Sharp, Dull, Radiating)"
              name="typeOfPain"
              value={formData.typeOfPain}
              onChange={handleChange}
            />
            <Input
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
          </Grid>
          <label className="block font-medium mt-2 mb-1">
            VAS Score (0–10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            className="w-full"
            name="vasScore"
            value={formData.vasScore}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 7: Range of Motion (ROM) */}
        <Section title="Range of Motion (ROM)">
          <Textarea
            label="Joint-wise ROM Evaluation (Active/Passive)"
            name="jointROM"
            value={formData.jointROM}
            onChange={handleChange}
          />
          <Textarea
            label="Pain During Movement"
            name="painDuringMovement"
            value={formData.painDuringMovement}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 8: Muscle Strength Testing */}
        <Section title="Muscle Strength">
          <Textarea
            label="Manual Muscle Testing (MMT) Grade"
            name="mmt"
            value={formData.mmt}
            onChange={handleChange}
          />
          <Textarea
            label="Muscle Weakness / Imbalance"
            name="muscleWeakness"
            value={formData.muscleWeakness}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 9: Special Tests */}
        <Section title="Special Orthopedic Tests">
          <Textarea
            label="Mention Specific Tests Conducted & Outcomes"
            name="mentionSpecificTests"
            value={formData.mentionSpecificTests}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 10: Functional Assessment */}
        <Section title="Functional Assessment">
          <Textarea
            label="Gait / Transfers / Daily Activities"
            name="gait"
            value={formData.gait}
            onChange={handleChange}
          />
          <Textarea
            label="Assistive Devices Used"
            name="assistiveDevices"
            value={formData.assistiveDevices}
            onChange={handleChange}
          />
          <Textarea
            label="Functional Independence Level"
            name="functionalIndependence"
            value={formData.functionalIndependence}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 11: Investigations */}
        <Section title="Investigations / Reports">
          <Textarea
            label="X-ray / MRI / CT Scan / Other"
            name="xray"
            value={formData.xray}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 12: Problem List */}
        <Section title="Problem List">
          <Textarea
            label="Summarize Clinical Problems"
            name="summarizeClinicalProblems"
            value={formData.summarizeClinicalProblems}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 13: Goals */}
        <Section title="Goals of Treatment">
          <Textarea
            label="Short-Term Goals"
            name="shortTermGoals"
            value={formData.shortTermGoals}
            onChange={handleChange}
          />
          <Textarea
            label="Long-Term Goals"
            name="longTermGoals"
            value={formData.longTermGoals}
            onChange={handleChange}
          />
        </Section>

        {/* SECTION 15: Consent & Signature */}
        <Section title="Consent & Signature">
          <Textarea
            label="Patient Consent / Remarks"
            name="patientConsent"
            value={formData.patientConsent}
            onChange={handleChange}
          />
          <Grid>
            <Input
              label="Physiotherapist Name"
              name="physiotherapistName"
              value={formData.physiotherapistName}
              onChange={handleChange}
            />
            <Input
              label="Signature"
              name="signature"
              value={formData.signature}
              onChange={handleChange}
            />
            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Grid>
        </Section>

        {/* Submit Button */}
        <div className="text-center space-y-3">
          {id && (
            <>
              {history?.length >= 2 ? (
                <div className="text-red-600 font-semibold">
                  No update possible. Maximum update limit (2) reached.
                </div>
              ) : (
                <div className="text-green-600 font-semibold">
                  {2 - (history?.length || 0)} update
                  {2 - (history?.length || 0) === 1 ? " is" : "s are"}{" "}
                  remaining.
                </div>
              )}
            </>
          )}

          <div className="space-x-4">
            <button
              type="submit"
              disabled={id && history?.length >= 2}
              className={`${
                id
                  ? history?.length >= 2
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white px-8 py-3 rounded-lg transition`}
            >
              {id ? "Update Evaluation" : "Submit Evaluation"}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Musculoskeletal;

// Reusable Components
const Section = ({ title, children }) => (
  <section>
    <h2 className="text-2xl font-semibold text-blue-600 mb-4">{title}</h2>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, type = "text", name, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1 text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1 text-gray-700">{label}</label>
    <textarea
      rows={3}
      placeholder={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
