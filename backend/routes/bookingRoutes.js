const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const { facility, date, timeSlot } = req.body;
  try {
    const existingBooking = await Booking.findOne({ facility, date, timeSlot, status: "confirmed" });
    if (existingBooking) {
      return res.status(400).json({ success: false, message: "Slot already booked" });
    }
    const newBooking = new Booking({ memberId: req.user.userId, facility, date, timeSlot });
    await newBooking.save();
    res.status(201).json({ success: true, message: "Booking confirmed", data: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const myBookings = await Booking.find({ memberId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: myBookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/all", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ success: false, error: "Admin only" });
  try {
    const allBookings = await Booking.find().populate("memberId", "name memberId").sort({ createdAt: -1 });
    res.json({ success: true, data: allBookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;