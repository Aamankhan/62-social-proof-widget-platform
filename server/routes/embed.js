const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const Widget = require('../models/Widget');

// Get embed configuration
router.get('/config', async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json({
      success: true,
      data: {
        apiKey: settings?.apiKey,
        globalEnabled: settings?.globalWidgetEnabled || true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get widget data for embedding (public endpoint)
router.get('/widget-data', async (req, res) => {
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
    if (settings.domainWhitelist && settings.domainWhitelist[0] !== '*') {
      if (!domain || !settings.domainWhitelist.includes(domain)) {
        return res.status(403).json({
          success: false,
          error: 'Domain not whitelisted'
        });
      }
    }
    
    // Get active widgets
    const widgets = await Widget.find({ 
      status: true, 
      globalEnabled: true 
    }).lean();
    
    res.json({
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
});

module.exports = router;