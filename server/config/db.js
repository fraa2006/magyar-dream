import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Check: 1) Atlas cluster is active  2) Your IP is whitelisted in Atlas Network Access');
    throw err;
  }
};

export default connectDB;
