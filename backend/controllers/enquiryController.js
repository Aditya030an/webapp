import enquiryModel from "../models/enquiryModels.js";
import jwt from "jsonwebtoken";

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
      sex,
      age,
      occupation,
      contactNumber,
      email,
      chiefComplaint,
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
      sex,
      age,
      occupation,
      contactNumber,
      email,
      chiefComplaint,
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
    const enquiries = await enquiryModel.find();
    res.status(200).json({ enquiries });
  }catch(err){
    console.log(err);
  }
}

const getPersonalDetails = async (req, res) => {
  try {
    const contactNumber = req?.contactNumber;
    const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });

    res.status(200).json({ enquiryPersonalDetails });
  } catch (err) {
    console.log(err);
  }
};

export { createEnquiry, getEnquiry , getPersonalDetails };
