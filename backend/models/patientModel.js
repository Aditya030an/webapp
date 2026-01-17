import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    personalDetails: {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
      },
      chiefComplaint: {
        type: String,
        required: true,
      },
      patientId: {
        type: String,
        required: true,
        unique: true,
      },
      enquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "enquiry",
        required: true,
      },
    },
    //   this physiotherapist is made by the owner with status (owner , junior)
    physioAssigned: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "physiotherapist",
      default: [],
    },
    //   is this all are assessment -> Neurological , Musculoskeletal , Obesity Management , Pilates
    assessment: {
      neurologicalFormId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "neurologicalForm",
        default: [],
      },
      musculoskeletalFormId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "orthopedicFormSchema",
        default: [],
      },
      obesityFormId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ObesityForm",
        default: [],
      },
      pilatesPhysioFormId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "PilatesPhysioForm",
        default: [],
      },
    },
    treatment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TreatmentPlan",
      },
    ],
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
    billing: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
      },
    ],
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
