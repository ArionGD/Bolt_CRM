import React, { useState } from 'react';
import { VehicleModel, VehicleStatus } from '../../../types';
import { api } from '../../../lib/api';
import { Car, X, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface AddStockModalProps {
  models: VehicleModel[];
  canSeePurchasePrice: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  models,
  canSeePurchasePrice,
  onClose,
  onSuccess,
}) => {
  const [formModelId, setFormModelId] = useState(models[0]?.id || '');
  const [formVin, setFormVin] = useState('');
  const [formColour, setFormColour] = useState('Pearl White');
  const [formYear, setFormYear] = useState('2026');
  const [formCondition, setFormCondition] = useState<'new' | 'demo' | 'used'>('new');
  const [formStatus, setFormStatus] = useState<VehicleStatus>('in_stock');
  const [formPurchasePrice, setFormPurchasePrice] = useState(
    models[0] ? String(Math.round(models[0].ex_showroom_price * 0.9)) : ''
  );
  const [formAskingPrice, setFormAskingPrice] = useState(
    models[0] ? String(models[0].ex_showroom_price + 3000) : ''
  );
  const [formOdometer, setFormOdometer] = useState('0');
  const [formLocation, setFormLocation] = useState('Showroom Floor');
  const [formArrivalDate, setFormArrivalDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModelChange = (modelId: string) => {
    setFormModelId(modelId);
    const selected = models.find((m) => m.id === modelId);
    if (selected) {
      setFormAskingPrice(String(selected.ex_showroom_price + 3000));
      setFormPurchasePrice(String(Math.round(selected.ex_showroom_price * 0.9)));
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formVin || !formModelId || !formAskingPrice) {
      setError('Please fill in required fields (VIN, Model, Asking Price).');
      return;
    }

    try {
      setSubmitting(true);
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
        notes: formNotes || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to add vehicle to stock.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-brand-600" />
            <h3 className="font-extrabold text-lg text-slate-900">Add Physical Vehicle to Stock</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleAddStock} className="mt-4 space-y-4 text-xs">
          {/* Model selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select EV Model *</label>
            <select
              value={formModelId}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} {m.model_name} ({(m.body_type || 'EV').toUpperCase()}) — ₹{m.ex_showroom_price.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* VIN & Colour */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Physical VIN *</label>
              <input
                type="text"
                placeholder="e.g. MB9TRISHAEV902341"
                value={formVin}
                onChange={(e) => setFormVin(e.target.value)}
                className="w-full px-3 py-2 font-mono uppercase border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Colour *</label>
              <input
                type="text"
                value={formColour}
                onChange={(e) => setFormColour(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Asking / Customer Price (₹) *</label>
              <input
                type="number"
                value={formAskingPrice}
                onChange={(e) => setFormAskingPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>
            {canSeePurchasePrice && (
              <div>
                <label className="block font-bold text-sky-900 mb-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dealer Purchase Cost (₹)</span>
                </label>
                <input
                  type="number"
                  value={formPurchasePrice}
                  onChange={(e) => setFormPurchasePrice(e.target.value)}
                  className="w-full px-3 py-2 border border-sky-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none bg-sky-50/40"
                />
              </div>
            )}
          </div>

          {/* Status & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as VehicleStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="in_stock">In Stock (Showroom)</option>
                <option value="in_transit">In Transit from Factory</option>
                <option value="reserved">Reserved for Customer</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Floor Bay 1, Basement..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Unique Chassis Stock Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unique VIN chassis number ensures accurate stock allocation without duplication.</span>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Add Vehicle to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
