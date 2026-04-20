const Widget = require('../models/Widget');

// Get all widgets
exports.getAllWidgets = async (req, res) => {
  try {
    const widgets = await Widget.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: widgets
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single widget
exports.getWidgetById = async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id);
    if (!widget) {
      return res.status(404).json({ success: false, error: 'Widget not found' });
    }
    res.status(200).json({ success: true, data: widget });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create widget
exports.createWidget = async (req, res) => {
  try {
    console.log('Creating widget:', req.body);
    
    const widgetData = {
      name: req.body.name,
      type: req.body.type || 'sales',
      mode: req.body.mode || 'manual',
      message: req.body.message || '',
      position: req.body.position || 'bottom-right',
      rotationInterval: req.body.rotationInterval || 5,
      status: req.body.status !== undefined ? req.body.status : true,
      globalEnabled: req.body.globalEnabled !== undefined ? req.body.globalEnabled : true,
      themeSettings: req.body.themeSettings || {
        fontSize: '14px',
        buttonColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: '8px',
        shadowIntensity: 'soft',
        animation: 'slide'
      },
      fakeSettings: req.body.fakeSettings || {
        names: ['Rahul', 'Anita', 'Priya', 'Amit', 'Neha', 'Vikram'],
        cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune'],
        products: ['Shoes', 'Watch', 'Laptop', 'Phone', 'Headphones', 'Bag'],
        messages: ['Limited stock!', 'Free shipping', 'Sale ends tonight', 'New collection'],
        minVisitors: 12,
        maxVisitors: 38,
        updateInterval: 5,
        displaySpeed: 3
      },
      realSettings: req.body.realSettings || {
        apiEndpoint: '',
        webhookUrl: '',
        shopifyDomain: '',
        shopifyToken: '',
        woocommerceUrl: '',
        woocommerceKey: '',
        woocommerceSecret: ''
      }
    };
    
    const widget = new Widget(widgetData);
    await widget.save();
    
    res.status(201).json({ success: true, data: widget });
  } catch (error) {
    console.error('Create widget error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update widget
exports.updateWidget = async (req, res) => {
  try {
    console.log('Updating widget:', req.params.id, req.body);
    
    const widget = await Widget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!widget) {
      return res.status(404).json({ success: false, error: 'Widget not found' });
    }
    
    res.status(200).json({ success: true, data: widget });
  } catch (error) {
    console.error('Update widget error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete widget
exports.deleteWidget = async (req, res) => {
  try {
    const widget = await Widget.findByIdAndDelete(req.params.id);
    if (!widget) {
      return res.status(404).json({ success: false, error: 'Widget not found' });
    }
    res.status(200).json({ success: true, message: 'Widget deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Toggle widget status
exports.toggleWidgetStatus = async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id);
    if (!widget) {
      return res.status(404).json({ success: false, error: 'Widget not found' });
    }
    widget.status = !widget.status;
    await widget.save();
    res.status(200).json({ success: true, data: widget });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};