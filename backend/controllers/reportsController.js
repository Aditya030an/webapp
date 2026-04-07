import billModel from "../models/billReportModels.js";
import expensesModel from "../models/expensesReportModels.js";
import inventoryModel from "../models/inventoryReportModels.js";
import Patient from "../models/patientModel.js";
import rentModel from "../models/rentReportModels.js";
import salaryModel from "../models/salaryReportModels.js";
const createBill = async (req, res) => {
  try {
    const { patientId, formData } = req.body;
    console.log("patient id", patientId);
    console.log("formData", formData);

    if (!patientId || !formData) {
      return res.status(400).json({
        success: false,
        message: "patientId and formData are required",
      });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const paidAmount =
      Number(formData.advancePayment) + Number(formData.amountInWallet);

    const remainingBalance =
      paidAmount > Number(formData.total)
        ? paidAmount - Number(formData.total)
        : 0;
    // console.log("remainingBalance", remainingBalance);

    const newBill = await billModel.create({
      patientId,
      ...formData,
      amountInWallet: remainingBalance,
      advancePayment:
        Number(formData.advancePayment) + Number(formData.amountInWallet),
    });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: {
          billing: newBill._id,
        },
      },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      bill: newBill,
      patient: updatedPatient,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to create bill",
      error: err.message,
    });
  }
};

const getBill = async (req, res) => {
  try {
    const bills = await billModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Bills retrieved successfully",
      data: bills,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve bills",
      error: err.message,
    });
  }
};

const updateBillPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Validate input
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    if (!["Paid", "Unpaid"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status (Only Paid / Unpaid allowed)",
      });
    }

    // ✅ Find bill
    const bill = await billModel.findById(id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    // ✅ Update ONLY paymentStatus (safe PUT)
    bill.paymentStatus = status;

    await bill.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      bill,
    });
  } catch (error) {
    console.log("PUT update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteBill = async (req, res) => {
  try {
    const id = req.params.id;
    const bill = await billModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
      data: bill,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to delete bill",
      error: err.message,
    });
  }
};

const createExpenses = async (req, res) => {
  try {
    const { ...formData } = req.body;
    console.log(formData);
    const newExpenses = new expensesModel(formData);
    const savedExpenses = await newExpenses.save();
    res.status(201).json({
      success: true,
      message: "Expenses created successfully",
      data: savedExpenses,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to create expenses",
      error: err.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await expensesModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully",
      data: expenses,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve expenses",
      error: err.message,
    });
  }
};

const createInventory = async (req, res) => {
  try {
    const { ...formData } = req.body;
    console.log(formData);
    const newInventory = new inventoryModel(formData);
    const savedInventory = await newInventory.save();
    res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      data: savedInventory,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to create inventory",
      error: err.message,
    });
  }
};

const getInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Inventory retrieved successfully",
      data: inventory,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve inventory",
      error: err.message,
    });
  }
};

const createRent = async (req, res) => {
  try {
    const { ...formData } = req.body;
    console.log(formData);
    const newRent = new rentModel(formData);
    const savedRent = await newRent.save();
    res.status(201).json({
      success: true,
      message: "Rent created successfully",
      data: savedRent,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to create rent",
      error: err.message,
    });
  }
};

const getRent = async (req, res) => {
  try {
    const rents = await rentModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Rents retrieved successfully",
      data: rents,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve rents",
      error: err.message,
    });
  }
};

// const updateRentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const validStatus = ["Paid", "Unpaid", "Pending"];
//     if (!validStatus.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status value",
//       });
//     }

//     console.log(id , status);

//     const updatedRent = await rentModel.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true },
//     );

//     if (!updatedRent) {
//       return res.status(404).json({
//         success: false,
//         message: "Rent record not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Status updated successfully",
//       data: updatedRent,
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

const updateRentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["Paid", "Unpaid", "Pending"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    console.log(id , status);

    const updated = await rentModel.findByIdAndUpdate(
      id,
      { $set: { status } }, // ✅ safer
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Rent not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createSalary = async (req, res) => {
  try {
    const { ...formData } = req.body;
    console.log(formData);
    const newSalary = new salaryModel(formData);
    const savedSalary = await newSalary.save();
    res.status(201).json({
      success: true,
      message: "Salary created successfully",
      data: savedSalary,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to create salary",
      error: err.message,
    });
  }
};

const getSalary = async (req, res) => {
  try {
    const salaries = await salaryModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Salaries retrieved successfully",
      data: salaries,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve salaries",
      error: err.message,
    });
  }
};

const updateSalaryPaidStatus = async (req, res) => {
  try {
    const { entryId, empId } = req.params;
    const { paid } = req.body;

    const salary = await salaryModel.findById(entryId);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary entry not found",
      });
    }

    const employee = salary.employees.id(empId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ✅ update field
    employee.paid = paid;

    await salary.save();

    res.status(200).json({
      success: true,
      message: "Paid status updated successfully",
      data: salary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {
  createBill,
  getBill,
  updateBillPaymentStatus,
  createExpenses,
  getExpenses,
  createInventory,
  getInventory,
  createRent,
  getRent,
  updateRentStatus,
  createSalary,
  getSalary,
  updateSalaryPaidStatus,
};
