import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Order } from '../../types.ts';
import {
  Truck,
  Printer,
  Package,
  CheckCircle2,
  ExternalLink,
  Barcode,
  Search,
  Send,
  Sparkles,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

export const ShippingLabelsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState('FedEx Priority');
  const [trackingNumber, setTrackingNumber] = useState('AURA-FEDEX-94821');
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getOrders(businessId);
        setOrders(data);
        if (data.length > 0) {
          setSelectedOrder(data[0]);
          if (data[0].carrier) setCarrier(data[0].carrier);
          if (data[0].trackingNumber) setTrackingNumber(data[0].trackingNumber);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    }
    load();
  }, [businessId]);

  const handleSelectOrder = (ord: Order) => {
    setSelectedOrder(ord);
    setCarrier(ord.carrier || 'FedEx Priority');
    setTrackingNumber(ord.trackingNumber || `AURA-FDX-${ord.id.replace(/\D/g, '') || '94821'}`);
    setDispatchSuccess(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDispatchShipment = async () => {
    if (!selectedOrder) return;
    try {
      setDispatching(true);
      const updated = await api.updateOrder(businessId, selectedOrder.id, {
        carrier,
        trackingNumber,
        fulfillmentStatus: 'shipped',
      });
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
      setSelectedOrder(updated);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to dispatch shipment:', err);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Shipping & Fulfillment Labels</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold">
              4x6 Thermal Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Generate standard 4x6 thermal shipping labels, assign courier tracking numbers, and automatically notify customers on WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label</span>
          </button>

          <button
            onClick={handleDispatchShipment}
            disabled={dispatching || selectedOrder?.fulfillmentStatus === 'shipped'}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{dispatching ? 'Dispatching...' : selectedOrder?.fulfillmentStatus === 'shipped' ? 'Dispatched' : 'Confirm Dispatch & Notify'}</span>
          </button>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Order <strong>{selectedOrder?.id}</strong> marked as <strong>Shipped</strong>. Automated tracking dispatched to {selectedOrder?.customerPhone || selectedOrder?.customerEmail} via WhatsApp.
            </span>
          </div>
          <span className="font-mono font-bold text-[11px]">{trackingNumber}</span>
        </div>
      )}

      {/* 2-Column Split: Select Order & Label Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Orders Selection */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-xs shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Select Order for Fulfillment
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{orders.length} orders total</span>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {orders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <button
                  key={ord.id}
                  onClick={() => handleSelectOrder(ord)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{ord.id}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-semibold uppercase ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{ord.customerName} · {ord.shippingAddress}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${ord.total.toFixed(2)}</span>
                    <span className={`text-[10px] block capitalize font-medium mt-0.5 ${
                      ord.fulfillmentStatus === 'shipped' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {ord.fulfillmentStatus}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Carrier Network</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="FedEx Priority">FedEx Priority Overnight</option>
                <option value="DHL Express Worldwide">DHL Express Worldwide</option>
                <option value="UPS Next Day Air">UPS Next Day Air</option>
                <option value="USPS Priority Mail">USPS Priority Mail</option>
              </select>
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Courier Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right: Printable Shipping Label Visual Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center shadow-sm">
          <div className="w-full max-w-sm bg-white text-slate-950 rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs border-2 border-slate-950">
            {/* Carrier Banner */}
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <span className="font-extrabold text-base tracking-tighter uppercase">{carrier}</span>
              <span className="font-bold text-xs bg-slate-950 text-white px-2 py-0.5 rounded">PRIORITY 1</span>
            </div>

            {/* From Address */}
            <div className="text-[11px] leading-tight">
              <div className="font-bold uppercase tracking-wider text-[9px] text-slate-500">SHIPPER / ORIGIN:</div>
              <div className="font-bold text-slate-950">{activeBusiness?.name || 'AURA ATELIER & COUTURE'}</div>
              <div>{activeBusiness?.location || '450 Madison Avenue'}</div>
              <div>New York, NY 10022</div>
            </div>

            {/* To Address */}
            <div className="border-t-2 border-slate-950 pt-2 text-[12px] leading-tight">
              <div className="font-bold uppercase tracking-wider text-[9px] text-slate-500">DELIVER TO:</div>
              <div className="font-bold text-sm uppercase text-slate-950">{selectedOrder?.customerName || 'ALEXANDER WRIGHT'}</div>
              <div>{selectedOrder?.shippingAddress || '885 2nd Avenue, Penthouse B'}</div>
              <div className="font-bold">NEW YORK, NY 10017</div>
            </div>

            {/* Barcode Simulator */}
            <div className="border-t-2 border-slate-950 pt-3 text-center space-y-1">
              <div className="h-14 bg-slate-950 flex items-center justify-center text-white text-[10px] tracking-widest font-mono select-none">
                ||||| | |||||||| |||| | ||||||||||| ||||||| | ||||||
              </div>
              <div className="text-[11px] font-bold tracking-widest">{trackingNumber}</div>
            </div>

            <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[10px] text-slate-600">
              <span>Order: {selectedOrder?.id}</span>
              <span>Weight: 3.4 LBS</span>
              <span className="font-bold uppercase">{selectedOrder?.fulfillmentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
