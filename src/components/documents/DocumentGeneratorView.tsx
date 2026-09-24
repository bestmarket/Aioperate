import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  DollarSign,
  Send,
  Building,
  User,
  Trash2,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { DocumentRecord } from '../../types.ts';

export const DocumentGeneratorView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // New Document modal form state
  const [newType, setNewType] = useState<'invoice' | 'receipt' | 'quote' | 'proposal'>('invoice');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([
    { description: 'Handcrafted Bespoke Dinner Suit', quantity: 1, unitPrice: 1850 },
  ]);
  const [notes, setNotes] = useState('Payment due within 14 days. Complimentary fitting adjustments included.');

  const fetchDocs = async () => {
    if (!activeBusiness?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${activeBusiness.id}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
        if (data.length > 0 && !selectedDoc) {
          setSelectedDoc(data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load documents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [activeBusiness?.id]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness?.id || !clientName.trim()) return;

    try {
      const res = await fetch(`/api/documents/${activeBusiness.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newType,
          docNumber: `${newType.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
          clientName,
          clientEmail,
          currency: activeBusiness.currency || 'USD',
          items,
          notes,
          status: newType === 'receipt' ? 'paid' : 'sent',
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setDocuments((prev) => [created, ...prev]);
        setSelectedDoc(created);
        setCreating(false);
        setClientName('');
        setClientEmail('');
      }
    } catch (e) {
      console.error('Failed to create document:', e);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!activeBusiness?.id) return;
    try {
      const res = await fetch(`/api/documents/${activeBusiness.id}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
        if (selectedDoc?.id === id) {
          setSelectedDoc(updated);
        }
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Documents & Invoicing</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Invoices, Quotes & Receipts
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Generate professional client invoices, tax receipts, and bespoke price quotes with automatic tax computations and payment tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreating(!creating)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{creating ? 'Close Form' : 'New Invoice / Quote'}</span>
          </button>
        </div>
      </div>

      {/* Creation Modal / Inline Drawer */}
      {creating && (
        <form onSubmit={handleCreateDocument} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Draft New Commercial Document</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document Type</label>
              <select
                value={newType}
                onChange={(e: any) => setNewType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="invoice">Invoice</option>
                <option value="quote">Price Quote / Estimate</option>
                <option value="receipt">Official Payment Receipt</option>
                <option value="proposal">Commercial Proposal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Full Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., Alexander Sterling"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@corporate.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Line Items</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            {items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={it.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  placeholder="Item description / service"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                  placeholder="Qty"
                  className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-center"
                />
                <input
                  type="number"
                  step="0.01"
                  value={it.unitPrice}
                  onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                  placeholder="Price"
                  className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Terms & Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition-colors"
            >
              Issue Document
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Document List (Left) + Document Printable Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Selector (Left) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            All Records ({documents.length})
          </div>

          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedDoc?.id === doc.id
                  ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{doc.docNumber}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border ${
                    doc.status === 'paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : doc.status === 'sent'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="font-semibold text-white text-xs mt-1.5">{doc.clientName}</div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="capitalize">{doc.type}</span>
                <span className="font-bold text-white">${doc.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Printable Document Sheet (Right) */}
        <div className="lg:col-span-8">
          {selectedDoc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="text-xl font-extrabold text-white tracking-tight">
                    {activeBusiness?.name || 'Aura Atelier'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{activeBusiness?.contactEmail} • {activeBusiness?.location}</div>
                  <div className="text-xs text-slate-400">{activeBusiness?.website}</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {selectedDoc.type}
                  </span>
                  <div className="font-mono text-sm font-bold text-white mt-2">{selectedDoc.docNumber}</div>
                  <div className="text-xs text-slate-400">Date: {new Date(selectedDoc.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold uppercase tracking-wider text-slate-400 mb-1">Billed To</div>
                  <div className="font-semibold text-white text-sm">{selectedDoc.clientName}</div>
                  <div className="text-slate-400">{selectedDoc.clientEmail}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold uppercase tracking-wider text-slate-400 mb-1">Status & Terms</div>
                  <div className="flex items-center justify-end gap-1.5">
                    <select
                      value={selectedDoc.status}
                      onChange={(e) => handleStatusChange(selectedDoc.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid (Verified)</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>
                  {selectedDoc.dueDate && (
                    <div className="text-[11px] text-slate-400 mt-1">Due: {selectedDoc.dueDate}</div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5">Item Description</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedDoc.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-3 text-slate-200">{it.description}</td>
                        <td className="py-3 text-center text-slate-400">{it.quantity}</td>
                        <td className="py-3 text-right text-slate-400">${it.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right font-semibold text-white">
                          ${(it.quantity * it.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>${selectedDoc.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sales Tax (8.875%):</span>
                    <span>${selectedDoc.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Total Amount:</span>
                    <span className="text-amber-400">${selectedDoc.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedDoc.notes && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Notes & Terms: </span>
                  {selectedDoc.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Select or create a document to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
