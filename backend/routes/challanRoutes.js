const express = require("express");
const router = express.Router();
const Challan = require("../models/Challan");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ success: false, error: "Admin only" });
  try {
    const challan = await Challan.create(req.body);
    res.json({ success: true, message: "Challan generated", data: challan });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const challans = await Challan.find({ memberId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: challans });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;