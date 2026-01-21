import React, { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const OrderList = ({ orders, onViewOrder, onUpdateStatus, onProcessPayment, onRefresh, onUpdatePriority, onTransfer, onAddItems, activeTab, setActiveTab }) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    PENDING: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
    PREPARING: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    READY: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    DELIVERED: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    CANCELLED: 'bg-gradient-to-r from-red-500 to-red-700 text-white',
    PAID: 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'
  };

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar with Tab Buttons */}
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-all transform hover:scale-105 shadow-lg ${
                activeTab === 'list' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'bg-white/30 text-gray-900 hover:bg-white/40'
              }`}
            >
              <span>📋 Orders</span>
            </button>
            
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-all transform hover:scale-105 shadow-lg ${
                activeTab === 'create' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                  : 'bg-white/30 text-gray-900 hover:bg-white/40'
              }`}
            >
              <span>➕ New Order</span>
            </button>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/30 backdrop-blur-md border border-white/40 text-gray-900 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
            >
              <option value="ALL">🍽️ All Orders</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="PREPARING">👨🍳 Preparing</option>
              <option value="READY">✅ Ready</option>
              <option value="DELIVERED">🚀 Delivered</option>
              <option value="CANCELLED">❌ Cancelled</option>
              <option value="PAID">💰 Paid</option>
            </select>
          </div>
          
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-6 py-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-all transform hover:scale-105 border border-white/40 font-medium"
          >
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side - Order List */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden lg:col-span-1 self-start sticky top-6">
          <div className="p-4 border-b border-white/30">
            <h3 className="text-xl font-bold text-gray-900">📋 Orders ({filteredOrders.length})</h3>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-300px)] p-4 space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleOrderClick(order)}
                className={`bg-white/30 backdrop-blur-md rounded-xl p-4 cursor-pointer transition-all hover:bg-white/40 border ${
                  selectedOrder?._id === order._id ? 'border-purple-500 ring-2 ring-purple-500' : 'border-white/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                    <p className="text-xs text-gray-700">🪑 {order.tableNumber || 'N/A'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900">🍕 {order.items.length} items</span>
                  <span className="font-bold text-green-700">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🍽️</div>
                <p className="text-gray-900 font-medium">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Order Details */}
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden lg:col-span-2">
          {selectedOrder ? (
            <>
              <div className="p-4 border-b border-white/30">
                <h3 className="text-xl font-bold text-gray-900">📄 Order Details</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Customer Info & Order Items in Same Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30">
                    <h4 className="font-bold text-gray-900 mb-3">👤 Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-900"><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                      {selectedOrder.customerPhone && (
                        <p className="text-gray-900"><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                      )}
                      <p className="text-gray-900"><span className="font-medium">Table:</span> {selectedOrder.tableNumber || 'N/A'}</p>
                      {selectedOrder.mergedTableNumbers && selectedOrder.mergedTableNumbers.length > 0 && (
                        <p className="text-purple-700 font-medium">🔗 Merged: {selectedOrder.mergedTableNumbers.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30">
                    <h4 className="font-bold text-gray-900 mb-3">🍕 Order Items</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start text-sm bg-white/20 p-2 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.quantity}x {item.name}</p>
                            {item.variation && <p className="text-xs text-gray-700">Variation: {item.variation.name}</p>}
                          </div>
                          <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Status & Priority + Payment Info in Same Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Order Status & Priority */}
                  <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30">
                    <h4 className="font-bold text-gray-900 mb-3">⚙️ Order Management</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-900 block mb-1">Status</label>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => onUpdateStatus(selectedOrder._id, e.target.value)}
                          className={`w-full px-4 py-2 rounded-xl text-sm font-bold border-0 shadow-md ${statusColors[selectedOrder.status]}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PREPARING">Preparing</option>
                          <option value="READY">Ready</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="PAID">Paid</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-900 block mb-1">Priority</label>
                        <select
                          value={selectedOrder.priority || 'NORMAL'}
                          onChange={(e) => onUpdatePriority && onUpdatePriority(selectedOrder._id, e.target.value)}
                          className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-xl text-sm font-medium"
                        >
                          <option value="LOW">🟢 Low</option>
                          <option value="NORMAL">🟡 Normal</option>
                          <option value="HIGH">🟠 High</option>
                          <option value="URGENT">🔴 Urgent</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30">
                    <h4 className="font-bold text-gray-900 mb-3">💰 Payment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-xl font-bold text-green-700">{formatCurrency(selectedOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-900">Status:</span>
                        {selectedOrder.paymentDetails ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-bold">
                            ✓ {selectedOrder.paymentDetails.method}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full text-xs font-bold">
                            ⏳ Unpaid
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-xs">📅 {formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onViewOrder(selectedOrder)}
                    className="flex-1 p-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border border-white/40"
                  >
                    👁️ View
                  </button>
                  {selectedOrder.status !== 'PAID' && selectedOrder.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onAddItems && onAddItems(selectedOrder._id)}
                      className="flex-1 p-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border border-white/40"
                    >
                      ➕ Add
                    </button>
                  )}
                  {selectedOrder.tableId && selectedOrder.status !== 'PAID' && selectedOrder.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onTransfer(selectedOrder)}
                      className="flex-1 p-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border border-white/40"
                    >
                      🔄 Transfer
                    </button>
                  )}
                  {!selectedOrder.paymentDetails && (
                    <button
                      onClick={() => onProcessPayment(selectedOrder)}
                      className="flex-1 p-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border border-white/40"
                    >
                      💳 Pay
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-10">
              <div className="text-center">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-gray-900 font-medium text-lg">Select an order to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
