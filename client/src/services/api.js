const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'sp_zjy8lf6y9b';

const request = async (endpoint, options = {}) => {
  if (!API_KEY) {
    throw new Error('API key is not configured');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {}
      
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    if (result.data !== undefined) return result.data;
    if (result.success && result.data) return result.data;
    if (Array.isArray(result)) return result;
    if (result.widgets) return result.widgets;
    return result;
    
  } catch (error) {
    console.error(`API Error ${endpoint}:`, error);
    throw error;
  }
};

export const getWidgets = () => request('/widgets');
export const getWidget = (id) => request(`/widgets/${id}`);
export const createWidget = (data) => request('/widgets', { method: 'POST', body: JSON.stringify(data) });
export const updateWidget = (id, data) => request(`/widgets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteWidget = (id) => request(`/widgets/${id}`, { method: 'DELETE' });
export const toggleWidget = (id) => request(`/widgets/${id}/toggle`, { method: 'PATCH' });

export const getNotifications = () => request('/notifications');
export const getWidgetNotifications = (widgetId) => request(`/notifications/widget/${widgetId}`);
export const createNotification = (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) });
export const updateNotification = (id, data) => request(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNotification = (id) => request(`/notifications/${id}`, { method: 'DELETE' });

export const getSettings = () => request('/settings');
export const updateSettings = (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) });
export const resetApiKey = () => request('/settings/reset-api-key', { method: 'POST' });