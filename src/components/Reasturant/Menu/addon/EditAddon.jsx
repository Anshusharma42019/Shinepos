import React, { useState } from 'react';

const EditAddon = ({ addon, onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    name: addon.name || '',
    price: addon.price || '',
    description: addon.description || '',
    veg: addon.veg || true,
    available: addon.available || true
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addon/update/addon/${addon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          veg: formData.veg,
          available: formData.available
        })
      });

      if (response.ok) {
        alert('Addon updated successfully!');
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update addon');
      }
    } catch (error) {
      alert('Error updating addon');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Addon</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Addon Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Extra Cheese"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
            rows="3"
            placeholder="Optional description"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="veg"
            id="veg"
            checked={formData.veg}
            onChange={handleInputChange}
            className="w-4 h-4 text-green-600"
          />
          <label htmlFor="veg" className="text-sm font-medium">
            Vegetarian
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="available"
            id="available"
            checked={formData.available}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="available" className="text-sm font-medium">
            Available
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Addon'}
        </button>
      </form>
    </div>
  );
};

export default EditAddon;