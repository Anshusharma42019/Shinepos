import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown, FiFilter, FiRefreshCw } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TYPE_CONFIG = {
  restock:         { label: 'Restock',         color: 'text-green-400',  bg: 'bg-green-500/20',  icon: FiArrowUp },
  order_deduction: { label: 'Order Deduction', color: 'text-red-400',    bg: 'bg-red-500/20',    icon: FiArrowDown },
  wastage:         { label: 'Wastage',          color: 'text-orange-400', bg: 'bg-orange-500/20', icon: FiArrowDown },
};

const InventoryStockLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ type: '', from: '', to: '' });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.from) params.append('from', filter.from);
      if (filter.to)   params.append('to', filter.to);
      const res = await fetch(`${API_BASE_URL}/api/inventory/stock-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setLogs((await res.json()).logs || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const summary = logs.reduce((acc, log) => {
    if (log.type === 'restock')         acc.restocked  += log.quantity;
    if (log.type === 'order_deduction') acc.deducted   += Math.abs(log.quantity);
    if (log.type === 'wastage')         acc.wasted     += Math.abs(log.quantity);
    return acc;
  }, { restocked: 0, deducted: 0, wasted: 0 });

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Restocked', value: summary.restocked.toFixed(2), color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
          { label: 'Used in Orders',  value: summary.deducted.toFixed(2),  color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/30' },
          { label: 'Wasted',          value: summary.wasted.toFixed(2),    color: 'text-orange-400',bg: 'bg-orange-500/10 border-orange-500/30' },
        ].map(card => (
          <div key={card.label} className={`rounded-2xl border p-5 ${card.bg} bg-white/5 backdrop-blur-md`}>
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Type</label>
          <select value={filter.type} onChange={e => setFilter(p => ({ ...p, type: e.target.value }))}
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="">All</option>
            <option value="restock">Restock</option>
            <option value="order_deduction">Order Deduction</option>
            <option value="wastage">Wastage</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">From</label>
          <input type="date" value={filter.from} onChange={e => setFilter(p => ({ ...p, from: e.target.value }))}
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">To</label>
          <input type="date" value={filter.to} onChange={e => setFilter(p => ({ ...p, to: e.target.value }))}
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
        </div>
        <button onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
          <FiFilter size={14} /> Apply
        </button>
        <button onClick={() => { setFilter({ type: '', from: '', to: '' }); setTimeout(fetchLogs, 0); }}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors">
          <FiRefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/20">
          <h3 className="text-white font-semibold">Stock Movement Logs ({logs.length})</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No logs found for the selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.restock;
                  const Icon = cfg.icon;
                  const isPositive = log.quantity > 0;
                  return (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{log.itemName || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{log.quantity}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{log.note || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryStockLog;
