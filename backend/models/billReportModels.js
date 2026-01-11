// models/Bill.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const billSchema = new mongoose.Schema(
  {
    billNumber: { type: String, required: true },
    billType: {
      type: String,
      enum: ["Home", "Client"],
      default: "Home",
      required: true,
    },
    customer: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Cash", "Online"], default: "Cash" },
    items: [itemSchema],
    total: { type: Number, required: true },
    advancePayment: { type: Number, default: 0 },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
