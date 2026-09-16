import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Lead, Order, SalesSummaryReport, StockAgeingBucket, Vehicle } from '../types';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Car,
  Target,
  ArrowUpRight,
  Filter,
  CheckCircle,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [summary, setSummary] = useState<SalesSummaryReport | null>(null);
  const [ageing, setAgeing] = useState<StockAgeingBucket | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, a, l, v, o] = await Promise.all([
          api.getSalesSummary(),
          api.getStockAgeing(),
          api.getLeads(),
          api.getVehicles(),
          api.getOrders(),
        ]);
        setSummary(s);
        setAgeing(a);
        setLeads(l);
        setVehicles(v);
        setOrders(o);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Lead Funnel calculations
  const totalLeads = leads.length || 1;
  const contacted = leads.filter((l) => l.status !== 'new').length;
  const testDrive = leads.filter((l) => ['test_drive_scheduled', 'test_drive_done', 'quoted', 'negotiating', 'won'].includes(l.status)).length;
  const quoted = leads.filter((l) => ['quoted', 'negotiating', 'won'].includes(l.status)).length;
  const won = leads.filter((l) => l.status === 'won').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Dealership Intelligence & Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Executive view of sales conversions, stock holding duration, and cash collections.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Total Sales Booked</span>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{((summary?.total_sales_value || 0) / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-slate-400 mt-2">{summary?.total_orders || 0} vehicle contracts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Cash Collected</span>
          <div className="text-3xl font-extrabold text-emerald-700">
            ₹{((summary?.total_cash_collected || 0) / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            {(((summary?.total_cash_collected || 0) / (summary?.total_sales_value || 1)) * 100).toFixed(1)}% realization rate
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Receivables Due</span>
          <div className="text-3xl font-extrabold text-sky-700">
            ₹{((summary?.total_outstanding_balance || 0) / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-sky-700 font-medium mt-2">Pending RTO / loan disbursals</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Delivered to Customers</span>
          <div className="text-3xl font-extrabold text-emerald-600">
            {summary?.total_delivered || 0} EVs
          </div>
          <p className="text-xs text-slate-400 mt-2">Successful showroom handovers</p>
        </div>
      </div>

      {/* Two Analytics Sections: Stock Ageing Breakdown & Lead Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Stock Ageing Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900">Inventory Ageing Breakdown</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Holding cost and days on showroom floor</p>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 text-sm block">&lt; 30 Days (Fast Moving)</span>
                <span className="text-xs text-emerald-700">Fresh consignments within target turn cycle</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-900">{ageing?.under_30_days || 0}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-sky-900 text-sm block">30–60 Days (Normal Shelf)</span>
                <span className="text-xs text-sky-700">Standard showroom display & trial units</span>
              </div>
              <span className="text-xl font-extrabold text-sky-900">{ageing?.days_30_to_60 || 0}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">60–90 Days (Attention Needed)</span>
                <span className="text-xs text-slate-600">Recommend offering corporate discount incentives</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900">{ageing?.days_60_to_90 || 0}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-950 text-sm block">&gt; 90 Days (Capital Locked)</span>
                <span className="text-xs text-slate-700">High priority: clearance drive / fleet allocation</span>
              </div>
              <span className="text-xl font-extrabold text-slate-950">{ageing?.over_90_days || 0}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Lead Funnel Conversion */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-extrabold text-slate-900">Lead Conversion Funnel</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Stage drop-off from initial walk-in to won booking</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Stage 1: Enquiries */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>1. Showroom Enquiries Logged</span>
                <span>{totalLeads} leads (100%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-sky-600 h-3 rounded-full w-full"></div>
              </div>
            </div>

            {/* Stage 2: Contacted */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>2. Followed-Up & Qualified</span>
                <span>{contacted} leads ({Math.round((contacted / totalLeads) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-sky-500 h-3 rounded-full"
                  style={{ width: `${(contacted / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stage 3: Test Drive Done */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>3. Test Drive Experienced</span>
                <span>{testDrive} leads ({Math.round((testDrive / totalLeads) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-sky-400 h-3 rounded-full"
                  style={{ width: `${(testDrive / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stage 4: Quoted */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>4. On-Road Quotation Sent</span>
                <span>{quoted} leads ({Math.round((quoted / totalLeads) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-slate-400 h-3 rounded-full"
                  style={{ width: `${(quoted / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stage 5: Won */}
            <div>
              <div className="flex justify-between font-bold text-emerald-800 mb-1">
                <span>5. Booking Won & Physical Car Allocated</span>
                <span>{won} won ({Math.round((won / totalLeads) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full"
                  style={{ width: `${(won / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
