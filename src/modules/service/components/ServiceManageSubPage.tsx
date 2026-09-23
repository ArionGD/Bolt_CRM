import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { ServiceJob, ServicePartUsed, ServiceStatus } from '../../../types';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Car,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  X,
  IndianRupee,
  Trash2,
  FileText,
  AlertCircle,
  TrendingUp,
  Tag,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const ServiceManageSubPage: React.FC = () => {
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleQuery, setVehicleQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceiptJob, setSelectedReceiptJob] = useState<ServiceJob | null>(null);

  // Form State for Manual Entry
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [odometerKm, setOdometerKm] = useState('');
  const [serviceType, setServiceType] = useState('General Servicing');
  const [issueDescription, setIssueDescription] = useState('');
  const [mechanicNotes, setMechanicNotes] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('Vikram Singh (Senior Tech)');

  // Dynamic Parts List
  const [partsUsed, setPartsUsed] = useState<ServicePartUsed[]>([]);
  const [partNameInput, setPartNameInput] = useState('');
  const [partQtyInput, setPartQtyInput] = useState('1');
  const [partCostInput, setPartCostInput] = useState('');

  // Financial & Labour
  const [labourCharges, setLabourCharges] = useState('400');
  const [miscCharges, setMiscCharges] = useState('0');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'credit'>('cash');
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>('in_progress');

  async function loadJobs() {
    setLoading(true);
    try {
      const data = await api.getServiceJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  // Reset form
  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setVehicleModel('');
    setVehicleNumber('');
    setOdometerKm('');
    setServiceType('General Servicing');
    setIssueDescription('');
    setMechanicNotes('');
    setAssignedTechnician('Vikram Singh (Senior Tech)');
    setPartsUsed([]);
    setPartNameInput('');
    setPartQtyInput('1');
    setPartCostInput('');
    setLabourCharges('400');
    setMiscCharges('0');
    setDiscountAmount('0');
    setPaidAmount('');
    setPaymentMode('cash');
    setServiceStatus('in_progress');
  };

  // Add Part to List
  const handleAddPart = () => {
    if (!partNameInput.trim()) {
      alert('Please enter part name');
      return;
    }
    const qty = parseInt(partQtyInput) || 1;
    const cost = parseFloat(partCostInput) || 0;
    if (cost < 0) {
      alert('Invalid part cost');
      return;
    }

    const newPart: ServicePartUsed = {
      id: 'p_' + Date.now(),
      part_name: partNameInput.trim(),
      quantity: qty,
      unit_cost: cost,
      total_cost: qty * cost,
    };

    setPartsUsed([...partsUsed, newPart]);
    setPartNameInput('');
    setPartQtyInput('1');
    setPartCostInput('');
  };

  const handleRemovePart = (id: string) => {
    setPartsUsed(partsUsed.filter((p) => p.id !== id));
  };

  // Calculations
  const computedPartsTotal = partsUsed.reduce((sum, p) => sum + p.total_cost, 0);
  const numLabour = parseFloat(labourCharges) || 0;
  const numMisc = parseFloat(miscCharges) || 0;
  const numDiscount = parseFloat(discountAmount) || 0;
  const computedTotalBill = Math.max(0, computedPartsTotal + numLabour + numMisc - numDiscount);
  const computedPaid = paidAmount !== '' ? parseFloat(paidAmount) || 0 : computedTotalBill;
  const computedBalanceDue = Math.max(0, computedTotalBill - computedPaid);

  // Submit Job Card
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Please enter customer mobile number');
      return;
    }
    if (!vehicleModel.trim()) {
      alert('Please enter vehicle model');
      return;
    }
    if (!vehicleNumber.trim()) {
      alert('Please enter vehicle registration/plate number');
      return;
    }
    if (!issueDescription.trim()) {
      alert('Please specify the reported issue or service requested');
      return;
    }

    try {
      await api.createServiceJob({
        service_date: new Date().toISOString().split('T')[0],
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || undefined,
        vehicle_model: vehicleModel.trim(),
        vehicle_number: vehicleNumber.trim().toUpperCase(),
        odometer_km: odometerKm ? parseInt(odometerKm) : undefined,
        service_type: serviceType,
        issue_description: issueDescription.trim(),
        mechanic_notes: mechanicNotes.trim() || undefined,
        assigned_technician: assignedTechnician,
        parts_used: partsUsed,
        parts_total_cost: computedPartsTotal,
        labour_charges: numLabour,
        miscellaneous_charges: numMisc,
        discount: numDiscount,
        total_amount: computedTotalBill,
        paid_amount: computedPaid,
        balance_due: computedBalanceDue,
        payment_mode: paymentMode,
        status: serviceStatus,
        delivery_date:
          serviceStatus === 'delivered' ? new Date().toISOString().split('T')[0] : undefined,
      });

      setShowAddModal(false);
      resetForm();
      loadJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to record service job card');
    }
  };

  // Quick Status Update
  const handleUpdateStatus = async (jobId: string, newStatus: ServiceStatus) => {
    try {
      await api.updateServiceJob(jobId, {
        status: newStatus,
        delivery_date: newStatus === 'delivered' ? new Date().toISOString().split('T')[0] : undefined,
      });
      loadJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered List
  const filteredJobs = jobs.filter((j) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCust =
        j.customer_name?.toLowerCase().includes(q) || j.customer_phone?.toLowerCase().includes(q);
      if (!matchCust) return false;
    }

    if (vehicleQuery.trim()) {
      const q = vehicleQuery.toLowerCase();
      const matchVeh =
        j.vehicle_model?.toLowerCase().includes(q) ||
        j.vehicle_number?.toLowerCase().includes(q) ||
        j.job_card_no?.toLowerCase().includes(q);
      if (!matchVeh) return false;
    }

    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (serviceTypeFilter !== 'all' && j.service_type !== serviceTypeFilter) return false;

    return true;
  });

  // KPI Calculations
  const inWorkshopCount = jobs.filter((j) => j.status === 'received' || j.status === 'in_progress').length;
  const readyCount = jobs.filter((j) => j.status === 'ready_for_pickup').length;
  const deliveredCount = jobs.filter((j) => j.status === 'delivered').length;
  const totalLabourEarned = jobs.reduce((sum, j) => sum + (j.labour_charges || 0), 0);
  const totalRevenue = jobs.reduce((sum, j) => sum + (j.total_amount || 0), 0);

  return (
    <div className="space-y-5">
      {/* 1. Header with Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
              <Wrench className="w-5 h-5" />
            </span>
            <span>Workshop Job Cards</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manual customer check-in, issue diagnostics, parts replacement, and labour billing.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-600/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Job Card</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>In Workshop</span>
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{inWorkshopCount} Vehicles</div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Ready for Pickup</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{readyCount} Vehicles</div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Delivered / Done</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{deliveredCount} Jobs</div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Labour Income (₹)</span>
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-sky-800 mt-1">
            ₹{totalLabourEarned.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Total Invoiced (₹)</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
          />
        </div>

        <div className="relative">
          <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Vehicle model, plate, or Job ID..."
            value={vehicleQuery}
            onChange={(e) => setVehicleQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 font-medium cursor-pointer"
        >
          <option value="all">All Service Statuses</option>
          <option value="received">Vehicle Received</option>
          <option value="in_progress">In Progress</option>
          <option value="ready_for_pickup">Ready for Pickup</option>
          <option value="delivered">Delivered & Settled</option>
        </select>

        <select
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 font-medium cursor-pointer"
        >
          <option value="all">All Service Types</option>
          <option value="General Servicing">General Servicing</option>
          <option value="Battery & BMS">Battery & BMS</option>
          <option value="Motor & Controller">Motor & Controller</option>
          <option value="Brakes & Suspension">Brakes & Suspension</option>
          <option value="Wiring & Electrical">Wiring & Electrical</option>
        </select>
      </div>

      {/* 4. Service Job Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading service jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="font-bold text-slate-700 text-sm">No Service Job Cards Found</p>
            <p className="text-xs text-slate-500 mt-1">
              Click "+ New Job Card" above to log vehicle arrival, issues, parts, and labour charges.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Job Card / Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle Details</th>
                  <th className="py-3 px-4">Reported Issue & Service</th>
                  <th className="py-3 px-4">Parts Replaced</th>
                  <th className="py-3 px-4">Parts Cost</th>
                  <th className="py-3 px-4">Labour (₹)</th>
                  <th className="py-3 px-4 text-sky-800">Total Bill</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div>{job.job_card_no}</div>
                      <div className="text-[10px] font-sans text-slate-400 font-normal">
                        {job.service_date}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{job.customer_name}</div>
                      <div className="text-slate-500 text-[11px]">{job.customer_phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{job.vehicle_model}</div>
                      <div className="font-mono text-slate-600 text-[11px] font-semibold">
                        {job.vehicle_number}
                      </div>
                      {job.odometer_km && (
                        <div className="text-slate-400 text-[10px]">{job.odometer_km.toLocaleString('en-IN')} km</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
                        {job.service_type}
                      </span>
                      <div className="text-[11px] text-slate-700 line-clamp-2" title={job.issue_description}>
                        {job.issue_description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {job.parts_used && job.parts_used.length > 0 ? (
                        <div className="flex flex-col gap-1 max-w-[170px]">
                          {job.parts_used.map((p) => (
                            <div key={p.id} className="text-[10px] text-slate-700 truncate" title={p.part_name}>
                              <span className="font-bold text-slate-900">{p.quantity}x</span> {p.part_name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No parts</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                      ₹{(job.parts_total_cost || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-900 font-bold">
                      ₹{(job.labour_charges || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-extrabold text-sky-800 text-sm">
                        ₹{job.total_amount.toLocaleString('en-IN')}
                      </div>
                      {job.balance_due > 0 ? (
                        <div className="text-[10px] text-sky-700 font-bold">
                          ₹{job.balance_due.toLocaleString('en-IN')} due
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Settled
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="relative group inline-block">
                        <select
                          value={job.status}
                          onChange={(e) => handleUpdateStatus(job.id, e.target.value as ServiceStatus)}
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                            job.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : job.status === 'ready_for_pickup'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : job.status === 'in_progress'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="received">Received</option>
                          <option value="in_progress">In Progress</option>
                          <option value="ready_for_pickup">Ready for Pickup</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceiptJob(job)}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors cursor-pointer mr-1.5"
                        title="View & Print Job Card Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        <span>Bill</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. NEW SERVICE JOB CARD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                  <Wrench className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">New Workshop Job Card</h3>
                  <p className="text-xs text-slate-500">Record customer vehicle check-in, issue & charges.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              {/* Customer & Vehicle Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Customer Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98390 12345"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Vehicle Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mayuri Deluxe E-Rickshaw"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Registration / Number Plate <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UP-32-ER-4412"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white uppercase font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5200"
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Service Category</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-medium"
                  >
                    <option value="General Servicing">General Servicing</option>
                    <option value="Battery & BMS">Battery & BMS Diagnostics</option>
                    <option value="Motor & Controller">Motor & Controller Repair</option>
                    <option value="Brakes & Suspension">Brakes & Suspension</option>
                    <option value="Wiring & Electrical">Wiring & Electricals</option>
                    <option value="Body & Alignment">Body Work & Alignment</option>
                  </select>
                </div>
              </div>

              {/* Reported Issue */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Reported Issue & Problem Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe the complaint reported by customer (e.g. brake slipping, motor cutting out under load, battery draining fast)..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Spares / Parts Used Section */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-purple-50/40 border border-purple-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">Spare Parts Replaced (Optional)</span>
                  <span className="text-[11px] font-mono font-bold text-purple-700">
                    Parts Total: ₹{computedPartsTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Add Part Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Part name (e.g. Heavy Duty Brake Shoe)"
                      value={partNameInput}
                      onChange={(e) => setPartNameInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={partQtyInput}
                      onChange={(e) => setPartQtyInput(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Price (₹)"
                      value={partCostInput}
                      onChange={(e) => setPartCostInput(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddPart}
                      className="w-full py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* List of Added Parts */}
                {partsUsed.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-purple-200/50">
                    {partsUsed.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-purple-100 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{p.quantity}x</span> {p.part_name}
                          <span className="text-slate-400 ml-1.5">(@ ₹{p.unit_cost})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900">
                            ₹{p.total_cost.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePart(p.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Labour, Billing & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Labour Charges (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 400"
                    value={labourCharges}
                    onChange={(e) => setLabourCharges(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Misc / Consumables (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={miscCharges}
                    onChange={(e) => setMiscCharges(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Advance / Paid Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave empty for full bill"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono text-emerald-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-medium"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI / QR Code</option>
                    <option value="card">Debit / Credit Card</option>
                    <option value="credit">Credit (Balance Due)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={serviceStatus}
                    onChange={(e) => setServiceStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-medium"
                  >
                    <option value="received">Vehicle Received</option>
                    <option value="in_progress">In Progress</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="delivered">Delivered & Settled</option>
                  </select>
                </div>
              </div>

              {/* Live Cost Calculation Summary Card */}
              <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-indigo-200">
                    Parts: ₹{computedPartsTotal} + Labour: ₹{numLabour} {numMisc > 0 && `+ Misc: ₹${numMisc}`}{' '}
                    {numDiscount > 0 && `- Disc: ₹${numDiscount}`}
                  </div>
                  <div className="text-lg font-black mt-0.5">
                    Total Bill: ₹{computedTotalBill.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-emerald-300 font-bold">Paid: ₹{computedPaid.toLocaleString('en-IN')}</div>
                  {computedBalanceDue > 0 ? (
                    <div className="text-xs text-amber-300 font-bold">Due: ₹{computedBalanceDue.toLocaleString('en-IN')}</div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 font-semibold">✓ Fully Settled</div>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md shadow-brand-600/20 transition-all cursor-pointer"
                >
                  Save Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. PRINTABLE JOB CARD INVOICE MODAL */}
      {selectedReceiptJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 my-auto print:p-0 print:border-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <span className="font-bold text-slate-800 text-xs">Job Card Tax Invoice</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptJob(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 text-xs font-sans">
              <div className="text-center border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  TRISHA MOTORS EV WORKSHOP
                </h2>
                <p className="text-[10px] text-slate-500">Authorized EV Service Center & Spare Spares Depot</p>
                <p className="text-[10px] text-slate-400">Station Road, Main Market • Tel: +91 98000 11111</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">JOB CARD NUMBER</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceiptJob.job_card_no}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DATE</span>
                  <span className="font-bold text-slate-900">{selectedReceiptJob.service_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CUSTOMER</span>
                  <span className="font-bold text-slate-900">{selectedReceiptJob.customer_name}</span>
                  <div className="text-[10px] text-slate-500">{selectedReceiptJob.customer_phone}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VEHICLE</span>
                  <span className="font-bold text-slate-900">{selectedReceiptJob.vehicle_model}</span>
                  <div className="font-mono font-semibold text-slate-700">{selectedReceiptJob.vehicle_number}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold mb-0.5">
                  Reported Issue / Work Order
                </span>
                <p className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-800 border border-slate-100">
                  {selectedReceiptJob.issue_description}
                </p>
              </div>

              {/* Parts Table */}
              {selectedReceiptJob.parts_used && selectedReceiptJob.parts_used.length > 0 && (
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold mb-1">
                    Spare Parts Replaced
                  </span>
                  <table className="w-full text-[11px] border border-slate-100 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50 text-slate-600 font-bold">
                      <tr>
                        <th className="p-1.5 text-left">Item</th>
                        <th className="p-1.5 text-center">Qty</th>
                        <th className="p-1.5 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReceiptJob.parts_used.map((p) => (
                        <tr key={p.id}>
                          <td className="p-1.5">{p.part_name}</td>
                          <td className="p-1.5 text-center">{p.quantity}</td>
                          <td className="p-1.5 text-right font-mono">₹{p.total_cost.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bill Totals */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Parts Subtotal:</span>
                  <span className="font-mono">₹{selectedReceiptJob.parts_total_cost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Labour Charges:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{selectedReceiptJob.labour_charges.toLocaleString('en-IN')}
                  </span>
                </div>
                {selectedReceiptJob.miscellaneous_charges ? (
                  <div className="flex justify-between text-slate-600">
                    <span>Misc Charges:</span>
                    <span className="font-mono">
                      ₹{selectedReceiptJob.miscellaneous_charges.toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Invoiced:</span>
                  <span className="font-mono text-sky-800">
                    ₹{selectedReceiptJob.total_amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-emerald-700">
                  <span>Amount Paid ({selectedReceiptJob.payment_mode?.toUpperCase()}):</span>
                  <span className="font-mono">₹{selectedReceiptJob.paid_amount.toLocaleString('en-IN')}</span>
                </div>
                {selectedReceiptJob.balance_due > 0 && (
                  <div className="flex justify-between text-xs font-bold text-rose-700">
                    <span>Balance Due:</span>
                    <span className="font-mono">₹{selectedReceiptJob.balance_due.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
                <p>30-Day Guarantee on Service Labour. Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
