const mongoose = require('mongoose');

const fakeSettingsSchema = new mongoose.Schema({
  names: { type: [String], default: ['Rahul', 'Anita', 'Priya', 'Amit', 'Neha', 'Vikram', 'Rohan', 'Simran'] },
  cities: { type: [String], default: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Hyderabad'] },
  products: { type: [String], default: ['Shoes', 'Watch', 'Laptop', 'Phone', 'Headphones', 'Bag', 'T-Shirt', 'Jeans'] },
  messages: { type: [String], default: ['Limited stock!', 'Free shipping', 'Sale ends tonight', 'New collection'] },
  minVisitors: { type: Number, default: 12 },
  maxVisitors: { type: Number, default: 38 },
  updateInterval: { type: Number, default: 5 },
  displaySpeed: { type: Number, default: 3 }
});

const realSettingsSchema = new mongoose.Schema({
  apiEndpoint: { type: String, default: '' },
  webhookUrl: { type: String, default: '' },
  shopifyDomain: { type: String, default: '' },
  shopifyToken: { type: String, default: '' },
  woocommerceUrl: { type: String, default: '' },
  woocommerceKey: { type: String, default: '' },
  woocommerceSecret: { type: String, default: '' }
});

const themeSettingsSchema = new mongoose.Schema({
  fontSize: { type: String, default: '14px' },
  buttonColor: { type: String, default: '#3b82f6' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#1f2937' },
  borderRadius: { type: String, default: '8px' },
  shadowIntensity: { type: String, enum: ['none', 'soft', 'medium', 'strong'], default: 'soft' },
  animation: { type: String, enum: ['slide', 'fade', 'bounce'], default: 'slide' }
});

const widgetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['sales', 'visitor', 'signup', 'custom'], required: true, default: 'sales' },
  mode: { type: String, enum: ['manual', 'random', 'real'], default: 'manual' },
  message: { type: String, default: '' },
  status: { type: Boolean, default: true },
  globalEnabled: { type: Boolean, default: true },
  position: { type: String, enum: ['bottom-left', 'bottom-right', 'top-right'], default: 'bottom-right' },
  rotationInterval: { type: Number, default: 5 },
  themeSettings: { type: themeSettingsSchema, default: () => ({}) },
  fakeSettings: { type: fakeSettingsSchema, default: () => ({}) },
  realSettings: { type: realSettingsSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Widget', widgetSchema);