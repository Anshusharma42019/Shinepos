import React, { useState } from 'react';

const EditStaff = ({ staff, onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    name: staff.name || '',
    email: staff.email || '',
    phone: staff.phone || '',
    role: staff.role || 'CASHIER',
    hourlyRate: staff.hourlyRate || '',
    permissions: staff.permissions || []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/update/staff/${staff._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          hourlyRate: Number(formData.hourlyRate),
          permissions: formData.permissions
        })
      });

      if (response.ok) {
        alert('Staff member updated successfully!');
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update staff member');
      }
    } catch (error) {
      alert('Error updating staff member');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">✏️ Edit Staff Member</h3>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl border border-white/40"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="CASHIER">💰 Cashier</option>
                <option value="KITCHEN_STAFF">👨🍳 Kitchen Staff</option>
                <option value="MANAGER">👨💼 Manager</option>
                <option value="RESTAURANT_ADMIN">👑 Restaurant Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Hourly Rate *</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                min="0"
                className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>
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
              {loading ? 'Updating...' : '✓ Update Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
