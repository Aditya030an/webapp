import { assessmentFieldConfig } from "./assessmentFieldConfig";
import { pdf } from "@react-pdf/renderer";
import AssessmentPdf from "../pdf/AssessmentPdf";

const AssessmentDetailsModal = ({
  open,
  onClose,
  data,
  title,
  assessmentType,
  onDownloadPdf,
}) => {
  if (!open || !data) return null;

  const fields = assessmentFieldConfig[assessmentType] || [];

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadPdf = async () => {
    const blob = await pdf(
      <AssessmentPdf data={data} assessmentType={assessmentType} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${assessmentType}-assessment.pdf`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xs text-gray-500">
            Created on:{" "}
            {new Date(data.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {fields.map((field) => {
            const value = data[field.key];

            // 🔹 TABLE (Obesity weightChart)
            if (field.type === "table") {
              return (
                <div key={field.key}>
                  <h3 className="font-semibold mb-2">{field.label}</h3>

                  {!value?.length ? (
                    <p className="text-sm text-gray-500">No data available</p>
                  ) : (
                    <table className="w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          {field.columns.map((col) => (
                            <th
                              key={col.key}
                              className="border px-2 py-1 text-left"
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {value.map((row, idx) => (
                          <tr key={idx}>
                            {field.columns.map((col) => (
                              <td key={col.key} className="border px-2 py-1">
                                {col.type === "date"
                                  ? formatDate(row[col.key])
                                  : row[col.key] || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            }

            // 🔹 NORMAL FIELD
            return (
              <div
                key={field.key}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <span className="text-gray-500 font-medium">{field.label}</span>
                <span>
                  {field.type === "date"
                    ? formatDate(value)
                    : typeof value === "object"
                    ? "-"
                    : value || "-"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetailsModal;
