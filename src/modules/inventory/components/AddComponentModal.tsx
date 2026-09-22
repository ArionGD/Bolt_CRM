import React, { useState } from 'react';
import { ComponentCategory } from '../../../types';
import { api } from '../../../lib/api';
import { Cpu, X } from 'lucide-react';

interface AddComponentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORY_LABELS: { value: ComponentCategory; label: string }[] = [
  { value: 'batteries', label: 'Battery Packs & Cells' },
  { value: 'motors', label: 'BLDC Motors & Drivetrain' },
  { value: 'controllers', label: 'Smart Controllers & Inverters' },
  { value: 'chargers', label: 'EV Fast Chargers & Adapters' },
  { value: 'brakes', label: 'Brakes & Suspension' },
  { value: 'tyres', label: 'Tyres & Alloy Wheels' },
  { value: 'electronics', label: 'Digital TFT Clusters & Wiring' },
  { value: 'accessories', label: 'Showroom Accessories' },
  { value: 'other', label: 'Other Spares' },
];

export const AddComponentModal: React.FC<AddComponentModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('batteries');
  const [cost, setCost] = useState('15000');
  const [quantity, setQuantity] = useState('10');
  const [minReorderLevel, setMinReorderLevel] = useState('3');
  const [supplier, setSupplier] = useState('Trisha Motors OEM Direct');
  const [warrantyMonths, setWarrantyMonths] = useState('24');
  const [sku, setSku] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSku = () => {
    const prefixMap: Record<ComponentCategory, string> = {
      batteries: 'BAT',
      motors: 'MTR',
      controllers: 'CTR',
      chargers: 'CHG',
      brakes: 'BRK',
      tyres: 'TYR',
      electronics: 'ELE',
      accessories: 'ACC',
      other: 'SPR',
    };
    const code = prefixMap[category] || 'CMP';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setSku(`${code}-${rand}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide the component name.');
      return;
    }

    const finalSku = sku.trim() || `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedQty = parseInt(quantity, 10) || 0;
    const parsedMin = parseInt(minReorderLevel, 10) || 1;
    const parsedCost = parseFloat(cost) || 0;
    const parsedWarranty = parseInt(warrantyMonths, 10) || 12;

    try {
      setSubmitting(true);
      await api.addComponent({
        name: name.trim(),
        sku: finalSku,
        category,
        compatible_models: ['Universal Spares'],
        quantity: parsedQty,
        min_reorder_level: parsedMin,
        unit_price: parsedCost,
        supplier: supplier.trim() || undefined,
        warranty_months: parsedWarranty,
        notes: notes.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to add component');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Add Component Parts</h3>
              <p className="text-xs text-slate-500">Track spares, batteries, chargers, and workshop stock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {/* 1. Component Name (First Field) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Component Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. 60V 30Ah LFP Smart Battery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* 2. Category & Cost (₹) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComponentCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {CATEGORY_LABELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Cost (₹) *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="e.g. 15000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Quantity & Min Alert Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Quantity in Stock *</label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Min Reorder Level</label>
              <input
                type="number"
                min="0"
                required
                value={minReorderLevel}
                onChange={(e) => setMinReorderLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Supplier & Warranty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Supplier / Partner</label>
              <input
                type="text"
                placeholder="e.g. Trisha Motors OEM Direct"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Warranty (Months)</label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 5. SKU & Auto-generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">SKU / Part Number</label>
              <button
                type="button"
                onClick={generateSku}
                className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold cursor-pointer"
              >
                Auto-generate SKU
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. BAT-6030-LFP"
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none uppercase"
            />
          </div>

          {/* 6. Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Notes</label>
            <input
              type="text"
              placeholder="Optional notes or remarks"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Registering...' : 'Add Component Parts'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
