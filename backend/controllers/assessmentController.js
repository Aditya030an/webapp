import enquiryModel from "../models/enquiryModels.js";
import jwt from "jsonwebtoken";
import neurologicalFormModel from "../models/neurologicalAssessmentModels.js";
import musculoskeletalFormModel from "../models/musculoskeletalAssessmentModels.js";
import obesityFormModel from "../models/obesityAssessmentModels.js";
import pilatesPhysioFormModel from "../models/pilatesAssessmentModels.js";
// Create token based on contactNumber

// Route for creating an enquiry
const createNeurologicalForm = async (req, res) => {
  try {
    const contactNumber = req?.contactNumber;
    const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });

    const enquiryId = enquiryPersonalDetails?.[0]?._id;
    const { ...formData } = req.body;
    // console.log("data inside backed", formData);

    const newForm = await neurologicalFormModel.create({
      enquiryId,
      ...formData,
    });

    // Update Enquiry with neurologicalFormId (singular)
    const newEnquiry = await enquiryModel.findByIdAndUpdate(
      enquiryId,
      {
        neurologicalFormId: newForm._id,
        patientName: formData?.patientName,
        age: formData?.age,
        sex: formData?.sex,
        occupation: formData?.occupation,
        contactNumber: formData?.contactNumber,
        chiefComplaint: formData?.chiefComplaint,
      },
      { new: true, runValidators: true }
    );
    // console.log("new form", newForm);
    // console.log("enquiry id", newEnquiry);

    res.status(200).json({
      message: "Neurological form created successfully.",
      success: true,
    });
  } catch (err) {
    console.log(err);
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
    const contactNumber = req?.contactNumber;
    const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });

    const enquiryId = enquiryPersonalDetails?.[0]?._id;
    const { ...formData } = req.body;
    // console.log("data musculoskeletal inside backed", formData);

    const newForm = await musculoskeletalFormModel.create({
      enquiryId,
      ...formData,
    });

    // Update Enquiry with neurologicalFormId (singular)
    const newEnquiry = await enquiryModel.findByIdAndUpdate(
      enquiryId,
      {
        musculoskeletalFormId: newForm._id,
        patientName: formData?.patientName,
        age: formData?.age,
        sex: formData?.sex,
        occupation: formData?.occupation,
        contactNumber: formData?.contactNumber,
        chiefComplaint: formData?.chiefComplaint,
      },
      { new: true, runValidators: true }
    );
    // console.log("new form musculoskeletalFormModel", newForm);
    // console.log("enquiry id", newEnquiry);

    res.status(200).json({
      message: "Musculoskeletal form created successfully.",
      success: true,
    });
  } catch (err) {
    console.log(err);
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
    const contactNumber = req?.contactNumber;
    const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });

    const enquiryId = enquiryPersonalDetails?.[0]?._id;
    const { ...formData } = req.body;
    // console.log("data musculoskeletal inside backed", formData);

    const newForm = await obesityFormModel.create({
      enquiryId,
      ...formData,
    });

    const newEnquiry = await enquiryModel.findByIdAndUpdate(
      enquiryId,
      {
        obesityFormId: newForm._id,
        fullName: formData?.patientName,
        age: formData?.age,
        sex: formData?.sex,
      },
      { new: true, runValidators: true }
    );
    // console.log("new form obesityForm", newForm);
    // console.log("enquiry id", newEnquiry);
    res.status(201).json({
      message: "Obesity form successfully submitted",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to submit obesity form",
      error: error.message,
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
    const contactNumber = req?.contactNumber;
    const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });

    const enquiryId = enquiryPersonalDetails?.[0]?._id;
    const { ...formData } = req.body;
    // console.log("data pilates inside backed", formData);

    const newForm = await pilatesPhysioFormModel.create({
      enquiryId,
      ...formData,
    });

    const newEnquiry = await pilatesPhysioFormModel.findByIdAndUpdate(
      enquiryId,
      {
        pilatesFormId: newForm._id,
        fullName: formData?.patientName,
        age: formData?.age,
        sex: formData?.sex,
      },
      { new: true, runValidators: true }
    );
    // console.log("new form pilatesForm", newForm);
    // console.log("enquiry id", newEnquiry);
    res.status(201).json({
      message: "Pilates form successfully submitted",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to submit Pilates form",
      error: error.message,
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
