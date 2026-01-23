import React, { useState } from 'react';
import { FiPlus, FiEye, FiClipboard, FiRefreshCw, FiArchive, FiList } from 'react-icons/fi';
import OrderList from './OrderList';
import CreateOrder from './CreateOrder';
import OrderDetails from './OrderDetails';
import OrderHistory from './OrderHistory';
import PaymentModal from '../Payment/PaymentModal';
import TransferModal from './TransferModal';
import AddNewOrder from '../AddNewOrder';
import { useOrders } from './hooks/useOrders';

const Order = () => {
  const [showAddItems, setShowAddItems] = useState(null);
  const {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    selectedOrder,
    setSelectedOrder,
    showPaymentModal,
    setShowPaymentModal,
    showTransferModal,
    setShowTransferModal,
    fetchOrders,
    handleCreateOrder,
    handleUpdateStatus,
    handleUpdatePriority,
    handleProcessPayment,
    handleViewOrder,
    handlePaymentClick,
    handleTransferClick,
    handleTransferSuccess
  } = useOrders();

  const handleAddItems = (orderId) => {
    console.log('handleAddItems called with orderId:', orderId);
    setShowAddItems(orderId);
  };

  const handleAddItemsClose = () => {
    setShowAddItems(null);
    fetchOrders();
    setActiveTab('list'); // Redirect to orders page
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl mb-6 animate-slideIn">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Persistent Navigation Header */}
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-colors ${
                  activeTab === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-white/30 text-gray-900 hover:bg-white/40'
                }`}
              >
                <span><FiClipboard className="inline mr-2" />Orders</span>
              </button>
              
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-colors ${
                  activeTab === 'create' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-white/30 text-gray-900 hover:bg-white/40'
                }`}
              >
                <span><FiPlus className="inline mr-2" />New Order</span>
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                    : 'bg-white/30 text-gray-900 hover:bg-white/40'
                }`}
              >
                <span><FiArchive className="inline mr-2" />History</span>
              </button>
              
              <select
                className="bg-white/30 backdrop-blur-md border border-white/40 text-gray-900 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              >
                <option value="ALL"><FiList className="inline mr-1" />All Orders</option>
                <option value="PENDING">⏳ Pending</option>
                <option value="PREPARING">👨🍳 Preparing</option>
                <option value="READY">✅ Ready</option>
                <option value="DELIVERED">🚀 Delivered</option>
                <option value="CANCELLED">❌ Cancelled</option>
                <option value="PAID">💰 Paid</option>
              </select>
            </div>
            
            <button
              onClick={fetchOrders}
              className="flex items-center space-x-2 px-6 py-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors font-medium"
            >
              <span><FiRefreshCw className="inline mr-2" />Refresh</span>
            </button>
          </div>
        </div>

        {!loading && (
          <>
            {activeTab === 'list' && (
              <div className="animate-fadeIn">
                <OrderList
                  orders={orders}
                  onViewOrder={handleViewOrder}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePriority={handleUpdatePriority}
                  onProcessPayment={handlePaymentClick}
                  onAddItems={handleAddItems}
                  onTransfer={handleTransferClick}
                  onRefresh={fetchOrders}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  showNavigation={false}
                />
              </div>
            )}

            {activeTab === 'create' && (
              <div className="animate-fadeIn">
                <CreateOrder
                  onCreateOrder={handleCreateOrder}
                  onCancel={() => setActiveTab('list')}
                />
              </div>
            )}

            {activeTab === 'details' && selectedOrder && (
              <OrderDetails
                order={selectedOrder}
                onUpdateStatus={handleUpdateStatus}
                onProcessPayment={handlePaymentClick}
                onBack={() => setActiveTab('list')}
              />
            )}

            {activeTab === 'history' && (
              <div className="animate-fadeIn">
                <OrderHistory />
              </div>
            )}

            {showPaymentModal && selectedOrder && (
              <PaymentModal
                order={selectedOrder}
                onProcessPayment={handleProcessPayment}
                onClose={() => setShowPaymentModal(false)}
              />
            )}

            {showAddItems && (
              <div>
                <p>Debug: showAddItems = {showAddItems}</p>
                <AddNewOrder
                  orderId={showAddItems}
                  onClose={handleAddItemsClose}
                />
              </div>
            )}

            {showTransferModal && selectedOrder && (
              <TransferModal
                order={selectedOrder}
                onClose={() => {
                  setShowTransferModal(false);
                  setSelectedOrder(null);
                }}
                onSuccess={handleTransferSuccess}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Order;