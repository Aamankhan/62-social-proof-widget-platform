const mongoose = require('mongoose');

const liveMessageSchema = new mongoose.Schema({
  widgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Widget' },
  text: { type: String, required: true },
  type: { type: String, enum: ['custom', 'alert', 'announcement'], default: 'custom' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LiveMessage', liveMessageSchema);