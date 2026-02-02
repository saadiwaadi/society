const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// Connect to DB directly
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const seedAdmin = async () => {
  try {
    // 1. Delete any existing users to avoid duplicates
    await User.deleteMany({});
    console.log('🧹 Old users removed.');

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('securepassword', salt);

    // 3. Create the Admin
// 3. Create the Admin
    const admin = new User({
      memberId: 'ADMIN001', // <--- ADD THIS LINE
      email: 'admin@society.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('🎉 Admin Account Created: admin@society.com / securepassword');
    
    // 4. Disconnect
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedAdmin();