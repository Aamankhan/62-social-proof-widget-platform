const Notification = require('../models/Notification');
const Widget = require('../models/Widget');

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('widgetId', 'name type')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get notifications by widget (PUBLIC)
exports.getNotificationsByWidget = async (req, res) => {
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single notification
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('widgetId', 'name type');
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update notification
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Toggle notification status
exports.toggleNotificationStatus = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    notification.isActive = !notification.isActive;
    await notification.save();
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Track impression
exports.trackImpression = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $inc: { impressions: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Track click
exports.trackClick = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const activeNotifications = await Notification.countDocuments({ isActive: true });
    
    const totalImpressions = await Notification.aggregate([
      { $group: { _id: null, total: { $sum: '$impressions' } } }
    ]);
    
    const totalClicks = await Notification.aggregate([
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total: totalNotifications,
        active: activeNotifications,
        totalImpressions: totalImpressions[0]?.total || 0,
        totalClicks: totalClicks[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};