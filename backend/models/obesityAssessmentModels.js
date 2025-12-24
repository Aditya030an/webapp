// models/ObesityForm.js
import mongoose from "mongoose";

const weightChartEntrySchema = new mongoose.Schema(
  {
    date: String,
    before: String,
    after: String,
  },
  { _id: false }
);

const ObesityFormSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  height: { type: String },
  weight: { type: String },
  bmi: { type: String },

  medicalHistory: { type: String },

  armGirth: { type: String },
  thighGirth: { type: String },
  chest: { type: String },
  abdomenUmbilicus: { type: String },
  abdomenXiphoid: { type: String },
  abdomenAsis: { type: String },

  weightChart: [weightChartEntrySchema],

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

  summary: { type: String },

  submittedAt: { type: Date, default: Date.now },
});

const ObesityForm = mongoose.model("ObesityForm", ObesityFormSchema);
export default ObesityForm;
