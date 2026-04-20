import React, { useState, useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { getWidgets, getNotifications } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalWidgets: 0,
    activeWidgets: 0,
    totalNotifications: 0,
    totalImpressions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const widgets = await getWidgets();
      const widgetsArray = Array.isArray(widgets) ? widgets : [];
      
      const notifications = await getNotifications();
      const notificationsArray = Array.isArray(notifications) ? notifications : [];
      
      setStats({
        totalWidgets: widgetsArray.length,
        activeWidgets: widgetsArray.filter(w => w.status).length,
        totalNotifications: notificationsArray.length,
        totalImpressions: notificationsArray.reduce((sum, n) => sum + (n.impressions || 0), 0)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-2xl md:text-3xl text-blue-600"></i>
          <p className="mt-2 text-sm md:text-base text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <i className="fa-solid fa-circle-exclamation text-red-600 text-sm md:text-base"></i>
          <p className="text-sm md:text-base text-red-800">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <StatsCard
          title="Total Widgets"
          value={stats.totalWidgets}
          icon="fa-solid fa-window-maximize"
          color="blue"
        />
        <StatsCard
          title="Active Widgets"
          value={stats.activeWidgets}
          icon="fa-solid fa-check-circle"
          color="green"
        />
        <StatsCard
          title="Notifications"
          value={stats.totalNotifications}
          icon="fa-solid fa-bell"
          color="purple"
        />
        <StatsCard
          title="Total Impressions"
          value={stats.totalImpressions.toLocaleString()}
          icon="fa-solid fa-eye"
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Recent Activity</h2>
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
            <div className="flex items-center gap-2 md:gap-3">
              <i className="fa-solid fa-chart-line text-green-500 text-sm md:text-base"></i>
              <div>
                <p className="font-medium text-sm md:text-base">Widget Performance</p>
                <p className="text-xs md:text-sm text-gray-600">Your widgets are performing well</p>
              </div>
            </div>
            <span className="text-xs md:text-sm text-gray-500">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}