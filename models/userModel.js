import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Hashed password
    role: {
      type: String,
      enum: ["admin", "user"], // Allowed roles
      default: "user", // Default role
    },
    userType: {
      type: String,
      enum: ["student", "educator"], // User types for 'user' role
      default: "student",
    },
    preferences: { type: [String], default: [] }, // Array field
    institution: { type: String, required: true },
    lastLogin: { type: Date, default: null }, // Optional
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpires: { type: Date }, // Expiry time for reset token
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const User = mongoose.model("User", userSchema, "userData");
export default User;
