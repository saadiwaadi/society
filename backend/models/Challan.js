const mongoose = require("mongoose");

const challanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // e.g., "January 2026"
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Challan", challanSchema);