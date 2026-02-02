require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@society.com' });
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'Super Admin',
      memberId: 'ADMIN001',
      email: 'admin@society.com',
      passwordHash: hashedAdminPassword,
      isAdmin: true
    });

    await admin.save();
    console.log("✅ Admin user created: admin@society.com / admin123");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();