const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ROUTE: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log("📥 Incoming Login Data:", req.body);

    // 1. Extract and Clean Data
    const { identifier, password } = req.body;
    
    // ⚠️ FIX: Remove accidental spaces from inputs
    const cleanEmail = identifier.trim(); 
    const cleanPassword = password.trim(); 

    // 2. Check if user exists (Include the password field!)
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    
    console.log("👤 Database User Found:", user); 

    if (!user) {
      console.log("⚠️ Login Failed: User not found ->", cleanEmail);
      return res.status(400).json({ msg: "User not found" });
    }

    // 3. Validate Password
    // compare(cleanPassword, hashed_password_from_db)
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    
    if (!isMatch) {
      console.log("⚠️ Login Failed: Wrong password ->", cleanEmail);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 4. Create Token
    const payload = { user: { id: user.id, role: user.role } };
    
    if (!process.env.JWT_SECRET) {
      throw new Error("Missing JWT_SECRET in .env file");
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        console.log("✅ Login Successful for:", cleanEmail);
        // Return user info WITHOUT the password
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            } 
        });
      }
    );

  } catch (err) {
    console.error("❌ ROUTE ERROR:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;