import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: String,
  motherName: String,
  cnic: String,
  dob: Date,
  gender: String,
  address: String,
  phone: String,
  email: String,
  previousSchool: String,
  appliedProgram: String,
  appliedClass: String,
  image: String,
  documents: [String],
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Admission || mongoose.model('Admission', AdmissionSchema);
