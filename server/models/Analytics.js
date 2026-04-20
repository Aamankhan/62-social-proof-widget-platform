const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  widgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Widget' },
  type: { type: String, enum: ['impression', 'click', 'conversion'], required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Analytics', analyticsSchema);