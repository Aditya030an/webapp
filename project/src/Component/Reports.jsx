import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const categories = [
  { name: "Bill", path: "bill" },
  { name: "Expenses", path: "expenses" },
  { name: "Inventory", path: "inventory" },
  { name: "Rent", path: "rent" },
  { name: "Salary", path: "salary" },
  { name: "Total", path: "total" },
];

const Reports = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HEADER ================= */}
      <nav className="bg-white shadow-md px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">Reports Dashboard</h1>
      </nav>

      {/* ================= TABS ================= */}
      <div className="bg-white shadow-sm px-6 py-2 flex gap-3 overflow-x-auto">
        {categories.map((cat) => {
          const isActive = location.pathname.includes(cat.path);

          return (
            <Link
              key={cat.name}
              to={cat.path}
              className={`px-4 py-2 rounded-full font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }
              `}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* ================= CHILD CONTENT ================= */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Reports;
