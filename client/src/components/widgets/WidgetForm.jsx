import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Toggle from '../common/Toggle';

export default function WidgetForm({ widget, onSave, onCancel }) {
  // Basic Info State
  const [name, setName] = useState('');
  const [type, setType] = useState('sales');
  const [mode, setMode] = useState('manual');
  const [manualMessage, setManualMessage] = useState('');
  const [position, setPosition] = useState('bottom-right');
  const [rotationInterval, setRotationInterval] = useState(5);
  const [status, setStatus] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState('');

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    fontSize: '14px',
    buttonColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: '8px',
    shadowIntensity: 'soft',
    animation: 'slide'
  });

  // Fake/Random Settings
  const [fakeSettings, setFakeSettings] = useState({
    names: ['Rahul', 'Anita', 'Priya', 'Amit', 'Neha', 'Vikram', 'Rohan', 'Simran'],
    cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Hyderabad'],
    products: ['Shoes', 'Watch', 'Laptop', 'Phone', 'Headphones', 'Bag', 'T-Shirt', 'Jeans'],
    messages: ['Limited stock!', 'Free shipping', 'Sale ends tonight', 'New collection'],
    minVisitors: 12,
    maxVisitors: 38,
    displaySpeed: 3
  });

  // Real Settings
  const [realSettings, setRealSettings] = useState({
    apiEndpoint: '',
    webhookUrl: '',
    shopifyDomain: '',
    shopifyToken: '',
    woocommerceUrl: '',
    woocommerceKey: '',
    woocommerceSecret: ''
  });

  // Load widget data when editing
  useEffect(() => {
    if (widget) {
      setName(widget.name || '');
      setType(widget.type || 'sales');
      setMode(widget.mode || 'manual');
      setManualMessage(widget.message || '');
      setPosition(widget.position || 'bottom-right');
      setRotationInterval(widget.rotationInterval || 5);
      setStatus(widget.status !== undefined ? widget.status : true);
      
      if (widget.themeSettings) setThemeSettings(widget.themeSettings);
      if (widget.fakeSettings) setFakeSettings(widget.fakeSettings);
      if (widget.realSettings) setRealSettings(widget.realSettings);
    }
  }, [widget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || name.trim() === '') {
      setError('Widget name is required');
      return;
    }
    
    setError('');
    
    // Prepare message based on mode
    let finalMessage = manualMessage;
    if (mode === 'random') {
      finalMessage = '{name} from {city} purchased {product}';
    }
    
    const submitData = {
      name: name.trim(),
      type: type,
      mode: mode,
      message: finalMessage,
      position: position,
      rotationInterval: Number(rotationInterval),
      status: status,
      globalEnabled: true,
      themeSettings: themeSettings,
      fakeSettings: fakeSettings,
      realSettings: realSettings
    };
    
    console.log('Submitting widget:', submitData);
    onSave(submitData);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          <button type="button" onClick={() => setActiveTab('basic')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
            <i className="fa-solid fa-info-circle mr-2"></i>Basic Info
          </button>
          <button type="button" onClick={() => setActiveTab('mode')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'mode' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
            <i className="fa-solid fa-sliders-h mr-2"></i>Mode
          </button>
          <button type="button" onClick={() => setActiveTab('fake')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'fake' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
            <i className="fa-solid fa-dice-d6 mr-2"></i>Random Settings
          </button>
          <button type="button" onClick={() => setActiveTab('real')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'real' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
            <i className="fa-solid fa-cloud-upload-alt mr-2"></i>Real Settings
          </button>
          <button type="button" onClick={() => setActiveTab('appearance')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'appearance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
            <i className="fa-solid fa-palette mr-2"></i>Appearance
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Widget Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Sales Widget" />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Widget Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="sales">Sales Notification</option>
                <option value="visitor">Visitor Counter</option>
                <option value="signup">Signup Alert</option>
                <option value="custom">Custom Message</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Interval (seconds)</label>
              <input type="number" value={rotationInterval} onChange={(e) => setRotationInterval(parseInt(e.target.value))}
                min="3" max="15" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">Widget Status</label>
                <p className="text-xs text-gray-500">Enable/disable this widget</p>
              </div>
              <Toggle checked={status} onChange={() => setStatus(!status)} />
            </div>
          </div>
        )}

        {/* Mode Selection Tab */}
        {activeTab === 'mode' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Manual Mode */}
              <button type="button" onClick={() => setMode('manual')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${mode === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <i className="fa-solid fa-pen text-2xl mb-2"></i>
                <p className={`font-medium ${mode === 'manual' ? 'text-blue-600' : 'text-gray-700'}`}>Manual Mode</p>
                <p className="text-xs text-gray-500 mt-1">Enter custom message</p>
              </button>

              {/* Random Mode */}
              <button type="button" onClick={() => setMode('random')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${mode === 'random' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <i className="fa-solid fa-dice-d6 text-2xl mb-2"></i>
                <p className={`font-medium ${mode === 'random' ? 'text-blue-600' : 'text-gray-700'}`}>Random Mode</p>
                <p className="text-xs text-gray-500 mt-1">Dynamic rotating alerts</p>
              </button>

              {/* Real Mode */}
              <button type="button" onClick={() => setMode('real')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${mode === 'real' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <i className="fa-solid fa-cloud-upload-alt text-2xl mb-2"></i>
                <p className={`font-medium ${mode === 'real' ? 'text-blue-600' : 'text-gray-700'}`}>Real Mode</p>
                <p className="text-xs text-gray-500 mt-1">Live API data</p>
              </button>
            </div>

            {/* Manual Message Input */}
            {mode === 'manual' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Manual Message</label>
                <textarea value={manualMessage} onChange={(e) => setManualMessage(e.target.value)}
                  rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your message here... e.g., Someone just purchased Shoes!" />
                <p className="text-xs text-gray-500 mt-1">This exact message will be shown</p>
              </div>
            )}

            {/* Random Mode Info */}
            {mode === 'random' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Random mode will automatically generate dynamic notifications using your Random Settings.
                  Messages will rotate forever with no limit.
                </p>
              </div>
            )}

            {/* Real Mode Info */}
            {mode === 'real' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Real mode fetches live data from your API/webhook. Configure endpoints in Real Settings tab.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Random Settings Tab */}
        {activeTab === 'fake' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Names Pool (comma separated)</label>
              <input type="text" value={fakeSettings.names.join(', ')}
                onChange={(e) => setFakeSettings({...fakeSettings, names: e.target.value.split(',').map(s=>s.trim()).filter(s=>s)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cities Pool</label>
              <input type="text" value={fakeSettings.cities.join(', ')}
                onChange={(e) => setFakeSettings({...fakeSettings, cities: e.target.value.split(',').map(s=>s.trim()).filter(s=>s)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            {type === 'sales' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Products Pool</label>
                <input type="text" value={fakeSettings.products.join(', ')}
                  onChange={(e) => setFakeSettings({...fakeSettings, products: e.target.value.split(',').map(s=>s.trim()).filter(s=>s)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            )}
            {type === 'visitor' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Visitors</label>
                  <input type="number" value={fakeSettings.minVisitors}
                    onChange={(e) => setFakeSettings({...fakeSettings, minVisitors: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Visitors</label>
                  <input type="number" value={fakeSettings.maxVisitors}
                    onChange={(e) => setFakeSettings({...fakeSettings, maxVisitors: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Speed (seconds)</label>
              <input type="number" value={fakeSettings.displaySpeed} min="2" max="10"
                onChange={(e) => setFakeSettings({...fakeSettings, displaySpeed: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        )}

        {/* Real Settings Tab */}
        {activeTab === 'real' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Webhook URLs</p>
              <code className="block text-xs bg-white p-2 rounded">POST http://localhost:5000/api/push/order</code>
              <code className="block text-xs bg-white p-2 rounded mt-2">POST http://localhost:5000/api/push/signup</code>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom API Endpoint</label>
              <input type="text" value={realSettings.apiEndpoint}
                onChange={(e) => setRealSettings({...realSettings, apiEndpoint: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://your-api.com/webhook" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <input type="text" value={realSettings.webhookUrl}
                onChange={(e) => setRealSettings({...realSettings, webhookUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://your-domain.com/webhook" />
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                <select value={themeSettings.fontSize} onChange={(e) => setThemeSettings({...themeSettings, fontSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="12px">Small (12px)</option>
                  <option value="14px">Medium (14px)</option>
                  <option value="16px">Large (16px)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                <select value={themeSettings.animation} onChange={(e) => setThemeSettings({...themeSettings, animation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="slide">Slide In</option>
                  <option value="fade">Fade In</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
                <input type="color" value={themeSettings.buttonColor}
                  onChange={(e) => setThemeSettings({...themeSettings, buttonColor: e.target.value})}
                  className="w-full h-10 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                <input type="color" value={themeSettings.backgroundColor}
                  onChange={(e) => setThemeSettings({...themeSettings, backgroundColor: e.target.value})}
                  className="w-full h-10 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <input type="color" value={themeSettings.textColor}
                  onChange={(e) => setThemeSettings({...themeSettings, textColor: e.target.value})}
                  className="w-full h-10 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius: {themeSettings.borderRadius}</label>
              <input type="range" min="0" max="20" value={parseInt(themeSettings.borderRadius)}
                onChange={(e) => setThemeSettings({...themeSettings, borderRadius: `${e.target.value}px`})}
                className="w-full" />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-6 mt-4 border-t">
          <Button type="submit">{widget ? 'Update Widget' : 'Create Widget'}</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}