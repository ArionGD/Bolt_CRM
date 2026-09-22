import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Vehicle, VehicleModel, VehicleStatus } from '../../types';
import {
  Car,
  Plus,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { AddStockModal } from './components/AddStockModal';
import { VehicleDetailSubPage } from './components/VehicleDetailSubPage';

export const InventoryMain: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // If viewing a single vehicle detail, render the subpage
  if (id) {
    return <VehicleDetailSubPage />;
  }

  const { role } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const canSeePurchasePrice = role === 'admin';

  async function loadData() {
    try {
      const [vList, mList] = await Promise.all([api.getVehicles(), api.getModels()]);
      setVehicles(vList);
      setModels(mList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (vehicleId: string, newStatus: VehicleStatus) => {
    try {
      await api.updateVehicle(vehicleId, { status: newStatus });
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const model = models.find((m) => m.id === v.model_id);
    const matchesType = typeFilter === 'all' || model?.body_type === typeFilter;
    const matchesSearch =
      v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.colour.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Add Stock Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vehicle Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Physical stock allocation with atomic database-level VIN protection.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Add Physical Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by VIN, model name, color, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="in_transit">In Transit</option>
              <option value="reserved">Reserved</option>
              <option value="delivered">Delivered</option>
              <option value="sold">Sold</option>
            </select>

            {/* EV Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="all">All EV Types</option>
              <option value="scooter">Electric Scooty (2W)</option>
              <option value="3w">Electric Rickshaw (3W)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Vehicles Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">VIN & Model</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Colour</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Ageing</th>
                  {canSeePurchasePrice && (
                    <th className="py-3.5 px-4 text-sky-900 bg-sky-50/50">Dealer Cost</th>
                  )}
                  <th className="py-3.5 px-4">Asking Price</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredVehicles.map((v) => {
                  const m = models.find((mod) => mod.id === v.model_id);
                  const ageDays = Math.floor(
                    (new Date().getTime() - new Date(v.arrival_date || v.created_at).getTime()) /
                      (1000 * 3600 * 24)
                  );
                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      {/* VIN & Model */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <Link
                            to={`/crm/inventory/${v.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 transition-colors"
                          >
                            {v.brand || m?.brand} {v.model_name || m?.model_name}
                          </Link>
                          <p className="font-mono text-[11px] text-slate-500">{v.vin}</p>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {m?.body_type === 'scooter' ? 'Scooty 2W' : 'E-Rickshaw 3W'}
                        </span>
                      </td>

                      {/* Colour */}
                      <td className="py-3.5 px-4 text-slate-700">{v.colour}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={v.status}
                          onChange={(e) =>
                            handleStatusChange(v.id, e.target.value as VehicleStatus)
                          }
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                            v.status === 'in_stock'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : v.status === 'in_transit'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : v.status === 'reserved'
                              ? 'bg-slate-200 text-slate-800 border-slate-300'
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

                      {/* Ageing */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ageDays < 30
                              ? 'bg-emerald-50 text-emerald-700'
                              : ageDays < 60
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-slate-200 text-slate-900'
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
        <AddStockModal
          models={models}
          canSeePurchasePrice={canSeePurchasePrice}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default InventoryMain;
