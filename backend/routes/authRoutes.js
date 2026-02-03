const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// ==========================
// 1. REGISTER ROUTE
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, unit_no, contact } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      unit_no,
      contact,
      role: "resident" // Default role
    });

    await user.save();

    // Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, role: user.role, unit_no: user.unit_no } 
    });

  } catch (err) {
    console.error("Register Error:", err.message); // Log error to terminal
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ==========================
// 2. LOGIN ROUTE
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Allow login by Email OR Member ID (if you have one) - for now just Email
    const user = await User.findOne({ email: identifier });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role, unit_no: user.unit_no }
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;