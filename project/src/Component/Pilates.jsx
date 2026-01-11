import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssessmentDetailsModal from "./showAssesmentDetails/AssessmentDetailsModal";
const Pilates = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location?.state?.patient;
  const patientDetail = location?.state?.patient?.personalDetails;
  const patient_id = location?.state?.patient?._id;

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    medicalHistory: "",
    exerciseFrequency: "",
    exerciseType: "",
    pilatesGoals: "",
    postureNotes: "",
    painAreas: "",
    physiotherapistSummary: "",
  });

  const [activeRecords, setActiveRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const activeTab = "Pilates";

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

  const pickAllowedFields = (source, allowedKeys) => {
    const result = {};
    allowedKeys.forEach((key) => {
      if (source[key] !== undefined) {
        result[key] = source[key];
      }
    });
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (patientDetail) {
      setFormData((prev) => ({
        ...prev,
        fullName: patientDetail?.name || "",
        age: patientDetail?.age || "",
        gender: patientDetail?.gender || "",
      }));
    }
  }, [patientDetail]);

  useEffect(() => {
    const forms = patient?.assessment?.pilatesPhysioFormId;

    if (forms?.length) {
      const lastForm = forms[forms.length - 1];

      const allowedKeys = Object.keys(formData);

      const filteredData = pickAllowedFields(lastForm, allowedKeys);

      setFormData((prev) => ({
        ...prev,
        ...filteredData,
      }));

      setActiveRecords([...forms].reverse());
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      patientId: patient_id,
      formData: formData,
    };
    setLoading(true);
    try {
      const endPoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/assessment/pilates`;
      const method = "POST";

      const response = await fetch(endPoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(payLoad),
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        alert(result.message);
        setHistory(result?.updatedForm?.history);
        setFormData({
          fullName: "",
          age: "",
          gender: "",
          medicalHistory: "",
          exerciseFrequency: "",
          exerciseType: "",
          pilatesGoals: "",
          postureNotes: "",
          painAreas: "",
          physiotherapistSummary: "",
        });
        navigate(`/PatientDetails/${patient_id}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log("error inside the nero", error);
      alert("error");
    } finally {
      setLoading(false);
    }
  };

  console.log("active record", activeRecords);
  console.log("selected record", selectedRecord);
  return (
    <div>
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
      <form
        onSubmit={handleSubmit}
        className="w-full min-h-screen bg-gray-50 p-6 overflow-y-auto"
      >
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 space-y-10">
          <h1 className="text-3xl font-bold text-center text-blue-700">
            Pilates Physiotherapy Assessment Form
          </h1>

          {/* Patient Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Patient Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="input"
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                readOnly
              />
              <input
                className="input"
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                readOnly
              />
              <input
                className="input"
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
                readOnly
              />
            </div>
          </section>

          {/* Medical History */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Medical History
            </h2>
            <textarea
              className="input h-32"
              name="medicalHistory"
              placeholder="Medical issues, previous injuries or surgeries"
              value={formData.medicalHistory}
              onChange={handleChange}
            />
          </section>

          {/* Current Activity Level */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Current Activity Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input"
                type="text"
                name="exerciseFrequency"
                placeholder="Exercise Frequency (e.g., daily, weekly)"
                value={formData.exerciseFrequency}
                onChange={handleChange}
              />
              <input
                className="input"
                type="text"
                name="exerciseType"
                placeholder="Type of Exercise (e.g., Yoga, Gym, None)"
                value={formData.exerciseType}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Goals */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Goals for Pilates
            </h2>
            <textarea
              className="input h-32"
              name="pilatesGoals"
              placeholder="What would you like to achieve through Pilates?"
              value={formData.pilatesGoals}
              onChange={handleChange}
            />
          </section>

          {/* Posture & Movement */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Posture & Movement Observations
            </h2>
            <textarea
              className="input h-32"
              name="postureNotes"
              placeholder="Notes on posture, alignment, flexibility"
              value={formData.postureNotes}
              onChange={handleChange}
            />
          </section>

          {/* Pain Areas */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Pain or Discomfort Areas
            </h2>
            <textarea
              className="input h-32"
              name="painAreas"
              placeholder="Describe any current pain/discomfort during movement or rest"
              value={formData.painAreas}
              onChange={handleChange}
            />
          </section>

          {/* Summary */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Physiotherapist's Summary
            </h2>
            <textarea
              className="input h-32"
              name="physiotherapistSummary"
              placeholder="Overall assessment and initial plan"
              value={formData.physiotherapistSummary}
              onChange={handleChange}
            />
          </section>

          {/* Submit */}
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
                disabled={(id && history?.length >= 2) || loading}
                className={`${
                  id
                    ? history?.length >= 2
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-700 hover:bg-green-800"
                    : "bg-blue-700 hover:bg-blue-800"
                } text-white px-8 py-3 rounded-lg transition`}
              >
                {id
                  ? loading
                    ? "Updating..."
                    : "Update Evaluation"
                  : loading
                  ? "Submitting..."
                  : "Submit Evaluation"}
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
        </div>
      </form>
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

export default Pilates;
