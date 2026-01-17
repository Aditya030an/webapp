import jwt from "jsonwebtoken";
import Employee from "../models/employeeModels.js";

const employeeAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("token", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing. Please login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    req.id = decoded.id;
    next(); 
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default employeeAuth;
