import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssessmentDetailsModal from "../showAssesmentDetails/AssessmentDetailsModal";

const assessmentItems = [
  { name: "Neurological", key: "neurologicalFormId", path: "/assessment" },
  {
    name: "Musculoskeletal",
    key: "musculoskeletalFormId",
    path: "/musculoskeletal",
  },
  { name: "Obesity Management", key: "obesityFormId", path: "/obesity" },
  { name: "Pilates", key: "pilatesPhysioFormId", path: "/pilates" },
  // { name: "Treatment Plan", key: "treatmentPlan", path: "/treatmentPlan" },
];

const AssessmentSection = ({ assessment, patientDetail }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Neurological");
  const [activeRecords, setActiveRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  console.log("assessment", assessment);

  const goTo = (path) => {
    navigate(path, { state: { patient: patientDetail } });
  };

  useEffect(() => {
    const selected = assessmentItems.find((i) => i.name === activeTab);
    if (!selected) return;

    const records = assessment?.[selected.key] || [];
    const sorted = [...records].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setActiveRecords(sorted);
  }, [activeTab, assessment]);
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

  return (
    <section className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-3">Assessment</h2>
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {assessmentItems.map((item) => (
          <button
            key={item.name}
            onClick={() => goTo(item.path)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
           Add {item.name}
          </button>
        ))}
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {assessmentItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`px-3 py-1 text-sm border rounded ${
              activeTab === item.name ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
      {/* Records */}
      {activeRecords.length === 0 ? (
        <p className="text-sm text-gray-500">No {activeTab} records</p>
      ) : (
        <ul className="text-sm list-disc ml-5">
          {activeRecords?.map((item, index) => (
            <li
              key={item?._id}
              onClick={() => {
                setSelectedRecord(item);
                setOpenModal(true);
              }}
              className="cursor-pointer"
            >
              {activeTab} Assessment #{index + 1} -{" "}
              {formatDateTime(item?.createdAt)}
            </li>
          ))}
        </ul>
      )}
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
    </section>
  );
};

export default AssessmentSection;
