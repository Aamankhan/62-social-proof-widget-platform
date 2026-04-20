const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  widgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  productName: {
    type: String,
    default: ''
  },
  customerName: {
    type: String,
    default: ''
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);