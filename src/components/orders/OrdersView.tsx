import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Order } from '../../types.ts';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  ExternalLink,
  DollarSign,
  CreditCard,
} from 'lucide-react';

interface OrdersViewProps {
  onNavigateToShipping?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onNavigateToShipping }) => {
  const { activeBusiness } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders(businessId);
      setOrders(data);
      if (data.length > 0) setSelectedOrder(data[0]);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [businessId]);

  const handleUpdateStatus = async (
    orderId: string,
    updates: Partial<Order>
  ) => {
    try {
      const updated = await api.updateOrder(businessId, orderId, updates);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) setSelectedOrder(updated);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Sales Orders & Fulfillment</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Orders generated autonomously by your AI Employee and website checkout links.
          </p>
        </div>

        {onNavigateToShipping && (
          <button
            onClick={onNavigateToShipping}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            <Truck className="w-4 h-4 text-indigo-400" />
            <span>Generate Shipping Labels</span>
          </button>
        )}
      </div>

      {/* 2-Column Split: Orders Table & Order Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Fulfillment</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-600/10' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-white">{ord.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-400">{ord.items.length} item(s)</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {ord.paymentStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">
                        <span className="text-slate-300">{ord.fulfillmentStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-white">
                        ${ord.total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detail Inspector */}
        {selectedOrder ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{selectedOrder.id}</h3>
                <span className="text-[11px] text-slate-400">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedOrder.paymentStatus === 'paid'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {selectedOrder.paymentStatus}
              </span>
            </div>

            {/* Customer Details */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Customer</span>
              <div className="font-semibold text-white">{selectedOrder.customerName}</div>
              <div className="text-slate-300">{selectedOrder.customerEmail}</div>
              <div className="text-slate-400 text-[11px] mt-1">{selectedOrder.shippingAddress}</div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Ordered Items</span>
              <div className="space-y-1.5">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-white">{it.name}</div>
                      <div className="text-[10px] text-slate-400">Qty: {it.quantity}</div>
                    </div>
                    <div className="font-mono text-emerald-400 font-bold">
                      ${(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono">${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
                <span>Total</span>
                <span className="font-mono text-emerald-400">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Fulfillment controls */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Update Fulfillment
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, { fulfillmentStatus: 'shipped' })}
                  className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
                >
                  Mark Shipped
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, { fulfillmentStatus: 'delivered' })}
                  className="py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 font-medium"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-xs text-slate-400 flex items-center justify-center">
            Select an order to inspect.
          </div>
        )}
      </div>
    </div>
  );
};
