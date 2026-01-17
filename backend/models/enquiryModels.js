import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  email: {
    type: String,
    // required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  chiefComplaint: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    enum: ["Pending", "Done", "Deny"],
    required: true,
  },
  source: {
    type: String,
    enum: ["Walk-in", "Phone", "Referral", "Online"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Partially Paid"],
    // required: true,
  },
  amountPerDay: {
    type: Number,
    // required: true,
  },
  numberOfDays: {
    type: Number,
    // required: true,
  },
  total: {
    type: Number,
    // required: true,
  },
  enquiryStatus: {
    type: String,
    enum: ["lead" , "patient"],
    default: "lead",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  musculoskeletalFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MusculoskeletalForm", // Reference to MusculoskeletalForm
    required: false,
  },
  neurologicalFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NeurologicalForm", // Reference to NeurologicalForm
    required: false,
  },
  obesityFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ObesityForm", // Reference to NeurologicalForm
    required: false,
  },
  pilatesPhysioFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PilatesPhysioForm", // Reference to NeurologicalForm
    required: false,
  }
}, {
  timestamps: true,
});

const enquiryModel =mongoose.models.user ||  mongoose.model("enquiry" , enquirySchema);

export default enquiryModel;


