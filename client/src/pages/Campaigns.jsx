import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { getNotifications, createNotification, deleteNotification } from '../services/api';

export default function Campaigns() {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    location: '',
    customerName: '',
    productName: ''
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      const notificationsArray = Array.isArray(data) ? data : [];
      setNotifications(notificationsArray);
      console.log('Notifications loaded:', notificationsArray);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNotification(formData);
      await loadNotifications();
      setShowForm(false);
      setFormData({ text: '', location: '', customerName: '', productName: '' });
    } catch (error) {
      console.error('Error creating notification:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await deleteNotification(id);
        await loadNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
        setError(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-2xl md:text-3xl text-blue-600"></i>
          <p className="mt-2 text-sm md:text-base text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Campaigns</h1>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <i className="fa-solid fa-plus mr-2"></i>
          Add Notification
        </Button>
      </div>

      {error && (
        <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <i className="fa-solid fa-circle-exclamation text-red-600 text-sm md:text-base"></i>
            <p className="text-sm md:text-base text-red-800">Error: {error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-600">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Create Notification</h2>
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <input
              type="text"
              placeholder="Notification text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm md:text-base"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Location (e.g., Delhi, Mumbai)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm md:text-base"
              />
              <input
                type="text"
                placeholder="Customer name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm md:text-base"
              />
            </div>
            <input
              type="text"
              placeholder="Product name"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm md:text-base"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto">Create</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {notifications.length === 0 && !showForm ? (
        <div className="text-center py-8 md:py-12 bg-white rounded-lg shadow">
          <i className="fa-solid fa-bell text-3xl md:text-4xl text-gray-400 mb-3 md:mb-4"></i>
          <p className="text-sm md:text-base text-gray-500 mb-3 md:mb-4">No notifications created yet</p>
          <Button onClick={() => setShowForm(true)}>
            Create your first notification
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="hidden sm:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notifications.map(notification => (
                <tr key={notification._id}>
                  <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 break-words max-w-[150px] md:max-w-none">
                    {notification.text}
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600">
                    {notification.location || '-'}
                  </td>
                  <td className="hidden sm:table-cell px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600">
                    {notification.customerName || '-'}
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4">
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-red-600 hover:text-red-800 text-sm md:text-base"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}