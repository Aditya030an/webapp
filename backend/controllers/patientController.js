import Patient from "../models/patientModel.js";
import enquiryModel from "../models/enquiryModels.js";
import Counter from "../models/counterModel.js";

/* ---------- Generate Human Patient ID ---------- */

const generatePatientCode = async () => {
  const year = new Date().getFullYear();

  // Get patient with highest patientId number
  const lastPatient = await Patient.findOne(
    {},
    { "personalDetails.patientId": 1 }
  )
    .sort({ "personalDetails.patientId": -1 })
    .lean();

  let nextNumber = 1;

  if (lastPatient?.personalDetails?.patientId) {
    // Example: MR-00027/2026 → 27
    const lastId = lastPatient.personalDetails.patientId;
    const numberPart = parseInt(lastId.split("-")[1].split("/")[0], 10);
    nextNumber = numberPart + 1;
  }

  return `MR-${String(nextNumber).padStart(5, "0")}/${year}`;
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

    console.log("req.body", req.body);

    // 1️⃣ Generate patient code
    const patientCode = await generatePatientCode();

    console.log("patientCode", patientCode);

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
        patientName: name,
        gender,
        age,
        contactNumber,
        chiefComplaint,
        enquiryStatus: "patient",
        patientId: patient._id, // ✅ ObjectId reference
      },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Patient created and enquiry converted",
      data: patient,
    });
  } catch (error) {
    console.error(error);

    // 🔐 Duplicate safety (extra protection)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Patient ID already exists",
      });
    }

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
