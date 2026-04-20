const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  widgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Widget' },
  name: { type: String, required: true },
  city: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);