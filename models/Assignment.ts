import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  description: String,
  fileUrl: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true }
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
