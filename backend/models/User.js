const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ... other fields
  memberId: { 
    type: String, 
    required: true, 
    unique: true, // Creates an index automatically
    index: true   // Explicitly asking for an index (double sure)
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // ... passwordHash, isAdmin, etc.
}, { timestamps: true });

// Compound index example (if you search by name often)
userSchema.index({ name: 1 }); 

module.exports = mongoose.model("User", userSchema);