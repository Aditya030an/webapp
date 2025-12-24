import express from "express";
import { addEmployee, getAllEmployee, updateAttendance } from "../controllers/employeeController.js";
const router = express.Router();


// Add employee
router.post("/addEmployee", addEmployee );

// Get all employees
router.get("/getAllEmployee", getAllEmployee);

// Update attendance
router.post("/update-attendance", updateAttendance);

export default router;
