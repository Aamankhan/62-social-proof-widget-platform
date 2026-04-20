const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
  widgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Widget' },
  name: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Signup', signupSchema);