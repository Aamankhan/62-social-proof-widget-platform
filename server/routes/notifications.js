const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { validateApiKey } = require('../middleware/auth');

// Get all notifications
router.get('/', validateApiKey, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get notifications by widget (PUBLIC)
router.get('/widget/:widgetId', async (req, res) => {
  try {
    const notifications = await Notification.find({
      widgetId: req.params.widgetId,
      isActive: true
    }).sort({ createdAt: -1 }).limit(20);
    
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single notification
router.get('/:id', validateApiKey, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create notification
router.post('/', validateApiKey, async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update notification
router.put('/:id', validateApiKey, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete notification
router.delete('/:id', validateApiKey, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle notification status
router.patch('/:id/toggle', validateApiKey, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    notification.isActive = !notification.isActive;
    await notification.save();
    
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track impression
router.post('/:id/impression', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $inc: { impressions: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track click
router.post('/:id/click', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;