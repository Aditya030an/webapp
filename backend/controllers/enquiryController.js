import enquiryModel from "../models/enquiryModels.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Patient from "../models/patientModel.js";
import TreatmentPlan from "../models/treatmentPlanModels.js";
import Attendance from "../models/attendanceModel.js";
import Bill from "../models/billReportModels.js";
import NeurologicalForm from "../models/neurologicalAssessmentModels.js";
import MusculoskeletalForm from "../models/musculoskeletalAssessmentModels.js";
import ObesityForm from "../models/obesityAssessmentModels.js";
import PilatesPhysioForm from "../models/pilatesAssessmentModels.js";

// Create token based on contactNumber
const createToken = (contactNumber) => {
  return jwt.sign({ contactNumber }, process.env.JWT_SECRET);
};

// Route for creating an enquiry
const createEnquiry = async (req, res) => {
  console.log("response inside backend", req.body);
  try {
    const {
      patientName,
      gender,
      age,
      occupation,
      contactNumber,
      email,
      chiefComplaint,
      remark,
      response,
      source,
      paymentStatus,
      amountPerDay,
      numberOfDays,
      total,
      musculoskeletalFormId,
      neurologicalFormId,
    } = req.body;

    // Check if contact number already exists
    const existing = await enquiryModel.findOne({ contactNumber });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Contact number already exists." });
    }

    // Create a new enquiry document
    const newEnquiry = new enquiryModel({
      patientName,
      gender,
      age,
      occupation,
      contactNumber,
      email,
      chiefComplaint,
      remark,
      response,
      source,
      paymentStatus,
      amountPerDay,
      numberOfDays,
      total,
      musculoskeletalFormId,
      neurologicalFormId,
    });

    // Save the enquiry to the database
    await newEnquiry.save();

    // Generate JWT token based on contact number
    const token = createToken(contactNumber);

    // Respond with success message and the generated token
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully!",
      data: newEnquiry,
      token: token, // Return the token to the client
    });
  } catch (error) {
    console.error("Error in createEnquiry:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const getEnquiry = async (req, res)=>{
  try{
    const enquiries = await enquiryModel.find().populate("patientId");
    res.status(200).json({ enquiries });
  }catch(err){
    console.log(err);
  }
}


const getPatientAttendanceEnquiry = async (req, res) => {
  try {
    const enquiries = await enquiryModel
      .find({ enquiryStatus: "patient" })
      .select("patientName updatedAt patientId")
      .populate({
        path: "patientId",
        select: "personalDetails attendance",
        populate: {
          path: "attendance",
          select: "date status",
        },
      });

    res.status(200).json({ enquiries });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching enquiries" });
  }
};

const getPersonalDetails = async (req, res) => {
  try {
    const contactNumber = req?.contactNumber;
    const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });

    res.status(200).json({ enquiryPersonalDetails });
  } catch (err) {
    console.log(err);
  }
};


const updatedEnquiry = async (req, res) => {
  try {
    const enquiry = await enquiryModel.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    const updatedEnquiry = await enquiryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const deleteEnquiryById = async (req, res) => {
//   try {
//     const enquiry = await enquiryModel.findById(req.params.id);
//     if (!enquiry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }

//     console.log("enquiry", enquiry);

//     // await enquiryModel.findByIdAndDelete(req.params.id);
    
//     // if(enquiry.enquiryStatus === "patient"){
//     // }
//     // res.status(200).json({ success: true,  message: "Enquiry deleted successfully" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const deleteEnquiryById = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const enquiry = await enquiryModel.findById(req.params.id).session(session);

    if (!enquiry) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // 🔴 Only if enquiry is patient
    if (enquiry.enquiryStatus === "patient" && enquiry.patientId) {
      const patientId = enquiry.patientId;

      // ✅ Delete ALL assessments by patientId
      await NeurologicalForm.deleteMany({ patientId }, { session });
      await MusculoskeletalForm.deleteMany({ patientId }, { session });
      await ObesityForm.deleteMany({ patientId }, { session });
      await PilatesPhysioForm.deleteMany({ patientId }, { session });

      // ✅ Delete treatment, attendance, billing
      await TreatmentPlan.deleteMany({ patientId }, { session });
      await Attendance.deleteMany({ id: patientId }, { session });
      await Bill.deleteMany({ patientId }, { session });

      // ✅ Delete patient
      await Patient.findByIdAndDelete(patientId).session(session);
    }

    // ✅ Delete enquiry
    await enquiryModel.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Enquiry and ALL related patient data deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Cascade delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during deletion",
    });
  }
};

export { createEnquiry, getEnquiry , getPatientAttendanceEnquiry , getPersonalDetails , updatedEnquiry  , deleteEnquiryById };
