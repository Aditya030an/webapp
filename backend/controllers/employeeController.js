import Employee from "../models/employeeModels.js";
import jwt from "jsonwebtoken";

const addEmployee = async (req, res) => {
  const { name, role } = req.body;
  console.log("req.body add", req.body);
  try {
    // Check if employee with same name (case-insensitive) already exists
    const existingEmployee = await Employee.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ success: false, message: "Employee already exists" });
    }

    // Create and save new employee
    const newEmployee = new Employee({ name, role });
    await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("Error in addEmployee:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  const { empId, date, status } = req.body;
  const month = date.slice(0, 7);

  console.log("req.bosy attendenace", req?.body);

  try {
    const employee = await Employee.findById(empId);
    if (!employee)
      return res.json({ success: false, message: "Employee not found" });

    if (!employee?.attendance) employee.attendance = {};
    if (!employee?.attendance[month]) employee.attendance[month] = {};
    employee.attendance[month][date] = status;

    await employee.save();
    console.log("employee", employee?.attendance[month][date]);

    res.json({ success: true, message: "Attendance updated", data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      qualification,
      registrationNo,
      experience,
      contactNumber,
      email,
      password,
      workingBranch,
      status,
      employeeType,
      employeePost,
      joiningDate,
      exitDate,
    } = req.body;

    const loginEmployeeId = req.id;

    console.log("loginEmployeeId", loginEmployeeId);
    const loginEmployee = await Employee.findById(loginEmployeeId);

    if (!loginEmployee) {
      return res.status(401).json({
        success: false,
        message: "Employee not found",
      });
    }
    console.log("employee", loginEmployee);
    // ✅ Check admin using personalDetails.email
    if (loginEmployee.personalDetails.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    console.log("login employee, , ,  , , ,", loginEmployee);

    console.log("create employee", req.body);

    if (
      !fullName ||
      !qualification ||
      experience === undefined ||
      experience === null ||
      !contactNumber ||
      !email ||
      !password ||
      !employeeType ||
      !workingBranch ||
      !status ||
      !joiningDate ||
      !employeeId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (!/^[0-9]{10}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact number",
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const employee = await Employee.create({
      personalDetails: {
        employeeId,
        fullName,
        qualification,
        registrationNo,
        experience,
        contactNumber,
        email,
        password,
        workingBranch,
        status,
        employeeType,
        employeePost,
        joiningDate,
        exitDate,
      },
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("patientLook.patientId")
      .populate({
        path:"attendance",
        options: { sort: { createdAt: -1 } },
      });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching patient",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      qualification,
      registrationNo,
      experience,
      contactNumber,
      email,
      password,
      employeeType,
      employeePost,
      joiningDate,
      workingBranch,
      status,
      exitDate,
    } = req.body;

    const employeeExist = await Employee.findById(req.params.id);
    if (!employeeExist) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, {
      personalDetails: {
        employeeId,
        fullName,
        qualification,
        registrationNo,
        experience,
        contactNumber,
        email,
        password,
        workingBranch,
        status,
        employeeType,
        employeePost,
        joiningDate,
        exitDate,
      },
    });
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching patient",
    });
  }
};

const deleteEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error delete patient",
    });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("loginData", req.body);
    const employee = await Employee.findOne({ "personalDetails.email": email });
    console.log("employee", employee);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.personalDetails.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching employee",
    });
  }
};

export {
  createEmployee,
  addEmployee,
  getAllEmployee,
  updateAttendance,
  getEmployeeById,
  updateEmployee,
  deleteEmployeeById,
  loginEmployee,
};
