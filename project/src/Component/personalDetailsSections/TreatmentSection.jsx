import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssessmentDetailsModal from "../showAssesmentDetails/AssessmentDetailsModal";

const TreatmentSection = ({ treatment, patientDetail }) => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const activeTab = "Treatment Plan";
  const goTo = (path) => {
    navigate(path, { state: { patient: patientDetail } });
  };
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
      <h2 className="font-semibold text-lg mb-3">Treatment</h2>

      <button
        onClick={() => goTo("/treatmentPlan")}
        className="px-3 py-1 mb-2 text-sm border rounded hover:bg-gray-100"
      >
        Add Treatment
      </button>

      {treatment?.length === 0 ? (
        <p className="text-sm text-gray-500">No treatment history</p>
      ) : (
        <ul className="text-sm list-disc ml-5">
          {treatment?.map((t, i) => (
            <li
              key={i}
              onClick={() => {
                setSelectedRecord(t);
                setOpenModal(true);
              }}
              className="cursor-pointer"
            >
              {i + 1} Treatment{t.name} - {formatDateTime(t?.createdAt)}
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

export default TreatmentSection;
