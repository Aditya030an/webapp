import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent"],
      default: "Present",
    },
    type:{
      type: String,
      required: true,
      enum: ["employee", "patient"],
      default: "patient",
    }
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
