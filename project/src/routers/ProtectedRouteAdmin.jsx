import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin = ({ children }) => {
  const employee = JSON.parse(localStorage.getItem("loginEmployeeData"));
  if (employee?.personalDetails?.email !== import.meta.env.VITE_ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRouteAdmin;
