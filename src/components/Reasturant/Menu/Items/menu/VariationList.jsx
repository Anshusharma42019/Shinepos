import React, { useState, useEffect } from 'react';
import AddVariation from './AddVariation';

const VariationList = ({ onEdit }) => {
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');

  useEffect(() => {
    fetchVariations();
  }, []);

  const fetchVariations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/variation/all/variation`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVariations(data.variations || []);
      }
    } catch (error) {
      console.error('Error fetching variations:', error);
    }
    setLoading(false);
  };

  const deleteVariation = async (id) => {
    if (!confirm('Are you sure you want to delete this variation?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/variation/delete/variation/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setVariations(variations.filter(variation => variation._id !== id));
        alert('Variation deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting variation:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Variations</h2>
        {view === 'list' && (
          <button
            onClick={() => setView('add')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            + Add Variation
          </button>
        )}
      </div>
      
      {view === 'add' && (
        <div className="mb-6">
          <AddVariation onSuccess={() => { setView('list'); fetchVariations(); }} onBack={() => setView('list')} />
        </div>
      )}
      
      {view === 'list' && (
        <div className="grid gap-4">
        {variations.map(variation => (
          <div key={variation._id} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{variation.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    variation.available ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {variation.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Price:</span> ₹{variation.price}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit && onEdit(variation)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVariation(variation._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
      
      {variations.length === 0 && view === 'list' && (
        <div className="text-center py-8 text-gray-500">
          <p>No variations found. Add some variations to get started.</p>
        </div>
      )}
    </div>
  );
};

export default VariationList;