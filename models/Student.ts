import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const StudentSchema = new mongoose.Schema({
  admissionNumber: { type: String, unique: true },
  fullName: { type: String, required: true },
  fatherName: String,
  fatherPhone: String,
  fatherOccupation: String,
  motherName: String,
  cnic: String,
  dob: Date,
  gender: String,
  address: String,
  phone: String,
  email: String,
  program: String,
  class: String,
  section: String,
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' },
  image: String,
  documents: [String],
  admissionDate: { type: Date, default: Date.now },
  previousSchool: String,
  previousClass: String,
  previousMarks: String,
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  loginEnabled: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationId: { type: String, unique: true, sparse: true },
  verificationDate: { type: Date }
}, { timestamps: true });

// Hash password before saving
StudentSchema.pre('save', async function(this: any) {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema, 'students');
