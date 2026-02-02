const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links this booking to the user who made it
    required: true
  },
  facility: {
    type: String, 
    required: true,
    enum: ["Football Ground", "Community Hall", "Swimming Pool"] // Limits choices
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  timeSlot: {
    type: String, // Format: 18:00-20:00
    required: true
  },
  status: {
    type: String,
    default: "confirmed",
    enum: ["confirmed", "cancelled"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);