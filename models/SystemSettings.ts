import mongoose from 'mongoose';

const SystemSettingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: 'Qurtaba School of Excellence Bela' },
  schoolLogo: { type: String, default: 'logo.jpg' },
  schoolEmail: { type: String, default: 'info@qurtaba.edu.pk' },
  phone: { type: String, default: '+92 91 1234567' },
  address: { type: String, default: 'Phase 3, Hayatabad, Peshawar, Khyber Pakhtunkhwa, Pakistan' },
  footerText: { type: String, default: '© 2026 Qurtaba School of Excellence Bela. All Rights Reserved.' },
  themeColor: { type: String, default: '#3525cd' }
}, { timestamps: true });

export default mongoose.models.SystemSettings || mongoose.model('SystemSettings', SystemSettingsSchema);
