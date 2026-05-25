import mongoose from 'mongoose';

const FacilitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
}, { timestamps: true });

export default mongoose.models.Facility || mongoose.model('Facility', FacilitySchema);
