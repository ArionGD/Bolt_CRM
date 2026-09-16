import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Customer, Lead, LeadStatus, VehicleModel } from '../types';
import {
  Target,
  Plus,
  Phone,
  Calendar,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  Car,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'new', label: '1. New Enquiries', color: 'border-sky-300 bg-sky-50/50 text-sky-800' },
  { id: 'contacted', label: '2. Contacted', color: 'border-sky-400 bg-sky-50 text-sky-900' },
  { id: 'test_drive_scheduled', label: '3. Test Drive', color: 'border-emerald-400 bg-emerald-50/50 text-emerald-800' },
  { id: 'quoted', label: '4. Quoted', color: 'border-slate-300 bg-slate-100 text-slate-800' },
  { id: 'negotiating', label: '5. Negotiating', color: 'border-sky-500 bg-sky-100/60 text-sky-900' },
  { id: 'won', label: 'Won (Booking)', color: 'border-emerald-500 bg-emerald-100 text-emerald-900' },
  { id: 'lost', label: 'Lost', color: 'border-slate-300 bg-slate-50 text-slate-500' },
];

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [modelId, setModelId] = useState('');
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  async function loadData() {
    try {
      const [l, c, m] = await Promise.all([
        api.getLeads(),
        api.getCustomers(),
        api.getModels(),
      ]);
      setLeads(l);
      setCustomers(c);
      setModels(m);
      if (c.length > 0 && !customerId) setCustomerId(c[0].id);
      if (m.length > 0 && !modelId) setModelId(m[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleStageChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await api.updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    const mod = models.find((m) => m.id === modelId);

    try {
      await api.addLead({
        customer_id: customerId,
        model_id: modelId,
        status: 'new',
        expected_close_date: expectedDate,
        customer_name: cust?.full_name,
        customer_phone: cust?.phone,
        brand: mod?.brand,
        model_name: mod?.model_name,
      });
      setShowAddModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create lead');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Lead Pipeline & Funnel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {leads.length} active leads
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">From walk-in enquiry to quotation, test drive, and final booking.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Capture Lead</span>
        </button>
      </div>

      {/* Kanban Pipeline Board */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading pipeline stages...</div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-6 min-h-[550px]">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 bg-slate-100/70 rounded-2xl border border-slate-200/80 flex flex-col p-3"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-lg border ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow space-y-2.5 text-xs"
                    >
                      {/* Customer Name & Phone */}
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{lead.customer_name || 'Customer'}</div>
                        <div className="flex items-center space-x-1 text-slate-500 text-[11px] mt-0.5 font-medium">
                          <Phone className="w-3 h-3 text-brand-600" />
                          <span>{lead.customer_phone || '—'}</span>
                        </div>
                      </div>

                      {/* Desired Model Badge */}
                      <div className="flex items-center space-x-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 text-slate-700">
                        <Car className="w-3.5 h-3.5 text-brand-600" />
                        <span className="font-semibold">{lead.brand} {lead.model_name || 'EV Model'}</span>
                      </div>

                      {/* Expected Date */}
                      {lead.expected_close_date && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>Target: {lead.expected_close_date}</span>
                        </div>
                      )}

                      {/* Stage transition buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        {stage.id === 'new' && (
                          <button
                            onClick={() => handleStageChange(lead.id, 'contacted')}
                            className="w-full text-center py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded font-semibold text-[11px] transition-colors"
                          >
                            Mark Contacted →
                          </button>
                        )}
                        {stage.id === 'contacted' && (
                          <button
                            onClick={() => handleStageChange(lead.id, 'test_drive_scheduled')}
                            className="w-full text-center py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded font-semibold text-[11px] transition-colors"
                          >
                            Book Test Drive →
                          </button>
                        )}
                        {stage.id === 'test_drive_scheduled' && (
                          <button
                            onClick={() => handleStageChange(lead.id, 'quoted')}
                            className="w-full text-center py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition-colors"
                          >
                            Send Quotation →
                          </button>
                        )}
                        {stage.id === 'quoted' && (
                          <button
                            onClick={() => handleStageChange(lead.id, 'negotiating')}
                            className="w-full text-center py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded font-semibold text-[11px] transition-colors"
                          >
                            Negotiate Terms →
                          </button>
                        )}
                        {stage.id === 'negotiating' && (
                          <div className="flex space-x-1 w-full">
                            <button
                              onClick={() => handleStageChange(lead.id, 'won')}
                              className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors flex items-center justify-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Won</span>
                            </button>
                            <button
                              onClick={() => handleStageChange(lead.id, 'lost')}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-semibold text-[11px] transition-colors"
                            >
                              Lost
                            </button>
                          </div>
                        )}
                        {stage.id === 'won' && (
                          <Link
                            to={`/orders?customer_id=${lead.customer_id}`}
                            className="w-full text-center py-1 bg-emerald-50 text-emerald-800 rounded font-bold text-[11px] hover:underline"
                          >
                            View Order Record →
                          </Link>
                        )}
                        {stage.id === 'lost' && (
                          <span className="text-[10px] text-slate-400 italic">Archived as lost</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Capture Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Capture New Enquiry</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="mt-4 space-y-3 text-xs">
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
                <label className="block font-bold text-slate-700 mb-1">Interested EV Model *</label>
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
                <label className="block font-bold text-slate-700 mb-1">Expected Decision Date</label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 shadow-sm"
                >
                  Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
