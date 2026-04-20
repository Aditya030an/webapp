import Patient from "../models/patientModel.js";
import enquiryModel from "../models/enquiryModels.js";
import Counter from "../models/counterModel.js";

/* ---------- Generate Human Patient ID ---------- */

const generatePatientCode = async () => {
  const year = new Date().getFullYear();

  const lastPatient = await Patient.findOne(
    {},
    { "personalDetails.patientId": 1 },
  )
    .sort({ "personalDetails.patientId": -1 })
    .lean();

  let nextNumber = 1;

  if (lastPatient?.personalDetails?.patientId) {
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

    const patientCode = await generatePatientCode();

    const patient = await Patient.create({
      personalDetails: {
        name,
        age,
        gender,
        address,
        contactNumber,
        chiefComplaint,
        patientId: patientCode,
        enquiryId,
      },
    });

    await enquiryModel.findByIdAndUpdate(
      enquiryId,
      {
        patientName: name,
        gender,
        age,
        contactNumber,
        chiefComplaint,
        enquiryStatus: "patient",
        patientId: patient._id,
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

const updatedPatientStatus = async (req, res) => {
  try {
    const { patientId, patientStatus, enquiryId, remark } = req.body;
  
    if (!enquiryId) {
      return res.status(400).json({
        success: false,
        message: "enquiryId is required",
      });
    }

    const enquiryUpdateData = {};

    if (typeof remark === "string") {
      enquiryUpdateData.remark = remark.trim();
    }

    const enquiry = await enquiryModel.findByIdAndUpdate(
      enquiryId,
      { $set: enquiryUpdateData },
      { new: true },
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    let patient = null;

    if (patientId) {
      if (typeof patientStatus !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "patientStatus must be true or false",
        });
      }

      patient = await Patient.findByIdAndUpdate(
        patientId,
        {
          $set: {
            "personalDetails.patientStatus": patientStatus,
          },
        },
        { new: true },
      );

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry,
      patient,
    });
  } catch (err) {
    console.error("Error updating enquiry/patient:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating enquiry/patient",
    });
  }
};

export { createPatient, getAllPatient, getPatientById, updatedPatientStatus };