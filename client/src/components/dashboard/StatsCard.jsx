import React from 'react';

export default function StatsCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-0.5 md:mb-1">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <i className={`${icon} text-base md:text-xl`}></i>
        </div>
      </div>
    </div>
  );
}