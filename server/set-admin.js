import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
await connectDB();

const user = await User.findOneAndUpdate(
  { email: 'magyardream@gmail.com' },
  { role: 'superadmin', isPremium: true },
  { new: true }
);

if (user) {
  console.log(`✅ Aggiornato: ${user.email} → role: ${user.role}, isPremium: ${user.isPremium}`);
} else {
  console.log('❌ Utente non trovato. Assicurati di aver fatto login con Google almeno una volta.');
}

mongoose.disconnect();
