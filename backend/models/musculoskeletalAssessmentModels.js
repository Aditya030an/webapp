import mongoose from "mongoose";

const musculoskeletalSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    age: { type: String },
    sex: { type: String },
    occupation: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    referredBy: { type: String },
    dateOfEvaluation: { type: Date },

    chiefComplaint: { type: String },
    historyOfPresentIllness: { type: String },
    durationOfCondition: { type: String },
    onset: { type: String },
    aggravatingFactors: { type: String },

    medicalHistory: { type: String },
    surgicalHistory: { type: String },
    familyHistory: { type: String },
    personalHistory: { type: String },

    posture: { type: String },
    scars: { type: String },

    tenderness: { type: String },
    temperature: { type: String },

    typeOfPain: { type: String },
    siteOfPain: { type: String },
    duration: { type: String },
    vasScore: { type: Number },

    jointROM: { type: String },
    painDuringMovement: { type: String },

    mmt: { type: String },
    muscleWeakness: { type: String },

    mentionSpecificTests: { type: String },

    gait: { type: String },
    assistiveDevices: { type: String },
    functionalIndependence: { type: String },

    xray: { type: String },

    summarizeClinicalProblems: { type: String },

    shortTermGoals: { type: String },
    longTermGoals: { type: String },

    patientConsent: { type: String },
    physiotherapistName: { type: String },
    signature: { type: String },
    date: { type: Date },
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enquiry",
      required: true,
    },
    history: [
      {
        updatedAt: { type: Date, default: Date.now },
        data: { type: mongoose.Schema.Types.Mixed }, // <- key fix
      },
    ],
  },
  { timestamps: true }
);

const musculoskeletalForm = mongoose.model(
  "orthopedicFormSchema",
  musculoskeletalSchema
);

export default musculoskeletalForm;
