import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: String,
  teacher: String,
  capacity: Number,
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model('Class', ClassSchema);
