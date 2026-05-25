import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema({
  class: { type: String, required: true }, // e.g. "Class 10-A"
  day: { type: String, required: true },   // e.g. "Monday"
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  startTime: { type: String, required: true }, // e.g. "08:00"
  endTime: { type: String, required: true },   // e.g. "08:45"
  room: String,
}, { timestamps: true });

export default mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);
