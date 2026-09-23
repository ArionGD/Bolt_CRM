import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  DollarSign,
  CheckCircle2,
  Clock,
  Car,
  TrendingUp,
  Package,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { ServiceJob } from '../../../types';

export const ServiceReportsSubPage: React.FC = () => {
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | '7days'>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getServiceJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load service jobs for report', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs by date
  const filteredJobs = useMemo(() => {
    if (dateFilter === 'all') return jobs;
    const now = new Date();
    const daysAgo = dateFilter === '7days' ? 7 : 30;
    const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return jobs.filter((j) => new Date(j.created_at) >= cutoff);
  }, [jobs, dateFilter]);

  // Financial aggregates
  const metrics = useMemo(() => {
    const totalJobs = filteredJobs.length;
    const deliveredJobs = filteredJobs.filter((j) => j.status === 'delivered').length;
    const inProgressJobs = filteredJobs.filter(
      (j) => j.status === 'in_progress' || j.status === 'received'
    ).length;
    const readyJobs = filteredJobs.filter((j) => j.status === 'ready_for_pickup').length;

    const totalLabour = filteredJobs.reduce((sum, j) => sum + (j.labour_charges || 0), 0);
    const totalPartsCost = filteredJobs.reduce((sum, j) => sum + (j.parts_total_cost || 0), 0);
    const totalDiscount = filteredJobs.reduce((sum, j) => sum + (j.discount || 0), 0);
    const totalBilled = filteredJobs.reduce((sum, j) => sum + (j.total_amount || 0), 0);
    const totalPaid = filteredJobs.reduce((sum, j) => sum + (j.paid_amount || 0), 0);
    const totalDue = filteredJobs.reduce((sum, j) => sum + (j.balance_due || 0), 0);

    const avgTicket = totalJobs > 0 ? Math.round(totalBilled / totalJobs) : 0;
    const labourShare = totalBilled > 0 ? Math.round((totalLabour / (totalLabour + totalPartsCost || 1)) * 100) : 0;
    const partsShare = 100 - labourShare;

    return {
      totalJobs,
      deliveredJobs,
      inProgressJobs,
      readyJobs,
      totalLabour,
      totalPartsCost,
      totalDiscount,
      totalBilled,
      totalPaid,
      totalDue,
      avgTicket,
      labourShare,
      partsShare,
    };
  }, [filteredJobs]);

  // Aggregate Top Parts Consumed
  const topParts = useMemo(() => {
    const map: { [name: string]: { name: string; qty: number; total: number } } = {};
    filteredJobs.forEach((job) => {
      (job.parts_used || []).forEach((p) => {
        const key = p.part_name.trim().toLowerCase();
        if (!map[key]) {
          map[key] = { name: p.part_name, qty: 0, total: 0 };
        }
        map[key].qty += p.quantity;
        map[key].total += p.total_cost;
      });
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [filteredJobs]);

  // Categorize Issues
  const issueDistribution = useMemo(() => {
    const counts = {
      'Brakes & Suspension': 0,
      'Electrical & Sensors': 0,
      'Battery & Charging': 0,
      'Periodic Maintenance': 0,
      'Motor & Transmission': 0,
      'Other Workshop Repairs': 0,
    };

    filteredJobs.forEach((job) => {
      const issue = (job.issue_description || '').toLowerCase();
      if (issue.includes('brake') || issue.includes('pad') || issue.includes('suspension')) {
        counts['Brakes & Suspension'] += 1;
      } else if (
        issue.includes('sensor') ||
        issue.includes('wiring') ||
        issue.includes('throttle') ||
        issue.includes('light') ||
        issue.includes('horn')
      ) {
        counts['Electrical & Sensors'] += 1;
      } else if (
        issue.includes('battery') ||
        issue.includes('charging') ||
        issue.includes('charger') ||
        issue.includes('bms')
      ) {
        counts['Battery & Charging'] += 1;
      } else if (
        issue.includes('service') ||
        issue.includes('maintenance') ||
        issue.includes('oil') ||
        issue.includes('general')
      ) {
        counts['Periodic Maintenance'] += 1;
      } else if (issue.includes('motor') || issue.includes('gear') || issue.includes('controller')) {
        counts['Motor & Transmission'] += 1;
      } else {
        counts['Other Workshop Repairs'] += 1;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      pct: filteredJobs.length > 0 ? Math.round((count / filteredJobs.length) * 100) : 0,
    }));
  }, [filteredJobs]);

  return (
    <div className="space-y-6">
      {/* Filter and Overview Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            Service Center Financial & Workshop Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational turnaround, labour vs parts earnings, and component consumption metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Period:</span>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateFilter === 'all'
                  ? 'bg-white text-brand-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter('30days')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateFilter === '30days'
                  ? 'bg-white text-brand-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateFilter === '7days'
                  ? 'bg-white text-brand-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Billed */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 p-5 rounded-2xl border border-indigo-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Total Invoiced
            </span>
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-600/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              ₹{metrics.totalBilled.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-indigo-700 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>₹{metrics.totalPaid.toLocaleString('en-IN')} collected</span>
            </div>
          </div>
        </div>

        {/* Labour Income */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Labour Income
            </span>
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm shadow-emerald-600/20">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              ₹{metrics.totalLabour.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-semibold">
              <span>{metrics.labourShare}% of total gross workshop billing</span>
            </div>
          </div>
        </div>

        {/* Parts Revenue */}
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 p-5 rounded-2xl border border-amber-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Parts Replaced
            </span>
            <div className="p-2 bg-amber-600 text-white rounded-xl shadow-sm shadow-amber-600/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              ₹{metrics.totalPartsCost.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-700 font-semibold">
              <span>{topParts.length} unique parts billed</span>
            </div>
          </div>
        </div>

        {/* Avg Job Ticket Size */}
        <div className="bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Avg Ticket Size
            </span>
            <div className="p-2 bg-sky-600 text-white rounded-xl shadow-sm shadow-sky-600/20">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              ₹{metrics.avgTicket.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-sky-700 font-semibold">
              <span>Across {metrics.totalJobs} service job cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Turnaround & Revenue Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Service Revenue Split (Labour vs Parts)
            </h3>
            <span className="text-xs font-bold text-slate-500">
              ₹{metrics.totalBilled.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Split Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${metrics.labourShare}%` }}
                title={`Labour: ${metrics.labourShare}%`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${metrics.partsShare}%` }}
                title={`Parts: ${metrics.partsShare}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-900">Labour Charges</span>
                  </div>
                  <p className="text-lg font-black text-emerald-950 mt-1">
                    ₹{metrics.totalLabour.toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-emerald-700">
                  {metrics.labourShare}%
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-amber-900">Spares & Components</span>
                  </div>
                  <p className="text-lg font-black text-amber-950 mt-1">
                    ₹{metrics.totalPartsCost.toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-amber-700">
                  {metrics.partsShare}%
                </span>
              </div>
            </div>

            {metrics.totalDue > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-rose-900">Uncollected Balance Due</span>
                </div>
                <span className="text-sm font-black text-rose-700">
                  ₹{metrics.totalDue.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Operational Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Workshop Vehicle Status Pipeline
            </h3>
            <span className="text-xs font-bold text-slate-500">{metrics.totalJobs} Total</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Delivered to Customer</div>
                  <div className="text-[11px] text-slate-500">Service completed and vehicle released</div>
                </div>
              </div>
              <span className="text-base font-black text-slate-900">{metrics.deliveredJobs}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Ready for Pickup</div>
                  <div className="text-[11px] text-slate-500">Work finished, customer notified</div>
                </div>
              </div>
              <span className="text-base font-black text-slate-900">{metrics.readyJobs}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">In Workshop / On Ramp</div>
                  <div className="text-[11px] text-slate-500">Active diagnosis & mechanical repairs</div>
                </div>
              </div>
              <span className="text-base font-black text-slate-900">{metrics.inProgressJobs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Common Issue Distribution & Top Parts Consumed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              Common Issues & Workshop Faults
            </h3>
            <span className="text-xs font-bold text-slate-500">Categorized</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {issueDistribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="text-slate-900 font-bold">
                    {item.count} job{item.count === 1 ? '' : 's'} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Parts Consumed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              Spare Parts Consumed in Workshop
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {topParts.length} Parts Replaced
            </span>
          </div>

          <div className="overflow-x-auto">
            {topParts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium">
                No spare parts recorded in this timeframe.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2.5">Spare Part Name</th>
                    <th className="pb-2.5 text-center">Qty Used</th>
                    <th className="pb-2.5 text-right">Total Billed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topParts.slice(0, 7).map((p) => (
                    <tr key={p.name} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-2.5 text-center font-semibold text-slate-600">{p.qty}</td>
                      <td className="py-2.5 text-right font-black text-slate-900">
                        ₹{p.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceReportsSubPage;
