import React from 'react';
import { FiLink } from 'react-icons/fi';

const TableList = ({ tables, onUpdateStatus, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'OCCUPIED': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'RESERVED': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white';
      case 'MAINTENANCE': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'AVAILABLE': return '✅';
      case 'OCCUPIED': return '🔴';
      case 'RESERVED': return '🟡';
      case 'MAINTENANCE': return '🔧';
      default: return '❓';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tables.map((table, index) => (
        <div 
          key={table._id} 
          className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn card-hover"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-3xl">🪑</div>
              <h3 className="text-2xl font-bold text-gray-900">{table.tableNumber}</h3>
              {table.mergedWith && table.mergedWith.length > 0 && (
                <FiLink className="text-purple-600 animate-pulse-slow" title="Merged Table" size={20} />
              )}
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold shadow-md ${getStatusColor(table.status)}`}>
              {getStatusEmoji(table.status)} {table.status}
            </span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-gray-900">
              <span className="text-xl">👥</span>
              <p className="text-sm font-medium">Capacity: {table.capacity} people</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-900">
              <span className="text-xl">🏠</span>
              <p className="text-sm font-medium">Location: {table.location}</p>
            </div>
            {table.mergedWith && table.mergedWith.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-3 mt-3 border-2 border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🔗</span>
                  <p className="text-sm font-bold text-purple-700">Merged Tables:</p>
                </div>
                <p className="text-xs text-purple-600 font-medium">
                  {table.mergedWith.map(id => {
                    const originalTable = tables.find(t => t._id === id);
                    return originalTable?.tableNumber;
                  }).filter(Boolean).join(', ')}
                </p>
                {table.mergedGuestCount && (
                  <p className="text-xs text-purple-600 font-medium mt-1">👥 Guests: {table.mergedGuestCount}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={table.status}
              onChange={(e) => onUpdateStatus(table._id, e.target.value)}
              className="flex-1 px-4 py-2 bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 text-gray-900"
            >
              <option value="AVAILABLE">✅ Available</option>
              <option value="OCCUPIED">🔴 Occupied</option>
              <option value="RESERVED">🟡 Reserved</option>
              <option value="MAINTENANCE">🔧 Maintenance</option>
            </select>
            
            <button
              onClick={() => onEdit(table)}
              className="px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl text-sm font-medium transition-all border border-white/40"
            >
              ✏️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableList;