const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links the complaint to the Member who sent it
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "resolved", "dismissed"]
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model("Complaint", complaintSchema);