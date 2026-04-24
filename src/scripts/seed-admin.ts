import mongoose from 'mongoose';
import User from '../modules/user/user.model';
import env from '../config/env';

// Sample admin user data
const adminUser = {
  uid: 'admin_001',
  email: 'admin@studyvault.com',
  displayName: 'Admin User',
  photoURL: '',
  role: 'ADMIN',
  emailVerified: true,
};

const run = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const existing = await User.findOne({ uid: adminUser.uid });
    if (existing) {
      console.log('⚠️  Admin user already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const user = await User.create(adminUser);
    console.log('✅ Admin user created:', user.email);
    console.log('🔑 UID:', user.uid);
    console.log('🛡️  Role:', user.role);

    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

run();
