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
} from 'lucide-react';

export const ShippingLabelsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState('DHL Express Worldwide');
  const [trackingNumber, setTrackingNumber] = useState('1Z9999999999999999');

  const businessId = activeBusiness?.id || 'biz_aura_001';

  useEffect(() => {
    async function load() {
      const data = await api.getOrders(businessId);
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
    }
    load();
  }, [businessId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Shipping & Fulfillment Labels</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate 4x6 standard thermal & PDF shipping labels with automated tracking dispatched to customer WhatsApp.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print Thermal Label (4x6)</span>
        </button>
      </div>

      {/* 2-Column Split: Select Order & Label Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Orders Selection */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Select Order to Generate Label</h3>

          <div className="space-y-2">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedOrder?.id === ord.id
                    ? 'border-indigo-500 bg-indigo-600/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold font-mono text-white">{ord.id}</div>
                  <div className="text-[11px] text-slate-400">{ord.customerName} · {ord.shippingAddress}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">${ord.total.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 block capitalize">{ord.fulfillmentStatus}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Carrier Network</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="DHL Express Worldwide">DHL Express Worldwide</option>
                <option value="FedEx Priority Overnight">FedEx Priority</option>
                <option value="UPS Next Day Air">UPS Next Day Air</option>
                <option value="USPS Priority Mail">USPS Priority Mail</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Assigned Tracking #</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right: Printable Shipping Label Visual Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-white text-slate-950 rounded-xl p-5 shadow-2xl space-y-4 font-mono text-xs border border-slate-200">
            {/* Carrier Banner */}
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
              <span className="font-extrabold text-base tracking-tighter uppercase">{carrier}</span>
              <span className="font-bold text-xs bg-slate-950 text-white px-2 py-0.5 rounded">PRIORITY</span>
            </div>

            {/* From Address */}
            <div className="text-[11px] leading-tight">
              <div className="font-bold uppercase tracking-wider text-[9px] text-slate-500">FROM / SHIPPER:</div>
              <div className="font-bold">{activeBusiness?.name || 'AURA ATELIER'}</div>
              <div>{activeBusiness?.location || '100 Montgomery St, Suite 1400'}</div>
              <div>San Francisco, CA 94104</div>
            </div>

            {/* To Address */}
            <div className="border-t-2 border-slate-950 pt-2 text-[12px] leading-tight">
              <div className="font-bold uppercase tracking-wider text-[9px] text-slate-500">SHIP TO:</div>
              <div className="font-bold text-sm uppercase">{selectedOrder?.customerName || 'VALUED CLIENT'}</div>
              <div>{selectedOrder?.shippingAddress || '10880 Wilshire Blvd, Suite 2100'}</div>
              <div className="font-bold">LOS ANGELES, CA 90024</div>
            </div>

            {/* Barcode Simulator */}
            <div className="border-t-2 border-slate-950 pt-3 text-center space-y-1">
              <div className="h-14 bg-slate-950 flex items-center justify-center text-white text-[10px] tracking-widest font-mono">
                ||||| | |||||||| |||| | ||||||||||| ||||||| | ||||||
              </div>
              <div className="text-[11px] font-bold tracking-widest">{trackingNumber}</div>
            </div>

            <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[10px] text-slate-600">
              <span>Order: {selectedOrder?.id}</span>
              <span>Weight: 3.4 LBS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
