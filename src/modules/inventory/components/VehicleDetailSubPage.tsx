import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Vehicle, VehicleModel, VehicleStatus } from '../../../types';
import {
  ArrowLeft,
  BatteryCharging,
  Zap,
  Gauge,
  Calendar,
  MapPin,
  ShieldCheck,
  Tag,
  CheckCircle,
  FileText,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const VehicleDetailSubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [model, setModel] = useState<VehicleModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const vehicles = await api.getVehicles();
        const v = vehicles.find((item) => item.id === id);
        if (v) {
          setVehicle(v);
          const models = await api.getModels();
          const m = models.find((mod) => mod.id === v.model_id);
          setModel(m || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStatusChange = async (newStatus: VehicleStatus) => {
    if (!vehicle) return;
    try {
      const updated = await api.updateVehicle(vehicle.id, { status: newStatus });
      setVehicle(updated);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Vehicle Not Found</h2>
        <p className="text-slate-500 mt-2">The physical vehicle you are looking for does not exist.</p>
        <Link to="/crm/inventory" className="mt-4 inline-block text-brand-600 font-semibold text-sm">
          ← Back to Inventory
        </Link>
      </div>
    );
  }

  const ageDays = Math.floor(
    (new Date().getTime() - new Date(vehicle.arrival_date || vehicle.created_at).getTime()) /
      (1000 * 3600 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Top breadcrumb & back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/crm/inventory')}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Vehicle Inventory</span>
        </button>
        <div className="flex items-center space-x-2">
          <Link
            to="/crm/sales?tab=quotations"
            className="inline-flex items-center px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span>Generate Quote</span>
          </Link>
          <Link
            to="/crm/sales?tab=orders"
            className="inline-flex items-center px-3.5 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            <span>Book to Order</span>
          </Link>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                {(model?.body_type || 'EV').toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {vehicle.manufacture_year || 2026} Model
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {vehicle.brand || model?.brand} {vehicle.model_name || model?.model_name}
            </h1>
            <p className="text-xs font-mono text-slate-500 mt-1 flex items-center space-x-2">
              <span className="font-bold text-slate-700">VIN:</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">{vehicle.vin}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div>
              <p className="text-xs text-slate-500">Asking Price</p>
              <p className="text-2xl font-black text-slate-900">
                ₹{vehicle.asking_price.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="sm:border-l sm:border-slate-200 sm:pl-4">
              <p className="text-xs text-slate-500 mb-1">Physical Status</p>
              <select
                value={vehicle.status}
                onChange={(e) => handleStatusChange(e.target.value as VehicleStatus)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="in_stock">In Stock</option>
                <option value="in_transit">In Transit</option>
                <option value="reserved">Reserved</option>
                <option value="delivered">Delivered</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Vehicle Details & Model Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Physical Unit Specs */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Unit Configuration & Location
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Exterior Colour</p>
                <p className="text-slate-900 font-bold mt-0.5">{vehicle.colour}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Condition</p>
                <p className="text-slate-900 font-bold capitalize mt-0.5">{vehicle.condition}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Odometer</p>
                <p className="text-slate-900 font-bold mt-0.5">{vehicle.odometer_km || 0} km</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Location</p>
                <p className="text-slate-900 font-bold mt-0.5 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {vehicle.location || 'Showroom Floor'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Inventory Timeline</p>
                <p className="text-slate-900 font-bold mt-0.5">{ageDays} days in inventory</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Arrival Date</p>
                <p className="text-slate-900 font-bold mt-0.5">
                  {vehicle.arrival_date || 'Initial Stock'}
                </p>
              </div>
            </div>

            {/* Atomic VIN Lock Callout */}
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Atomic Physical VIN Lock Active</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  This VIN ({vehicle.vin}) is guaranteed unique at the database level. Once bound to a customer order, it cannot be double-sold.
                </p>
              </div>
            </div>
          </div>

          {/* Model Engineering Specifications */}
          {model && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Factory Specifications & Performance
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-emerald-600 mb-1">
                    <BatteryCharging className="w-4 h-4" />
                    <span className="font-semibold text-slate-600">Battery</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900">
                    {model.battery_kwh || 3.2} kWh
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-sky-600 mb-1">
                    <Gauge className="w-4 h-4" />
                    <span className="font-semibold text-slate-600">Range (IDC)</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900">
                    {model.range_km || 120} km
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-emerald-600 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold text-slate-600">Motor Power</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900">
                    {model.motor_power_kw || 4.5} kW
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-sky-600 mb-1">
                    <Tag className="w-4 h-4" />
                    <span className="font-semibold text-slate-600">Ex-Showroom</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900">
                    ₹{model.ex_showroom_price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Financials */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Financial Breakdown
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Customer Asking Price</span>
                <span className="font-bold text-slate-900">
                  ₹{vehicle.asking_price.toLocaleString('en-IN')}
                </span>
              </div>
              {role === 'admin' && vehicle.purchase_price && (
                <div className="flex justify-between py-1 border-b border-sky-100 bg-sky-50/50 px-2 rounded">
                  <span className="text-sky-900 font-semibold">Dealer Cost (Confidential)</span>
                  <span className="font-bold text-sky-900">
                    ₹{vehicle.purchase_price.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {role === 'admin' && vehicle.purchase_price && (
                <div className="flex justify-between py-1 text-emerald-700 font-semibold px-2">
                  <span>Gross Margin Potential</span>
                  <span>
                    ₹{(vehicle.asking_price - vehicle.purchase_price).toLocaleString('en-IN')} (
                    {Math.round(
                      ((vehicle.asking_price - vehicle.purchase_price) / vehicle.asking_price) * 100
                    )}
                    %)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailSubPage;
