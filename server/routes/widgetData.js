const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Signup = require('../models/Signup');
const LiveMessage = require('../models/LiveMessage');
const Visitor = require('../models/Visitor');
const Widget = require('../models/Widget');

// Get fake data for widget
router.get('/fake/:widgetId', async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.widgetId);
    if (!widget) {
      return res.status(404).json({ success: false, error: 'Widget not found' });
    }
    
    console.log('Generating fake data for widget:', widget.name, 'Type:', widget.type);
    
    const fakeSettings = widget.fakeSettings || {};
    
    // Default values if not set
    const names = fakeSettings.names && fakeSettings.names.length ? fakeSettings.names : ['Rahul', 'Anita', 'Priya', 'Amit', 'Neha', 'Vikram', 'Pooja', 'Raj', 'Simran', 'Arjun'];
    const cities = fakeSettings.cities && fakeSettings.cities.length ? fakeSettings.cities : ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Hyderabad', 'Ahmedabad', 'Lucknow'];
    const products = fakeSettings.products && fakeSettings.products.length ? fakeSettings.products : ['Shoes', 'Watch', 'Laptop', 'Phone', 'Headphones', 'Bag', 'T-shirt', 'Jeans', 'Sunglasses', 'Perfume'];
    const messages = fakeSettings.messages && fakeSettings.messages.length ? fakeSettings.messages : ['Limited stock!', 'Free shipping', 'Sale ends tonight', 'New collection arrived', 'Best seller!', 'Limited offer!'];
    
    let data = [];
    
    switch (widget.type) {
      case 'sales':
        // Generate 5 random sales notifications
        for (let i = 0; i < 5; i++) {
          data.push({
            name: names[Math.floor(Math.random() * names.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
            product: products[Math.floor(Math.random() * products.length)],
            time: Math.floor(Math.random() * 30) + 1 // 1-30 minutes ago
          });
        }
        break;
        
      case 'visitor':
        const min = fakeSettings.minVisitors || 12;
        const max = fakeSettings.maxVisitors || 38;
        // Generate random visitor count
        data = [{ 
          count: Math.floor(Math.random() * (max - min + 1)) + min,
          timestamp: new Date()
        }];
        break;
        
      case 'signup':
        // Generate 5 random signups
        for (let i = 0; i < 5; i++) {
          data.push({
            name: names[Math.floor(Math.random() * names.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
            time: Math.floor(Math.random() * 60) + 1
          });
        }
        break;
        
      case 'custom':
        // Generate random custom messages
        for (let i = 0; i < 5; i++) {
          data.push({
            text: messages[Math.floor(Math.random() * messages.length)]
          });
        }
        break;
    }
    
    console.log('Generated fake data:', data);
    res.json({ success: true, data, mode: 'fake' });
  } catch (error) {
    console.error('Fake data error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get real data for widget
router.get('/real/:widgetId', async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.widgetId);
    if (!widget) {
      return res.status(404).json({ success: false, error: 'Widget not found' });
    }
    
    let data = [];
    
    switch (widget.type) {
      case 'sales':
        const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
        data = orders.map(order => ({
          name: order.name,
          city: order.city,
          product: order.product,
          time: Math.floor((Date.now() - new Date(order.createdAt)) / 60000)
        }));
        break;
        
      case 'visitor':
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const count = await Visitor.countDocuments({ lastSeen: { $gt: fiveMinutesAgo } });
        data = [{ count: count || 15 }];
        break;
        
      case 'signup':
        const signups = await Signup.find().sort({ createdAt: -1 }).limit(10);
        data = signups.map(signup => ({
          name: signup.name,
          city: signup.city,
          time: Math.floor((Date.now() - new Date(signup.createdAt)) / 60000)
        }));
        break;
        
      case 'custom':
        const messages = await LiveMessage.find({ isActive: true }).sort({ createdAt: -1 }).limit(10);
        data = messages.map(msg => ({ text: msg.text }));
        break;
    }
    
    // If no real data, provide fallback fake data
    if (!data || data.length === 0) {
      const fakeSettings = widget.fakeSettings || {};
      const names = fakeSettings.names || ['Rahul', 'Anita', 'Priya'];
      const cities = fakeSettings.cities || ['Delhi', 'Mumbai'];
      const products = fakeSettings.products || ['Shoes', 'Watch'];
      
      if (widget.type === 'sales') {
        data = [{
          name: names[0],
          city: cities[0],
          product: products[0],
          time: 2
        }];
      } else if (widget.type === 'visitor') {
        data = [{ count: 25 }];
      } else if (widget.type === 'signup') {
        data = [{ name: names[0], city: cities[0], time: 5 }];
      } else {
        data = [{ text: 'Welcome to our store!' }];
      }
    }
    
    res.json({ success: true, data, mode: 'real' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;