const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Signup = require('../models/Signup');
const LiveMessage = require('../models/LiveMessage');
const Visitor = require('../models/Visitor');
const Analytics = require('../models/Analytics');
const Setting = require('../models/Setting');

// Push Order (Sales Notification)
router.post('/order', async (req, res) => {
  try {
    const { apiKey, name, city, product, amount, widgetId } = req.body;
    
    const settings = await Setting.findOne();
    if (!settings || settings.apiKey !== apiKey) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }
    
    const order = new Order({ name, city, product, amount, widgetId });
    await order.save();
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Push Signup
router.post('/signup', async (req, res) => {
  try {
    const { apiKey, name, city, email, widgetId } = req.body;
    
    const settings = await Setting.findOne();
    if (!settings || settings.apiKey !== apiKey) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }
    
    const signup = new Signup({ name, city, email, widgetId });
    await signup.save();
    
    res.json({ success: true, data: signup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Push Custom Message
router.post('/message', async (req, res) => {
  try {
    const { apiKey, text, widgetId } = req.body;
    
    const settings = await Setting.findOne();
    if (!settings || settings.apiKey !== apiKey) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }
    
    const message = new LiveMessage({ text, widgetId });
    await message.save();
    
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track Visitor
router.post('/visitor', async (req, res) => {
  try {
    const { apiKey, sessionId, page, widgetId } = req.body;
    
    const settings = await Setting.findOne();
    if (!settings || settings.apiKey !== apiKey) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }
    
    let visitor = await Visitor.findOne({ sessionId });
    if (visitor) {
      visitor.lastSeen = new Date();
      await visitor.save();
    } else {
      visitor = new Visitor({ sessionId, page, widgetId, ip: req.ip });
      await visitor.save();
    }
    
    res.json({ success: true, data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track Analytics
router.post('/analytics', async (req, res) => {
  try {
    const { apiKey, widgetId, type, data } = req.body;
    
    const settings = await Setting.findOne();
    if (!settings || settings.apiKey !== apiKey) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }
    
    const analytics = new Analytics({ widgetId, type, data });
    await analytics.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;