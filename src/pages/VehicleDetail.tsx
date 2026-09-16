import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Vehicle, VehicleModel, VehicleStatus } from '../types';
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

export const VehicleDetail: React.FC = () => {
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
      <div className="p-8 text-center">
        <p className="text-slate-600 font-bold text-lg">Vehicle record not found</p>
        <Link to="/crm/inventory" className="text-brand-600 font-semibold text-sm mt-2 inline-block">
          ← Back to Inventory
        </Link>
      </div>
    );
  }

  const canSeeCost = role === 'admin';
  const margin = vehicle.purchase_price ? vehicle.asking_price - vehicle.purchase_price : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Inventory</span>
        </button>

        {/* Quick Action buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to={`/crm/quotations?vehicle_id=${vehicle.id}&model_id=${vehicle.model_id}`}
            className="inline-flex items-center px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            <span>Generate Quotation</span>
          </Link>
          {vehicle.status === 'in_stock' && (
            <Link
              to={`/crm/orders?vehicle_id=${vehicle.id}`}
              className="inline-flex items-center px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
              <span>Book Vehicle</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top Vehicle Summary Banner */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
                {vehicle.brand || 'EV'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold uppercase text-slate-500">
                {vehicle.manufacture_year || 2026}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                {vehicle.condition}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {vehicle.brand} {vehicle.model_name}
            </h1>
            <p className="text-sm font-medium text-slate-600">
              {vehicle.variant || 'Standard'} • <span className="font-bold text-slate-800">{vehicle.colour}</span>
            </p>
          </div>

          {/* Pricing & Status Selector */}
          <div className="text-left md:text-right space-y-2">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Showroom Asking Price</span>
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{vehicle.asking_price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center md:justify-end space-x-2">
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              <select
                value={vehicle.status}
                onChange={(e) => handleStatusChange(e.target.value as VehicleStatus)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-slate-50 border-slate-300 focus:ring-2 focus:ring-brand-500"
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

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Technical & EV Specifications */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-600" />
              <span>EV Powertrain Specifications</span>
            </h2>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Battery Capacity:</span>
                <span className="font-bold text-slate-900">{model?.battery_kwh || '45.0'} kWh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Certified Range:</span>
                <span className="font-bold text-emerald-700">{model?.range_km || '489'} km (MIDC)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Peak Motor Power:</span>
                <span className="font-bold text-slate-900">{model?.motor_power_kw || '106'} kW ({Math.round((model?.motor_power_kw || 106) * 1.34)} PS)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">AC Charging Speed:</span>
                <span className="font-bold text-slate-900">{model?.charging_ac_kw || '7.2'} kW Wallbox</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">DC Fast Charge (CCS2):</span>
                <span className="font-bold text-sky-700">{model?.charging_dc_kw || '50.0'} kW (10-80% in 45 min)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Seating Capacity:</span>
                <span className="font-bold text-slate-900">{model?.seating_capacity || 5} Persons</span>
              </div>
            </div>
          </div>

          {/* Column 2: Physical Unit Identification */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-sky-600" />
              <span>Chassis & Physical Trackers</span>
            </h2>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs border border-slate-100">
              <div className="py-1 border-b border-slate-200/60">
                <span className="text-slate-500 block mb-0.5">VIN / Chassis Number:</span>
                <span className="font-mono font-extrabold text-sm text-slate-900 select-all">{vehicle.vin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Motor Serial No:</span>
                <span className="font-mono font-bold text-slate-800">{vehicle.motor_no || 'MOT-CONF-001'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Battery Pack Serial:</span>
                <span className="font-mono font-bold text-slate-800">{vehicle.battery_serial || 'BAT-PACK-992'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Odometer Reading:</span>
                <span className="font-bold text-slate-900">{vehicle.odometer_km || 0} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Current Location:</span>
                <span className="font-bold text-slate-900 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{vehicle.location || 'Showroom'}</span>
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Arrival at Dealership:</span>
                <span className="font-bold text-slate-900">{vehicle.arrival_date || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Commercials & Dealer Margins (Admin Gated) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Commercial & Dealership Margins</span>
            </h2>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Ex-Showroom Base:</span>
                <span className="font-bold text-slate-900">₹{(model?.ex_showroom_price || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Showroom Asking Price:</span>
                <span className="font-bold text-slate-900">₹{vehicle.asking_price.toLocaleString('en-IN')}</span>
              </div>

              {canSeeCost ? (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 bg-sky-50 -mx-4 px-4">
                    <span className="text-sky-900 font-semibold">Dealer Cost Price:</span>
                    <span className="font-extrabold text-sky-950">
                      {vehicle.purchase_price ? `₹${vehicle.purchase_price.toLocaleString('en-IN')}` : '—'}
                    </span>
                  </div>
                  {margin !== null && (
                    <div className="flex justify-between py-1 bg-emerald-50 -mx-4 px-4 rounded-b-lg">
                      <span className="text-emerald-800 font-semibold">Gross Margin:</span>
                      <span className="font-extrabold text-emerald-900">
                        +₹{margin.toLocaleString('en-IN')} ({((margin / vehicle.asking_price) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-slate-100/80 rounded-lg text-slate-400 text-center italic">
                  Dealer cost prices and margins are restricted to Admin role.
                </div>
              )}
            </div>

            {/* Notes */}
            {vehicle.notes && (
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-800">
                <span className="font-bold block mb-1">Dealership Remarks:</span>
                <p className="leading-relaxed">{vehicle.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
