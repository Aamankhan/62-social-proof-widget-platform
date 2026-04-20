import React, { useState } from 'react';
import LiveWidgetPreview from '../components/preview/LiveWidgetPreview';
import { usePreview } from '../contexts/PreviewContext';
import Button from '../components/common/Button';

export default function Preview() {
  const { settings, updateSettings, currentWidget, setCurrentWidget, setIsVisible } = usePreview();
  const [selectedWidgetId, setSelectedWidgetId] = useState('');

  const handleWidgetChange = (e) => {
    const widgetId = e.target.value;
    setSelectedWidgetId(widgetId);
    // In real app, fetch widget by ID
    setCurrentWidget({
      _id: widgetId,
      type: 'sales',
      message: 'Test notification message',
      position: 'bottom-right',
      themeSettings: {
        fontSize: '14px',
        buttonColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: '8px',
        shadowIntensity: 'soft',
        animation: 'slide'
      },
      rotationInterval: 5
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Live Preview</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preview Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Widget
                </label>
                <select
                  value={selectedWidgetId}
                  onChange={handleWidgetChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a widget to preview</option>
                  <option value="widget1">Sales Notification</option>
                  <option value="widget2">Visitor Counter</option>
                  <option value="widget3">Signup Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Widget
                </label>
                <div className="flex gap-3">
                  <Button onClick={() => setIsVisible(true)}>
                    <i className="fa-solid fa-play mr-2"></i>
                    Show Preview
                  </Button>
                  <Button variant="secondary" onClick={() => setIsVisible(false)}>
                    <i className="fa-solid fa-stop mr-2"></i>
                    Hide Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>✓ Changes made in Appearance Settings will reflect instantly here</p>
              <p>✓ Test different positions, colors, and animations</p>
              <p>✓ Preview exactly how the widget will look on your website</p>
              <p>✓ Once satisfied, copy the embed code from the Embed Script page</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Preview Area</h2>
          <div className="bg-gray-100 rounded-lg h-96 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <i className="fa-solid fa-desktop text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">Your website preview</p>
                <p className="text-sm text-gray-400 mt-2">Widget will appear here</p>
              </div>
            </div>
            <LiveWidgetPreview />
          </div>
        </div>
      </div>
    </div>
  );
}