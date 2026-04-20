import React from 'react';

export default function PositionSelector({ value, onChange }) {
  const positions = [
    { id: 'bottom-left', label: 'Bottom Left', icon: 'fa-solid fa-arrow-down-left' },
    { id: 'bottom-right', label: 'Bottom Right', icon: 'fa-solid fa-arrow-down-right' },
    { id: 'top-right', label: 'Top Right', icon: 'fa-solid fa-arrow-up-right' }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {positions.map(position => (
        <button
          key={position.id}
          onClick={() => onChange(position.id)}
          className={`p-4 border-2 rounded-lg text-center transition-all ${
            value === position.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <i className={`${position.icon} text-2xl mb-2 ${
            value === position.id ? 'text-blue-600' : 'text-gray-600'
          }`}></i>
          <p className={`text-sm font-medium ${
            value === position.id ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {position.label}
          </p>
        </button>
      ))}
    </div>
  );
}