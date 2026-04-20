const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  globalWidgetEnabled: {
    type: Boolean,
    default: true
  },
  domainWhitelist: [{
    type: String,
    default: ['*']
  }],
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  embedScriptVersion: {
    type: String,
    default: '1.0.0'
  },
  lastReset: {
    type: Date,
    default: Date.now
  },

    defaultMode: { type: String, enum: ['fake', 'real'], default: 'fake' },
  realFirstFallback: { type: Boolean, default: false },
  duplicatePrevention: { type: Boolean, default: true },
  alertSpeed: { type: Number, default: 3 }
});

module.exports = mongoose.model('Setting', settingSchema);