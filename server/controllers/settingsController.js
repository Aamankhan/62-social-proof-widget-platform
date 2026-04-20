const Setting = require('../models/Setting');
const { generateApiKey } = require('../utils/apiKeyGenerator');

// Get settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Setting({
        apiKey: generateApiKey(),
        globalWidgetEnabled: true,
        domainWhitelist: ['*'],
        embedScriptVersion: '1.0.0'
      });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    // Update only allowed fields
    const allowedUpdates = ['globalWidgetEnabled', 'domainWhitelist', 'embedScriptVersion'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Reset API key
exports.resetApiKey = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    const oldApiKey = settings.apiKey;
    settings.apiKey = generateApiKey();
    settings.lastReset = new Date();
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'API key reset successfully',
      data: {
        oldApiKey: oldApiKey,
        newApiKey: settings.apiKey,
        resetAt: settings.lastReset
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Validate API key
exports.validateApiKey = async (req, res) => {
  try {
    const { apiKey } = req.query;
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required'
      });
    }
    
    const settings = await Setting.findOne({ apiKey: apiKey });
    
    res.status(200).json({
      success: true,
      valid: !!settings,
      data: settings ? {
        globalEnabled: settings.globalWidgetEnabled,
        version: settings.embedScriptVersion
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add domain to whitelist
exports.addDomainToWhitelist = async (req, res) => {
  try {
    const { domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain is required'
      });
    }
    
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    if (!settings.domainWhitelist.includes(domain)) {
      settings.domainWhitelist.push(domain);
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      data: settings.domainWhitelist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Remove domain from whitelist
exports.removeDomainFromWhitelist = async (req, res) => {
  try {
    const { domain } = req.params;
    
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    // Don't allow removing wildcard
    if (domain === '*') {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove wildcard domain'
      });
    }
    
    settings.domainWhitelist = settings.domainWhitelist.filter(d => d !== domain);
    await settings.save();
    
    res.status(200).json({
      success: true,
      data: settings.domainWhitelist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get embed configuration (public endpoint)
exports.getEmbedConfig = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Settings not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        apiKey: settings.apiKey,
        globalEnabled: settings.globalWidgetEnabled,
        version: settings.embedScriptVersion
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get widget data for embedding (public endpoint)
exports.getWidgetData = async (req, res) => {
  try {
    const { apiKey, domain } = req.query;
    
    // Validate API key
    const settings = await Setting.findOne();
    
    if (!settings || settings.apiKey !== apiKey) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }
    
    // Check domain whitelist
    if (settings.domainWhitelist[0] !== '*') {
      if (!domain || !settings.domainWhitelist.includes(domain)) {
        return res.status(403).json({
          success: false,
          error: 'Domain not whitelisted'
        });
      }
    }
    
    // Get active widgets
    const Widget = require('../models/Widget');
    const widgets = await Widget.find({ 
      status: true, 
      globalEnabled: true 
    }).select('-__v');
    
    res.status(200).json({
      success: true,
      data: {
        widgets: widgets,
        settings: {
          globalEnabled: settings.globalWidgetEnabled
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Reset all settings to default
exports.resetSettings = async (req, res) => {
  try {
    const defaultSettings = {
      globalWidgetEnabled: true,
      domainWhitelist: ['*'],
      apiKey: generateApiKey(),
      embedScriptVersion: '1.0.0',
      lastReset: new Date()
    };
    
    let settings = await Setting.findOne();
    
    if (settings) {
      Object.assign(settings, defaultSettings);
      await settings.save();
    } else {
      settings = new Setting(defaultSettings);
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Settings reset to default',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get system health
exports.getSystemHealth = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    const Widget = require('../models/Widget');
    const Notification = require('../models/Notification');
    
    const widgetCount = await Widget.countDocuments();
    const activeWidgetCount = await Widget.countDocuments({ status: true });
    const notificationCount = await Notification.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date(),
        settings: {
          exists: !!settings,
          globalEnabled: settings?.globalWidgetEnabled || false,
          version: settings?.embedScriptVersion || 'unknown'
        },
        stats: {
          totalWidgets: widgetCount,
          activeWidgets: activeWidgetCount,
          totalNotifications: notificationCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};