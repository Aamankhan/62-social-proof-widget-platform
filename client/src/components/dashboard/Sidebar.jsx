import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { path: '/', icon: 'fa-solid fa-chart-line', label: 'Dashboard' },
    { path: '/widgets', icon: 'fa-solid fa-window-maximize', label: 'Widgets' },
    { path: '/campaigns', icon: 'fa-solid fa-bullhorn', label: 'Campaigns' },
    { path: '/appearance', icon: 'fa-solid fa-palette', label: 'Appearance' },
    { path: '/preview', icon: 'fa-solid fa-eye', label: 'Preview' },
    { path: '/embed', icon: 'fa-solid fa-code', label: 'Embed Script' },
    { path: '/settings', icon: 'fa-solid fa-gear', label: 'Settings' },
     // ... existing items
  { path: '/integrations', icon: 'fa-solid fa-plug', label: 'Integrations' },
  { path: '/live-logs', icon: 'fa-solid fa-list-ul', label: 'Live Logs' },
  { path: '/analytics', icon: 'fa-solid fa-chart-line', label: 'Analytics' }
  ];

  // Mobile sidebar toggle button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
    >
      <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-600 text-xl`}></i>
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 border-b">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-chart-simple text-blue-600 text-xl md:text-2xl"></i>
          <span className="font-bold text-lg md:text-xl text-gray-800">SocialProof</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 hidden sm:block">Notification Widget Platform</p>
      </div>
      
      <nav className="flex-1 p-2 md:p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-1 transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className={`${item.icon} text-base md:text-lg ${isActive ? 'text-blue-600' : 'text-gray-500'}`}></i>
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-3 md:p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-2 md:p-3">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-rocket text-purple-600 text-sm md:text-base"></i>
            <span className="text-xs font-semibold hidden sm:inline">Need Help?</span>
          </div>
          <p className="text-xs text-gray-600 hidden sm:block">Check documentation or contact support</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white shadow-lg flex-shrink-0">
        <SidebarContent />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 lg:hidden animate-slideIn">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}