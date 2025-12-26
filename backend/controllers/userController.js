import User from "../models/userModels.js"; // ✅ FIX NAME
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if(validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)){
      return res.status(400).json({ message: "All fields are required" });
    }

    if(!validator.isStrongPassword(password)){
      return res.status(400).json({ message: "Password is not strong enough:"});
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * LOGIN USER
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userWithoutPassword = {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user:userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL USERS
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // 🔐 hide password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password"); // 🔐 hide password
    res.status(200).json(user == null ? { message: "No user found" } : user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};