import Patient from "../models/patientModel.js";
import TreatmentPlan from "../models/treatmentPlanModels.js";

// @desc   Create a new treatment plan
// @route  POST /api/treatment-plans
export const createTreatmentPlan = async (req, res) => {
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

    const newTreatmentPlane = await TreatmentPlan.create({
      patientId,
      ...formData,
    });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: {
          "treatment": newTreatmentPlane._id,
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Treatment plan created successfully",
      data: newTreatmentPlane,
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc   Get all treatment plans
// @route  GET /api/treatment-plans
export const getTreatmentPlans = async (req, res) => {
  try {
    const plans = await TreatmentPlan.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
