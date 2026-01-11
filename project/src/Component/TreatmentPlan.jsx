import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import AssessmentDetailsModal from "./showAssesmentDetails/AssessmentDetailsModal";

const TreatmentPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location?.state?.patient;
  const patientDetail = location?.state?.patient?.personalDetails;
  const patient_id = location?.state?.patient?._id;

  console.log("patient inside the treatment", patient);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exercises: "",
    progressionStrategy: "",
  });

  const [activeRecords, setActiveRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const activeTab = "Treatment Plan";

  const formatDateTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const [plans, setPlans] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const forms = patient?.treatment;
    console.log("forms", forms);
    if (forms?.length) {
      setFormData((prev) => ({
        ...prev, 
        exercises: forms[0]?.exercises,
        progressionStrategy: forms[0]?.progressionStrategy
      }));
    }
    setActiveRecords([...forms].reverse());
  }, [patient]);

  console.log("formData", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      patientId: patient_id,
      formData: formData,
    };
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/treatmentPlan/createTreatmentPlane`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify(payLoad),
        }
      );
      const result = await response.json();
      console.log("result create ", result);
      if (result?.success) {
        alert(result?.message);
        setFormData({ exercises: "", progressionStrategy: "" }); // Reset
        navigate(`/PatientDetails/${patient_id}`);
      } else {
        alert(result?.message);
      }
    } catch (error) {
      console.log("error inside creating the treatment place", error);
      alert("error");
    } finally {
      setLoading(false);
    }
  };



  const handleDownloadPDF = (plan) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Treatment Plan", 20, 20);

    doc.setFontSize(12);

    const marginLeft = 20;
    let currentHeight = 40;

    const exercisesLines = doc.splitTextToSize(
      `Exercises: ${plan.exercises}`,
      170
    );
    doc.text(exercisesLines, marginLeft, currentHeight);
    currentHeight += exercisesLines.length * 10;

    const strategyLines = doc.splitTextToSize(
      `Progression Strategy: ${plan.progressionStrategy}`,
      170
    );
    doc.text(strategyLines, marginLeft, currentHeight);
    currentHeight += strategyLines.length * 10;

    const dateLine = `Created At: ${new Date(plan.createdAt).toLocaleString()}`;
    doc.text(dateLine, marginLeft, currentHeight);

    doc.save(`treatment-plan-${plan._id}.pdf`);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div>
        <h2>History</h2>
        {activeRecords.length === 0 ? (
          <p className="text-sm text-gray-500">No {activeTab} records</p>
        ) : (
          <ul className="text-sm list-disc ml-5 p-2">
            {activeRecords?.map((item, index) => (
              <li
                key={item?._id}
                onClick={() => {
                  setSelectedRecord(item);
                  setOpenModal(true);
                }}
                className="cursor-pointer "
              >
                {activeTab} Assessment #{index + 1} -{" "}
                {formatDateTime(item?.createdAt)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Treatment Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              Exercises / Modalities / Frequency / Duration
            </label>
            <textarea
              name="exercises"
              value={formData.exercises}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Progression Strategy</label>
            <textarea
              name="progressionStrategy"
              value={formData.progressionStrategy}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Create Treatment Plan"}
          </button>
        </form>
      </div>

      {/* <div className="max-w-7xl mx-auto mt-8">
        <h3 className="text-xl font-semibold mb-4">All Treatment Plans</h3>
        {plans?.length === 0 ? (
          <p>No plans found.</p>
        ) : (
          <div className="grid gap-4">
            {plans?.map((plan) => (
              <div
                key={plan?._id}
                className="bg-white p-4 rounded shadow relative"
              >
                <p>
                  <strong>Exercises:</strong> {plan?.exercises}
                </p>
                <p>
                  <strong>Progression:</strong> {plan?.progressionStrategy}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  Created: {new Date(plan.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDownloadPDF(plan)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div> */}
      <AssessmentDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRecord}
        title={`${activeTab} Assessment`}
        assessmentType={activeTab}
        onDownloadPdf={() => {
          console.log("Download PDF for", activeTab, selectedRecord);
        }}
      />
    </div>
  );
};

export default TreatmentPlan;
