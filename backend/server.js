require('dotenv').config(); // Load variables first
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json()); // Allows the server to accept JSON data
app.use(cors());         // Allows your React app to talk to this API

// --- DATABASE CONNECTION ---
// Using the variable from your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));
app.use("/api/complaints", require("./routes/complaintRoutes"));
// --- ROUTES ---
// This connects the logic for your User models and logins

// --- ROUTES ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/challans", require("./routes/challanRoutes")); 
app.get('/', (req, res) => {
  res.send('Society Portal API is running...');
});

app.use(require("./middleware/errorMiddleware"));


// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});