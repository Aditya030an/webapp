import express from "express";
import {
  createAttendance,
  createEmployeeAttendance,
} from "../controllers/attendanceController.js";

import employeeAuth from "../middleware/employeeAuth.js";
const attendanceRouter = express.Router();

attendanceRouter.post("/createAttendance", createAttendance);
attendanceRouter.post(
  "/createEmployeeAttendance",
  employeeAuth,
  createEmployeeAttendance,
);

export default attendanceRouter;
