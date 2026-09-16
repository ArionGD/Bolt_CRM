import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Vehicle, VehicleModel, VehicleStatus } from '../types';
import {
  Car,
  Plus,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Calendar,
  MapPin,
  X,
  Gauge,
  Sparkles,
} from 'lucide-react';

export const Inventory: React.FC = () => {
  const { role } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding physical stock unit
  const [formModelId, setFormModelId] = useState('');
  const [formVin, setFormVin] = useState('');
  const [formColour, setFormColour] = useState('Pearl White');
  const [formYear, setFormYear] = useState('2026');
  const [formCondition, setFormCondition] = useState<'new' | 'demo' | 'used'>('new');
  const [formStatus, setFormStatus] = useState<VehicleStatus>('in_stock');
  const [formPurchasePrice, setFormPurchasePrice] = useState('');
  const [formAskingPrice, setFormAskingPrice] = useState('');
  const [formOdometer, setFormOdometer] = useState('0');
  const [formLocation, setFormLocation] = useState('Showroom Floor');
  const [formArrivalDate, setFormArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  const canSeePurchasePrice = role === 'admin';

  async function loadData() {
    try {
      const [vList, mList] = await Promise.all([api.getVehicles(), api.getModels()]);
      setVehicles(vList);
      setModels(mList);
      if (mList.length > 0 && !formModelId) {
        setFormModelId(mList[0].id);
        setFormAskingPrice(String(mList[0].ex_showroom_price + 3000));
        setFormPurchasePrice(String(Math.round(mList[0].ex_showroom_price * 0.9)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleModelChange = (mId: string) => {
    setFormModelId(mId);
    const m = models.find((mod) => mod.id === mId);
    if (m) {
      setFormAskingPrice(String(m.ex_showroom_price + 3000));
      setFormPurchasePrice(String(Math.round(m.ex_showroom_price * 0.9)));
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVin.trim()) {
      alert('VIN / Chassis number is required!');
      return;
    }
    try {
      await api.addVehicle({
        model_id: formModelId,
        vin: formVin.toUpperCase().trim(),
        colour: formColour,
        manufacture_year: parseInt(formYear) || 2026,
        condition: formCondition,
        status: formStatus,
        purchase_price: formPurchasePrice ? parseFloat(formPurchasePrice) : undefined,
        asking_price: parseFloat(formAskingPrice) || 82000,
        odometer_km: parseInt(formOdometer) || 0,
        location: formLocation,
        arrival_date: formArrivalDate,
        notes: formNotes,
      });
      setShowAddModal(false);
      setFormVin('');
      setFormNotes('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add vehicle');
    }
  };

  const handleQuickStatusChange = async (vId: string, newStatus: VehicleStatus) => {
    try {
      await api.updateVehicle(vId, { status: newStatus });
      setVehicles((prev) =>
        prev.map((v) => (v.id === vId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = vehicles.filter((v) => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.vin.toLowerCase().includes(q) ||
      (v.brand && v.brand.toLowerCase().includes(q)) ||
      (v.model_name && v.model_name.toLowerCase().includes(q)) ||
      v.colour.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getAgeDays = (arrival?: string, created?: string) => {
    const d = arrival ? new Date(arrival) : created ? new Date(created) : new Date();
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Physical EV Inventory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {vehicles.length} units
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Track actual VIN chassis numbers on the showroom floor and transit yard.</p>
        </div>
        {role !== 'accounts' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Stock Unit</span>
          </button>
        )}
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by VIN, Model, Colour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'in_stock', 'in_transit', 'reserved', 'delivered', 'sold'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading showroom stock...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-base font-semibold text-slate-700">No matching vehicles found</p>
            <p className="text-xs mt-1">Try changing your search keywords or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Vehicle / Specs</th>
                  <th className="py-3 px-4">VIN (Chassis)</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Stock Age</th>
                  {canSeePurchasePrice && (
                    <th className="py-3 px-4 text-sky-800 bg-sky-50/50">
                      <div className="flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Dealer Cost</span>
                      </div>
                    </th>
                  )}
                  <th className="py-3 px-4">Asking Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((v) => {
                  const ageDays = getAgeDays(v.arrival_date, v.created_at);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Vehicle Model & Colour */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {v.brand} {v.model_name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {v.variant || 'Standard'} • <span className="text-slate-700 font-medium">{v.colour}</span>
                        </div>
                      </td>

                      {/* VIN */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {v.vin}
                        {v.odometer_km ? (
                          <div className="text-[10px] text-slate-400 font-sans">{v.odometer_km} km</div>
                        ) : null}
                      </td>

                      {/* Condition */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            v.condition === 'new'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : v.condition === 'demo'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {v.condition}
                        </span>
                      </td>

                      {/* Status + Quick Changer */}
                      <td className="py-3.5 px-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleQuickStatusChange(v.id, e.target.value as VehicleStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            v.status === 'in_stock'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : v.status === 'in_transit'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : v.status === 'reserved'
                              ? 'bg-slate-200 text-slate-800 border-slate-300'
                              : v.status === 'delivered'
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="in_transit">In Transit</option>
                          <option value="reserved">Reserved</option>
                          <option value="delivered">Delivered</option>
                          <option value="sold">Sold</option>
                        </select>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{v.location || 'Showroom'}</span>
                        </div>
                      </td>

                      {/* Stock Age */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ageDays < 30
                              ? 'bg-emerald-50 text-emerald-700'
                              : ageDays < 60
                              ? 'bg-sky-50 text-sky-700'
                              : ageDays < 90
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-slate-200 text-slate-900 font-extrabold'
                          }`}
                        >
                          {ageDays}d old
                        </span>
                      </td>

                      {/* Dealer Purchase Price (Admin Only) */}
                      {canSeePurchasePrice && (
                        <td className="py-3.5 px-4 bg-sky-50/30 font-semibold text-sky-900">
                          {v.purchase_price
                            ? `₹${v.purchase_price.toLocaleString('en-IN')}`
                            : '—'}
                        </td>
                      )}

                      {/* Asking Price */}
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                        ₹{v.asking_price.toLocaleString('en-IN')}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/crm/inventory/${v.id}`}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Details</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Add Physical Vehicle to Stock</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="mt-4 space-y-4 text-xs">
              {/* Model selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Model Catalogue *</label>
                <select
                  value={formModelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.model_name} — {m.variant || 'Standard'} (Ex-Showroom ₹{m.ex_showroom_price.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* VIN & Colour */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">VIN / Chassis Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAT612345N2P8812"
                    value={formVin}
                    onChange={(e) => setFormVin(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Colour *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pearl White / Metallic Grey / Green & Yellow"
                    value={formColour}
                    onChange={(e) => setFormColour(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Condition, Year & Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="new">New</option>
                    <option value="demo">Demo</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="in_transit">In Transit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Asking Price & Dealer Purchase Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Showroom Asking Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formAskingPrice}
                    onChange={(e) => setFormAskingPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                {canSeePurchasePrice ? (
                  <div>
                    <label className="block font-bold text-sky-900 mb-1 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                      <span>Dealer Cost (Admin Only)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Showroom purchase cost"
                      value={formPurchasePrice}
                      onChange={(e) => setFormPurchasePrice(e.target.value)}
                      className="w-full p-2.5 bg-sky-50/50 border border-sky-200 rounded-xl font-semibold text-sky-900"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Dealer Cost</label>
                    <input
                      type="text"
                      disabled
                      value="Restricted to Admin"
                      className="w-full p-2.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl cursor-not-allowed italic"
                    />
                  </div>
                )}
              </div>

              {/* Location & Arrival Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Showroom Floor / Yard Lot A"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arrival Date</label>
                  <input
                    type="date"
                    value={formArrivalDate}
                    onChange={(e) => setFormArrivalDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Accessories Fitted</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Special accessories or inspection remarks..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 shadow-sm"
                >
                  Save Vehicle to Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
