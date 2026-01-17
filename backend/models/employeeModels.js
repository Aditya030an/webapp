import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    personalDetails: {
      employeeId: {
        type: String,
        required: true,
        unique: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      qualification: {
        type: String,
        required: true,
      },
      registrationNo: {
        type: String,
        required: true,
      },
      experience: {
        type: Number,
        min: 0,
        default: 0,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
      },
      email: {
        type: String,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true,
        unique: true,
      },
      password:{
        type: String,
        required: true,
      },
      workingBranch: { type: String, required: true },
      status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
        required: true,
      },
      employmentType: {
        type: String,
        enum: [
          "Full Time",
          "Part Time",
          "Visiting Consultant",
          "Home Visit Therapist",
          "Intern / Trainee",
        ],
        required: true,
      },
      joiningDate: {
        type: Date,
        required: true,
      },
      exitDate: {
        type: Date,
      },
    },
    patientLook:{
      patientId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Patient",
        required: true,
        default: [],
      },
    }
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
