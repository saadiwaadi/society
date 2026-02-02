const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit"); // 🛡️ Import Rate Limit
const { check } = require("express-validator");  // 🛡️ Import Validator
const validateRequest = require("../middleware/validateRequest"); // 🛡️ Import Bouncer
const User = require("../models/User");

const router = express.Router();

// 🛡️ RATE LIMITER: Block IP after 10 failed attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // <--- Increased to 10 attempts as requested
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes"
  }
});

// LOGIN ROUTE
router.post("/login", 
  loginLimiter, // 1. Check Rate Limit
  [
    check('identifier').notEmpty().withMessage('Email or Member ID is required'),
    check('password').notEmpty().withMessage('Password is required'),
    validateRequest // 2. Check Input Validity
  ], 
  async (req, res) => {
    try {
      const { identifier, password } = req.body;

      // Check if user exists (by email OR memberId)
      const user = await User.findOne({
        $or: [{ email: identifier }, { memberId: identifier }]
      });

      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Generate Token
      const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Standard Response
      res.json({ 
        success: true, 
        token, 
        isAdmin: user.isAdmin,
        user: { name: user.name, email: user.email, memberId: user.memberId }
      });

    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;