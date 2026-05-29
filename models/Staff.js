import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const StaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  cnic: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  status: { type: String, default: 'Active' },
  empId: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  loginEnabled: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving; enable portal login when credentials are set
StaffSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    if (!this.isModified('loginEnabled') && this.loginEnabled === false) {
      this.loginEnabled = true;
    }
    const alreadyHashed = /^\$2[aby]\$/.test(this.password);
    if (!alreadyHashed) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
});

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema, 'staff');
