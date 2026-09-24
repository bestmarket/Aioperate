import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Booking, Service } from '../../types.ts';
import {
  CalendarCheck,
  Search,
  Clock,
  User,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  DollarSign,
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New booking state
  const [newBooking, setNewBooking] = useState({
    serviceId: '',
    serviceName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '2026-09-28',
    time: '14:00',
    durationMinutes: 60,
    price: 150,
  });

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadData = async () => {
    try {
      setLoading(true);
      const [bkList, srvList] = await Promise.all([
        api.getBookings(businessId),
        api.getServices(businessId),
      ]);
      setBookings(bkList);
      setServices(srvList);
      if (bkList.length > 0) setSelectedBooking(bkList[0]);
      if (srvList.length > 0) {
        setNewBooking((prev) => ({
          ...prev,
          serviceId: srvList[0].id,
          serviceName: srvList[0].name,
          price: srvList[0].price,
          durationMinutes: srvList[0].durationMinutes,
        }));
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [businessId]);

  const handleCreateBooking = async () => {
    try {
      await api.createBooking(businessId, newBooking);
      setShowAddModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const updated = await api.updateBooking(businessId, bookingId, { status });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      if (selectedBooking?.id === bookingId) setSelectedBooking(updated);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Appointments & VIP Bookings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI automatically coordinates calendar slots, collects deposits, and sends WhatsApp & calendar confirmations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Manual Booking</span>
        </button>
      </div>

      {/* Services Catalog Pill Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          Available Bookable Services & Consultations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {services.map((s) => (
            <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
              <div className="font-bold text-white">{s.name}</div>
              <div className="text-slate-400 text-[11px]">{s.description}</div>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-emerald-400 font-bold">${s.price}</span>
                <span className="text-slate-400">{s.durationMinutes} mins · Staff: {s.staff[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Table & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 font-semibold text-xs text-white">
            Upcoming Reserved Sessions
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Staff Specialist</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.map((b) => {
                  const isSelected = selectedBooking?.id === b.id;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-600/10' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-white">{b.customerName}</td>
                      <td className="px-4 py-3 text-slate-300">{b.serviceName}</td>
                      <td className="px-4 py-3 font-mono text-indigo-300">
                        {b.date} · {b.time}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{b.staffName}</td>
                      <td className="px-4 py-3 capitalize">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : b.status === 'completed'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Booking Card */}
        {selectedBooking ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">{selectedBooking.serviceName}</h3>
              <span className="text-emerald-400 font-bold font-mono">${selectedBooking.price}</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Client Details</span>
                <div className="font-semibold text-white">{selectedBooking.customerName}</div>
                <div className="text-slate-300">{selectedBooking.customerEmail}</div>
                <div className="text-slate-400">{selectedBooking.customerPhone}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Scheduled Slot</span>
                <div className="text-indigo-400 font-bold">{selectedBooking.date} at {selectedBooking.time}</div>
                <div className="text-slate-400 text-[11px]">{selectedBooking.durationMinutes} Minutes Session</div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Actions</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                    className="py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 font-medium"
                  >
                    Mark Attended
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                    className="py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-medium"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-xs text-slate-400 flex items-center justify-center">
            Select a booking to inspect details.
          </div>
        )}
      </div>

      {/* Manual Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Create Booking</h3>

            <div>
              <label className="text-slate-300 block mb-1">Customer Full Name</label>
              <input
                type="text"
                value={newBooking.customerName}
                onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Customer Email</label>
              <input
                type="email"
                value={newBooking.customerEmail}
                onChange={(e) => setNewBooking({ ...newBooking, customerEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Date</label>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Time</label>
                <input
                  type="time"
                  value={newBooking.time}
                  onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={!newBooking.customerName.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
