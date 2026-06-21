import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { MONTHS, YEARS } from "../utils/reportFetch";
import {
  ReportPage,
  Card,
  ReportToolbar,
  Tile,
  Loading,
  ErrorState,
  EmptyState,
} from "./reports/ReportUI";

// Format any date-like value to a YYYY-MM-DD string using UTC components,
// so attendance dates and the selected date are compared on the same basis
// (no off-by-one from local timezone shifts).
const toUTCDateStr = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const isPresent = (att) =>
  String(att?.status || "").toLowerCase() === "present";

const PatientAttendancePage = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const now = new Date();
  // filterType: today | thisMonth | thisYear | date | period
  const [filterType, setFilterType] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(now.getUTCMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getUTCFullYear());

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchAllEnquiries = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${backendURL}/api/enquiry/getPatientAttendanceEnquiry`,
        );
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const result = await response.json();
        if (active) setEnquiries(result?.enquiries || []);
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load attendance data");
          setEnquiries([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAllEnquiries();
    return () => {
      active = false;
    };
  }, [backendURL]);

  // Returns true if a single attendance record matches the active filter.
  const matchesFilter = (att) => {
    const d = new Date(att?.date);
    if (Number.isNaN(d.getTime())) return false;

    if (filterType === "today") {
      return toUTCDateStr(att.date) === toUTCDateStr(now);
    }
    if (filterType === "thisMonth") {
      return (
        d.getUTCMonth() === now.getUTCMonth() &&
        d.getUTCFullYear() === now.getUTCFullYear()
      );
    }
    if (filterType === "thisYear") {
      return d.getUTCFullYear() === now.getUTCFullYear();
    }
    if (filterType === "date") {
      if (!selectedDate) return false;
      return toUTCDateStr(att.date) === selectedDate;
    }
    if (filterType === "period") {
      return (
        d.getUTCMonth() + 1 === Number(selectedMonth) &&
        d.getUTCFullYear() === Number(selectedYear)
      );
    }
    return false;
  };

  // Compute matched patients + total Present visits for the active period.
  const { patients, totalVisits } = useMemo(() => {
    let visits = 0;
    const matched = enquiries.filter((item) => {
      const attendance = item.patientId?.attendance || [];
      const presentInPeriod = attendance.filter(
        (att) => isPresent(att) && matchesFilter(att),
      );
      visits += presentInPeriod.length;
      return presentInPeriod.length > 0;
    });
    return { patients: matched, totalVisits: visits };
    // matchesFilter closes over filter state; deps cover everything it reads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquiries, filterType, selectedDate, selectedMonth, selectedYear]);

  // Human-readable label of the resolved period being shown.
  const periodLabel = useMemo(() => {
    if (filterType === "today") return `Today (${toUTCDateStr(now)})`;
    if (filterType === "thisMonth") {
      const m = MONTHS.find((x) => x.value === now.getUTCMonth() + 1);
      return `This Month (${m?.label} ${now.getUTCFullYear()})`;
    }
    if (filterType === "thisYear") return `This Year (${now.getUTCFullYear()})`;
    if (filterType === "date") {
      return selectedDate ? `Date: ${selectedDate}` : "Pick a date";
    }
    if (filterType === "period") {
      const m = MONTHS.find((x) => x.value === Number(selectedMonth));
      return `${m?.label} ${selectedYear}`;
    }
    return "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, selectedDate, selectedMonth, selectedYear]);

  const presets = [
    { key: "today", label: "Today" },
    { key: "thisMonth", label: "This Month" },
    { key: "thisYear", label: "This Year" },
    { key: "date", label: "Specific Date" },
    { key: "period", label: "Month / Year" },
  ];

  return (
    <ReportPage>
      <ReportToolbar title="Daily Attendance" periodLabel={periodLabel}>
        {/* Filter presets */}
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => setFilterType(p.key)}
            className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
              filterType === p.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {p.label}
          </button>
        ))}

        {/* Conditional pickers */}
        {filterType === "date" && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-2 py-2 rounded-lg text-sm"
          />
        )}

        {filterType === "period" && (
          <>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border px-2 py-2 rounded-lg text-sm"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border px-2 py-2 rounded-lg text-sm"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </>
        )}
      </ReportToolbar>

      {/* Metrics */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Tile
            emoji="🧑‍🤝‍🧑"
            label="Patients Attended"
            value={String(patients.length)}
            isCurrency={false}
            tone="blue"
            hint="Unique patients in this period"
          />
          <Tile
            emoji="📅"
            label="Total Visits"
            value={String(totalVisits)}
            isCurrency={false}
            tone="emerald"
            hint="Total Present sessions"
          />
        </div>
      )}

      {/* Result */}
      {loading ? (
        <Loading label="Loading attendance…" />
      ) : error ? (
        <ErrorState message={error} />
      ) : patients.length === 0 ? (
        <EmptyState label="No patients attended in this period." />
      ) : (
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Patients ({patients.length})
          </h2>
          <ul className="space-y-2">
            {patients.map((item) => (
              <li
                key={item?._id}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-100"
              >
                <span>{item.patientName}</span>
                <Link
                  to={`/PatientDetails/${item?.patientId?._id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </ReportPage>
  );
};

export default PatientAttendancePage;
