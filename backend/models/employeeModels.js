import mongoose from "mongoose";


const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  role: { type: String, default: "Employee" },
  attendance: {
    type: Map,
    of: Map,
    default: {},
  }
});

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;

