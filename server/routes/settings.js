const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { validateApiKey } = require('../middleware/auth');

router.get('/', validateApiKey, settingsController.getSettings);
router.get('/embed-config', settingsController.getEmbedConfig);
router.get('/health', settingsController.getSystemHealth);
router.put('/', validateApiKey, settingsController.updateSettings);
router.post('/reset-api-key', validateApiKey, settingsController.resetApiKey);
router.post('/reset-all', validateApiKey, settingsController.resetSettings);
router.post('/whitelist', validateApiKey, settingsController.addDomainToWhitelist);
router.delete('/whitelist/:domain', validateApiKey, settingsController.removeDomainFromWhitelist);
router.get('/validate', settingsController.validateApiKey);
router.get('/widget-data', settingsController.getWidgetData);








module.exports = router;