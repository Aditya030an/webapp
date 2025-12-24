import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Obesity = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    bmi: "",
    medicalHistory: "",
    armGirth: "",
    thighGirth: "",
    chest: "",
    abdomenUmbilicus: "",
    abdomenXiphoid: "",
    abdomenAsis: "",
    weightChart: Array(5).fill({ date: "", before: "", after: "" }),
    summary: "",
  });

  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChartChange = (index, field, value) => {
    const newChart = [...formData.weightChart];
    newChart[index] = { ...newChart[index], [field]: value };
    setFormData((prev) => ({ ...prev, weightChart: newChart }));
  };
  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        if (id) {
          const dataResponse = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/assessment/getobesity/${id}`,
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
            fullName: data?.patientName,
            age: data?.age,
            sex: data?.sex,
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

    try {
      const endpoint = id
        ? `${
            import.meta.env.VITE_BACKEND_URL
          }/api/assessment/updateObesity/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/assessment/obesity`;
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
          sex: "",
          height: "",
          weight: "",
          bmi: "",
          medicalHistory: "",
          armGirth: "",
          thighGirth: "",
          chest: "",
          abdomenUmbilicus: "",
          abdomenXiphoid: "",
          abdomenAsis: "",
          weightChart: Array(5).fill({ date: "", before: "", after: "" }),
          summary: "",
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
                  <strong>Sex:</strong> {item?.data?.sex}
                </p>
                <p>
                  <strong>Height:</strong> {item?.data?.height}
                </p>
                <p>
                  <strong>Weight:</strong> {item?.data?.weight}
                </p>
                <p>
                  <strong>BMI:</strong> {item?.data?.bmi}
                </p>
                <p>
                  <strong>Medical History:</strong> {item?.data?.medicalHistory}
                </p>
                <p>
                  <strong>Arm Girth:</strong> {item?.data?.armGirth}
                </p>
                <p>
                  <strong>Thigh Girth:</strong> {item?.data?.thighGirth}
                </p>
                <p>
                  <strong>Chest:</strong> {item?.data?.chest}
                </p>
                <p>
                  <strong>Abdomen (Umbilicus):</strong>{" "}
                  {item?.data?.abdomenUmbilicus}
                </p>
                <p>
                  <strong>Abdomen (Xiphoid):</strong>{" "}
                  {item?.data?.abdomenXiphoid}
                </p>
                <p>
                  <strong>Abdomen (ASIS):</strong> {item?.data?.abdomenAsis}
                </p>

                <div className="mt-4">
                  <h3 className="font-bold">Weight Chart</h3>
                  <table className="w-full border mt-2">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Date</th>
                        <th className="border px-2 py-1">Before</th>
                        <th className="border px-2 py-1">After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.data?.weightChart?.map((entry, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">{entry.date}</td>
                          <td className="border px-2 py-1">{entry.before}</td>
                          <td className="border px-2 py-1">{entry.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4">
                  <strong>Summary:</strong> {item?.data?.summary}
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
          <h1 className="text-3xl font-bold text-center text-purple-600">
            Obesity Management Assessment Form
          </h1>

          {/* Patient Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="input"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                readOnly
              />
              <input
                className="input"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                readOnly
              />
              <input
                className="input"
                type="text"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                placeholder="Sex"
                readOnly
              />
              <input
                className="input"
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height (cm)"
              />
              <input
                className="input"
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight (kg)"
              />
              <input
                className="input"
                type="text"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                placeholder="BMI"
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
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Any known medical conditions, medications, or previous treatments"
            />
          </section>

          {/* Body Measurements */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Body Measurements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="input"
                type="text"
                name="armGirth"
                value={formData.armGirth}
                onChange={handleChange}
                placeholder="Arm Girth (cm)"
              />
              <input
                className="input"
                type="text"
                name="thighGirth"
                value={formData.thighGirth}
                onChange={handleChange}
                placeholder="Thigh Girth (cm)"
              />
              <input
                className="input"
                type="text"
                name="chest"
                value={formData.chest}
                onChange={handleChange}
                placeholder="Chest (cm)"
              />
              <input
                className="input"
                type="text"
                name="abdomenUmbilicus"
                value={formData.abdomenUmbilicus}
                onChange={handleChange}
                placeholder="Abdomen at Umbilicus (cm)"
              />
              <input
                className="input"
                type="text"
                name="abdomenXiphoid"
                value={formData.abdomenXiphoid}
                onChange={handleChange}
                placeholder="Abdomen at Xiphoid Process (cm)"
              />
              <input
                className="input"
                type="text"
                name="abdomenAsis"
                value={formData.abdomenAsis}
                onChange={handleChange}
                placeholder="Abdomen at ASIS (cm)"
              />
            </div>
          </section>

          {/* Per Day Weight Chart */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Per Day Weight Chart (Before & After Treatment)
            </h2>
            <div className="space-y-4">
              {formData.weightChart.map((entry, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    className="input"
                    type="date"
                    value={entry.date}
                    onChange={(e) =>
                      handleChartChange(i, "date", e.target.value)
                    }
                  />
                  <input
                    className="input"
                    type="text"
                    value={entry.before}
                    onChange={(e) =>
                      handleChartChange(i, "before", e.target.value)
                    }
                    placeholder="Before Treatment Weight (kg)"
                  />
                  <input
                    className="input"
                    type="text"
                    value={entry.after}
                    onChange={(e) =>
                      handleChartChange(i, "after", e.target.value)
                    }
                    placeholder="After Treatment Weight (kg)"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Assessment Summary */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Physiotherapist's Summary
            </h2>
            <textarea
              className="input h-32"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Overall assessment and plan"
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

export default Obesity;
