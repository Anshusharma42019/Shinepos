import React, { useState, useEffect } from 'react';
import { useCategory } from '../Category/hooks/useCategory';
import { FiCircle, FiTrash2, FiPlus } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddItem = ({ onSuccess, onBack }) => {
  const { categories } = useCategory();
  const [formData, setFormData] = useState({
    itemName: '',
    categoryID: '',
    status: 'active',
    imageUrl: '',
    videoUrl: '',
    timeToPrepare: '',
    foodType: 'veg',
    marginCostPercentage: 40
  });
  const [availableAddons, setAvailableAddons] = useState([]);
  const [availableVariations, setAvailableVariations] = useState([]);
  const [availableInventory, setAvailableInventory] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAddon, setSearchAddon] = useState('');
  const [searchVariation, setSearchVariation] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    fetchAddons();
    fetchVariations();
    fetchInventory();
  }, []);

  const fetchAddons = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/addon/all/addon`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setAvailableAddons((await res.json()).addons || []);
    } catch (e) { console.error(e); }
  };

  const fetchVariations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/variation/all/variation`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setAvailableVariations((await res.json()).variations || []);
    } catch (e) { console.error(e); }
  };

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/inventory/all/inventory/items`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setAvailableInventory((await res.json()).inventory || []);
    } catch (e) { console.error(e); }
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    const res = await fetch(`${API_BASE_URL}/api/upload/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return (await res.json()).url;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddonChange = (id, checked) =>
    setSelectedAddons(checked ? [...selectedAddons, id] : selectedAddons.filter(x => x !== id));

  const handleVariationChange = (id, checked) =>
    setSelectedVariations(checked ? [...selectedVariations, id] : selectedVariations.filter(x => x !== id));

  const addIngredient = () =>
    setIngredients(prev => [...prev, { inventoryItemId: '', quantity: '', unit: '' }]);

  const updateIngredient = (index, field, value) =>
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing));

  const handleInventorySelect = (index, inventoryItemId) => {
    const item = availableInventory.find(i => i._id === inventoryItemId);
    setIngredients(prev => prev.map((ing, i) =>
      i === index ? { ...ing, inventoryItemId, unit: item?.unit || '' } : ing
    ));
  };

  const removeIngredient = (index) =>
    setIngredients(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/menus/create/menu-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          itemName: formData.itemName,
          categoryID: formData.categoryID,
          status: formData.status,
          imageUrl: formData.imageUrl,
          videoUrl: formData.videoUrl,
          timeToPrepare: Number(formData.timeToPrepare),
          foodType: formData.foodType,
          addon: selectedAddons,
          variation: selectedVariations,
          marginCostPercentage: Number(formData.marginCostPercentage),
          ingredients: ingredients.filter(i => i.inventoryItemId && i.quantity)
        })
      });
      if (res.ok) {
        alert('Item added successfully!');
        if (onSuccess) onSuccess();
      } else {
        alert((await res.json()).error || 'Failed to add item');
      }
    } catch (error) {
      alert('Error adding item');
    }
    setLoading(false);
  };

  const filteredAddons = availableAddons.filter(a => a.name.toLowerCase().includes(searchAddon.toLowerCase()));
  const filteredVariations = availableVariations.filter(v => v.name.toLowerCase().includes(searchVariation.toLowerCase()));

  const inputCls = 'w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900';
  const cardCls = 'bg-white/20 backdrop-blur-2xl rounded-2xl p-6';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn p-6">
      {/* Left Side - Addons, Variations & Ingredients */}
      <div className="lg:col-span-1 space-y-6">
        {/* Addons */}
        <div className={cardCls}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Addons</h3>
          <input type="text" placeholder="Search addons..." value={searchAddon}
            onChange={e => setSearchAddon(e.target.value)} className={`${inputCls} mb-4`} />
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {filteredAddons.map(addon => (
              <label key={addon._id} className="flex items-center space-x-3 p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/50 transition-colors">
                <input type="checkbox" checked={selectedAddons.includes(addon._id)}
                  onChange={e => handleAddonChange(addon._id, e.target.checked)} className="w-4 h-4" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{addon.name}</div>
                  <div className="text-sm text-black font-bold">₹{addon.price}</div>
                </div>
                <FiCircle className={addon.veg ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'} size={12} />
              </label>
            ))}
          </div>
        </div>

        {/* Variations */}
        <div className={cardCls}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Variations</h3>
          <input type="text" placeholder="Search variations..." value={searchVariation}
            onChange={e => setSearchVariation(e.target.value)} className={`${inputCls} mb-4`} />
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {filteredVariations.map(variation => (
              <label key={variation._id} className="flex items-center space-x-3 p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/50 transition-colors">
                <input type="checkbox" checked={selectedVariations.includes(variation._id)}
                  onChange={e => handleVariationChange(variation._id, e.target.checked)} className="w-4 h-4" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{variation.name}</div>
                  <div className="text-sm text-black font-bold">₹{variation.price}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Inventory Ingredients */}
        <div className={cardCls}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Inventory Ingredients</h3>
            <button type="button" onClick={addIngredient}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              <FiPlus size={14} /> Add
            </button>
          </div>
          {ingredients.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-3">No ingredients added. Click Add to link inventory items.</p>
          )}
          <div className="space-y-3">
            {ingredients.map((ing, index) => (
              <div key={index} className="bg-white/40 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Ingredient {index + 1}</span>
                  <button type="button" onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <select value={ing.inventoryItemId}
                  onChange={e => handleInventorySelect(index, e.target.value)}
                  className="w-full bg-white/60 border border-white/50 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select inventory item</option>
                  {availableInventory.map(item => (
                    <option key={item._id} value={item._id}>{item.name} ({item.unit})</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input type="number" placeholder="Qty" min="0" step="0.01"
                    value={ing.quantity}
                    onChange={e => updateIngredient(index, 'quantity', e.target.value)}
                    className="w-2/3 bg-white/60 border border-white/50 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <input type="text" placeholder="Unit" value={ing.unit} readOnly
                    className="w-1/3 bg-white/30 border border-white/50 rounded-lg px-3 py-1.5 text-sm text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Item Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className={cardCls}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Item Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Item Name *</label>
              <input type="text" name="itemName" value={formData.itemName}
                onChange={handleInputChange} className={inputCls} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Category *</label>
              <select name="categoryID" value={formData.categoryID}
                onChange={handleInputChange} className={inputCls} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className={inputCls}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Food Type</label>
              <select name="foodType" value={formData.foodType} onChange={handleInputChange} className={inputCls}>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Time to Prepare (min) *</label>
              <input type="number" name="timeToPrepare" value={formData.timeToPrepare}
                onChange={handleInputChange} className={inputCls} min="1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Margin Cost % *</label>
              <input type="number" name="marginCostPercentage" value={formData.marginCostPercentage}
                onChange={handleInputChange} className={inputCls} min="0" max="100" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Image</label>
              <input type="file" accept="image/*" disabled={uploadingImage} className={inputCls}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploadingImage(true);
                  try {
                    const url = await uploadToCloudinary(file);
                    setFormData(prev => ({ ...prev, imageUrl: url }));
                  } catch (err) { alert('Failed to upload image: ' + err.message); }
                  setUploadingImage(false);
                }} />
              {uploadingImage && <p className="text-sm text-gray-900 mt-1">Uploading...</p>}
              {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl mt-2" />}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">Video</label>
              <input type="file" accept="video/*" disabled={uploadingVideo} className={inputCls}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploadingVideo(true);
                  try {
                    const url = await uploadToCloudinary(file);
                    setFormData(prev => ({ ...prev, videoUrl: url }));
                  } catch (err) { alert('Failed to upload video'); }
                  setUploadingVideo(false);
                }} />
              {uploadingVideo && <p className="text-sm text-gray-900 mt-1">Uploading...</p>}
              {formData.videoUrl && <video src={formData.videoUrl} controls className="w-full h-32 rounded-xl mt-2" />}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className={cardCls}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-900">Addons:</span>
              <span className="ml-2 font-bold text-black">{selectedAddons.length}</span>
            </div>
            <div>
              <span className="text-gray-900">Variations:</span>
              <span className="ml-2 font-bold text-black">{selectedVariations.length}</span>
            </div>
            <div>
              <span className="text-gray-900">Ingredients:</span>
              <span className="ml-2 font-bold text-green-700">{ingredients.filter(i => i.inventoryItemId && i.quantity).length}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onBack}
            className="px-6 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors">
            ← Back
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating...' : 'Create Item'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddItem;
