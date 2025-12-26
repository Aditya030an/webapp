import mongoose from "mongoose";
import validator from "validator";

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength:3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);
export default User;
