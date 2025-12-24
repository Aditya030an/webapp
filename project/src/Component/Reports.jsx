


import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Bill", path: "/Bill" },
  { name: "Expenses", path: "/Expenses" },
  { name: "Inventory", path: "/Investory" }, // Note: spelling matches your route
  { name: "Rent", path: "/Rent" },
  { name: "Salary", path: "/Salary" },
];

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Report Dashboard</h1>
      </nav>

      {/* Category Links */}
      <div className="bg-white shadow-sm px-6 py-2 flex space-x-4 overflow-x-auto">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}
            className="px-4 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-blue-100"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="p-6">
        <h2 className="text-xl text-gray-500">Select a report to view details</h2>
      </div>
    </div>
  );
};

export default Reports;
