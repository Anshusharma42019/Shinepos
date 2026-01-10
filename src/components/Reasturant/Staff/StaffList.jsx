import React, { useState, useEffect } from 'react';
import AddStaff from './AddStaff';
import EditStaff from './EditStaff';

const StaffList = ({ onAdd, onEdit }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User role:', user.role);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/all/staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff || []);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
    setLoading(false);
  };

  const deleteStaff = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/update/staff/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: false })
      });
      
      if (response.ok) {
        setStaff(staff.filter(member => member._id !== id));
        alert('Staff member deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setView('edit');
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Staff
        </button>
      </div>
      
      <div className="grid gap-4">
          {staff.map(member => (
            <div key={member._id} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      member.role === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                      member.role === 'CASHIER' ? 'bg-blue-100 text-blue-800' :
                      member.role === 'KITCHEN_STAFF' ? 'bg-orange-100 text-orange-800' :
                      member.role === 'RESTAURANT_ADMIN' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.role.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Email:</span> {member.email}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Phone:</span> {member.phone}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Hourly Rate:</span> ₹{member.hourlyRate || 0}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Joined:</span> {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStaff(member._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      
      {staff.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No staff members found. Add some staff to get started.</p>
        </div>
      )}
    </div>
  );
};

export default StaffList;