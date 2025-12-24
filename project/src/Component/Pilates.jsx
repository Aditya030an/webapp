import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const Pilates = () => {
  const { id } = useParams();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        if (id) {
          const dataResponse = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/assessment/getpilates/${id}`,
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
            fullName: data?.patientName || "",
            age: data?.age || "",
            gender: data?.sex || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    fetchPersonalDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    try {
      const endpoint = id
        ? `${
            import.meta.env.VITE_BACKEND_URL
          }/api/assessment/updatePilates/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/assessment/pilates`;

      const method = id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
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
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

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
                {new Date(item?.updatedAt).toLocaleString("en-IN")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Full Name:</strong> {item?.data?.fullName}
                </p>
                <p>
                  <strong>Age:</strong> {item?.data?.age}
                </p>
                <p>
                  <strong>Gender:</strong> {item?.data?.gender}
                </p>
                <p>
                  <strong>Medical History:</strong> {item?.data?.medicalHistory}
                </p>
                <p>
                  <strong>Exercise Frequency:</strong>{" "}
                  {item?.data?.exerciseFrequency}
                </p>
                <p>
                  <strong>Pilates Goals:</strong> {item?.data?.pilatesGoals}
                </p>
                <p>
                  <strong>Posture Notes:</strong> {item?.data?.postureNotes}
                </p>
                <p>
                  <strong>Pain Areas:</strong> {item?.data?.painAreas}
                </p>
                <p>
                  <strong>Physiotherapist Summary:</strong>{" "}
                  {item?.data?.physiotherapistSummary}
                </p>
              </div>
            </div>
          ))
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
        </div>
      </form>
    </div>
  );
};

export default Pilates;
