import React, { useState } from 'react';
import Button from '../components/common/Button';

export default function Setup() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  const testConnection = async () => {
    setStatus('Testing connection...');
    try {
      const response = await fetch('http://localhost:5000/api/widgets', {
        headers: { 'x-api-key': apiKey }
      });
      
      if (response.ok) {
        setStatus('✅ Connection successful! Save this API key to your .env file');
        // Save to localStorage for temporary use
        localStorage.setItem('apiKey', apiKey);
      } else {
        setStatus('❌ Connection failed. Check your API key');
      }
    } catch (error) {
      setStatus('❌ Cannot connect to server. Make sure backend is running on port 5000');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <i className="fa-solid fa-chart-simple text-4xl text-blue-600 mb-3"></i>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to SocialProof</h1>
          <p className="text-gray-600 mt-2">Configure your API key to get started</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from MongoDB or run node scripts/init.js
            </p>
          </div>
          
          <Button onClick={testConnection} className="w-full">
            Test Connection
          </Button>
          
          {status && (
            <div className={`p-3 rounded-lg text-sm ${
              status.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {status}
            </div>
          )}
          
          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-gray-500 text-center">
              Don't have an API key? Run: <code className="bg-gray-100 px-1 rounded">node server/scripts/init.js</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}