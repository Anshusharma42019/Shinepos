import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EditTable = ({ table, onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    tableNumber: table.tableNumber || '',
    capacity: table.capacity || '',
    location: table.location || 'INDOOR'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/table/tables/${table._id}`,
        {
          ...formData,
          capacity: parseInt(formData.capacity)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Table updated successfully!');
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update table');
    }
    
    setLoading(false);
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">✏️ Edit Table</h3>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl border border-white/40"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Table Number *</label>
            <input
              type="text"
              value={formData.tableNumber}
              onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
              className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Capacity *</label>
            <input
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Location</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            >
              <option value="INDOOR">🏠 Indoor</option>
              <option value="OUTDOOR">🌳 Outdoor</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl border border-white/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl border border-white/40 disabled:opacity-50"
            >
              {loading ? 'Updating...' : '✓ Update Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTable;
