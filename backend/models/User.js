const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  memberId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true, 
    select: false // ✅ This hides the password by default (security best practice)
  },
  role: { 
    type: String, 
    enum: ['admin', 'member'], 
    default: 'member' 
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);