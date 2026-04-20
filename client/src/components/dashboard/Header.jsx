import React from 'react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 ml-8 lg:ml-0">
          <h1 className="text-base md:text-xl font-semibold text-gray-800 hidden sm:block">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <button className="relative text-gray-600 hover:text-gray-800">
            <i className="fa-regular fa-bell text-lg md:text-xl"></i>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs md:text-sm font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Platform Owner</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user text-white text-xs md:text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}