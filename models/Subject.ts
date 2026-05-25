import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Compulsory', 'Elective', 'Vocational'], default: 'Compulsory' },
  class: { type: String, default: 'All Classes' },
  description: String,
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
