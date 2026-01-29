const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({
      $or: [{ email: identifier }, { memberId: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Member ID" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    // 3. Create the "Digital ID Card" (Token)
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send response
    res.json({
      message: "Login Successful",
      token,
      isAdmin: user.isAdmin
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;