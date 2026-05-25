import mongoose from 'mongoose';

const ExamSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Exam Title
  session: { type: String, default: '2024 - 2025' },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, default: '09:00 AM' },
  duration: { type: Number, default: 180 },
  totalMarks: { type: Number, default: 100 },
  passingMarks: { type: Number, default: 33 },
  description: String,
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
