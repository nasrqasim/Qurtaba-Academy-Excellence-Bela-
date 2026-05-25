import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  month: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  paymentDate: { type: Date },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.Payroll || mongoose.model('Payroll', PayrollSchema);
