import React, { useState } from 'react'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import CategoryList from './CategoryList'

const MainCategorys = () => {
  const [view, setView] = useState('list');
  const [editingCategory, setEditingCategory] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddSuccess = () => {
    setView('list');
    setRefreshKey(prev => prev + 1);
  };

  const handleEditSuccess = () => {
    setView('list');
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setView('edit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">🏷️ Category Management</h1>
            <p className="text-gray-600 mt-1">Organize your menu items by categories</p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('add')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>➕ Add Category</span>
            </button>
          )}
        </div>
        
        {view === 'add' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <AddCategory onSuccess={handleAddSuccess} onBack={() => setView('list')} />
          </div>
        )}

        {view === 'edit' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <EditCategory category={editingCategory} onSuccess={handleEditSuccess} onBack={() => setView('list')} />
          </div>
        )}

        {view === 'list' && (
          <div className="animate-fadeIn">
            <CategoryList key={refreshKey} onEdit={handleEdit} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MainCategorys
