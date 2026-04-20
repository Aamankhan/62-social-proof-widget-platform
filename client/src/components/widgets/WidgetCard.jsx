import React from 'react';
import Toggle from '../common/Toggle';

export default function WidgetCard({ widget, onToggle, onEdit, onDelete }) {
  const getTypeIcon = () => {
    switch(widget.type) {
      case 'sales': return 'fa-solid fa-cart-shopping';
      case 'visitor': return 'fa-solid fa-users';
      case 'signup': return 'fa-solid fa-user-plus';
      default: return 'fa-solid fa-message';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-3 md:p-6">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className={`${getTypeIcon()} text-blue-600 text-sm md:text-base`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900">{widget.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{widget.type}</p>
            </div>
          </div>
          <Toggle checked={widget.status} onChange={() => onToggle(widget._id)} />
        </div>
        
        <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 line-clamp-2">{widget.message}</p>
        
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(widget)}
              className="text-gray-600 hover:text-blue-600 text-xs md:text-sm"
            >
              <i className="fa-solid fa-pen mr-1"></i>
              Edit
            </button>
            <button 
              onClick={() => onDelete(widget._id)}
              className="text-gray-600 hover:text-red-600 text-xs md:text-sm"
            >
              <i className="fa-solid fa-trash mr-1"></i>
              Delete
            </button>
          </div>
          <div className="text-xs text-gray-500">
            <i className="fa-regular fa-calendar mr-1"></i>
            {new Date(widget.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}