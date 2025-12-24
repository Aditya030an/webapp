import Employee from "../models/employeeModels.js";

const addEmployee = async (req, res) => {
  const { name, role } = req.body;
  console.log("req.body add" , req.body);
  try {
    // Check if employee with same name (case-insensitive) already exists
    const existingEmployee = await Employee.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existingEmployee) {
      return res.status(400).json({ success: false, message: "Employee already exists" });
    }

    // Create and save new employee
    const newEmployee = new Employee({ name, role });
    await newEmployee.save();

    return res.status(201).json({ success: true, message: "Employee added successfully", employee: newEmployee });
  } catch (err) {
    console.error("Error in addEmployee:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  const { empId, date, status } = req.body;
  const month = date.slice(0, 7);

  console.log("req.bosy attendenace" , req?.body);

  try {
    const employee = await Employee.findById(empId);
    if (!employee)
      return res.json({ success: false, message: "Employee not found" });

    if (!employee?.attendance) employee.attendance = {};
    if (!employee?.attendance[month]) employee.attendance[month] = {};
    employee.attendance[month][date] = status;

    await employee.save();
    console.log("employee" , employee?.attendance[month][date]);

    res.json({ success: true, message: "Attendance updated" , data: employee});
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addEmployee, getAllEmployee, updateAttendance };
