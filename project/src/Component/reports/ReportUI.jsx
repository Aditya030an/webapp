import PropTypes from "prop-types";
import { formatINR } from "../../utils/reportFetch";

/**
 * Shared presentational kit for the Reports screens so every tab looks and
 * reads the same for a non-technical user (the doctor): white cards, big
 * plain-language number tiles, ✓ "tally" lines that show how figures add up,
 * and consistent loading / error / empty states.
 */

const TONES = {
  emerald: "text-emerald-600",
  rose: "text-rose-600",
  amber: "text-amber-600",
  blue: "text-blue-600",
  gray: "text-gray-800",
};

// Page wrapper.
export const ReportPage = ({ children }) => (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">{children}</div>
);
ReportPage.propTypes = { children: PropTypes.node };

// White rounded card container.
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
    {children}
  </div>
);
Card.propTypes = { children: PropTypes.node, className: PropTypes.string };

// Toolbar: title + "Showing: <period>" + right-aligned controls (filters/exports).
export const ReportToolbar = ({ title, periodLabel, children }) => (
  <Card>
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {periodLabel && (
          <p className="text-sm text-gray-500">
            Showing:{" "}
            <span className="font-semibold text-gray-700">{periodLabel}</span>
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  </Card>
);
ReportToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  periodLabel: PropTypes.string,
  children: PropTypes.node,
};

// Big plain-language number tile.
export const Tile = ({
  emoji,
  label,
  value,
  tone = "gray",
  hint,
  isCurrency = true,
  signed = false,
}) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      {emoji && <span className="text-lg">{emoji}</span>}
      {label}
    </div>
    <p
      className={`text-2xl sm:text-3xl font-extrabold mt-1 ${TONES[tone] || TONES.gray}`}
    >
      {isCurrency
        ? `${signed && value < 0 ? "−" : ""}₹${formatINR(Math.abs(value))}`
        : value}
    </p>
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);
Tile.propTypes = {
  emoji: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tone: PropTypes.string,
  hint: PropTypes.string,
  isCurrency: PropTypes.bool,
  signed: PropTypes.bool,
};

// ✓ line showing the arithmetic so the doctor can cross-check.
export const TallyLine = ({ text }) => (
  <p className="text-xs text-gray-500 bg-gray-50 rounded-md px-3 py-2 mt-3">
    ✓ {text}
  </p>
);
TallyLine.propTypes = { text: PropTypes.string.isRequired };

export const Loading = ({ label = "Loading…" }) => (
  <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
    {label}
  </div>
);
Loading.propTypes = { label: PropTypes.string };

export const ErrorState = ({ message = "Something went wrong. Please try again." }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-6 font-medium">
    {message}
  </div>
);
ErrorState.propTypes = { message: PropTypes.string };

export const EmptyState = ({ label = "No records found." }) => (
  <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
    {label}
  </div>
);
EmptyState.propTypes = { label: PropTypes.string };

// Standard export button styles (use as className on your buttons).
export const EXCEL_BTN =
  "bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50";
export const PDF_BTN =
  "bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50";
export const PRIMARY_BTN =
  "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50";
