import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Stored Hashed Password:", user.password); // Log stored hashed password

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Comparison Result:", isMatch); // Log the result of the password comparison

    if (!isMatch) {
      return res.status(401).json({ message: "Password didn't match" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate admin-specific JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}, "-password"); // Exclude passwords for security
    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    // Ensure the logged-in user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    // Find the user by ID and remove them
    const user = await User.findByIdAndDelete(userId);

    // If the user doesn't exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting user",
      error: err.message,
    });
  }
};
