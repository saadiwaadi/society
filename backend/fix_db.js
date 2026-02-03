const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to Database");
    
    try {
      // This command deletes the specific "ghost" index causing the error
      await mongoose.connection.collection("users").dropIndex("memberId_1");
      console.log("🎉 SUCCESS: The old 'memberId' rule has been removed!");
    } catch (err) {
      // If the index is already gone, it will tell us
      console.log("ℹ️ Report:", err.message);
    }

    console.log("You can now restart your server and register users.");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Connection Error:", err);
  });