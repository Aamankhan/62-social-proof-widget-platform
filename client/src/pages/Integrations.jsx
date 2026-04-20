import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { getSettings, updateSettings } from '../services/api';

export default function Integrations() {
  const [settings, setSettings] = useState({});
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showWebhook, setShowWebhook] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const copyWebhookUrl = () => {
    const url = `${window.location.origin}/api/push/order`;
    navigator.clipboard.writeText(url);
    alert('Webhook URL copied!');
  };

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Integrations</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Webhook Integration */}
        <Card title="Webhook Integration" icon="fa-solid fa-code-branch">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Receive real-time notifications via webhook. Send POST requests to:
            </p>
            <div className="bg-gray-100 p-3 rounded-lg">
              <code className="text-xs break-all">
                {window.location.origin}/api/push/order
              </code>
            </div>
            <Button onClick={copyWebhookUrl} className="w-full">
              <i className="fa-solid fa-copy mr-2"></i>
              Copy Webhook URL
            </Button>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Example Payload</h3>
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
{`{
  "apiKey": "${settings.apiKey || 'your-api-key'}",
  "name": "John Doe",
  "city": "Delhi",
  "product": "Premium Shoes",
  "amount": 99.99
}`}
              </pre>
            </div>
          </div>
        </Card>
        
        {/* Shopify Integration */}
        <Card title="Shopify Integration" icon="fa-brands fa-shopify">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your Shopify store to automatically send order notifications.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <i className="fa-solid fa-info-circle mr-2"></i>
                Install our app from Shopify App Store to enable automatic sync.
              </p>
            </div>
            <Button variant="secondary" className="w-full" disabled>
              <i className="fa-brands fa-shopify mr-2"></i>
              Coming Soon
            </Button>
          </div>
        </Card>
        
        {/* WooCommerce Integration */}
        <Card title="WooCommerce Integration" icon="fa-brands fa-wordpress">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect WooCommerce store via REST API.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Store URL (https://yourstore.com)"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Consumer Key"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Consumer Secret"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <Button className="w-full">
                <i className="fa-solid fa-plug mr-2"></i>
                Connect Store
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Custom API */}
        <Card title="Custom API" icon="fa-solid fa-microchip">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Use our REST API to push custom data from any platform.
            </p>
            <div className="bg-gray-100 p-3 rounded-lg">
              <code className="text-xs break-all">
                POST {window.location.origin}/api/push/message
              </code>
            </div>
            <Button variant="secondary" onClick={() => setShowWebhook(!showWebhook)} className="w-full">
              <i className="fa-solid fa-code mr-2"></i>
              View Documentation
            </Button>
            
            {showWebhook && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Custom Message Endpoint</h4>
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
{`{
  "apiKey": "${settings.apiKey || 'your-api-key'}",
  "text": "Your custom message here",
  "widgetId": "widget-id-optional"
}`}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}