import React from 'react';
import { usePreview } from '../contexts/PreviewContext';
import ColorPicker from '../components/appearance/ColorPicker';
import PositionSelector from '../components/appearance/PositionSelector';

export default function Appearance() {
  const { settings, updateSettings } = usePreview();

  const handleChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Appearance Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Theme Colors</h2>
            
            <div className="space-y-4">
              <ColorPicker
                label="Primary Button Color"
                value={settings.buttonColor}
                onChange={(color) => handleChange('buttonColor', color)}
              />
              
              <ColorPicker
                label="Background Color"
                value={settings.backgroundColor}
                onChange={(color) => handleChange('backgroundColor', color)}
              />
              
              <ColorPicker
                label="Text Color"
                value={settings.textColor}
                onChange={(color) => handleChange('textColor', color)}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Typography</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="12px">Small (12px)</option>
                <option value="14px">Medium (14px)</option>
                <option value="16px">Large (16px)</option>
                <option value="18px">Extra Large (18px)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Widget Position</h2>
            <PositionSelector
              value={settings.position}
              onChange={(position) => handleChange('position', position)}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Animation & Effects</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation Type
                </label>
                <select
                  value={settings.animation}
                  onChange={(e) => handleChange('animation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="slide">Slide In</option>
                  <option value="fade">Fade In</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Radius
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={parseInt(settings.borderRadius)}
                  onChange={(e) => handleChange('borderRadius', `${e.target.value}px`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">{settings.borderRadius}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shadow Intensity
                </label>
                <select
                  value={settings.shadowIntensity}
                  onChange={(e) => handleChange('shadowIntensity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="none">None</option>
                  <option value="soft">Soft</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}