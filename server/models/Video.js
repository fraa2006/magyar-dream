import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  videoUrl:    { type: String, required: true },
  position:    { type: String, enum: ['GK', 'DF', 'MF', 'FW', ''], default: '' },
  views:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);
