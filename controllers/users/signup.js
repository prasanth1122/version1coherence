import bcrypt from "bcryptjs";
import User from "../../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, userType, institution } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    if (!institution) {
      return res.status(400).json({ message: "Institution is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log the hashed password to check

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      userType,
      institution,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, role: newUser.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Check if email already exists
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(200)
        .json({ exists: true, message: "Email already registered" });
    }

    res.status(200).json({ exists: false, message: "Email is available" });
  } catch (err) {
    console.error("Error checking email:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
