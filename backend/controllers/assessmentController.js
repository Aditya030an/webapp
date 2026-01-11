import enquiryModel from "../models/enquiryModels.js";
import Patient from "../models/patientModel.js";
import jwt from "jsonwebtoken";
import neurologicalFormModel from "../models/neurologicalAssessmentModels.js";
import musculoskeletalFormModel from "../models/musculoskeletalAssessmentModels.js";
import obesityFormModel from "../models/obesityAssessmentModels.js";
import pilatesPhysioFormModel from "../models/pilatesAssessmentModels.js";
// Create token based on contactNumber

// Route for creating an enquiry
const createNeurologicalForm = async (req, res) => {
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

    // 1️⃣ Create neurological form
    const newNeurologicalForm = await neurologicalFormModel.create({
      patientId,
      ...formData,
    });

    // 2️⃣ Push neurological form ID (BEST way)
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: {
          "assessment.neurologicalFormId": newNeurologicalForm._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Neurological form created successfully",
      neuro: newNeurologicalForm,
      patient: updatedPatient,
    });
  } catch (err) {
    console.error("Neurological error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getNeurologicalForm = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("id", id);
    const form = await neurologicalFormModel.findById(id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }
    res.status(200).json({ success: true, form });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateNeurologicalForm = async (req, res) => {
  try {
    const id = req.params.id;
    const formData = req.body;
    // console.log("form data", formData);

    const form = await neurologicalFormModel.findById(id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    if (form.history?.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 2 updates allowed for this form",
      });
    }

    // Save current form as a snapshot in history before updating
    const currentSnapshot = form.toObject();
    delete currentSnapshot.history; // prevent nesting

    console.log("currect snap shot", currentSnapshot);

    form.history.push({
      updatedAt: new Date(),
      data: currentSnapshot,
    });

    form.markModified("history"); // <- force Mongoose to recognize the change

    // Prevent accidental overwrite of history from frontend
    if ("history" in formData) {
      delete formData.history;
    }

    // Apply new data to the form
    Object.assign(form, formData);

    const updatedForm = await form.save();

    res.status(200).json({
      success: true,
      message: "Update Neurological Form Successfully",
      updatedForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createMusculoskeletalForm = async (req, res) => {
  try {
    const { patientId, formData } = req.body;

    console.log("Musculoskeletal form", formData);

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

    const newMusculoskeletalForm = await musculoskeletalFormModel.create({
      patientId,
      ...formData,
    });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: {
          "assessment.musculoskeletalFormId": newMusculoskeletalForm._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Musculoskeletal form created successfully",
      musculo: newMusculoskeletalForm,
      patient: updatedPatient,
    });
  } catch (err) {
    console.log("Musculoskeletal error", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMusculoskeletalForm = async (req, res) => {
  try {
    const id = req.params.id;
    const form = await musculoskeletalFormModel.findById(id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }
    res.status(200).json({ success: true, form });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateMusculoskeletalForm = async (req, res) => {
  try {
    const id = req.params.id;
    const formData = req.body;

    const form = await musculoskeletalFormModel.findById(id);

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    // Limit to 2 updates only
    if (form.history?.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 2 updates allowed for this form",
      });
    }

    // Save current form as a snapshot in history before updating
    const currentSnapshot = form.toObject();
    delete currentSnapshot.history; // prevent nesting

    console.log("currect snap shot", currentSnapshot);

    form.history.push({
      updatedAt: new Date(),
      data: currentSnapshot,
    });

    form.markModified("history"); // <- force Mongoose to recognize the change

    // Prevent accidental overwrite of history from frontend
    if ("history" in formData) {
      delete formData.history;
    }

    // Apply new data to the form
    Object.assign(form, formData);

    const updatedForm = await form.save();

    res.status(200).json({
      success: true,
      message: "Update Musculoskeletal Successfully",
      updatedForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createObesityForm = async (req, res) => {
  try {
    const { patientId, formData } = req.body;

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

    const newObesityForm = await obesityFormModel.create({
      patientId,
      ...formData,
    });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: {
          "assessment.obesityFormId": newObesityForm._id,
        },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Obesity form successfully submitted",
      obesity: newObesityForm,
      patient: updatedPatient,
    });
  } catch (err) {
    console.error("Neurological error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getObesityForm = async (req, res) => {
  try {
    const id = req.params.id;
    const form = await obesityFormModel.findById(id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }
    res.status(200).json({ success: true, form });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateObesityForm = async (req, res) => {
  try {
    const id = req.params.id;
    const formData = req.body;
    // console.log("form data", formData);

    const form = await obesityFormModel.findById(id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    // Limit to 2 updates only
    if (form.history?.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 2 updates allowed for this form",
      });
    }

    // Save current form as a snapshot in history before updating
    const currentSnapshot = form.toObject();
    delete currentSnapshot.history; // prevent nesting

    form.history.push({
      updatedAt: new Date(),
      data: currentSnapshot,
    });

    form.markModified("history"); // <- force Mongoose to recognize the change

    // Prevent accidental overwrite of history from frontend
    if ("history" in formData) {
      delete formData.history;
    }

    // Apply new data to the form
    Object.assign(form, formData);

    const updatedForm = await form.save();

    res.status(200).json({
      success: true,
      message: "Update Obesity Successfully",
      updatedForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createPilatesForm = async (req, res) => {
  try {
    const { patientId, formData } = req.body;

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

    const newPilatesForm = await pilatesPhysioFormModel.create({
      patientId,
      ...formData,
    });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $push: {
          "assessment.pilatesPhysioFormId": newPilatesForm._id,
        },
      },
      { new: true }
    );
    // console.log("new form pilatesForm", newForm);
    // console.log("enquiry id", newEnquiry);
    res.status(201).json({
      success: true,
      message: "Pilates form successfully submitted",
      pilates: newPilatesForm,
      patient: updatedPatient,
    });
  } catch (err) {
    console.error("Neurological error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPilatesForm = async (req, res) => {
  try {
    const id = req.params.id;
    const form = await pilatesPhysioFormModel.findById(id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }
    res.status(200).json({ success: true, form });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updatePilatesForm = async (req, res) => {
  try {
    const id = req.params.id;
    const formData = req.body;

    const form = await pilatesPhysioFormModel.findById(id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    // Limit to 2 updates only
    if (form.history?.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 2 updates allowed for this form",
      });
    }

    // Save current form as a snapshot in history before updating
    const currentSnapshot = form.toObject();
    delete currentSnapshot.history; // prevent nesting

    form.history.push({
      updatedAt: new Date(),
      data: currentSnapshot,
    });

    form.markModified("history"); // <- force Mongoose to recognize the change

    // Prevent accidental overwrite of history from frontend
    if ("history" in formData) {
      delete formData.history;
    }

    // Apply new data to the form
    Object.assign(form, formData);

    const updatedForm = await form.save();

    res.status(200).json({
      success: true,
      message: "Update Pilates Successfully",
      updatedForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createNeurologicalForm,
  createMusculoskeletalForm,
  createObesityForm,
  createPilatesForm,
  getNeurologicalForm,
  getMusculoskeletalForm,
  getObesityForm,
  getPilatesForm,
  updateNeurologicalForm,
  updateMusculoskeletalForm,
  updateObesityForm,
  updatePilatesForm,
};
