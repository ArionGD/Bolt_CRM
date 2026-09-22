import React, { useState } from 'react';
import { ComponentCategory, ComponentItem } from '../../../types';
import { api } from '../../../lib/api';
import { Cpu, X, Sparkles, Layers, ShieldCheck } from 'lucide-react';

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

const AVAILABLE_MODELS = [
  'Scooty Model 1',
  'Scooty Model 2',
  'Scooty Model Pro',
  'E-Rickshaw Model 1',
  'Universal Spares',
];

export const AddComponentModal: React.FC<AddComponentModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('batteries');
  const [selectedModels, setSelectedModels] = useState<string[]>(['Scooty Model 1', 'Scooty Model 2']);
  const [quantity, setQuantity] = useState('10');
  const [minReorderLevel, setMinReorderLevel] = useState('3');
  const [unitPrice, setUnitPrice] = useState('15000');
  const [locationBin, setLocationBin] = useState('Rack A-01');
  const [supplier, setSupplier] = useState('Trisha Motors OEM Direct');
  const [warrantyMonths, setWarrantyMonths] = useState('24');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleModel = (modelName: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelName) ? prev.filter((m) => m !== modelName) : [...prev, modelName]
    );
  };

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
    const parsedPrice = parseFloat(unitPrice) || 0;
    const parsedWarranty = parseInt(warrantyMonths, 10) || 12;

    try {
      setSubmitting(true);
      await api.addComponent({
        name: name.trim(),
        sku: finalSku,
        category,
        compatible_models: selectedModels.length > 0 ? selectedModels : ['Universal Spares'],
        quantity: parsedQty,
        min_reorder_level: parsedMin,
        unit_price: parsedPrice,
        location_bin: locationBin.trim() || undefined,
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
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Add EV Component / Spare Part</h3>
              <p className="text-xs text-slate-500">Track spares, batteries, chargers, and workshop stock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
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
          {/* Component Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Component / Part Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. 60V 30Ah LFP Smart Battery"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Component Category *</label>
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
          </div>

          {/* SKU & Generator */}
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

          {/* Compatible Vehicle Models */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Compatible EV Models</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_MODELS.map((m) => {
                const isSelected = selectedModels.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleModel(m)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Qty, Min Reorder, Unit Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Initial Qty</label>
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
              <label className="block text-slate-700 font-bold mb-1">Min Alert Level</label>
              <input
                type="number"
                min="0"
                required
                value={minReorderLevel}
                onChange={(e) => setMinReorderLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Unit Price (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Storage Bin & Supplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Storage Location / Rack Bin</label>
              <input
                type="text"
                placeholder="e.g. Rack A-02 / Shelf 3"
                value={locationBin}
                onChange={(e) => setLocationBin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">OEM Supplier / Partner</label>
              <input
                type="text"
                placeholder="e.g. Trisha Motors OEM Direct"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
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
              {submitting ? 'Registering...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
