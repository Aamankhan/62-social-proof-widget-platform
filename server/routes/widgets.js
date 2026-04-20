const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');
const { validateApiKey } = require('../middleware/auth');

router.get('/', validateApiKey, widgetController.getAllWidgets);
router.get('/:id', validateApiKey, widgetController.getWidgetById);
router.post('/', validateApiKey, widgetController.createWidget);
router.put('/:id', validateApiKey, widgetController.updateWidget);
router.delete('/:id', validateApiKey, widgetController.deleteWidget);
router.patch('/:id/toggle', validateApiKey, widgetController.toggleWidgetStatus);

module.exports = router;