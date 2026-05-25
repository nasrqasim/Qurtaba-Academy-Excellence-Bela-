import mongoose from 'mongoose';

if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'General' },
  targetGroup: { type: String, default: 'All' },
  date: { type: String },
  priority: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
