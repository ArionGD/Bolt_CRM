import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Customer, TestDrive, TestDriveStatus, Vehicle, VehicleModel } from '../types';
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

export const TestDrives: React.FC = () => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Showroom Test Drives</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {testDrives.length} drives
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage customer vehicle trials, driver feedback, and demo car allocations.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Schedule Test Drive</span>
        </button>
      </div>

      {/* Test Drives List */}
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
                                prev.map((t) =>
                                  t.id === td.id ? { ...t, status: 'completed', feedback } : t
                                )
                              );
                            }
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">Done</span>
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
              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Schedule Test Drive Slot</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Model to Trial *</label>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.model_name} ({m.variant || 'Standard'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slot Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 shadow-sm"
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
