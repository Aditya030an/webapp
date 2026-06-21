import React, { useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfAttendanceContent from "../pdf/PdfAttendanceContent";

const AttendanceSection = ({ attendance = [], patientDetail, billing = [] }) => {
  const currentDate = new Date().toISOString().split("T")[0];

  // --- Billing summary (counter model: days billed lives on the bills) ---
  const totalPresent = attendance.filter((a) => a?.status === "Present").length;
  // Prefer stored sessionsBilled; fall back to the session row (items[0].qty)
  // so a bill saved without the field still counts toward "billed".
  const billedSessions = billing.reduce(
    (s, b) => s + (b?.sessionsBilled || b?.items?.[0]?.qty || 0),
    0,
  );
  const remainingSessions = Math.max(0, totalPresent - billedSessions);

  const [date, setDate] = useState(currentDate);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  const monthOptions = useMemo(() => {
    const months = attendance
      ?.filter((a) => a.date)
      .map((a) => {
        const value = new Date(a.date).toISOString().slice(0, 7);

        return {
          value,
          label: new Date(value + "-01").toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          }),
        };
      });

    return [...new Map(months.map((item) => [item.value, item])).values()];
  }, [attendance]);

  const filteredAttendance = selectedMonth
    ? attendance.filter((a) => {
        const recordMonth = new Date(a.date).toISOString().slice(0, 7);
        return recordMonth === selectedMonth;
      })
    : attendance;

  const handleSubmit = async () => {
    if (!date || !status) {
      alert("Please select date and status");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/attendance/createAttendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            patientId: patientDetail._id,
            date,
            status,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        alert("Attendance added");
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error adding attendance");
      console.log("err", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border rounded-lg p-3 sm:p-4 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-lg">
            Attendance{" "}
            <span className="text-gray-600 font-medium text-sm">
              ({filteredAttendance?.length || 0})
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-600">
            <span>
              Present: <b className="text-gray-900">{totalPresent}</b>
            </span>
            <span>
              Billed: <b className="text-gray-900">{billedSessions}</b>
            </span>
            <span>
              Remaining to bill:{" "}
              <b
                className={
                  remainingSessions > 0 ? "text-blue-600" : "text-green-600"
                }
              >
                {remainingSessions}
              </b>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            Filter by month:
          </label>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full sm:w-52 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Months</option>

            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          {selectedMonth && (
            <button
              onClick={() => setSelectedMonth("")}
              className="text-sm text-blue-600 hover:underline text-left sm:text-center"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded text-sm "
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded text-sm "
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-4 py-2 text-sm border rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 w-full lg:w-auto"
        >
          {loading ? "Saving..." : "Add"}
        </button>

        <PDFDownloadLink
          document={
            <PdfAttendanceContent
              attendance={filteredAttendance}
              patient={patientDetail?.personalDetails}
              month={selectedMonth}
            />
          }
          fileName={
            selectedMonth
              ? `Attendance-${patientDetail?.personalDetails?.name}-${selectedMonth}.pdf`
              : `Attendance-${patientDetail?.personalDetails?.name}-All.pdf`
          }
          className="w-full lg:w-auto"
        >
          {({ loading }) => (
            <button className="px-4 py-2 w-full bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
              {loading ? "Generating PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {selectedMonth && (
        <p className="text-xs text-gray-500 mb-2">
          Showing attendance for{" "}
          {new Date(selectedMonth + "-01").toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {filteredAttendance?.length === 0 ? (
        <p className="text-sm text-gray-500">No attendance records</p>
      ) : (
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="min-w-[500px] w-full border text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-3 py-2 text-left">Date</th>
                <th className="border px-3 py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map((a, i) => (
                <tr key={a._id || i}>
                  <td className="border px-3 py-2 whitespace-nowrap">
                    {new Date(a.date).toLocaleDateString("en-IN")}
                  </td>

                  <td
                    className={`border px-3 py-2 font-medium ${
                      a.status === "Present"
                        ? "text-green-600"
                        : "text-red-600"
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