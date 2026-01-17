import express from "express";
import {createEmployee , addEmployee, getAllEmployee, updateAttendance  , getEmployeeById , updateEmployee , deleteEmployeeById , loginEmployee} from "../controllers/employeeController.js";
import employeeAuth from "../middleware/employeeAuth.js";
const router = express.Router();

// Add employee
router.post("/addEmployee", addEmployee );

// Update attendance
router.post("/update-attendance", updateAttendance);

// create employee
router.post("/createEmployee" , employeeAuth ,  createEmployee);

// Get all employees
router.get("/getAllEmployee", getAllEmployee);

// get employee by ID
router.get("/getEmployeeById/:id" , getEmployeeById);

// update by id
router.put("/updateEmployee/:id" , updateEmployee);

// delete employee
router.delete("/deleteEmployee/:id" , deleteEmployeeById);

// for login employee
router.post("/loginEmployee" , loginEmployee);

export default router;
