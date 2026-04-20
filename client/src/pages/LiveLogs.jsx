import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { getWidgets } from '../services/api';

export default function LiveLogs() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [signups, setSignups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'orders') {
        const res = await fetch('http://localhost:5000/api/live-data/orders', {
          headers: { 'x-api-key': localStorage.getItem('apiKey') || '' }
        });
        const data = await res.json();
        if (data.success) setOrders(data.data);
      } else if (activeTab === 'signups') {
        const res = await fetch('http://localhost:5000/api/live-data/signups', {
          headers: { 'x-api-key': localStorage.getItem('apiKey') || '' }
        });
        const data = await res.json();
        if (data.success) setSignups(data.data);
      } else if (activeTab === 'messages') {
        const res = await fetch('http://localhost:5000/api/live-data/messages', {
          headers: { 'x-api-key': localStorage.getItem('apiKey') || '' }
        });
        const data = await res.json();
        if (data.success) setMessages(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: 'fa-solid fa-shopping-cart' },
    { id: 'signups', label: 'Signups', icon: 'fa-solid fa-user-plus' },
    { id: 'messages', label: 'Messages', icon: 'fa-solid fa-comment' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600"></i>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Live Data Logs</h1>
      
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Orders Table */}
      {activeTab === 'orders' && (
        <Card>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-inbox text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-500">No orders received yet</p>
              <p className="text-sm text-gray-400 mt-2">Send a test webhook to see data here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.city}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.product}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
      
      {/* Signups Table */}
      {activeTab === 'signups' && (
        <Card>
          {signups.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-inbox text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-500">No signups received yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {signups.map(signup => (
                    <tr key={signup._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(signup.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{signup.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{signup.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
      
      {/* Messages Table */}
      {activeTab === 'messages' && (
        <Card>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-inbox text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-500">No messages received yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(message => (
                <div key={message._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-900">{message.text}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}