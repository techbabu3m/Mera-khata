import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { db } from '../services/db';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  ArrowUpDown,
  X,
  CheckCircle2
} from 'lucide-react';

export const ProductsScreen: React.FC = () => {
  const { products, refreshData, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [unit, setUnit] = useState('pcs');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    db.addProduct(
      name,
      category,
      parseFloat(sellingPrice) || 0,
      parseFloat(costPrice) || 0,
      parseInt(stockQuantity) || 0,
      unit
    );
    refreshData();
    setShowAddModal(false);
    showToast(`Product "${name}" added to inventory!`);
    setName('');
    setSellingPrice('');
    setCostPrice('');
    setStockQuantity('');
  };

  const handleQuickStockChange = (prod: Product, delta: number) => {
    db.updateStock(prod.id, delta);
    refreshData();
    showToast(`Stock updated: ${prod.stockQuantity + delta} ${prod.unit}`);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-600" />
            <span>Product Inventory & Stock</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock tracking with automatic Babu low-stock alerts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search products by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => {
          const isLowStock = p.stockQuantity <= p.minStockAlert;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between transition ${
                isLowStock ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {p.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{p.name}</h3>
                  </div>

                  {isLowStock && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Low Stock</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Selling Price</span>
                    <span className="text-base font-black text-slate-900">₹{p.sellingPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Cost Price</span>
                    <span className="text-xs font-semibold text-slate-600">₹{p.costPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Stock Bar & Stepper */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {p.stockQuantity} {p.unit}
                  </span>
                  <span className="text-[10px] text-slate-400">Alert at: {p.minStockAlert} {p.unit}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleQuickStockChange(p, -1)}
                    className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleQuickStockChange(p, 1)}
                    className="w-7 h-7 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Add Inventory Product</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Linen Slim Fit Shirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Men Wear / Women Wear"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  placeholder="1200"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  placeholder="750"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Stock Qty</label>
                <input
                  type="number"
                  placeholder="15"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="metre">metre</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
