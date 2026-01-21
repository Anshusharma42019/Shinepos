import React, { useState, useEffect } from 'react';
import AddAddon from './AddAddon';

const AddonList = ({ addons, loading, onAdd, onEdit, onDelete }) => {
  const toggleAddonStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addon/update/addon/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ available: newStatus })
      });
      
      if (response.ok) {
        onDelete(); // Refresh data in parent
      }
    } catch (error) {
      console.error('Error updating addon status:', error);
    }
  };

  const deleteAddon = async (id) => {
    if (!confirm('Are you sure you want to delete this addon?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addon/delete/addon/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Addon deleted successfully!');
        onDelete(); // Refresh data in parent
      }
    } catch (error) {
      console.error('Error deleting addon:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">➕</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading addons...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">➕ Addons</h2>
          <p className="text-gray-600 mt-1">Manage extra toppings and add-ons</p>
        </div>
        <button
          onClick={onAdd}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <span>➕ Add Addon</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addons.map((addon, index) => (
          <div 
            key={addon._id} 
            className="bg-white p-6 rounded-2xl shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn card-hover"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{addon.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                    addon.veg ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}>
                    {addon.veg ? '🌱 Veg' : '🍖 Non-Veg'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">💵</span>
                  <span className="text-2xl font-bold text-green-600">₹{addon.price}</span>
                </div>
                
                {addon.description && (
                  <p className="text-sm text-gray-600 mb-3">{addon.description}</p>
                )}
                
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  addon.available ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {addon.available ? '✅ Available' : '❌ Unavailable'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => toggleAddonStatus(addon._id, addon.available)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all shadow-md ${
                  addon.available ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    addon.available ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <button
                onClick={() => onEdit && onEdit(addon)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteAddon(addon._id)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {addons.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
          <div className="text-6xl mb-4 animate-pulse-slow">➕</div>
          <p className="text-gray-500 text-lg font-medium">No addons found</p>
          <p className="text-gray-400 text-sm mt-2">Add some addons to get started</p>
        </div>
      )}
    </div>
  );
};

export default AddonList;