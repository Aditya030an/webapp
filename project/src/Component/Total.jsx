import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TotalReportPdf from "../Component/pdf/TotalReportPdf.jsx";
import { exportToExcel } from "../utils/exportToExcel";
import { fetchSummary, MONTHS, YEARS, formatINR } from "../utils/reportFetch";

const Total = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const summary = await fetchSummary({
          month: selectedMonth,
          year: selectedYear,
        });
        if (active) setData(summary);
      } catch (err) {
        console.error("Failed to load financial report:", err);
        if (active) {
          setError("Failed to load report data. Please try again.");
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [selectedMonth, selectedYear]);

  const periodLabel = () => {
    const m = selectedMonth
      ? MONTHS.find((x) => String(x.value) === String(selectedMonth))?.label
      : "";
    if (m && selectedYear) return `${m} ${selectedYear}`;
    if (selectedYear) return `Year ${selectedYear}`;
    if (m) return `${m} (all years)`;
    return "All time";
  };

  const downloadTotalExcel = () => {
    if (!data) return alert("No report data available");
    const rows = [
      { Section: "Income", Label: "Total Billed", Value: data.income.billed },
      { Section: "Income", Label: "Received", Value: data.income.received },
      { Section: "Income", Label: "Pending", Value: data.income.pending },
      { Section: "Income", Label: "Wallet", Value: data.income.wallet },
      { Section: "Outgoing", Label: "Expenses", Value: data.outgoing.expenses },
      {
        Section: "Outgoing",
        Label: "Inventory",
        Value: data.outgoing.inventory,
      },
      { Section: "Outgoing", Label: "Rent", Value: data.outgoing.rent },
      { Section: "Outgoing", Label: "Salary", Value: data.outgoing.salary },
      {
        Section: "Summary",
        Label: "Total Outgoing",
        Value: data.totalOutgoing,
      },
      { Section: "Summary", Label: "Net Balance", Value: data.netBalance },
    ];

    exportToExcel({
      data: rows,
      fileName: `Financial_Report_${selectedMonth || "All_Month"}_${selectedYear || "All_Year"}`,
      sheetName: "Financial Summary",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* ===== TOOLBAR ===== */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Financial Summary
            </h1>
            <p className="text-sm text-gray-500">
              Showing:{" "}
              <span className="font-semibold text-gray-700">
                {periodLabel()}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="border border-gray-300 p-2 rounded-lg text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 p-2 rounded-lg text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {(selectedMonth || selectedYear) && (
              <button
                onClick={() => {
                  setSelectedMonth("");
                  setSelectedYear("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}

            <span className="h-6 w-px bg-gray-200 hidden sm:block" />

            <button
              onClick={downloadTotalExcel}
              disabled={!data}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              ⬇ Excel
            </button>

            {data && (
              <PDFDownloadLink
                document={
                  <TotalReportPdf
                    data={data}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                  />
                }
                fileName={`Financial_Report_${selectedMonth || "All Month"}_${selectedYear || "All Year"}.pdf`}
              >
                {({ loading: pdfLoading }) => (
                  <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm">
                    {pdfLoading ? "Preparing…" : "⬇ PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>

      {/* ===== STATES ===== */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          Loading report…
        </div>
      )}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-6 font-medium">
          {error}
        </div>
      )}
      {!loading && !error && !data && (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          No report data available.
        </div>
      )}

      {/* ===== REPORT ===== */}
      {!loading && !error && data && (
        <div id="report" className="space-y-6">
          {/* ===== HERO: BOTTOM LINE ===== */}
          <div
            className={`rounded-2xl p-6 sm:p-8 text-white shadow-md ${
              data.netBalance >= 0
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                : "bg-gradient-to-r from-rose-500 to-rose-600"
            }`}
          >
            <p className="text-sm uppercase tracking-wide opacity-90">
              {data.netBalance >= 0 ? "Profit" : "Loss"} · {periodLabel()}
            </p>
            <p className="text-4xl sm:text-5xl font-extrabold mt-1">
              ₹{formatINR(Math.abs(data.netBalance))}
            </p>
            <p className="mt-3 text-sm sm:text-base opacity-95">
              Money Received{" "}
              <b>₹{formatINR(data.income.received)}</b> − Money Spent{" "}
              <b>₹{formatINR(data.totalOutgoing)}</b> ={" "}
              <b>
                ₹{formatINR(data.netBalance)}
                {data.netBalance >= 0 ? " profit" : " loss"}
              </b>
            </p>
          </div>

          {/* ===== 3 BIG NUMBERS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <BigTile
              emoji="📥"
              label="Money Received"
              value={data.income.received}
              tone="emerald"
              hint="Cash actually collected"
            />
            <BigTile
              emoji="📤"
              label="Money Spent"
              value={data.totalOutgoing}
              tone="rose"
              hint="Salary + Rent + Inventory + Expenses"
            />
            <BigTile
              emoji={data.netBalance >= 0 ? "📈" : "📉"}
              label="Net Balance"
              value={data.netBalance}
              tone={data.netBalance >= 0 ? "emerald" : "rose"}
              hint="Received − Spent"
              signed
            />
          </div>

          {/* ===== TWO BREAKDOWNS SIDE BY SIDE ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MONEY IN */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-1">💰 Money In</h2>
              <p className="text-xs text-gray-500 mb-4">
                What you billed and how much has come in
              </p>

              {/* Billed split bar: received vs pending */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Total Billed (work done)
                  </span>
                  <span className="font-semibold">
                    ₹{formatINR(data.income.billed)}
                  </span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="bg-emerald-500"
                    style={{
                      width: `${pct(data.income.received, data.income.billed)}%`,
                    }}
                    title="Received"
                  />
                  <div
                    className="bg-amber-400"
                    style={{
                      width: `${pct(data.income.pending, data.income.billed)}%`,
                    }}
                    title="Pending"
                  />
                </div>
              </div>

              <Row
                label="Received"
                sub="Paid bills + advances on unpaid"
                value={data.income.received}
                dot="bg-emerald-500"
              />
              <Row
                label="Pending"
                sub="Billed but not yet collected"
                value={data.income.pending}
                dot="bg-amber-400"
              />
              <Row
                label="Wallet credit held"
                sub="Advance balance kept for patients"
                value={data.income.wallet}
                dot="bg-blue-400"
              />

              <Equation
                text={`Received ₹${formatINR(data.income.received)} + Pending ₹${formatINR(
                  data.income.pending,
                )} = Billed ₹${formatINR(data.income.billed)}`}
              />
            </div>

            {/* MONEY OUT */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-1">🧾 Money Out</h2>
              <p className="text-xs text-gray-500 mb-4">
                Everything the clinic spent in this period
              </p>

              <ExpenseRow
                emoji="👥"
                label="Staff Salary"
                value={data.outgoing.salary}
                total={data.totalOutgoing}
              />
              <ExpenseRow
                emoji="🏠"
                label="Rent"
                value={data.outgoing.rent}
                total={data.totalOutgoing}
              />
              <ExpenseRow
                emoji="📦"
                label="Inventory"
                value={data.outgoing.inventory}
                total={data.totalOutgoing}
              />
              <ExpenseRow
                emoji="🧰"
                label="Other Expenses"
                value={data.outgoing.expenses}
                total={data.totalOutgoing}
              />

              <div className="flex justify-between items-center border-t mt-3 pt-3">
                <span className="font-bold text-gray-800">Total Spent</span>
                <span className="font-bold text-rose-600 text-lg">
                  ₹{formatINR(data.totalOutgoing)}
                </span>
              </div>
              <Equation
                text={`${formatINR(data.outgoing.salary)} + ${formatINR(
                  data.outgoing.rent,
                )} + ${formatINR(data.outgoing.inventory)} + ${formatINR(
                  data.outgoing.expenses,
                )} = ₹${formatINR(data.totalOutgoing)}`}
              />
            </div>
          </div>

          {/* ===== PLAIN-ENGLISH EXPLAINER ===== */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h2 className="font-bold text-blue-900 mb-2">
              How these numbers are calculated
            </h2>
            <ul className="text-sm text-blue-900/80 space-y-1 list-disc pl-5">
              <li>
                <b>Received</b> = full amount of paid bills + any advance taken on
                unpaid bills.
              </li>
              <li>
                <b>Pending</b> = Total Billed − Received (money still to collect).
              </li>
              <li>
                <b>Money Spent</b> = Staff Salary + Rent + Inventory + Other
                Expenses.
              </li>
              <li>
                <b>Profit / Loss</b> = Money Received − Money Spent.
              </li>
            </ul>
          </div>

          {/* ===== TREND ===== */}
          <TrendChart trend={data.trend} year={data.trendYear} />
        </div>
      )}
    </div>
  );
};

/* ===== HELPERS ===== */

const pct = (part, whole) => {
  const w = Number(whole) || 0;
  if (w <= 0) return 0;
  return Math.min(100, Math.max(0, (Number(part) / w) * 100));
};

const toneMap = {
  emerald: "text-emerald-600",
  rose: "text-rose-600",
};

const BigTile = ({ emoji, label, value, tone, hint, signed }) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <span className="text-lg">{emoji}</span>
      {label}
    </div>
    <p className={`text-2xl sm:text-3xl font-extrabold mt-1 ${toneMap[tone]}`}>
      {signed && value < 0 ? "−" : ""}₹{formatINR(Math.abs(value))}
    </p>
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const Row = ({ label, sub, value, dot }) => (
  <div className="flex items-start justify-between py-2 border-b last:border-b-0">
    <div className="flex items-start gap-2">
      <span className={`mt-1.5 w-2.5 h-2.5 rounded-full ${dot}`} />
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
    <span className="font-semibold text-gray-900">₹{formatINR(value)}</span>
  </div>
);

const ExpenseRow = ({ emoji, label, value, total }) => (
  <div className="py-2">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-700">
        {emoji} {label}
      </span>
      <span className="font-semibold text-gray-900">
        ₹{formatINR(value)}{" "}
        <span className="text-xs text-gray-400">
          ({Math.round(pct(value, total))}%)
        </span>
      </span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-2 bg-rose-400 rounded-full"
        style={{ width: `${pct(value, total)}%` }}
      />
    </div>
  </div>
);

const Equation = ({ text }) => (
  <p className="text-xs text-gray-500 bg-gray-50 rounded-md px-3 py-2 mt-3">
    ✓ {text}
  </p>
);

const monthShort = (m) =>
  new Date(0, m - 1).toLocaleString("default", { month: "short" });

const TrendChart = ({ trend = [], year }) => {
  const max = Math.max(
    1,
    ...trend.map((t) => Math.max(t.received || 0, t.spent || 0)),
  );
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-bold text-gray-800 mb-1">
        Month-by-Month Trend · {year}
      </h2>
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-emerald-500 rounded-sm" />
          Received
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-rose-400 rounded-sm" />
          Spent
        </span>
        <span className="ml-auto">Net = Received − Spent</span>
      </div>
      <div className="space-y-2">
        {trend.map((t) => (
          <div key={t.month} className="flex items-center gap-3">
            <span className="w-9 text-xs font-medium text-gray-600">
              {monthShort(t.month)}
            </span>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2.5 bg-emerald-500 rounded-full"
                  style={{ width: `${((t.received || 0) / max) * 100}%` }}
                />
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2.5 bg-rose-400 rounded-full"
                  style={{ width: `${((t.spent || 0) / max) * 100}%` }}
                />
              </div>
            </div>
            <span
              className={`w-24 text-right text-xs font-semibold ${
                (t.net || 0) >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {(t.net || 0) < 0 ? "−" : ""}₹{formatINR(Math.abs(t.net))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Total;
