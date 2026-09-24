import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Product } from '../../types.ts';
import {
  Package,
  Plus,
  Search,
  Tag,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 150,
    sku: '',
    inventory: 20,
    category: 'Suits & Jackets',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'],
  });

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(businessId);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [businessId]);

  const handleCreateProduct = async () => {
    try {
      await api.createProduct(businessId, newProduct);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        description: '',
        price: 150,
        sku: '',
        inventory: 20,
        category: 'Suits & Jackets',
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'],
      });
      loadProducts();
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(businessId, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Product Catalog & Live Stock</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Your AI Employee references this live catalog to answer questions, recommend matches, and create instant customer orders.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title, SKU, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="h-44 bg-slate-950 relative overflow-hidden">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-md border border-slate-700">
                  {prod.inventory > 0 ? `${prod.inventory} in stock` : 'Out of stock'}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                    {prod.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{prod.sku}</span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-white">
                    ${prod.salePrice || prod.price}
                  </span>
                  {prod.salePrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ${prod.price}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">{activeBusiness?.currency || 'USD'}</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
              <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Order Ready
              </span>
              <button
                onClick={() => handleDeleteProduct(prod.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Add New Product to Catalog</h3>

            <div>
              <label className="text-slate-300 block mb-1">Product Title</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Classic Charcoal Wool Blazer"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Price (USD)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Inventory Quantity</label>
                <input
                  type="number"
                  value={newProduct.inventory}
                  onChange={(e) => setNewProduct({ ...newProduct, inventory: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Description (used by AI to answer inquiries)</label>
              <textarea
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Crafted from Super 150s Merino wool with horn buttons..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={!newProduct.name.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
