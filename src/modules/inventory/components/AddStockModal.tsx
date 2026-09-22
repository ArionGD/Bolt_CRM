import React, { useState } from 'react';
import { VehicleModel, VehicleStatus } from '../../../types';
import { api } from '../../../lib/api';
import { Car, X, ShieldCheck, Sparkles, CheckCircle2, DollarSign, Tag } from 'lucide-react';

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
  const [formModelName, setFormModelName] = useState('');
  const [formBrand, setFormBrand] = useState('Trisha');
  const [formBodyType, setFormBodyType] = useState<'Scooty' | 'E-Rickshaw'>('Scooty');
  const [formPurchasePrice, setFormPurchasePrice] = useState('65000');
  const [formAskingPrice, setFormAskingPrice] = useState('78000');
  const [formVin, setFormVin] = useState('');
  const [formColour, setFormColour] = useState('Pearl White');
  const [formYear, setFormYear] = useState('2026');
  const [formCondition, setFormCondition] = useState<'new' | 'demo' | 'used'>('new');
  const [formStatus, setFormStatus] = useState<VehicleStatus>('in_stock');
  const [formOdometer, setFormOdometer] = useState('0');
  const [formLocation, setFormLocation] = useState('Showroom Floor');
  const [formArrivalDate, setFormArrivalDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live profit calculation
  const purchaseNum = parseFloat(formPurchasePrice) || 0;
  const askingNum = parseFloat(formAskingPrice) || 0;
  const expectedProfit = askingNum - purchaseNum;
  const marginPct = askingNum > 0 ? ((expectedProfit / askingNum) * 100).toFixed(1) : '0';

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formModelName.trim()) {
      setError('Please enter the Model Name.');
      return;
    }
    if (!formVin.trim()) {
      setError('Please enter the Physical VIN / Chassis Number.');
      return;
    }
    if (!formAskingPrice) {
      setError('Please enter the Asking / Selling Price.');
      return;
    }

    try {
      setSubmitting(true);
      await api.addVehicle({
        model_name: formModelName.trim(),
        brand: formBrand.trim() || 'Trisha',
        body_type: formBodyType,
        vin: formVin.toUpperCase().trim(),
        colour: formColour,
        manufacture_year: parseInt(formYear) || 2026,
        condition: formCondition,
        status: formStatus,
        purchase_price: formPurchasePrice ? parseFloat(formPurchasePrice) : undefined,
        asking_price: parseFloat(formAskingPrice) || 75000,
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
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Add Vehicle to Stock</h3>
              <p className="text-xs text-slate-500">Enter custom model name, prices, and chassis number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleAddStock} className="mt-5 space-y-4 text-xs">
          {/* Model Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                list="model-suggestions"
                required
                placeholder="e.g. Mayuri Deluxe / Scooty Pro"
                value={formModelName}
                onChange={(e) => setFormModelName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-400"
              />
              <datalist id="model-suggestions">
                {models.map((m) => (
                  <option key={m.id} value={m.model_name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                placeholder="e.g. Trisha / Mayuri / Yatri"
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Vehicle Category Toggle */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Vehicle Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormBodyType('Scooty')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  formBodyType === 'Scooty'
                    ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-sky-600" />
                <span>Electric Scooty</span>
              </button>

              <button
                type="button"
                onClick={() => setFormBodyType('E-Rickshaw')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  formBodyType === 'E-Rickshaw'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                <span>Commercial E-Rickshaw</span>
              </button>
            </div>
          </div>

          {/* Pricing & Profit Margin */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mark / Selling Price (₹) *</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="78000"
                  value={formAskingPrice}
                  onChange={(e) => setFormAskingPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-sky-900 mb-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Procurement Cost Price (₹)</span>
                </label>
                <input
                  type="number"
                  placeholder="65000"
                  value={formPurchasePrice}
                  onChange={(e) => setFormPurchasePrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-sky-300 rounded-xl text-xs font-black focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Profit Pill */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
              <span className="font-semibold text-slate-500">Projected Dealer Margin:</span>
              <span
                className={`font-black px-2 py-0.5 rounded-md ${
                  expectedProfit >= 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                ₹{expectedProfit.toLocaleString('en-IN')} ({marginPct}%)
              </span>
            </div>
          </div>

          {/* VIN & Colour */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chassis / VIN Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MB9TRISHAEV202601"
                value={formVin}
                onChange={(e) => setFormVin(e.target.value)}
                className="w-full px-3.5 py-2.5 font-mono uppercase border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vehicle Colour *
              </label>
              <input
                type="text"
                required
                value={formColour}
                onChange={(e) => setFormColour(e.target.value)}
                placeholder="Pearl White, Jet Black..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as VehicleStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="in_stock">In Stock</option>
                <option value="in_transit">In Transit</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Showroom Floor, Bay 1..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Arrival Date</label>
              <input
                type="date"
                value={formArrivalDate}
                onChange={(e) => setFormArrivalDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Add Vehicle to Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
