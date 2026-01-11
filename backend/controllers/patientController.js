import Patient from "../models/patientModel.js";
import enquiryModel from "../models/enquiryModels.js";

/* ---------- Generate Human Patient ID ---------- */
const generatePatientCode = async () => {
  const count = await Patient.countDocuments();
  const year = new Date().getFullYear();
  return `MR-${String(count + 1).padStart(5, "0")}/${year}`;
};

const createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      address,
      contactNumber,
      chiefComplaint,
      enquiryId,
    } = req.body;

    if (!enquiryId) {
      return res.status(400).json({
        success: false,
        message: "enquiryId is required",
      });
    }

    // 1️⃣ Generate patient code
    const patientCode = await generatePatientCode();

    // 2️⃣ Create patient
    const patient = await Patient.create({
      personalDetails: {
        name,
        age,
        gender,
        address,
        contactNumber,
        chiefComplaint,
        patientId: patientCode, // string ID
        enquiryId, // ref to enquiry
      },
    });

    // 3️⃣ Update enquiry
    await enquiryModel.findByIdAndUpdate(
      enquiryId,
      {
        enquiryStatus: "patient",
        patientId: patient._id, // ✅ ObjectId reference
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Patient created and enquiry converted",
      data: patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create patient",
      error: error.message,
    });
  }
};

const getAllPatient = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({ patients });
  } catch (err) {
    console.log(err);
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("personalDetails.enquiryId")
      .populate("assessment.musculoskeletalFormId")
      .populate("assessment.neurologicalFormId")
      .populate("assessment.obesityFormId")
      .populate("assessment.pilatesPhysioFormId")
      .populate([
        {
          path: "attendance",
          options: { sort: { createdAt: -1 } },
        },
        {
          path: "billing",
          options: { sort: { createdAt: -1 } },
        },
        {
          path: "treatment",
          options: { sort: { createdAt: -1 } },
        },
      ]);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching patient",
    });
  }
};

export { createPatient, getAllPatient, getPatientById };
