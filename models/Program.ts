import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: String,
  fee: Number,
  showOnPublic: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Program || mongoose.model('Program', ProgramSchema);
