import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute.jsx";
import AuthPage from "./pages/AuthPage";
import Navbar from "./Component/navbar.jsx";

import Home from "./Component/Home";
import Assessment from "./Component/Assessment";
import Musculoskeletal from "./Component/Musculoskeletal";
import Obesity from "./Component/Obesity";
import Pilates from "./Component/Pilates";
import TreatmentPlan from "./Component/TreatmentPlan";
import Client from "./Component/Client";
import Reports from "./Component/Reports";
import Bill from "./Component/Bill";
import Expenses from "./Component/Expenses";
import Inventory from "./Component/Inventory";
import Salary from "./Component/Salary";
import Rent from "./Component/Rent";
import Total from "./Component/Total";
import Attendence from "./Component/Attendence";
import PatientDetails from "./Component/PatientDetails.jsx";
import EmployeeDetails from "./Component/EmployeeDetails.jsx";
import { useState } from "react";

function App() {
  const [role , setRole] = useState("employee");
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/auth" element={<AuthPage setRole={setRole} />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home role={role} />
            </ProtectedRoute>
          }
        />

        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/musculoskeletal" element={<ProtectedRoute><Musculoskeletal /></ProtectedRoute>} />
        <Route path="/obesity" element={<ProtectedRoute><Obesity /></ProtectedRoute>} />
        <Route path="/pilates" element={<ProtectedRoute><Pilates /></ProtectedRoute>} />
        <Route path="/treatmentPlan" element={<ProtectedRoute><TreatmentPlan /></ProtectedRoute>} />
        <Route path="/client" element={<ProtectedRoute><Client /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/bill" element={<ProtectedRoute><Bill /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
        <Route path="/rent" element={<ProtectedRoute><Rent /></ProtectedRoute>} />
        <Route path="/total" element={<ProtectedRoute><Total /></ProtectedRoute>} />
        <Route path="/attendence" element={<ProtectedRoute><Attendence /></ProtectedRoute>} />

        <Route path="/PatientDetails/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
        <Route path="/EmployeeDetails/:id" element={<ProtectedRoute><EmployeeDetails role={role} /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
