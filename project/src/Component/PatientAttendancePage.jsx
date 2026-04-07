import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

const PatientAttendancePage = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [filterType, setFilterType] = useState("today"); // today | month | year
  const [selectedDate, setSelectedDate] = useState("");
  const [enquiries, setEnquiries] = useState([]);

  const fetchAllEnquiries = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/enquiry/getPatientAttendanceEnquiry`,
      );
      const result = await response.json();
      setEnquiries(result?.enquiries || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  const filteredPatients = useMemo(() => {
    const now = new Date();

    return enquiries.filter((item) => {
      const attendance = item.patientId?.attendance || [];

      return attendance.some((att) => {
        const attDate = new Date(att.date);

        if (filterType === "today") {
          return attDate.toDateString() === now.toDateString();
        }

        if (filterType === "month") {
          return (
            attDate.getMonth() === now.getMonth() &&
            attDate.getFullYear() === now.getFullYear()
          );
        }

        if (filterType === "year") {
          return attDate.getFullYear() === now.getFullYear();
        }

        if (filterType === "custom" && selectedDate) {
          return (
            attDate.toDateString() === new Date(selectedDate).toDateString()
          );
        }

        return false;
      });
    });
  }, [enquiries, filterType, selectedDate]);

  console.log("enq", enquiries);
  console.log("filteredPatients", filteredPatients);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Patient Attendance</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setFilterType("today")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Today
        </button>

        <button
          onClick={() => setFilterType("month")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          This Month
        </button>

        <button
          onClick={() => setFilterType("year")}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          This Year
        </button>

        <button
          onClick={() => setFilterType("custom")}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Select Date
        </button>

        {filterType === "custom" && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        )}
      </div>

      {/* Result */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-medium mb-3">
          Patients ({filteredPatients.length})
        </h2>

        {filteredPatients.length === 0 ? (
          <p className="text-gray-500">No patients found</p>
        ) : (
          <ul className="space-y-2">
            {filteredPatients.map((item) => (
              <div
                key={item?._id}
                className="flex items-center justify-between"
              >
                <li className="p-2 border rounded hover:bg-gray-100">
                  {item.patientName}
                </li>
                <Link
                  to={`/PatientDetails/${item?.patientId?._id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientAttendancePage;
