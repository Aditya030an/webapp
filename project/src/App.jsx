import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Component/navbar.jsx";
import Home from "./Component/Home";
import Assessment from "./Component/Assessment.jsx";
import Musculoskeletal from "./Component/Musculoskeletal.jsx";
import Obesity from "./Component/Obesity.jsx";
import Client from "./Component/Client.jsx";
import Pilates from "./Component/Pilates.jsx";
import Reports from "./Component/Reports.jsx";
import Bill from "./Component/Bill.jsx";
import Expenses from "./Component/Expenses.jsx";
import Rent from "./Component/Rent.jsx";
import Salary from "./Component/Salary.jsx";
import Inventory from "./Component/Inventory.jsx";
import Total from "./Component/Total.jsx";
import Attendence from "./Component/Attendence.jsx";
import TreatmentPlan from "./Component/TreatmentPlan.jsx";

function App() {
  return (
    <Router>
      <div>
        <Navbar />

        {/* Define routes for Home only */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Assessment" element={<Assessment />} />
          <Route path="/musculoskeletal" element={<Musculoskeletal />} />
          <Route path="/Obesity" element={<Obesity />} />
          <Route path="/Pilates" element={<Pilates />} />
          <Route path="/TreatmentPlan" element={<TreatmentPlan />} />
          <Route path="/Client" element={<Client />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/Bill" element={<Bill />} />
          <Route path="/Expenses" element={<Expenses />} />
          <Route path="/Investory" element={<Inventory />} />
          <Route path="/Salary" element={<Salary />} />
          <Route path="/Rent" element={<Rent />} />
          <Route path="/Total" element={<Total />} />
          <Route path="/Attendence" element={<Attendence />} />
          <Route path="/neurological/:id" element={<Assessment />} />
          <Route path="/musculoskeletal/:id" element={<Musculoskeletal />} />
          <Route path="/obesity/:id" element={<Obesity />} />
          <Route path="/pilates/:id" element={<Pilates />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
