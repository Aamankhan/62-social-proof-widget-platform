import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    total: { impressions: 0, clicks: 0, conversions: 0 },
    ctr: 0,
    daily: []
  });
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/live-data/analytics?days=${days}`, {
        headers: { 'x-api-key': localStorage.getItem('apiKey') || '' }
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600"></i>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Analytics</h1>
        
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Impressions</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {analytics.total.impressions.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-eye text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {analytics.total.clicks.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-mouse-pointer text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Click-Through Rate</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {analytics.ctr}%
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Breakdown */}
      <Card title="Daily Performance" icon="fa-solid fa-calendar-day">
        {analytics.daily.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No data available for selected period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.daily.map(day => (
                  <tr key={day._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{day._id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{day.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{day.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {day.impressions > 0 ? ((day.clicks / day.impressions) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-lightbulb text-blue-600 mt-0.5"></i>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Pro Tips</h3>
            <p className="text-sm text-blue-800">
              Higher CTR means your messages are engaging. Try different positions, 
              animations, and message styles to improve performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}