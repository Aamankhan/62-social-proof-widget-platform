const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  widgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Widget' },
  page: { type: String, default: '/' },
  ip: { type: String },
  userAgent: { type: String },
  lastSeen: { type: Date, default: Date.now },
  firstSeen: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);