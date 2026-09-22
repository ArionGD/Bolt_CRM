import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { Customer, Quotation, Vehicle, VehicleModel } from '../../../types';
import {
  FileText,
  Plus,
  Calculator,
  Calendar,
  CheckCircle2,
  X,
  Phone,
  Car,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const QuotationsSubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [customerId, setCustomerId] = useState(searchParams.get('customer_id') || '');
  const [modelId, setModelId] = useState(searchParams.get('model_id') || '');
  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicle_id') || '');
  const [insurance, setInsurance] = useState('3500');
  const [registration, setRegistration] = useState('2000');
  const [accessories, setAccessories] = useState('1500');
  const [handling, setHandling] = useState('1000');
  const [discount, setDiscount] = useState('2000');
  const [subsidy, setSubsidy] = useState('5000');

  async function loadData() {
    try {
      const [qList, cList, mList, vList] = await Promise.all([
        api.getQuotations(),
        api.getCustomers(),
        api.getModels(),
        api.getVehicles(),
      ]);
      setQuotations(qList);
      setCustomers(cList);
      setModels(mList);
      setVehicles(vList);
      if (cList.length > 0 && !customerId) setCustomerId(cList[0].id);
      if (mList.length > 0 && !modelId) setModelId(mList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedModel = models.find((m) => m.id === modelId);
  const exShowroom = selectedModel?.ex_showroom_price || 0;
  const insNum = parseFloat(insurance) || 0;
  const regNum = parseFloat(registration) || 0;
  const accNum = parseFloat(accessories) || 0;
  const hndNum = parseFloat(handling) || 0;
  const discNum = parseFloat(discount) || 0;
  const subNum = parseFloat(subsidy) || 0;

  const estimatedOnRoad = Math.max(
    0,
    exShowroom + insNum + regNum + accNum + hndNum - discNum - subNum
  );

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createQuotation({
        customer_id: customerId,
        model_id: modelId,
        vehicle_id: vehicleId || undefined,
        insurance: insNum,
        registration: regNum,
        accessories_total: accNum,
        handling_charges: hndNum,
        discount: discNum,
        subsidy_amount: subNum,
      });
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create quotation');
    }
  };

  return (
    <div className="space-y-4">
      {/* Subpage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Quotations & Pricing</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {quotations.length} quotes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Server-side on-road calculations including state EV subsidies and registration costs.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Generate Quote</span>
        </button>
      </div>

      {/* Quotations List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading quotations...</div>
        ) : quotations.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-700">No quotations generated yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Quote Number</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Model & Variant</th>
                  <th className="py-3 px-4">Ex-Showroom</th>
                  <th className="py-3 px-4">Subsidies & Discounts</th>
                  <th className="py-3 px-4">On-Road Final</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {q.quote_number}
                      <div className="text-[10px] font-sans text-slate-400 font-normal">
                        Valid till {q.valid_until || '14 days'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{q.customer_name}</div>
                      <div className="text-slate-500 text-[11px]">{q.customer_phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{q.brand} {q.model_name}</div>
                      <div className="text-slate-500 text-[11px]">{q.variant}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      ₹{q.ex_showroom.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-emerald-700 font-medium">
                      -₹{(q.discount + q.subsidy_amount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{q.on_road_total.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          q.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : q.status === 'sent'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/crm/sales?tab=orders&customer_id=${q.customer_id}&quotation_id=${q.id}`}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                        <span>Book to Order</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Builder Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-lg">Generate EV Price Quotation</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer *</label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehicle Model *</label>
                  <select
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.brand} {m.model_name} — ₹{m.ex_showroom_price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Breakdown Grid */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">
                  <span>Base Ex-Showroom Price:</span>
                  <span>₹{exShowroom.toLocaleString('en-IN')}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Insurance (₹)</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">RTO Registration (₹)</label>
                    <input
                      type="number"
                      value={registration}
                      onChange={(e) => setRegistration(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Accessories (₹)</label>
                    <input
                      type="number"
                      value={accessories}
                      onChange={(e) => setAccessories(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Handling / Log (₹)</label>
                    <input
                      type="number"
                      value={handling}
                      onChange={(e) => setHandling(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-700 font-semibold mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-emerald-300 rounded-lg bg-white text-emerald-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-700 font-semibold mb-1">State EV Subsidy (₹)</label>
                    <input
                      type="number"
                      value={subsidy}
                      onChange={(e) => setSubsidy(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-emerald-300 rounded-lg bg-white text-emerald-800 font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-sm">Estimated Total On-Road:</span>
                  <span className="text-lg font-black text-brand-700">
                    ₹{estimatedOnRoad.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Save & Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsSubPage;
