const Setting = require('../models/Setting');

const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Skip validation for OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  if (!apiKey) {
    return res.status(401).json({ 
      success: false, 
      error: 'API key is required' 
    });
  }
  
  try {
    const settings = await Setting.findOne();
    
    if (!settings) {
      return res.status(401).json({ 
        success: false, 
        error: 'System not configured' 
      });
    }
    
    if (settings.apiKey !== apiKey) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid API key' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Authentication error' 
    });
  }
};

module.exports = { validateApiKey };