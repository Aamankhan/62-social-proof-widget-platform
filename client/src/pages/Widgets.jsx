import React, { useState, useEffect } from 'react';
import WidgetCard from '../components/widgets/WidgetCard';
import WidgetForm from '../components/widgets/WidgetForm';
import Button from '../components/common/Button';
import { getWidgets, createWidget, updateWidget, deleteWidget, toggleWidget } from '../services/api';

export default function Widgets() {
  const [widgets, setWidgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWidgets();
  }, []);

  const loadWidgets = async () => {
    try {
      setLoading(true);
      const data = await getWidgets();
      setWidgets(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (widgetData) => {
    try {
      if (editingWidget) {
        await updateWidget(editingWidget._id, widgetData);
      } else {
        await createWidget(widgetData);
      }
      await loadWidgets();
      setShowForm(false);
      setEditingWidget(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleWidget(id);
      await loadWidgets();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this widget?')) {
      try {
        await deleteWidget(id);
        await loadWidgets();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600"></i>
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Widgets</h1>
        <Button onClick={() => setShowForm(true)}>
          <i className="fa-solid fa-plus mr-2"></i>Create Widget
        </Button>
      </div>

      {error && <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-800">{error}</div>}

      {showForm && (
        <WidgetForm widget={editingWidget} onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingWidget(null); }} />
      )}

      {widgets.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fa-solid fa-window-maximize text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-500">No widgets created yet</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">Create your first widget</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map(widget => (
            <WidgetCard key={widget._id} widget={widget} onToggle={handleToggle}
              onEdit={() => { setEditingWidget(widget); setShowForm(true); }}
              onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}