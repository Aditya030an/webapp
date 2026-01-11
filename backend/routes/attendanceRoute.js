import express from"express";
import {createAttendance } from "../controllers/attendanceController.js";
const attendanceRouter = express.Router();

attendanceRouter.post("/createAttendance", createAttendance);
// attendanceRouter.get("/getAttendance", getAttendance);

export default attendanceRouter;