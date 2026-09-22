import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Customer, TestDrive, TestDriveStatus, Vehicle, VehicleModel } from '../../../types';
import {
  Gauge,
  Plus,
  Calendar,
  Clock,
  Phone,
  Car,
  CheckCircle2,
  XCircle,
  X,
  MessageSquare,
} from 'lucide-react';

export const TestDrivesSubPage: React.FC = () => {
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [customerId, setCustomerId] = useState('');
  const [modelId, setModelId] = useState('');
  const [dateTime, setDateTime] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );

  async function loadData() {
    try {
      const [tdList, cList, vList, mList] = await Promise.all([
        api.getTestDrives(),
        api.getCustomers(),
        api.getVehicles(),
        api.getModels(),
      ]);
      setTestDrives(tdList);
      setCustomers(cList);
      setVehicles(vList);
      setModels(mList);
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

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    const mod = models.find((m) => m.id === modelId);

    try {
      await api.scheduleTestDrive({
        customer_id: customerId,
        model_id: modelId,
        scheduled_at: new Date(dateTime).toISOString(),
        customer_name: cust?.full_name,
        customer_phone: cust?.phone,
        brand: mod?.brand,
        model_name: mod?.model_name,
      });
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule test drive');
    }
  };

  return (
    <div className="space-y-4">
      {/* Subpage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Showroom Test Drives</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {testDrives.length} trials
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer trial slots, demo car allocations, and feedback.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Schedule Test Drive</span>
        </button>
      </div>

      {/* Test Drives Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading trial slots...</div>
        ) : testDrives.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Gauge className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-700">No test drives scheduled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">EV Model / Demo Car</th>
                  <th className="py-3 px-4">Scheduled Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Customer Feedback</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testDrives.map((td) => (
                  <tr key={td.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{td.customer_name}</div>
                      <div className="flex items-center space-x-1 text-slate-500 text-[11px] mt-0.5">
                        <Phone className="w-3 h-3 text-brand-600" />
                        <span>{td.customer_phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                        <Car className="w-4 h-4 text-brand-600" />
                        <span>{td.brand} {td.model_name}</span>
                      </div>
                      {td.vin && <span className="font-mono text-[10px] text-slate-400">Demo VIN: {td.vin}</span>}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(td.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          td.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : td.status === 'scheduled'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {td.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">
                      {td.feedback ? (
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          <span>{td.feedback}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending trial execution</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {td.status === 'scheduled' ? (
                        <button
                          onClick={() => {
                            const feedback = prompt('Enter customer driving experience feedback:');
                            if (feedback !== null) {
                              setTestDrives((prev) =>
                                prev.map((d) =>
                                  d.id === td.id ? { ...d, status: 'completed', feedback: feedback || 'Completed successfully' } : d
                                )
                              );
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Complete Trial
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Book Test Drive Slot</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="mt-4 space-y-3 text-xs">
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
                <label className="block font-semibold text-slate-700 mb-1">Select Demo Vehicle Model *</label>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.model_name} ({(m.body_type || 'EV').toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slot Date & Time *</label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDrivesSubPage;
