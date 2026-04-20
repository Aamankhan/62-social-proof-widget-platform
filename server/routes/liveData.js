const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Signup = require('../models/Signup');
const LiveMessage = require('../models/LiveMessage');
const Visitor = require('../models/Visitor');
const Analytics = require('../models/Analytics');
const { validateApiKey } = require('../middleware/auth');

// Get Orders
router.get('/orders', validateApiKey, async (req, res) => {
  try {
    const { limit = 50, widgetId } = req.query;
    const query = widgetId ? { widgetId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Signups
router.get('/signups', validateApiKey, async (req, res) => {
  try {
    const { limit = 50, widgetId } = req.query;
    const query = widgetId ? { widgetId } : {};
    const signups = await Signup.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json({ success: true, data: signups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Messages
router.get('/messages', validateApiKey, async (req, res) => {
  try {
    const { limit = 50, widgetId } = req.query;
    const query = widgetId ? { widgetId, isActive: true } : { isActive: true };
    const messages = await LiveMessage.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Visitors Count
router.get('/visitors/count', async (req, res) => {
  try {
    const { widgetId } = req.query;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const query = { lastSeen: { $gt: fiveMinutesAgo } };
    if (widgetId) query.widgetId = widgetId;
    
    const count = await Visitor.countDocuments(query);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Analytics
router.get('/analytics', validateApiKey, async (req, res) => {
  try {
    const { widgetId, days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const query = { createdAt: { $gt: startDate } };
    if (widgetId) query.widgetId = widgetId;
    
    const impressions = await Analytics.countDocuments({ ...query, type: 'impression' });
    const clicks = await Analytics.countDocuments({ ...query, type: 'click' });
    const conversions = await Analytics.countDocuments({ ...query, type: 'conversion' });
    
    const dailyStats = await Analytics.aggregate([
      { $match: query },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        impressions: { $sum: { $cond: [{ $eq: ["$type", "impression"] }, 1, 0] } },
        clicks: { $sum: { $cond: [{ $eq: ["$type", "click"] }, 1, 0] } }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        total: { impressions, clicks, conversions },
        ctr: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0,
        daily: dailyStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;