import mongoose from 'mongoose';
import User from '../modules/user/user.model';
import env from '../config/env';
import bcrypt from 'bcrypt';

// Admin user data from environment variables with fallback values
const adminUser = {
  uid: env.ADMIN_UID || 'admin_001',
  email: env.ADMIN_EMAIL || 'admin@studyvault.com',
  displayName: env.ADMIN_DISPLAY_NAME || 'Admin User',
  photoURL: env.ADMIN_PHOTO_URL || '',
  role: 'ADMIN' as const,
  emailVerified: true,
  authProvider: 'local' as const,
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

    // Hash password from environment variable or use secure default
    const plainPassword = env.ADMIN_PASSWORD as string;
    if (env.NODE_ENV === 'production' && !env.ADMIN_PASSWORD) {
      console.error('❌ ADMIN_PASSWORD must be set in production environment');
      await mongoose.disconnect();
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create admin user
    const userData = {
      ...adminUser,
      password: hashedPassword,
    };

    const user = await User.create(userData);
    console.log('✅ Admin user created:', user.email);
    console.log('🔑 UID:', user.uid);
    console.log('🛡️  Role:', user.role);
    
    if (env.NODE_ENV === 'development' && !env.ADMIN_PASSWORD) {
      console.log('🔐 Default password used (CHANGE IN PRODUCTION):', plainPassword);
    }

    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

run();