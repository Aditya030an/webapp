// import React, { useEffect, useState } from "react";
// import html2pdf from "html2pdf.js";

// const Total = () => {
//   const [data, setData] = useState({
//     income: {
//       billed: 0,
//       received: 0,
//       pending: 0,
//       wallet: 0,
//       count: 0,
//     },
//     outgoing: {
//       expenses: 0,
//       inventory: 0,
//       rent: 0,
//       salary: 0,
//     },
//   });

//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");

//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         const [
//           billRes,
//           expenseRes,
//           inventoryRes,
//           rentRes,
//           salaryRes,
//         ] = await Promise.all([
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/report/bill`),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/report/expenses`),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/report/inventory`),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/report/rent`),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/report/salary`),
//         ]);

//         const bills = (await billRes.json()).data || [];
//         const expenses = (await expenseRes.json()).data || [];
//         const inventory = (await inventoryRes.json()).data || [];
//         const rent = (await rentRes.json()).data || [];
//         const salary = (await salaryRes.json()).data || [];

//         const isMatch = (dateStr) => {
//           const d = new Date(dateStr);
//           return (
//             (!selectedMonth || d.getMonth() + 1 === +selectedMonth) &&
//             (!selectedYear || d.getFullYear() === +selectedYear)
//           );
//         };

//         const billFiltered = bills.filter((b) => isMatch(b.date));

//         const income = billFiltered.reduce(
//           (acc, b) => {
//             acc.billed += b.total;
//             acc.received += b.advancePayment || 0;
//             acc.wallet += b.amountInWallet || 0;
//             acc.pending += Math.max(0, b.total - (b.advancePayment || 0));
//             acc.count += 1;
//             return acc;
//           },
//           { billed: 0, received: 0, pending: 0, wallet: 0, count: 0 }
//         );

//         const outgoing = {
//           expenses: expenses.filter(e => isMatch(e.date))
//             .reduce((s, e) => s + e.total, 0),

//           inventory: inventory.filter(i => isMatch(i.createdAt))
//             .reduce((s, i) => s + i.total, 0),

//           rent: rent.filter(r => isMatch(r.dueDate))
//             .reduce((s, r) => s + r.amount, 0),

//           salary: salary.reduce((sum, s) => {
//             const matched = s.employees.filter(e => {
//               const [y, m] = e.month.split("-");
//               return (
//                 (!selectedMonth || +m === +selectedMonth) &&
//                 (!selectedYear || +y === +selectedYear)
//               );
//             });
//             return sum + matched.reduce((x, e) => x + e.salary, 0);
//           }, 0),
//         };

//         setData({ income, outgoing });
//       } catch (err) {
//         console.error("Report Error:", err);
//       }
//     };

//     fetchReport();
//   }, [selectedMonth, selectedYear]);

//   const totalOutgoing =
//     data.outgoing.expenses +
//     data.outgoing.inventory +
//     data.outgoing.rent +
//     data.outgoing.salary;

//   const netBalance = data.income.received - totalOutgoing;

//   const generatePDF = () => {
//     const content = `
//       <div style="font-family: Arial; padding:20px">
//         <h2 style="text-align:center">Financial Summary</h2>

//         <h3>Income</h3>
//         <p>Total Billed: ₹${data.income.billed}</p>
//         <p>Received: ₹${data.income.received}</p>
//         <p>Pending: ₹${data.income.pending}</p>
//         <p>Wallet: ₹${data.income.wallet}</p>

//         <h3>Outgoing</h3>
//         <p>Expenses: ₹${data.outgoing.expenses}</p>
//         <p>Inventory: ₹${data.outgoing.inventory}</p>
//         <p>Rent: ₹${data.outgoing.rent}</p>
//         <p>Salary: ₹${data.outgoing.salary}</p>

//         <h3>Summary</h3>
//         <p>Total Outgoing: ₹${totalOutgoing}</p>
//         <p><strong>Net Balance: ₹${netBalance}</strong></p>
//       </div>
//     `;
//     html2pdf().from(content).save("Financial_Report.pdf");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Filters */}
//       <div className="flex gap-4 mb-6">
//         <select className="border p-2" onChange={e => setSelectedMonth(e.target.value)}>
//           <option value="">All Months</option>
//           {[...Array(12)].map((_, i) => (
//             <option key={i} value={i + 1}>
//               {new Date(0, i).toLocaleString("default", { month: "long" })}
//             </option>
//           ))}
//         </select>

//         <select className="border p-2" onChange={e => setSelectedYear(e.target.value)}>
//           <option value="">All Years</option>
//           {[...Array(5)].map((_, i) => {
//             const y = new Date().getFullYear() - i;
//             return <option key={y} value={y}>{y}</option>;
//           })}
//         </select>

//         <button
//           onClick={generatePDF}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Download PDF
//         </button>
//       </div>

//       {/* Income */}
//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//         <h2 className="text-xl font-bold text-green-700 mb-4">Income</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Stat label="Billed" value={data.income.billed} />
//           <Stat label="Received" value={data.income.received} />
//           <Stat label="Pending" value={data.income.pending} />
//           <Stat label="Wallet" value={data.income.wallet} />
//         </div>
//       </div>

//       {/* Outgoing */}
//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//         <h2 className="text-xl font-bold text-red-700 mb-4">Outgoing</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Stat label="Expenses" value={data.outgoing.expenses} />
//           <Stat label="Inventory" value={data.outgoing.inventory} />
//           <Stat label="Rent" value={data.outgoing.rent} />
//           <Stat label="Salary" value={data.outgoing.salary} />
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-bold mb-2">Net Summary</h2>
//         <p>Total Outgoing: ₹{totalOutgoing}</p>
//         <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
//           Net Balance: ₹{netBalance}
//         </p>
//       </div>
//     </div>
//   );
// };

// const Stat = ({ label, value }) => (
//   <div className="bg-gray-50 p-4 rounded">
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className="text-xl font-bold">₹{value}</p>
//   </div>
// );

// export default Total;

import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TotalReportPdf from "../Component/pdf/TotalReportPdf.jsx";

const Total = () => {
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const urls = ["bill", "expenses", "inventory", "rent", "salary"].map(
        (type) => `${import.meta.env.VITE_BACKEND_URL}/api/report/${type}`,
      );

      const responses = await Promise.all(urls.map((u) => fetch(u)));
      const [billData, expensesData, inventoryData, rentData, salaryData] =
        await Promise.all(responses.map((r) => r.json()));

      const isMatch = (dateStr) => {
        const d = new Date(dateStr);
        return (
          (!selectedMonth || d.getMonth() + 1 === Number(selectedMonth)) &&
          (!selectedYear || d.getFullYear() === Number(selectedYear))
        );
      };

      /* ===== INCOME ===== */
      const bills = billData.data.filter((b) => isMatch(b.date));

      // const billed = bills.reduce((s, b) => s + b.total, 0);
      // const received = bills.reduce(
      //   (s, b) => s + Math.min(b.total, b.advancePayment || 0),
      //   0,
      // );
      // const pending = billed - received;
      // const wallet = bills.reduce((s, b) => s + (b.amountInWallet || 0), 0);

      const billed = bills.reduce((s, b) => s + b.total, 0);

      const received = bills
        .filter((b) => b.paymentStatus === "Paid")
        .reduce((s, b) => s + b.total, 0);

      const pending = bills
        .filter((b) => b.paymentStatus === "Unpaid")
        .reduce((s, b) => s + b.total, 0);

      const wallet = bills.reduce((s, b) => s + (b.amountInWallet || 0), 0);

      /* ===== OUTGOING ===== */
      const expenses = expensesData.data
        .filter((e) => isMatch(e.date))
        .reduce((s, e) => s + e.total, 0);

      const inventory = inventoryData.data
        .filter((i) => isMatch(i.createdAt))
        .reduce((s, i) => s + i.total, 0);

      const rent = rentData.data
        .filter((r) => isMatch(r.dueDate))
        .reduce((s, r) => s + r.amount, 0);

      const salary = salaryData.data.reduce((s, sal) => s + sal.totalSalary, 0);

      setData({
        income: { billed, received, pending, wallet },
        outgoing: { expenses, inventory, rent, salary },
      });
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  console.log("data", data);

  if (!data) return <p className="p-6">Loading report...</p>;

  const totalOutgoing =
    data.outgoing.expenses +
    data.outgoing.inventory +
    data.outgoing.rent +
    data.outgoing.salary;

  const netBalance = data.income.received - totalOutgoing;

  const generatePDF = () => {
    html2pdf()
      .from(document.getElementById("report"))
      .save("Financial_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ===== FILTERS ===== */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <PDFDownloadLink
          document={
            <TotalReportPdf
              data={data}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          }
          // fileName="Financial_Report.pdf"
          fileName={`Financial_Report_${selectedMonth || "All Month"}_${selectedYear || "All Year"}.pdf`}
        >
          {({ loading }) => (
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              {loading ? "Generating PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* ===== REPORT ===== */}
      <div id="report" className="space-y-8">
        {/* ===== FLOW ===== */}
        <Section title="Financial Flow Overview">
          <Grid>
            <FlowCard title="Billed" value={data.income.billed} color="blue" />
            <FlowCard
              title="Received"
              value={data.income.received}
              color="green"
            />
            <FlowCard title="Spent" value={totalOutgoing} color="red" />
            <FlowCard
              title="Net Balance"
              value={netBalance}
              color={netBalance >= 0 ? "green" : "red"}
            />
          </Grid>
        </Section>

        {/* ===== INCOME ===== */}
        <Section title="Income Breakdown">
          <Grid>
            <Stat label="Total Billed" value={data.income.billed} />
            <Stat label="Received" value={data.income.received} />
            <Stat label="Pending" value={data.income.pending} />
            <Stat label="Wallet" value={data.income.wallet} />
          </Grid>
        </Section>

        {/* ===== OUTGOING ===== */}
        <Section title="Expense Breakdown">
          <Grid>
            <Stat label="Expenses" value={data.outgoing.expenses} />
            <Stat label="Inventory" value={data.outgoing.inventory} />
            <Stat label="Rent" value={data.outgoing.rent} />
            <Stat label="Salary" value={data.outgoing.salary} />
          </Grid>
        </Section>

        {/* INCOME */}
        <Section title="Income Calculation">
          <CalcLine text={`Total Billed = ₹${data.income.billed}`} />
          <CalcLine text={`Received = ₹${data.income.received}`} />
          <CalcLine
            text={`Pending = ₹${data.income.billed} − ₹${data.income.received} = ₹${data.income.pending}`}
          />
          <CalcLine text={`Wallet Balance = ₹${data.income.wallet}`} />
        </Section>

        {/* EXPENSE */}
        <Section title="Expense Calculation">
          <CalcLine text={`Expenses = ₹${data.outgoing.expenses}`} />
          <CalcLine text={`Inventory = ₹${data.outgoing.inventory}`} />
          <CalcLine text={`Rent = ₹${data.outgoing.rent}`} />
          <CalcLine text={`Salary = ₹${data.outgoing.salary}`} />
          <CalcLine bold text={`Total Outgoing = ₹${totalOutgoing}`} />
        </Section>

        {/* ===== FINAL ===== */}
        <div
          className={`bg-white p-8 rounded-xl shadow border-l-8 ${
            netBalance >= 0 ? "border-green-500" : "border-red-500"
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">Final Result</h2>
          <p className="text-gray-600 mb-4">
            Based on received payments and total expenses
          </p>
          <p
            className={`text-3xl font-bold ${
              netBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {netBalance >= 0 ? "PROFIT" : "LOSS"} : ₹{Math.abs(netBalance)}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ===== SMALL REUSABLE COMPONENTS ===== */

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{children}</div>
);

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-xl font-bold">₹{value}</p>
  </div>
);

const colorMap = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
};

const FlowCard = ({ title, value, color }) => (
  <div className={`${colorMap[color]} p-6 rounded-lg text-center`}>
    <p className="font-semibold">{title}</p>
    <p className="text-2xl font-bold">₹{value}</p>
  </div>
);

export default Total;

const CalcLine = ({ text, bold }) => (
  <p className={`text-gray-700 ${bold ? "font-bold" : ""}`}>{text}</p>
);
