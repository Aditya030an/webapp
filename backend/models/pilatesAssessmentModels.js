// models/PilatesPhysioForm.js
import mongoose from "mongoose";

const PilatesPhysioFormSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },

  medicalHistory: { type: String },
  exerciseFrequency: { type: String },
  exerciseType: { type: String },
  pilatesGoals: { type: String },
  postureNotes: { type: String },
  painAreas: { type: String },
  physiotherapistSummary: { type: String },

  submittedAt: { type: Date, default: Date.now },
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
});

const PilatesPhysioForm = mongoose.model(
  "PilatesPhysioForm",
  PilatesPhysioFormSchema
);
export default PilatesPhysioForm;
