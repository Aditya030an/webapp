import React, { useState } from "react";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import AttendancePdf from "../pdf/AttendancePdf";
import PdfAssessmentContent from "../pdf/PdfAssessmentContent";
import PdfAttendanceContent from "../pdf/PdfAttendanceContent";

const AttendanceSection = ({ attendance, personalDetails, id }) => {
  console.log("att", attendance);
  const currentDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(currentDate);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !status) {
      alert("Please select date and status");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/attendance/createEmployeeAttendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("webapptoken"),
          },
          body: JSON.stringify({
            employeeId: id,
            date,
            status,
          }),
        },
      );

      const result = await res.json();
      console.log("result", result);
      if (result.success) {
        alert("Attendance added");
        window.location.reload(); // or refetch patient
      } else {
        if (
          result?.code === "TOKEN_EXPIRED" ||
          result?.code === "INVALID_TOKEN"
        ) {
          alert(result?.message + " Please login again");
          localStorage.removeItem("webapptoken");
          window.location.reload();
        } else {
          alert(result?.message);
        }
      }
    } catch (error) {
      alert("Error adding attendance");
      console.log("err", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAttendancePdf = async (attendance, personalDetails) => {
    const blob = await pdf(
      <AttendancePdf
        attendance={attendance}
        personalDetails={personalDetails}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-report.pdf";
    link.click();
  };

  return (
    <section className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-3">Attendance</h2>

      {/* ➕ ADD ATTENDANCE FORM */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-3 py-1 text-sm border rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Add"}
        </button>
        <PDFDownloadLink
          document={
            <PdfAttendanceContent
              attendance={attendance}
              patient={personalDetails}
            />
          }
          fileName={`Attendance-${personalDetails?.fullName}.pdf`}
        >
          {({ loading }) => (
            <button className="px-3 w-full bg-green-600 text-white py-1 rounded-md text-sm hover:bg-green-700">
              {loading ? "Generating PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* 📋 ATTENDANCE LIST */}
      {/* 📋 ATTENDANCE TABLE */}
      {attendance?.length === 0 ? (
        <p className="text-sm text-gray-500">No attendance records</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Date</th>
                <th className="border px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2">
                    {new Date(a.date).toLocaleDateString("en-IN")}
                  </td>
                  <td
                    className={`border px-3 py-2 font-medium ${
                      a.status === "Present" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AttendanceSection;
