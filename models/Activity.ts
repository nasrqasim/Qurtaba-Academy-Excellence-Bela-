import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  category: {
    type: String,
    required: true,
    enum: ['School Houses', 'Sports', 'Events', 'Extra Curricular Activities'],
  },
}, { timestamps: true });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
