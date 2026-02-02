const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const auth = require("../middleware/authMiddleware");

// 1. MEMBER: Create a new complaint
router.post("/", auth, async (req, res) => {
  try {
    const complaint = await Complaint.create({
      memberId: req.user.userId,
      category: req.body.category,
      description: req.body.description
    });
    // Standardized Success Response
    res.status(201).json({ success: true, message: "Complaint submitted", data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// 2. MEMBER: View own complaints
router.get("/my", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ memberId: req.user.userId })
      .sort({ createdAt: -1 }); // Newest first
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// 3. ADMIN: View all society complaints
router.get("/", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ success: false, error: "Admin only" });

  try {
    const complaints = await Complaint.find()
      .populate("memberId", "name memberId") // Shows Member Name instead of just ID
      .sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// 4. ADMIN: Update status
router.put("/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ success: false, error: "Admin only" });

  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, message: "Status updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;