import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentClass: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Paid' },
  transactionId: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
