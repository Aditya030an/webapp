import mongoose from "mongoose";

const treatmentPlanSchema = new mongoose.Schema(
  {
    exercises: {
      type: String,
      required: true,
    },
    progressionStrategy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TreatmentPlan = mongoose.model("TreatmentPlan", treatmentPlanSchema);
export default TreatmentPlan;