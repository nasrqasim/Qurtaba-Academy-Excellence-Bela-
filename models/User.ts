import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  username: { type: String, unique: true, sparse: true },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Admin', 'Teacher', 'Student', 'Staff'], 
    default: 'Student' 
  },
  profileImage: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(this: any) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.models.User || mongoose.model('User', UserSchema, 'users');
