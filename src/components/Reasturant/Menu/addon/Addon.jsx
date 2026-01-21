import React, { useState, useEffect, useRef } from 'react';
import AddonList from './AddonList';
import AddAddon from './AddAddon';
import EditAddon from './EditAddon';

const Addon = () => {
  const [view, setView] = useState('list');
  const [editingAddon, setEditingAddon] = useState(null);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAddons();
    }
  }, []);

  const fetchAddons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addon/all/addon`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddons(data.addons || []);
      }
    } catch (error) {
      console.error('Error fetching addons:', error);
    }
    setLoading(false);
  };

  const handleAddAddon = () => {
    setView('add');
  };

  const handleEditAddon = (addon) => {
    setEditingAddon(addon);
    setView('edit');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingAddon(null);
    fetchAddons(); // Refresh data
  };

  const renderView = () => {
    switch (view) {
      case 'add':
        return <AddAddon onSuccess={handleBackToList} onBack={() => setView('list')} />;
      case 'edit':
        return <EditAddon addon={editingAddon} onSuccess={handleBackToList} onBack={() => setView('list')} />;
      default:
        return <AddonList addons={addons} loading={loading} onAdd={handleAddAddon} onEdit={handleEditAddon} onDelete={fetchAddons} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {renderView()}
      </div>
    </div>
  );
};

export default Addon;