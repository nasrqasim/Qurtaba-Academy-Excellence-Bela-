import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  subjects: [{
    name: String,
    obtained: Number,
    total: Number,
    grade: String
  }],
  marks: { type: Number, default: 0 }, // Legacy or total obtained
  practicalMarks: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 100 }, // Total of all subjects
  grade: { type: String, default: 'F' }, // Overall Grade
  remarks: String,
}, { timestamps: true });
if (mongoose.models.Result) {
  delete mongoose.models.Result;
}

export default mongoose.model('Result', ResultSchema);
