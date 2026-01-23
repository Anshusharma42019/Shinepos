import React, { useState, useEffect } from 'react';
import KOTHistory from './KOTHistory';

const KOT = () => {
  const [kots, setKots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchKitchenOrders();
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitchen/all/kitchen/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const activeKots = (data.kots || []).filter(kot => 
          kot.status !== 'DELIVERED' && kot.status !== 'CANCELLED' && kot.status !== 'PAID'
        );
        setKots(activeKots);
      }
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    }
    setLoading(false);
  };

  const updateKOTStatus = async (kotId, newStatus) => {
    try {
      if (newStatus === 'DELIVERED' || newStatus === 'CANCELLED' || newStatus === 'PAID') {
        setKots(prev => prev.filter(kot => kot._id !== kotId));
      } else {
        setKots(prev => prev.map(kot => 
          kot._id === kotId ? { ...kot, status: newStatus } : kot
        ));
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kot/${kotId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error('Error updating KOT status:', error);
      fetchKitchenOrders();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">👨🍳</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-900 font-medium">Loading kitchen orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">👨🍳 Kitchen Orders (KOT)</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'active' 
                ? 'bg-white/40 backdrop-blur-lg text-gray-900' 
                : 'bg-white/20 backdrop-blur-md text-gray-800'
            }`}
          >
            🔥 Active KOTs
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-white/40 backdrop-blur-lg text-gray-900' 
                : 'bg-white/20 backdrop-blur-md text-gray-800'
            }`}
          >
            📜 History
          </button>
          <button
            onClick={fetchKitchenOrders}
            className="px-6 py-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl font-medium transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {kots.map((kot, index) => (
            <div 
              key={kot._id} 
              className={`bg-white/30 backdrop-blur-md rounded-2xl overflow-hidden transition-colors hover:bg-white/35 animate-fadeIn ${
                kot.priority === 'URGENT' ? 'ring-4 ring-red-500 animate-pulse-slow' : 
                kot.priority === 'HIGH' ? 'ring-2 ring-orange-400' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header */}
              <div className={`p-4 ${
                kot.priority === 'URGENT' ? 'bg-red-500/80' :
                kot.priority === 'HIGH' ? 'bg-orange-500/80' :
                kot.priority === 'NORMAL' ? 'bg-yellow-500/80' :
                'bg-green-500/80'
              } text-white backdrop-blur-md`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-2xl">{kot.kotNumber}</h3>
                    <p className="text-sm opacity-90">📝 {kot.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-1">
                      {kot.priority === 'URGENT' ? '🔴' :
                       kot.priority === 'HIGH' ? '🟠' :
                       kot.priority === 'NORMAL' ? '🟡' : '🟢'}
                    </div>
                    <p className="text-xs font-bold">{kot.priority || 'NORMAL'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span>⏰</span>
                  <span>{new Date(kot.createdAt).toLocaleTimeString()}</span>
                </div>
                {kot.tableNumber && (
                  <div className="flex items-center space-x-2 text-sm mt-1">
                    <span>🪑</span>
                    <span>Table: {kot.tableNumber}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  {kot.items?.map((item, index) => (
                    <div key={index} className="bg-white/40 backdrop-blur-lg rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="bg-orange-500 text-white font-bold px-2 py-1 rounded-full text-xs">
                              {item.quantity}x
                            </span>
                            <span className="font-bold text-gray-900">{item.name}</span>
                          </div>
                          {item.variation && (
                            <div className="text-sm text-gray-700 ml-8 mt-1">
                              🎯 {item.variation.name}
                            </div>
                          )}
                          {item.addons?.map((addon, addonIndex) => (
                            <div key={addonIndex} className="text-sm text-purple-700 ml-8 mt-1">
                              ➕ {addon.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Selector */}
                <select
                  value={kot.status}
                  onChange={(e) => updateKOTStatus(kot._id, e.target.value)}
                  className="w-full px-4 py-3 bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="PENDING">⏳ Pending</option>
                  <option value="PREPARING">👨🍳 Preparing</option>
                  <option value="READY">✅ Ready</option>
                  <option value="DELIVERED">🚀 Delivered</option>
                  <option value="CANCELLED">❌ Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'active' && kots.length === 0 && (
        <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="text-6xl mb-4 animate-pulse-slow">🍳</div>
          <p className="text-gray-500 text-lg font-medium">No active KOTs in kitchen</p>
          <p className="text-gray-400 text-sm mt-2">Orders will appear here when placed</p>
        </div>
      )}

      {activeTab === 'history' && <KOTHistory />}
    </div>
  );
};

export default KOT;
