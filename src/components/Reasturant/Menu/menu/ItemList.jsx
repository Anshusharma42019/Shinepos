import React, { useState, useEffect } from 'react';
import AddItem from './AddItem';
import EditItem from './EditItem';

const ItemList = () => {
  const [view, setView] = useState('list');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    if (view === 'list') {
      const loadItems = async () => {
        if (!isMounted) return;
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/get/all-menu-items`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok && isMounted) {
            const data = await response.json();
            setItems(data.menuItems || []);
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching items:', error);
          }
        }
        if (isMounted) {
          setLoading(false);
        }
      };

      loadItems();
    }
    
    return () => {
      isMounted = false;
    };
  }, [view]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/get/all-menu-items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.menuItems || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  const toggleItemStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // Optimistic update
    setItems(items.map(item => 
      item._id === id ? { ...item, status: newStatus } : item
    ));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/update/menu-item/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        // Revert on failure
        setItems(items.map(item => 
          item._id === id ? { ...item, status: currentStatus } : item
        ));
      }
    } catch (error) {
      console.error('Error updating item status:', error);
      // Revert on failure
      setItems(items.map(item => 
        item._id === id ? { ...item, status: currentStatus } : item
      ));
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/delete/menu-item/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
        alert('Item deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setView('edit');
  };

  const handleAddSuccess = () => {
    setView('list');
  };

  const handleEditSuccess = () => {
    setView('list');
    setEditingItem(null);
  };

  if (view === 'add') {
    return <AddItem onSuccess={handleAddSuccess} onBack={() => setView('list')} />;
  }

  if (view === 'edit') {
    return <EditItem item={editingItem} onSuccess={handleEditSuccess} onBack={() => setView('list')} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">🍕</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setView('add')}
          className="px-6 py-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-white/40"
        >
          <span>➕ Add Item</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div 
            key={item._id} 
            className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/40 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            {/* Image Section */}
            <div className="relative h-32 bg-gradient-to-br from-orange-100 to-red-100">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.itemName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl">🍴</span>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold shadow-md ${
                  item.status === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-400 text-white'
                }`}>
                  {item.status === 'active' ? '✓' : '✕'}
                </span>
              </div>
              
              {/* Food Type Badge */}
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold shadow-md ${
                  item.foodType === 'veg' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {item.foodType === 'veg' ? '🌱' : '🍖'}
                </span>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2 truncate">{item.itemName}</h3>
              
              <div className="space-y-1 mb-3 text-xs text-gray-900">
                <div className="flex items-center justify-between">
                  <span>🏷️ {item.categoryID?.name || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>⏰ {item.timeToPrepare} min</span>
                  {item.variation && item.variation.length > 0 ? (
                    <span className="text-sm font-bold text-green-600">
                      ₹{Math.min(...item.variation.map(v => v.price || 0))}
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleItemStatus(item._id, item.status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    item.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-2 py-1.5 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-lg text-xs font-medium transition-all border border-white/40"
                >
                  ✏️
                </button>
                
                <button
                  onClick={() => deleteItem(item._id)}
                  className="flex-1 px-2 py-1.5 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-lg text-xs font-medium transition-all border border-white/40"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="text-6xl mb-4 animate-pulse-slow">🍴</div>
          <p className="text-gray-500 text-lg font-medium">No menu items found</p>
          <p className="text-gray-400 text-sm mt-2">Add some items to get started</p>
        </div>
      )}
    </div>
  );
};

export default ItemList;