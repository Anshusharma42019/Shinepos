import React, { useState, useEffect } from 'react';

const OrderHistory = ({ onBack }) => {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredOrder, setHoveredOrder] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/all/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const completedOrders = (data.orders || []).filter(order => 
          order.status === 'PAID' || order.status === 'CANCELLED'
        );
        setHistoryOrders(completedOrders);
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">📜</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-900 font-medium">Loading history...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn space-y-4">
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/30 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📜 Order History</h2>
            <p className="text-gray-700">Orders with paid or cancelled status</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl font-medium transition-all"
            >
              ← Back to Orders
            </button>
          )}
        </div>
      </div>
      
      {historyOrders.length > 0 ? (
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/30 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Table</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Items</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {historyOrders.map((order, index) => (
                <tr 
                  key={order._id}
                  className={`border-t border-white/20 transition-all ${
                    hoveredOrder === order._id ? 'bg-white/20 shadow-lg scale-[1.02] z-10 relative' : 'hover:bg-white/10'
                  }`}
                  onMouseEnter={() => setHoveredOrder(order._id)}
                  onMouseLeave={() => setHoveredOrder(null)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      {order.customerPhone && (
                        <p className="text-sm text-gray-700">📞 {order.customerPhone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{order.tableNumber || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {hoveredOrder === order._id ? (
                        order.items?.map((item, idx) => (
                          <span key={idx} className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            {item.quantity}x {item.name}
                          </span>
                        ))
                      ) : (
                        <>
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                          {order.items?.length > 2 && (
                            <span className="text-xs text-gray-700">+{order.items.length - 2} more</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-green-700">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'PAID' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {order.status === 'PAID' ? '💰 PAID' : '❌ CANCELLED'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="text-6xl mb-4 animate-pulse-slow">📜</div>
          <p className="text-gray-500 text-lg font-medium">No order history available</p>
          <p className="text-gray-400 text-sm mt-2">Completed orders will appear here</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;