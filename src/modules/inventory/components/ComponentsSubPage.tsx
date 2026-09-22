import React, { useEffect, useState } from 'react';
import { ComponentCategory, ComponentItem, ComponentStatus } from '../../../types';
import { api } from '../../../lib/api';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Boxes,
  IndianRupee,
  Layers,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { AddComponentModal } from './AddComponentModal';

const CATEGORY_NAMES: Record<ComponentCategory, string> = {
  batteries: 'Battery Pack',
  motors: 'Motor & Drive',
  controllers: 'Controller & Inverter',
  chargers: 'Charger & Wallbox',
  brakes: 'Brakes & Suspension',
  tyres: 'Tyres & Wheels',
  electronics: 'Clusters & Wiring',
  accessories: 'Accessories',
  other: 'Other Spares',
};

export const ComponentsSubPage: React.FC = () => {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  async function loadComponents() {
    try {
      const list = await api.getComponents();
      setComponents(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComponents();
  }, []);

  const handleAdjustQuantity = async (id: string, delta: number) => {
    try {
      const updated = await api.adjustComponentQuantity(id, delta);
      setComponents((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Failed to adjust quantity', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from component inventory?`)) {
      return;
    }
    try {
      await api.deleteComponent(id);
      setComponents((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete component', err);
    }
  };

  const filteredComponents = components.filter((c) => {
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.sku.toLowerCase().includes(q) ||
      c.location_bin?.toLowerCase().includes(q) ||
      c.compatible_models.some((m) => m.toLowerCase().includes(q));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Calculate high-level summary metrics
  const totalSkus = components.length;
  const totalUnits = components.reduce((sum, c) => sum + (c.quantity || 0), 0);
  const lowStockCount = components.filter(
    (c) => c.status === 'low_stock' || (c.quantity <= c.min_reorder_level && c.quantity > 0)
  ).length;
  const totalValuation = components.reduce(
    (sum, c) => sum + (c.quantity || 0) * (c.unit_price || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Component Inventory KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Component SKUs
            </p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalSkus}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Units in Stock
            </p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalUnits}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Low Stock Alerts
            </p>
            <p
              className={`text-xl font-extrabold mt-0.5 ${
                lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'
              }`}
            >
              {lowStockCount}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Stock Valuation
            </p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              ₹{totalValuation.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filters, and Add Component Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, component name, compatible model, or bin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="batteries">Battery Packs</option>
              <option value="motors">Motors & Drive</option>
              <option value="controllers">Controllers</option>
              <option value="chargers">Fast Chargers</option>
              <option value="brakes">Brakes & Suspension</option>
              <option value="tyres">Tyres & Wheels</option>
              <option value="electronics">Electronics & TFT</option>
              <option value="accessories">Accessories</option>
              <option value="other">Other Spares</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock Warning</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-all cursor-pointer ml-auto md:ml-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Add Component</span>
            </button>
          </div>
        </div>
      </div>

      {/* Components Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-16">
            <Cpu className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Components in Inventory</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Component stock is empty. Click "Add Component" to record battery packs, motors, chargers, or replacement spares.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-3.5 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Add First Component</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">SKU & Part Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Compatible Models</th>
                  <th className="py-3.5 px-4">Bin Location</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredComponents.map((c) => {
                  const isLow = c.quantity <= c.min_reorder_level && c.quantity > 0;
                  const isOut = c.quantity === 0;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      {/* SKU & Name */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {c.sku}
                          </span>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {CATEGORY_NAMES[c.category] || c.category}
                        </span>
                      </td>

                      {/* Compatible Models */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {c.compatible_models.map((m, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Bin Location */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {c.location_bin ? (
                          <span className="font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {c.location_bin}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Quantity with quick +/- adjustment */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAdjustQuantity(c.id, -1)}
                            disabled={c.quantity === 0}
                            title="Decrease Quantity"
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            -
                          </button>
                          <span
                            className={`font-bold text-sm min-w-[2rem] text-center ${
                              isOut
                                ? 'text-red-600'
                                : isLow
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {c.quantity}
                          </span>
                          <button
                            onClick={() => handleAdjustQuantity(c.id, 1)}
                            title="Increase Quantity"
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{c.unit_price.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Component"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Component Modal */}
      {showAddModal && (
        <AddComponentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadComponents}
        />
      )}
    </div>
  );
};
