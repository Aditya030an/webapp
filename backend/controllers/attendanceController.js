import Attendance from "../models/attendanceModel.js";
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
      patientId,
      date,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    const attendance = await Attendance.create({
      patientId,
      date: new Date(date),
      status,
    });

    const updatePatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: { attendance: attendance._id },
      },
      { new: true }
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
