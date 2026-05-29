import mongoose from 'mongoose';

const SystemSettingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: 'Qurtaba School of Excellence Bela' },
  schoolLogo: { type: String, default: 'logo.jpg' },
  schoolEmail: { type: String, default: 'info@qurtaba.edu.pk' },
  phone: { type: String, default: '+923312493233' },
  address: { type: String, default: 'Qurtaba Academy of excellence bela Near AC Office bela,Lasbela' },
  footerText: { type: String, default: '© 2026 Qurtaba School of Excellence Bela. All Rights Reserved.' },
  themeColor: { type: String, default: '#3525cd' }
}, { timestamps: true });

export default mongoose.models.SystemSettings || mongoose.model('SystemSettings', SystemSettingsSchema);
