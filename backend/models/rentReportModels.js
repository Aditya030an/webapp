import mongoose from "mongoose";

const rentSchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true },
    month: { type: String, required: true }, // Example: "January 2025"
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      default: "Unpaid",
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

const Rent = mongoose.model("Rent", rentSchema);
export default Rent;
