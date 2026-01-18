import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModels.js";
import Patient from "../models/patientModel.js";

export const createAttendance = async (req, res) => {
  try {
    const { patientId, date, status } = req.body;

    console.log("patientId", patientId);
    console.log("date", date);
    console.log("status", status);

    if (!patientId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const existing = await Attendance.findOne({
      id: patientId,
      date,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    const attendance = await Attendance.create({
      id:patientId,
      date: new Date(date),
      status,
      type: "patient",
    });

    const updatePatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: { attendance: attendance._id },
      },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Attendance added successfully",
      data: attendance,
      patient: updatePatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    const loginEmployeeId = req.id;

    console.log("EmployeeId", employeeId);
    console.log("date", date);
    console.log("status", status);

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const loginEmployee = await Employee.findById(loginEmployeeId);
    if (!loginEmployee) {
      return res.status(401).json({
        success: false,
        message: "Employee not found",
      });
    }
    if (loginEmployee.personalDetails.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Only admin can add employee attendance",
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existing = await Attendance.findOne({
      id: employeeId,
      date,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    const attendance = await Attendance.create({
      id: employeeId,
      date: new Date(date),
      status,
      type: "employee",
    });

    const updateEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        $push: { attendance: attendance._id },
      },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Attendance added successfully",
      data: attendance,
      employee: updateEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
