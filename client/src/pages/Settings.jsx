import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import Toggle from '../components/common/Toggle';
import { getSettings, updateSettings, resetApiKey } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    globalWidgetEnabled: true,
    domainWhitelist: ['*'],
    apiKey: ''
  });
  
  const [newDomain, setNewDomain] = useState('');
  
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    delay: 5,
    infiniteLoop: true,
    avoidDuplicates: true,
    randomIntensity: 'medium'
  });

  useEffect(() => {
    loadSettings();
    loadNotificationSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadNotificationSettings = () => {
    // Load from localStorage or backend
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      try {
        setNotificationSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading notification settings:', e);
      }
    }
  };

  const saveNotificationSettings = (newSettings) => {
    setNotificationSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    
    // Update widget if exists
    if (window.SocialProofWidget) {
      window.SocialProofWidget.setDelay(newSettings.delay);
      window.SocialProofWidget.setIntensity(newSettings.randomIntensity);
    }
  };

  const handleToggleGlobal = async () => {
    try {
      const updated = await updateSettings({
        ...settings,
        globalWidgetEnabled: !settings.globalWidgetEnabled
      });
      setSettings(updated);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const addDomain = async () => {
    if (newDomain && !settings.domainWhitelist.includes(newDomain)) {
      const updated = await updateSettings({
        ...settings,
        domainWhitelist: [...settings.domainWhitelist, newDomain]
      });
      setSettings(updated);
      setNewDomain('');
    }
  };

  const removeDomain = async (domain) => {
    if (domain !== '*') {
      const updated = await updateSettings({
        ...settings,
        domainWhitelist: settings.domainWhitelist.filter(d => d !== domain)
      });
      setSettings(updated);
    }
  };

  const handleResetApiKey = async () => {
    if (window.confirm('Reset API key? This will invalidate existing integrations.')) {
      try {
        const result = await resetApiKey();
        alert('API key reset successfully!');
        loadSettings();
      } catch (error) {
        console.error('Error resetting API key:', error);
      }
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Settings</h1>
      
      <div className="space-y-4 md:space-y-6">
        {/* Global Widget Status */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base md:text-lg font-medium text-gray-900">Global Widget Status</h2>
              <p className="text-sm text-gray-600">Enable/disable all widgets globally</p>
            </div>
            <Toggle checked={settings.globalWidgetEnabled} onChange={handleToggleGlobal} />
          </div>
        </div>
        
        {/* Notification Settings - NEW */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-gray-900 mb-4">Notification Display Settings</h2>
          <p className="text-sm text-gray-600 mb-4">Control how notifications appear on your website</p>
          
          <div className="space-y-4">
            {/* Notification Delay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Delay
              </label>
              <select
                value={notificationSettings.delay}
                onChange={(e) => saveNotificationSettings({...notificationSettings, delay: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="3">3 seconds (Fast - High engagement)</option>
                <option value="5">5 seconds (Normal - Recommended)</option>
                <option value="8">8 seconds (Slow - Less intrusive)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Time between each notification</p>
            </div>
            
            {/* Infinite Loop Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Infinite Loop</h3>
                <p className="text-xs text-gray-500">Continue notifications forever until page closes</p>
              </div>
              <Toggle 
                checked={notificationSettings.infiniteLoop} 
                onChange={() => saveNotificationSettings({...notificationSettings, infiniteLoop: !notificationSettings.infiniteLoop})}
              />
            </div>
            
            {/* Avoid Duplicates Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Avoid Duplicates</h3>
                <p className="text-xs text-gray-500">Don't show same notification repeatedly in short time</p>
              </div>
              <Toggle 
                checked={notificationSettings.avoidDuplicates} 
                onChange={() => saveNotificationSettings({...notificationSettings, avoidDuplicates: !notificationSettings.avoidDuplicates})}
              />
            </div>
            
            {/* Random Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Random Intensity
              </label>
              <select
                value={notificationSettings.randomIntensity}
                onChange={(e) => saveNotificationSettings({...notificationSettings, randomIntensity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low (Conservative - Small variety)</option>
                <option value="medium">Medium (Balanced - Good variety)</option>
                <option value="high">High (Wide range - Maximum variety)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Controls how diverse the random notifications are</p>
            </div>
          </div>
          
          {/* Preview of current settings */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <i className="fa-solid fa-info-circle mr-1"></i>
              Current: {notificationSettings.delay} seconds delay • 
              {notificationSettings.infiniteLoop ? ' Infinite ON' : ' Infinite OFF'} • 
              {notificationSettings.avoidDuplicates ? ' No duplicates' : ' Duplicates allowed'} • 
              {notificationSettings.randomIntensity} intensity
            </p>
          </div>
        </div>
        
        {/* Domain Whitelist */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-gray-900 mb-4">Domain Whitelist</h2>
          <p className="text-sm text-gray-600 mb-4">Allow widgets only on specific domains</p>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="e.g., example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={addDomain} className="w-full sm:w-auto">
              <i className="fa-solid fa-plus mr-2"></i>
              Add Domain
            </Button>
          </div>
          
          <div className="space-y-2">
            {settings.domainWhitelist.map(domain => (
              <div key={domain} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-mono break-all">{domain}</span>
                {domain !== '*' && (
                  <button
                    onClick={() => removeDomain(domain)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* API Security */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-gray-900 mb-4">API Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono break-all">
                  {settings.apiKey || 'Loading...'}
                </code>
              </div>
            </div>
            <Button variant="danger" onClick={handleResetApiKey}>
              <i className="fa-solid fa-key mr-2"></i>
              Reset API Key
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              <i className="fa-solid fa-exclamation-triangle mr-1"></i>
              Warning: Resetting your API key will break all existing widget integrations.
            </p>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-lightbulb text-blue-600 mt-0.5"></i>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Notification Settings Tips</h3>
              <p className="text-xs text-blue-800">
                • <strong>Fast delay (3s)</strong> - Best for high-traffic stores, creates urgency<br/>
                • <strong>Normal delay (5s)</strong> - Balanced, recommended for most stores<br/>
                • <strong>Avoid duplicates</strong> - Prevents showing same notification repeatedly<br/>
                • <strong>High intensity</strong> - More variety in names, cities, and products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}