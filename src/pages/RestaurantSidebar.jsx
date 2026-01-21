import React, { useState } from 'react';

const RestaurantSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tables', label: 'Tables', icon: '🪑' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'subscription', label: 'Subscription', icon: '💳' }
  ];

  const orderSubItems = [
    { id: 'orders', label: 'Orders', icon: '📝' },
    { id: 'kot', label: 'Kitchen (KOT)', icon: '🍳' }
  ];

  const inventorySubItems = [
    { id: 'inventory', label: 'Inventory List', icon: '📋' },
    { id: 'add-inventory', label: 'Add Item', icon: '➕' }
  ];

  const menuSubItems = [
    { id: 'category', label: 'Category', icon: '🏷️' },
    { id: 'menu', label: 'Menu Items', icon: '🍔' },
    { id: 'addons', label: 'Addons', icon: '✨' },
    { id: 'variations', label: 'Variations', icon: '🎯' }
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="w-64 h-screen flex flex-col relative overflow-hidden">
      {/* Background with blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20"
        style={{ backdropFilter: 'blur(100px)' }}
      />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl border-r border-white/20" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">🍽️</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Restaurant POS</h2>
              <p className="text-xs text-gray-700">{user.name || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-white/40 backdrop-blur-lg text-gray-900 shadow-lg border border-white/50'
                  : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* Orders Dropdown */}
          <div className="pt-2">
            <button
              onClick={() => setOrderOpen(!orderOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                orderOpen ? 'bg-white/40 backdrop-blur-lg text-gray-900 border border-white/50' : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <span>Orders</span>
              </div>
              <span className={`text-xs transition-transform ${orderOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {orderOpen && (
              <div className="ml-6 mt-1 space-y-1 animate-slideIn">
                {orderSubItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveTab(subItem.id)}
                    className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === subItem.id
                        ? 'bg-white/40 backdrop-blur-lg text-gray-900 shadow-md border border-white/50'
                        : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Inventory Dropdown */}
          <div>
            <button
              onClick={() => setInventoryOpen(!inventoryOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                inventoryOpen ? 'bg-white/40 backdrop-blur-lg text-gray-900 border border-white/50' : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📦</span>
                <span>Inventory</span>
              </div>
              <span className={`text-xs transition-transform ${inventoryOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {inventoryOpen && (
              <div className="ml-6 mt-1 space-y-1 animate-slideIn">
                {inventorySubItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveTab(subItem.id)}
                    className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === subItem.id
                        ? 'bg-white/40 backdrop-blur-lg text-gray-900 shadow-md border border-white/50'
                        : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu Dropdown */}
          <div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                menuOpen ? 'bg-white/40 backdrop-blur-lg text-gray-900 border border-white/50' : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🍕</span>
                <span>Menu</span>
              </div>
              <span className={`text-xs transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {menuOpen && (
              <div className="ml-6 mt-1 space-y-1 animate-slideIn">
                {menuSubItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveTab(subItem.id)}
                    className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === subItem.id
                        ? 'bg-white/40 backdrop-blur-lg text-gray-900 shadow-md border border-white/50'
                        : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20 space-y-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-white/40 backdrop-blur-lg text-gray-900 shadow-lg border border-white/50'
                : 'text-gray-800 hover:bg-white/20 backdrop-blur-md border border-transparent'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span>Settings</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg transition-all transform hover:scale-105"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSidebar;
