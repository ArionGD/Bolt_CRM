import React, { useState } from 'react';
import { VehicleModel } from '../../../types';
import { api } from '../../../lib/api';
import { Car, X, Plus, Trash2, Tag, ShieldCheck } from 'lucide-react';

interface ColorStockEntry {
  color: string;
  quantity: number;
}

interface AddStockModalProps {
  models: VehicleModel[];
  canSeePurchasePrice: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  models,
  onClose,
  onSuccess,
}) => {
  const [formModelName, setFormModelName] = useState('');
  const [formBrand, setFormBrand] = useState('Trisha');
  const [formModelNumber, setFormModelNumber] = useState('');
  const [formBodyType, setFormBodyType] = useState<'Scooty' | 'E-Rickshaw'>('Scooty');
  const [formPurchasePrice, setFormPurchasePrice] = useState('65000');
  const [formAskingPrice, setFormAskingPrice] = useState('78000');
  const [formYear, setFormYear] = useState('2026');
  const [formArrivalDate, setFormArrivalDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [colorEntries, setColorEntries] = useState<ColorStockEntry[]>([
    { color: 'White', quantity: 2 },
    { color: 'Black', quantity: 1 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profit calculation
  const purchaseNum = parseFloat(formPurchasePrice) || 0;
  const askingNum = parseFloat(formAskingPrice) || 0;
  const expectedProfit = askingNum - purchaseNum;
  const marginPct = askingNum > 0 ? ((expectedProfit / askingNum) * 100).toFixed(1) : '0';

  // Total quantity of vehicles across all color rows
  const totalUnits = colorEntries.reduce((sum, c) => sum + (Number(c.quantity) || 0), 0);

  const addColorRow = () => {
    setColorEntries([...colorEntries, { color: 'Red', quantity: 1 }]);
  };

  const removeColorRow = (index: number) => {
    if (colorEntries.length <= 1) return;
    setColorEntries(colorEntries.filter((_, i) => i !== index));
  };

  const updateColorRow = (index: number, field: 'color' | 'quantity', value: any) => {
    const updated = [...colorEntries];
    updated[index] = { ...updated[index], [field]: value };
    setColorEntries(updated);
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formModelName.trim()) {
      setError('Please enter the Model Name.');
      return;
    }
    if (!formAskingPrice) {
      setError('Please enter the Selling Price.');
      return;
    }
    if (totalUnits <= 0) {
      setError('Please enter at least 1 vehicle quantity in colors.');
      return;
    }

    try {
      setSubmitting(true);
      const baseModel = formModelNumber.trim().toUpperCase() || 'EV' + new Date().getFullYear();

      // Create vehicle entries for each color and quantity
      for (const entry of colorEntries) {
        const colorName = entry.color.trim() || 'White';
        const colorPrefix = colorName.substring(0, 1).toUpperCase();
        const count = Math.max(1, Number(entry.quantity) || 1);

        for (let i = 1; i <= count; i++) {
          const rand = Math.floor(1000 + Math.random() * 9000);
          const vin = `${baseModel}-${colorPrefix}${i < 10 ? '0' + i : i}-${rand}`;

          await api.addVehicle({
            model_name: formModelName.trim(),
            brand: formBrand.trim() || 'Trisha',
            body_type: formBodyType,
            vin,
            colour: colorName,
            manufacture_year: parseInt(formYear) || 2026,
            condition: 'new',
            status: 'in_stock',
            location: 'Showroom Floor',
            purchase_price: purchaseNum ? purchaseNum : undefined,
            asking_price: askingNum ? askingNum : 75000,
            odometer_km: 0,
            arrival_date: formArrivalDate,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to add vehicles to stock.');
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
              <p className="text-xs text-slate-500">Register shipment with model name, prices, and color counts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
          {/* Model Name & Model Number */}
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
                Model Number
              </label>
              <input
                type="text"
                placeholder="e.g. TR-EV2026 / MAYURI-DLX"
                value={formModelNumber}
                onChange={(e) => setFormModelNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 font-mono uppercase border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Vehicle Category & Arrival Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vehicle Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormBodyType('Scooty')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    formBodyType === 'Scooty'
                      ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 text-sky-600" />
                  <span>Scooty</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormBodyType('E-Rickshaw')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    formBodyType === 'E-Rickshaw'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 text-emerald-600" />
                  <span>E-Rickshaw</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Arrival Date
              </label>
              <input
                type="date"
                value={formArrivalDate}
                onChange={(e) => setFormArrivalDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Pricing: Cost Price, Selling Price & Profit Margin */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sky-900 mb-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Cost Price (₹)</span>
                </label>
                <input
                  type="number"
                  placeholder="65000"
                  value={formPurchasePrice}
                  onChange={(e) => setFormPurchasePrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-sky-300 rounded-xl text-xs font-black focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Selling Price (₹) *</span>
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
            </div>

            {/* Profit Margin Pill */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
              <span className="font-semibold text-slate-500">Profit Margin:</span>
              <span
                className={`font-black px-2.5 py-0.5 rounded-md ${
                  expectedProfit >= 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                ₹{expectedProfit.toLocaleString('en-IN')} per unit ({marginPct}%)
              </span>
            </div>
          </div>

          {/* Vehicle Color & Quantity List */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-bold text-slate-900">
                  Vehicle Colors & Numbers *
                </label>
                <p className="text-[11px] text-slate-500">Specify color and number of units (e.g. 2 White, 1 Black)</p>
              </div>
              <span className="text-xs font-black text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                Total: {totalUnits} {totalUnits === 1 ? 'Vehicle' : 'Vehicles'}
              </span>
            </div>

            <div className="space-y-2.5">
              {colorEntries.map((entry, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      list="color-preset-list"
                      required
                      placeholder="Color (e.g. White, Black)"
                      value={entry.color}
                      onChange={(e) => updateColorRow(idx, 'color', e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="w-32 flex items-center space-x-1.5">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={entry.quantity}
                      onChange={(e) =>
                        updateColorRow(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <span className="text-[11px] font-bold text-slate-500 shrink-0">units</span>
                  </div>

                  {colorEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColorRow(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove color"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <datalist id="color-preset-list">
              <option value="White" />
              <option value="Black" />
              <option value="Red" />
              <option value="Electric Blue" />
              <option value="Grey" />
              <option value="Silver" />
              <option value="Green" />
            </datalist>

            <button
              type="button"
              onClick={addColorRow}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 pt-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Color</span>
            </button>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
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
              {submitting
                ? 'Registering...'
                : totalUnits > 1
                ? `Add ${totalUnits} Vehicles to Stock`
                : 'Add Vehicle to Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
