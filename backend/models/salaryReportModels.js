import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  month: { type: String, required: true }, // e.g., "2025-05"
  salary: { type: Number, required: true },
  paid: { type: Boolean, default: false },
});

const salaryReportSchema = new mongoose.Schema(
  {
    employees: [employeeSchema],
    totalSalary: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SalaryReport = mongoose.model("SalaryReport", salaryReportSchema);
export default SalaryReport;
