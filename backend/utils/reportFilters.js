/**
 * Shared period-filtering helpers for the Reports domain.
 *
 * Date-only values in this app are stored as UTC midnight (they come from
 * <input type="date">). To bucket them into the right month/year regardless of
 * the server's timezone, we compare on the UTC components — this is the single
 * source of truth so every report filters identically.
 */

// Parse a query param into a number, or null when absent/blank.
export const toNum = (v) =>
  v === undefined || v === null || v === "" ? null : Number(v);

// Does a Date/ISO value fall in the given month (1-12) and/or year?
// A null month or year acts as a wildcard (year-only, month-only, or all).
export const matchesPeriod = (dateValue, month, year) => {
  if (!dateValue) return false;
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return false;
  const monthOk = month ? d.getUTCMonth() + 1 === month : true;
  const yearOk = year ? d.getUTCFullYear() === year : true;
  return monthOk && yearOk;
};

// Same idea for the "YYYY-MM" string months used by salary entries.
export const matchesPeriodString = (ymString, month, year) => {
  if (!ymString || typeof ymString !== "string") return false;
  const [yStr, mStr] = ymString.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const monthOk = month ? m === month : true;
  const yearOk = year ? y === year : true;
  return monthOk && yearOk;
};
