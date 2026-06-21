import PropTypes from "prop-types";
import { MONTHS, YEARS } from "../../utils/reportFetch";

// Consistent month/year filter used across every report screen.
const MonthYearFilter = ({ month, year, onMonth, onYear, onClear }) => (
  <div className="flex flex-wrap items-center gap-3">
    <select
      value={month}
      onChange={(e) => onMonth(e.target.value)}
      className="border p-2 rounded text-sm"
    >
      <option value="">All Months</option>
      {MONTHS.map((m) => (
        <option key={m.value} value={m.value}>
          {m.label}
        </option>
      ))}
    </select>

    <select
      value={year}
      onChange={(e) => onYear(e.target.value)}
      className="border p-2 rounded text-sm"
    >
      <option value="">All Years</option>
      {YEARS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>

    {(month || year) && (
      <button
        onClick={onClear}
        className="text-sm text-blue-600 hover:underline"
      >
        Clear
      </button>
    )}
  </div>
);

MonthYearFilter.propTypes = {
  month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onMonth: PropTypes.func.isRequired,
  onYear: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default MonthYearFilter;
